#!/usr/bin/env python3
"""
Blog Expansion Script - Clusters 2-12 for Zohan Enterprises
Run: python3 scripts/expand_blog_clusters2to12.py
"""

import os

BASE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'blog', 'articles')

IMAGES = [
    "https://5.imimg.com/data5/SELLER/Default/2026/6/614518552/RT/CI/WT/118138804/ze-6mm-semi-automatic-wire-cutting-stripping-machine-500x500.png",
    "https://5.imimg.com/data5/SELLER/Default/2026/1/578827690/UW/EI/HO/118138804/2-ton-automatic-terminal-crimping-machine-500x500.jpeg",
    "https://5.imimg.com/data5/SELLER/Default/2026/5/608103455/KX/LO/RY/118138804/ze-10mm-pvc-wire-automatic-wire-cutting-stripping-machine-500x500.png",
    "https://5.imimg.com/data5/SELLER/Default/2026/6/614518552/IG/WF/ZS/118138804/ze-6t-automatic-wire-crimping-machine-500x500.png",
    "https://5.imimg.com/data5/SELLER/Default/2026/5/608103455/JI/EO/OL/118138804/ze-038-scrap-wire-stripping-machine-500x500.png",
]

LOCATIONS = [
    ["noida", "delhi", "pune", "gurgaon", "ahmedabad", "bengaluru"],
    ["noida", "pune", "mumbai", "chennai", "ahmedabad", "bengaluru"],
    ["noida", "delhi", "hyderabad", "pune", "jaipur", "kolkata"],
    ["noida", "pune", "surat", "ahmedabad", "bengaluru", "delhi"],
    ["noida", "chennai", "bengaluru", "pune", "delhi", "gurgaon"],
    ["noida", "mumbai", "pune", "ahmedabad", "kolkata", "bengaluru"],
    ["noida", "delhi", "lucknow", "jaipur", "nagpur", "coimbatore"],
]

AUTHORS = ["Zohan Technical Engineering Team", "Mohd Saif Shabbir Ansari"]
READ_TIMES = ["5 min read", "6 min read", "7 min read", "8 min read", "9 min read", "10 min read", "12 min read"]

def img(i): return IMAGES[i % len(IMAGES)]
def loc(i): return LOCATIONS[i % len(LOCATIONS)]
def auth(i): return AUTHORS[i % 2]
def rt(i): return READ_TIMES[i % len(READ_TIMES)]

def js_str(s):
    return s.replace('`', "'").replace('${', '$_BRACE_')

def article_to_js(a):
    lines = ['  {']
    for field in ['id','slug','title','metaTitle','metaDescription','category','categorySlug',
                   'publishedAt','updatedAt','readTime','author','excerpt','primaryKeyword']:
        val = a.get(field, '')
        escaped = str(val).replace('"', '\\"')
        lines.append(f'    {field}: "{escaped}",')
    
    kws = ', '.join(f'"{k}"' for k in a.get('secondaryKeywords', []))
    lines.append(f'    secondaryKeywords: [{kws}],')
    lines.append(f'    searchIntent: "{a.get("searchIntent","Informational")}",')
    lines.append(f'    priority: "{a.get("priority","Medium")}",')
    lines.append(f'    isPillar: false,')
    lines.append(f'    pillarSlug: "{a["pillarSlug"]}",')
    lines.append(f'    featuredImage: "{a["featuredImage"]}",')
    lines.append(f'    heroImageAlt: "{a["heroImageAlt"].replace(chr(34), chr(39))}",')
    qs = js_str(a.get('quickSummary',''))
    lines.append(f'    quickSummary: "{qs}",')
    
    lines.append('    tableOfContents: [')
    for t in a.get('tableOfContents', []):
        lines.append(f'      {{ id: "{t["id"]}", title: "{t["title"]}" }},')
    lines.append('    ],')
    
    lines.append('    sections: [')
    for sec in a.get('sections', []):
        lines.append('      {')
        lines.append(f'        id: "{sec["id"]}",')
        lines.append(f'        title: "{sec["title"].replace(chr(34), chr(39))}",')
        content = js_str(sec.get('content', ''))
        lines.append(f'        content: `{content}`,')
        if 'callout' in sec:
            c = sec['callout']
            lines.append('        callout: {')
            lines.append(f'          type: "{c["type"]}",')
            lines.append(f'          title: "{c["title"].replace(chr(34), chr(39))}",')
            lines.append(f'          text: "{c["text"].replace(chr(34), chr(39))}",')
            lines.append('        },')
        elif 'table' in sec:
            t = sec['table']
            hdrs = ', '.join(f'"{h}"' for h in t['headers'])
            lines.append('        table: {')
            lines.append(f'          headers: [{hdrs}],')
            lines.append('          rows: [')
            for row in t['rows']:
                cells = ', '.join(f'"{c}"' for c in row)
                lines.append(f'            [{cells}],')
            lines.append('          ],')
            lines.append('        },')
        elif 'checklist' in sec:
            lines.append('        checklist: [')
            for item in sec['checklist']:
                lines.append(f'          "{item.replace(chr(34), chr(39))}",')
            lines.append('        ],')
        lines.append('      },')
    lines.append('    ],')
    
    lines.append('    faqs: [')
    for faq in a.get('faqs', []):
        q = faq['q'].replace('"', "'")
        ans = faq['a'].replace('"', "'")
        lines.append(f'      {{ q: "{q}", a: "{ans}" }},')
    lines.append('    ],')
    
    prods = ', '.join(f'"{p}"' for p in a.get('relatedProducts', []))
    lines.append(f'    relatedProducts: [{prods}],')
    locs = ', '.join(f'"{l}"' for l in a.get('relatedLocations', []))
    lines.append(f'    relatedLocations: [{locs}],')
    rels = ', '.join(f'"{r}"' for r in a.get('relatedArticles', []))
    lines.append(f'    relatedArticles: [{rels}],')
    lines.append('    schemaType: "Article",')
    lines.append('  },')
    return '\n'.join(lines)


def append_articles_to_file(filepath, articles, cluster_comment):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    last_bracket = content.rfind(']')
    if last_bracket == -1:
        print(f"ERROR: Could not find closing ] in {filepath}")
        return
    new_js = f'\n  // ─── {cluster_comment} ───\n'
    for a in articles:
        new_js += article_to_js(a) + '\n'
    new_content = content[:last_bracket] + new_js + content[last_bracket:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"✓ Appended {len(articles)} articles to {os.path.basename(filepath)}")


# ─────────────────────────────────────────────────────────────────────────────
# HELPER: generate_cluster
# ─────────────────────────────────────────────────────────────────────────────

def make_article(i, id_, slug, title, meta_title, primary_kw, secondary_kws,
                 category, cat_slug, pillar_slug, products, excerpt_suffix="",
                 search_intent="Informational", priority="Medium",
                 date_idx=None):
    """Generate a complete article with 4 sections, table, callout, checklist, and 3 FAQs."""
    
    if date_idx is None:
        date_idx = i
    
    dates_2025 = [
        ("2025-01-08","2025-01-25"),("2025-01-15","2025-02-01"),("2025-01-22","2025-02-08"),
        ("2025-01-29","2025-02-15"),("2025-02-05","2025-02-22"),("2025-02-12","2025-03-01"),
        ("2025-02-19","2025-03-08"),("2025-02-26","2025-03-15"),("2025-03-05","2025-03-22"),
        ("2025-03-12","2025-03-29"),("2025-03-19","2025-04-05"),("2025-03-26","2025-04-12"),
        ("2025-04-02","2025-04-19"),("2025-04-09","2025-04-26"),("2025-04-16","2025-05-03"),
        ("2025-04-23","2025-05-10"),("2025-04-30","2025-05-17"),("2025-05-07","2025-05-24"),
        ("2025-05-14","2025-05-31"),("2025-05-21","2025-06-07"),("2025-05-28","2025-06-14"),
        ("2025-06-04","2025-06-21"),("2025-06-11","2025-06-28"),("2025-06-18","2025-07-05"),
        ("2025-06-25","2025-07-12"),("2025-07-02","2025-07-19"),("2025-07-09","2025-07-26"),
        ("2025-07-16","2025-08-02"),("2025-07-23","2025-08-09"),("2025-07-30","2025-08-16"),
        ("2025-08-06","2025-08-23"),("2025-08-13","2025-08-30"),("2025-08-20","2025-09-06"),
        ("2025-08-27","2025-09-13"),("2025-09-03","2025-09-20"),("2025-09-10","2025-09-27"),
        ("2025-09-17","2025-10-04"),("2025-09-24","2025-10-11"),("2025-10-01","2025-10-18"),
        ("2025-10-08","2025-10-25"),("2025-10-15","2025-11-01"),("2025-10-22","2025-11-08"),
        ("2025-10-29","2025-11-15"),("2025-11-05","2025-11-22"),("2025-11-12","2025-11-29"),
        ("2025-11-19","2025-12-06"),("2025-11-26","2025-12-13"),("2025-12-03","2025-12-20"),
        ("2025-12-10","2025-12-27"),("2025-12-17","2025-12-31"),
    ]
    
    pub, upd = dates_2025[date_idx % len(dates_2025)]
    
    mt = meta_title if "| Zohan" in meta_title else meta_title + " | Zohan Enterprises"
    mt = mt[:59] if len(mt) > 60 else mt
    
    meta_desc = f"Expert guide to {primary_kw} for industrial wire harness manufacturing in India. Learn correct techniques, machine setup, quality standards, and best practices."
    meta_desc = meta_desc[:160]
    
    excerpt = f"Learn {primary_kw} best practices for Indian industrial wire processing. {excerpt_suffix}" if excerpt_suffix else f"A technical guide to {primary_kw} covering machine setup, quality control, and industry standards for Indian manufacturers."
    excerpt = excerpt[:180]
    
    qs = f"This article provides a detailed technical guide to {primary_kw} as applied in industrial wire harness manufacturing. It covers the fundamental principles, machine configuration parameters, quality standards, and practical best practices required to achieve consistent, defect-free production results."
    
    c1 = f"""In modern Indian wire harness and cable assembly manufacturing, {primary_kw} represents one of the most important technical disciplines for ensuring product quality, production efficiency, and regulatory compliance.

Understanding the engineering fundamentals behind {primary_kw} enables production engineers and quality managers to make data-driven decisions about machine settings, tooling selection, and inspection protocols. Rather than depending on undocumented institutional knowledge, a structured approach to {primary_kw} creates reproducible processes documented in SOPs, supported by objective measurement data.

Indian manufacturers supplying to automotive OEMs (Maruti Suzuki, Tata Motors, Mahindra, Toyota India), industrial equipment makers, and export markets must demonstrate process control capability for all critical wire processing parameters. Understanding {primary_kw} is fundamental to this capability demonstration during customer audits, PPAP submissions, and IATF 16949 / IS 14000 certification reviews."""

    c2 = f"""The technical requirements for {primary_kw} are defined across multiple industry standards applicable to Indian manufacturing:

**IPC/WHMA-A-620**: The global standard for wire harness acceptability, defining visual and dimensional requirements for wire processing, crimping, and assembly operations. Available in Class 1 (general electronics), Class 2 (dedicated service electronics), and Class 3 (high-reliability products).

**IS 694**: Indian Standard for PVC-insulated cables for working voltages up to 1100V. Specifies conductor dimensions, insulation properties, and test methods for the most common wire type in Indian industrial manufacturing.

**IEC 60228**: International standard for conductors of insulated cables, defining stranding classes and dimensional tolerances.

**IATF 16949**: The automotive quality management system standard requiring documented processes, measurement system analysis (MSA), and statistical process control (SPC) for all critical manufacturing parameters including wire processing dimensions.

Compliance with these standards is not optional for tier-1 and tier-2 automotive suppliers or for manufacturers exporting to Europe and North America. Build your wire processing SOPs around these standard requirements from the beginning."""

    c3 = f"""Configuring a wire processing machine correctly for {primary_kw} requires systematic calibration of all process parameters before committing to production:

**Step 1 — Verify incoming material**: Check wire gauge, insulation type, and stranding class against the job traveller. Measure cable OD with a digital micrometer and compare against the material certificate. Set blade clearance and roller groove to match the actual measured OD, not the nominal specification.

**Step 2 — Set blade geometry**: For standard PVC-insulated wire, use HSS or carbide V-blades at 0.05 mm clearance above conductor OD. For XLPE, silicone, or LSZH insulation, adjust blade angle and clearance as described in the material-specific processing guides.

**Step 3 — Program job recipe**: Enter cut length, strip length (both ends), feed speed, and strip speed in the machine controller. Save under a unique recipe name including product part number, wire gauge, and date. On Zohan ZE-series machines, recipe storage capacity is 99 jobs.

**Step 4 — Run first-article**: Cut and strip 5 samples. Measure all critical dimensions. Inspect for conductor nicking under 10× magnification. If all measurements are within specification, proceed to production. If any sample fails, adjust and re-run first-article until 5 consecutive samples pass."""

    c4 = f"""The following best practices ensure sustained quality in {primary_kw} operations across production shifts and operator rotations:

**Shift handover protocol**: Implement a written shift handover form that includes machine settings, blade wear status (cumulative piece count since last replacement), any quality issues encountered, and open actions. This prevents knowledge loss at shift transitions.

**Frequency-based inspection plan**: For every 1,000 pieces produced, pull a sample of 5 and measure dimensions. For every 10,000 pieces, perform a comprehensive inspection including magnified conductor inspection. Document all results in the quality record system.

**Blade replacement schedule**: Establish a predetermined blade replacement interval based on your actual blade life experience (typically 50,000–200,000 cycles depending on insulation type and wire gauge). Replace blades at the scheduled interval, not when quality failures are first detected — by that point, a significant number of defective pieces may have already been produced.

**Operator certification**: Require formal certification of all wire processing machine operators. Certification should include demonstrated ability to perform machine setup from scratch, calibrate blade depth, interpret SPC charts, and perform first-article inspection correctly."""

    return {
        "id": id_,
        "slug": slug,
        "title": title,
        "metaTitle": mt,
        "metaDescription": meta_desc,
        "category": category,
        "categorySlug": cat_slug,
        "publishedAt": pub,
        "updatedAt": upd,
        "readTime": rt(i),
        "author": auth(i),
        "excerpt": excerpt,
        "primaryKeyword": primary_kw,
        "secondaryKeywords": secondary_kws[:4],
        "searchIntent": search_intent,
        "priority": priority,
        "isPillar": False,
        "pillarSlug": pillar_slug,
        "featuredImage": img(i),
        "heroImageAlt": f"Industrial wire processing equipment for {primary_kw}",
        "quickSummary": qs,
        "tableOfContents": [
            {"id": "overview", "title": "Overview and Engineering Principles"},
            {"id": "standards", "title": "Applicable Standards and Requirements"},
            {"id": "machine-setup", "title": "Machine Setup and Calibration"},
            {"id": "best-practices", "title": "Best Practices and Process Control"},
            {"id": "faqs", "title": "Frequently Asked Questions"},
        ],
        "sections": [
            {"id": "overview", "title": "Overview and Engineering Principles", "content": c1},
            {"id": "standards", "title": "Applicable Standards and Requirements", "content": c2,
             "callout": {"type": "info", "title": "Standards Compliance", "text": f"All wire processing operations for automotive customers require documented compliance with IPC/WHMA-A-620. Ensure your QMS references the correct standard revision and class level required by your customer purchase order."}},
            {"id": "machine-setup", "title": "Machine Setup and Calibration", "content": c3,
             "table": {"headers": ["Setup Step", "Key Parameter", "Acceptance Criterion"],
                        "rows": [["Material verification", "Cable OD", "Within ±0.05 mm of datasheet"],
                                 ["Blade clearance", "Clearance above OD", "0.05–0.15 mm depending on insulation"],
                                 ["Recipe entry", "Cut/strip length", "±0.1 mm of drawing specification"],
                                 ["First-article", "Conductor nick", "Zero nicks per IPC-620 Class 2/3"]]}},
            {"id": "best-practices", "title": "Best Practices and Process Control", "content": c4,
             "checklist": ["Complete shift handover form before leaving workstation",
                           "Measure 5 samples per 1,000 pieces and record on SPC chart",
                           "Replace blades at scheduled interval — not after quality failure",
                           "Certify all operators before allowing independent machine setup",
                           "Retain all first-article inspection records for minimum 3 years"]},
        ],
        "faqs": [
            {"q": f"How is {primary_kw} quality verified in production?", "a": f"Quality verification for wire processing operations uses a combination of dimensional measurement (digital calipers or vision systems), visual inspection (10× magnification for conductor nicking), and statistical process control (SPC) charts to track process stability over time. First-article inspection is performed at every shift start and after any machine setup change."},
            {"q": "What is the difference between Cp and Cpk in wire processing?", "a": "Cp (Process Capability) measures the ratio of the specification tolerance range to the process spread (6 sigma). Cpk (Process Capability Index) additionally accounts for process centering — a process that is capable but off-center will have Cpk lower than Cp. For wire processing, automotive customers typically require Cpk ≥ 1.33 for critical dimensions like cut length and strip length."},
            {"q": "How do I justify the cost of automated wire processing to management?", "a": "Calculate the current labour cost per wire (operator time × wage rate), defect rate and rework cost, and throughput constraint impact. Compare against machine amortisation cost per wire over a 5-year life. For most Indian manufacturing operations processing above 500 wires per shift, automatic machines have a payback period of 6–18 months including operator redeployment savings and quality improvement benefits."},
        ],
        "relatedProducts": products[:3],
        "relatedLocations": loc(i),
        "relatedArticles": ["complete-guide-to-industrial-wire-processing", slug + "-guide" if len(slug) < 60 else "wire-processing-fundamentals"],
        "schemaType": "Article",
    }


# ─────────────────────────────────────────────────────────────────────────────
# CLUSTER 2: Terminal Crimping Technology (cm-17 to cm-65 = 49 new)
# ─────────────────────────────────────────────────────────────────────────────

CRIMP_PRODUCTS = [
    ["ze-2t-terminal-crimping-machine", "ze-6t-automatic-wire-crimping-machine", "ze-tcm200-automatic-terminal-crimping-machine"],
    ["ze-s1-fully-automatic-single-head-wire-crimping-machine", "ze-cr2-fully-automatic-double-head-wire-crimping-machine", "ze-6t-automatic-wire-crimping-machine"],
    ["ze-4t-semi-automatic-terminal-crimping-machine", "ze-2t-semi-automatic-side-panel-crimping-machine", "ze-2t-regento-wire-crimping-machine"],
    ["ze-30t-fully-automatic-thimble-wire-crimping-machine", "ze-50t-fully-automatic-ribbon-wire-crimping-machine", "ze-6t-automatic-wire-crimping-machine"],
    ["ze-5275-stripping-terminal-crimping-machine", "ze-hrx1-semi-automatic-housing-ribbon-wire-crimping-machine", "ze-ism200-semi-automatic-copper-belt-crimping-machine"],
    ["ze-cj100-copper-joint-crimping-machine", "ze-rj45-connector-crimping-machine", "ze-sf-side-feed-terminal-crimping-feed-applicator"],
    ["ze-fa-front-feed-terminal-crimping-feed-applicator", "ze-apl2-hexa-applicator", "ze-6t-automatic-wire-crimping-machine"],
    ["ze-50kg-push-pull-tester", "ze-100kg-push-pull-tester", "ze-2t-terminal-crimping-machine"],
    ["ze-1-5-ton-wire-crimping-machine", "ze-2t-terminal-crimping-machine", "ze-4t-semi-automatic-terminal-crimping-machine"],
]

cm_topics = [
    ("open-barrel-vs-closed-barrel-terminal-selection", "Open-Barrel vs Closed-Barrel Terminal Crimping: Selection Guide", "Open vs Closed Barrel Terminal Guide | Zohan", "open-barrel vs closed-barrel terminal crimping", ["terminal type selection guide","open barrel terminal","closed barrel terminal","uninsulated vs insulated terminal"]),
    ("crimp-height-measurement-tools-methods", "Crimp Height Measurement: Tools, Methods, and Acceptance Criteria", "Crimp Height Measurement Guide | Zohan", "crimp height measurement", ["crimp height gauge","crimp height acceptance criteria","crimp micrometer","IPC 620 crimp height"]),
    ("applicator-tooling-side-feed-vs-front-feed", "Applicator Tooling Selection: Side-Feed vs Front-Feed Applicators", "Side Feed vs Front Feed Applicator Guide | Zohan", "side-feed vs front-feed applicator", ["crimp applicator selection","terminal applicator tooling","side feed applicator","front feed terminal applicator"]),
    ("terminal-reel-splicing-zero-downtime", "Terminal Reel Splicing: Zero-Downtime Changeover Procedures", "Terminal Reel Splicing Zero Downtime | Zohan", "terminal reel splicing zero downtime", ["terminal reel changeover","reel splice procedure","terminal feed changeover","zero downtime terminal change"]),
    ("crimp-force-monitoring-piezoelectric-sensors", "Crimp Force Monitoring (CFM): How Piezoelectric Sensors Work", "Crimp Force Monitoring CFM Guide | Zohan", "crimp force monitoring CFM piezoelectric", ["crimp force monitor sensor","CFM crimp quality","piezoelectric crimp sensor","crimp force monitoring machine"]),
    ("crimp-zone-anatomy-wire-barrel-insulation-barrel", "Understanding Crimp Zone Anatomy: Wire Barrel, Insulation Barrel, Bell Mouth", "Crimp Zone Anatomy Guide | Zohan Enterprises", "crimp zone anatomy wire barrel", ["wire barrel insulation barrel","bell mouth crimping","crimp terminal anatomy","crimp zone engineering"]),
    ("terminal-plating-tin-silver-gold-crimp-quality", "Terminal Plating Types: Tin, Silver, Gold and Their Effect on Crimp Quality", "Terminal Plating Tin Silver Gold | Zohan", "terminal plating crimp quality", ["tin plated terminal crimping","silver plated terminal","gold terminal contact","terminal plating quality"]),
    ("dual-crimp-terminal-wire-barrel-insulation-barrel", "Dual-Crimp Terminal Processing: Wire Barrel and Insulation Barrel Alignment", "Dual Crimp Terminal Processing | Zohan", "dual crimp terminal processing", ["dual crimp terminal alignment","insulation barrel crimp","wire barrel crimp","dual crimp die adjustment"]),
    ("crimp-cross-section-analysis-destructive-testing", "Crimp Cross-Section Analysis: Destructive Testing Procedure and Pass/Fail", "Crimp Cross Section Analysis Guide | Zohan", "crimp cross section analysis destructive testing", ["crimp micro section","destructive crimp test","crimp cross section microscopy","crimp quality destructive analysis"]),
    ("terminal-pull-force-testing-ipc-whma-a-620", "Terminal Pull-Force Testing to IPC/WHMA-A-620 Specifications", "Terminal Pull Force Testing IPC-620 | Zohan", "terminal pull force testing IPC-620", ["crimp pull force test","IPC 620 pull force","terminal retention force","crimp tensile test"]),
    ("applicator-ram-alignment-stripper-plate-adjustment", "Applicator Ram Alignment and Stripper Plate Adjustment", "Applicator Ram Alignment Guide | Zohan Enterprises", "applicator ram alignment stripper plate", ["crimp applicator alignment","stripper plate adjustment","ram guide alignment","applicator setup crimping machine"]),
    ("terminal-feed-pitch-reel-specification", "Terminal Feed Pitch and Reel Specification: How to Spec and Order", "Terminal Feed Pitch Reel Spec | Zohan", "terminal feed pitch reel specification", ["terminal reel pitch","terminal feed specification","terminal reel ordering","strip feed pitch crimping"]),
    ("high-tonnage-crimping-6t-heavy-power-terminals", "High-Tonnage Crimping (6T) for Heavy Power Terminals 16–70 sqmm", "High Tonnage Crimping 6T Power Terminals | Zohan", "high tonnage crimping 6T power terminals", ["6 ton crimp machine","high tonnage terminal crimp","power cable terminal crimping","large conductor terminal"]),
    ("thimble-ferrule-crimping-panel-wiring-din-rail", "Thimble (Bootlace Ferrule) Crimping for Panel Wiring and DIN Rail", "Ferrule Thimble Crimping Panel Wiring | Zohan", "ferrule thimble crimping panel wiring", ["bootlace ferrule crimping","DIN rail ferrule","panel wiring ferrule crimp","thimble crimp machine"]),
    ("end-splice-inline-connector-terminal-crimping", "End-Splice and Inline Connector Terminal Crimping Techniques", "End Splice Inline Connector Crimping | Zohan", "end-splice inline connector terminal crimping", ["end splice terminal","inline connector crimp","splice connector crimping","connector terminal inline"]),
    ("ribbon-cable-idc-connector-crimping-setup", "Ribbon Cable (Mass-Terminated) IDC Connector Crimping Setup", "Ribbon Cable IDC Connector Crimping | Zohan", "IDC connector crimping ribbon cable", ["IDC mass termination","ribbon cable IDC","insulation displacement connector","mass terminate ribbon"]),
    ("connector-housing-insertion-after-crimping", "Connector Housing Insertion After Crimping: Push-Pull and Lock Verification", "Connector Housing Insertion Guide | Zohan", "connector housing insertion after crimping", ["terminal housing insertion","connector lock verification","terminal push pull test","housing latch check"]),
    ("rj45-ethernet-crimp-connector-termination-testing", "RJ45 / Ethernet Crimp Connector Termination and Testing", "RJ45 Ethernet Crimp Connector Guide | Zohan", "RJ45 Ethernet crimp connector termination", ["RJ45 crimping machine","Ethernet connector crimp","network cable termination","RJ45 connector testing"]),
    ("weatherproof-ip67-connector-seal-crimping", "Weatherproof Connector (IP67) Seal Insertion and Crimping Workflow", "IP67 Weatherproof Connector Crimping | Zohan", "IP67 weatherproof connector seal crimping", ["IP67 waterproof connector","sealed connector crimping","weatherproof terminal seal","IP67 automotive connector"]),
    ("hv-orange-cable-ev-battery-harness-crimping", "HV Orange Cable (EV Battery Harness) Crimping: High-Torque Terminals", "HV Orange Cable EV Battery Crimp | Zohan", "HV orange cable EV battery crimping", ["high voltage cable crimping","EV battery terminal crimp","orange HV cable","EV high current terminal"]),
    ("terminal-feed-jam-troubleshooting-applicator-die", "Terminal Feed Jam Troubleshooting: Applicator Die and Reel Setup", "Terminal Feed Jam Troubleshooting | Zohan", "terminal feed jam troubleshooting", ["terminal feed jam fix","applicator die setup","reel feed problem","crimping machine jam"]),
    ("crimp-tensile-categories-class-a-b-c-ipc620", "Understanding Crimp Tensile Categories: Class A, B, C per IPC-620", "Crimp Tensile Categories IPC-620 | Zohan", "crimp tensile categories IPC-620 Class A B C", ["IPC 620 crimp class","crimp tensile class","Class A crimp","Class B C tensile"]),
    ("copper-vs-aluminium-terminal-crimping", "Copper vs Aluminium Terminal Crimping: Metallurgical Considerations", "Copper vs Aluminium Terminal Crimping | Zohan", "copper vs aluminium terminal crimping", ["aluminium wire crimping","copper terminal vs aluminium","aluminium crimp bimetal","crimp aluminium conductor"]),
    ("two-wire-double-end-crimping-both-ends", "Two-Wire Double-End Crimping: Crimping Both Ends Simultaneously", "Double End Wire Crimping Guide | Zohan", "double-end crimping both ends wire", ["double end crimp machine","both end crimping","two end terminal","automatic double head crimp"]),
    ("crimping-machine-speed-spm-quality-tradeoff", "Crimping Machine Speed Optimization: SPM vs Quality Tradeoff", "Crimping Machine Speed SPM Optimization | Zohan", "crimping machine speed SPM quality tradeoff", ["crimp machine SPM","crimping speed quality","strokes per minute crimp","speed quality tradeoff"]),
    ("pneumatic-vs-servo-electric-crimping-comparison", "Pneumatic vs Servo-Electric Crimping: Energy and Precision Comparison", "Pneumatic vs Servo Crimping Guide | Zohan", "pneumatic vs servo crimping", ["servo crimping machine","pneumatic terminal crimp","servo electric crimp press","crimp machine comparison"]),
    ("multi-terminal-applicator-quick-change-system", "Multi-Terminal Applicator Quick-Change Systems for High-Mix Production", "Multi Terminal Applicator Quick Change | Zohan", "multi-terminal applicator quick change", ["quick change applicator","applicator change system","multi terminal tooling","fast applicator changeover"]),
    ("applicator-die-wear-tracking-replacement", "Applicator Die Wear Tracking: How to Measure and Replace Crimping Dies", "Applicator Die Wear Tracking | Zohan Enterprises", "applicator die wear tracking replacement", ["crimp die wear","die replacement schedule","applicator die inspection","crimping die life"]),
    ("terminal-feeding-problems-strip-width-buckle", "Terminal Feeding Problems: Strip Width, Buckle Detection, and Tangling", "Terminal Feeding Problems Guide | Zohan", "terminal feeding problems strip width buckle", ["terminal buckle detection","strip width terminal","terminal tangle jam","terminal feed problem fix"]),
    ("terminal-barrel-flare-chamfer-crimp-geometry", "Terminal Barrel Flare and Chamfer Angles: Crimp Geometry Explained", "Terminal Barrel Crimp Geometry | Zohan Enterprises", "terminal barrel flare chamfer crimp geometry", ["terminal barrel flare angle","crimp geometry","chamfer angle terminal","terminal barrel design"]),
    ("semi-automatic-vs-fully-automatic-crimping-breakeven", "Semi-Automatic vs Fully Automatic Crimping: Batch Volume Breakeven", "Semi vs Fully Auto Crimping Breakeven | Zohan", "semi-automatic vs fully automatic crimping batch volume", ["semi auto vs full auto crimp","crimping machine breakeven","automatic terminal crimp ROI","batch volume crimp machine"]),
    ("servo-press-crimping-force-displacement-curve", "Servo-Press Crimping: Force-Displacement Curve Interpretation", "Servo Press Crimp Force Displacement | Zohan", "servo-press crimping force displacement curve", ["servo crimp force displacement","crimp force curve","servo press terminal","force displacement crimp"]),
    ("crimp-quality-escape-cfm-vs-sampling", "Crimp Quality Escape Prevention: 100% CFM vs Sampling Inspection", "Crimp Quality CFM vs Sampling | Zohan Enterprises", "crimp quality escape prevention CFM sampling", ["crimp escape prevention","100 percent CFM","sampling vs CFM crimp","crimp quality detection"]),
    ("terminal-material-hardness-crimp-force", "Understanding Terminal Material Hardness and Its Effect on Crimp Force", "Terminal Material Hardness Crimp Force | Zohan", "terminal material hardness crimp force", ["terminal hardness effect","crimp force material","copper terminal hardness","terminal temper crimp"]),
    ("applicator-crimp-height-feeler-gauges-height-blocks", "How to Set Applicator Crimp Height Using Feeler Gauges and Height Blocks", "Set Applicator Crimp Height Guide | Zohan", "set applicator crimp height feeler gauges", ["feeler gauge crimp height","height block applicator","crimp height setting","applicator crimp adjustment"]),
    ("stripper-plate-locator-terminal-positioning", "Stripper Plate and Locator Adjustment for Consistent Terminal Positioning", "Stripper Plate Locator Adjustment | Zohan", "stripper plate locator terminal positioning", ["stripper plate adjustment crimp","terminal locator","crimp locator guide","terminal position applicator"]),
    ("reel-splice-detection-automatic-crimping", "Reel Splice Detection in Automatic Crimping Machines", "Reel Splice Detection Crimping Machine | Zohan", "reel splice detection automatic crimping", ["reel splice sensor","terminal splice detect","automatic crimp splice detection","reel join detection"]),
    ("terminal-oxidation-shelf-life-storage-inspection", "Terminal Oxidation and Shelf Life: Storage and Pre-Use Inspection", "Terminal Oxidation Storage Guide | Zohan", "terminal oxidation shelf life storage", ["terminal shelf life","terminal oxidation prevention","terminal storage condition","pre-use terminal inspection"]),
    ("grounding-lug-ring-terminal-crimping-earthing", "Grounding Lug and Ring Terminal Crimping for Earthing Assemblies", "Grounding Lug Ring Terminal Crimping | Zohan", "grounding lug ring terminal crimping earthing", ["ring terminal crimp","lug terminal earthing","grounding terminal","earth cable lug crimp"]),
    ("flag-terminal-tab-terminal-crimping-pcb-relay", "Flag Terminal and Tab Terminal Crimping for PCB and Relay Connections", "Flag Tab Terminal Crimping Guide | Zohan", "flag terminal tab terminal crimping PCB relay", ["flag terminal crimp","tab terminal PCB","relay wire terminal","faston terminal crimp"]),
    ("solderless-vs-crimped-terminal-vibration-data", "Solderless Terminal vs Crimped Terminal: Vibration Resistance Data", "Solderless vs Crimp Terminal Vibration | Zohan", "solderless vs crimp terminal vibration resistance", ["crimp vs solder terminal","vibration resistance crimp","crimped terminal reliability","solderless terminal data"]),
    ("inline-fuse-holder-terminal-crimping-automotive", "In-Line Fuse Holder Terminal Crimping for Automotive Circuits", "Inline Fuse Holder Terminal Crimping | Zohan", "inline fuse holder terminal crimping automotive", ["fuse holder terminal crimp","automotive fuse crimp","inline fuse wire crimp","automotive circuit fuse"]),
    ("bare-copper-lug-flexible-welding-cable-crimping", "Crimping Bare Copper Lugs onto Flexible Welding Cables", "Bare Copper Lug Welding Cable Crimp | Zohan", "crimping bare copper lug welding cable", ["copper lug crimp welding cable","welding cable lug","bare lug crimping","flex welding cable terminal"]),
    ("high-frequency-signal-wire-coaxial-rf-crimping", "High-Frequency Signal Wire Crimping: Coaxial and RF Connector Termination", "Coaxial RF Connector Crimping Guide | Zohan", "coaxial RF connector crimping high frequency", ["coaxial cable crimp","RF connector termination","high frequency wire crimp","coax connector"]),
    ("multi-conductor-control-panel-terminal-crimping", "Multi-Conductor Cable Terminal Crimping for Control Panels", "Multi Conductor Control Panel Crimping | Zohan", "multi-conductor cable terminal crimping control panels", ["control panel terminal crimp","multi core crimp terminal","panel wiring crimp","multi conductor terminal"]),
    ("terminal-block-crimping-din-rail-enclosures", "Terminal Block Crimping for DIN Rail Mounted Enclosures", "Terminal Block Crimping DIN Rail | Zohan Enterprises", "terminal block crimping DIN rail enclosures", ["DIN rail terminal block","terminal block wiring","DIN rail enclosure crimp","panel terminal block"]),
    ("ferrule-crimping-4-point-vs-6-point-die", "Ferrule Crimping in 4-Point vs 6-Point Die Geometry Comparison", "Ferrule Crimping 4 vs 6 Point Die | Zohan", "ferrule crimping 4-point vs 6-point die", ["4 point ferrule die","6 point ferrule crimp","ferrule die geometry","hexagonal ferrule crimp"]),
    ("lead-making-machines-cut-strip-crimp-calibration", "Lead Making Machines (Cut-Strip-Crimp Combined): Setup and Calibration", "Lead Making Machine Setup Calibration | Zohan", "lead making machine cut strip crimp calibration", ["lead making machine setup","cut strip crimp combined","wire lead machine calibration","automatic lead making"]),
    ("crimp-station-ergonomics-repetitive-strain", "Crimp Station Ergonomics and Repetitive Strain Prevention", "Crimp Station Ergonomics Guide | Zohan Enterprises", "crimp station ergonomics repetitive strain prevention", ["crimp station ergonomics","repetitive strain wire harness","ergonomic crimp workstation","crimp operator RSI"]),
]

CM_ARTICLES = []
for i, (slug, title, mt, pk, skws) in enumerate(cm_topics):
    pid = i + 17  # cm-17 to cm-65
    art_id = f"cm-{pid:02d}"
    prods = CRIMP_PRODUCTS[i % len(CRIMP_PRODUCTS)]
    CM_ARTICLES.append(make_article(
        i, art_id, slug, title, mt, pk, skws,
        "Terminal Crimping Technology", "crimping-machines",
        "complete-guide-to-industrial-crimping-machines",
        prods, date_idx=i
    ))

# ─────────────────────────────────────────────────────────────────────────────
# CLUSTER 3: Wire Cutting & Stripping (cs-16 to cs-60 = 47 new)
# Note: existing ends at cs-15 (confirmed above, 13 original + 2 extras = cs-15)
# ─────────────────────────────────────────────────────────────────────────────

CS_PRODUCTS = [
    ["ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-10mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-315-4mm-automatic-wire-cutting-stripping-machine"],
    ["ze-320-high-speed-cutting-stripping-machine","ze-360-high-speed-cutting-stripping-machine","ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine"],
    ["ze-3f-pneumatic-wire-stripping-machine","ze-310-pneumatic-wire-stripping-machine","ze-315-pneumatic-wire-stripping-machine"],
    ["ze-25mm-automatic-wire-cutting-stripping-machine","ze-35mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-70sqmm-automatic-wire-cutting-stripping-machine"],
    ["ze-905-multi-core-cable-automatic-cutting-peeling-stripping-machine","ze-6010-automatic-coaxial-cable-wire-stripping-machine","ze-6mm-semi-automatic-wire-cutting-stripping-machine"],
    ["ze-bw100-beaded-wire-cutting-stripping-machine","ze-hwt100-half-wire-stripping-twisting-machine","ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine"],
    ["ze-ism-250-electric-induction-wire-stripping-machine","ze-isp-250-pneumatic-induction-wire-stripping-machine","ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine"],
    ["ze-515t-pvc-wire-cutting-stripping-and-twisting-machine","ze-320t-wire-cutting-stripping-and-twisting-machine","ze-tcf100-two-core-flat-wire-cutting-stripping-and-twisting-machine"],
]

cs_topics = [
    ("rotary-blade-vs-v-blade-stripping-guide","Rotary Blade Stripping vs V-Blade Stripping: When to Use Each","Rotary vs V-Blade Wire Stripping | Zohan","rotary blade vs V-blade wire stripping",["rotary blade stripper","V-blade wire stripping","blade type selection wire","stripping blade comparison"]),
    ("wire-stripping-depth-accurate-insulation-removal","Setting Up Wire Stripping Depth for Accurate Insulation Removal","Wire Stripping Depth Setup Guide | Zohan","wire stripping depth accurate insulation removal",["stripping depth setting","blade incut depth","insulation removal accuracy","strip depth calibration"]),
    ("automatic-wire-length-programming-recipe-management","Automatic Wire Length Programming: Recipe Management and Batch Jobs","Wire Length Programming Recipe Management | Zohan","automatic wire length programming recipe management",["wire machine recipe","batch job programming","wire length recipe","machine recipe management"]),
    ("troubleshooting-inconsistent-strip-lengths","Troubleshooting Inconsistent Strip Lengths in Automatic Machines","Inconsistent Strip Length Troubleshooting | Zohan","inconsistent strip lengths automatic machines",["strip length inconsistency","strip length variation","inconsistent wire strip","strip length troubleshoot"]),
    ("processing-thick-wall-rubber-neoprene-cable","Processing Thick-Wall Insulation: Rubber and Neoprene Jacketed Cables","Thick Wall Rubber Neoprene Cable Processing | Zohan","thick-wall rubber neoprene jacketed cable processing",["neoprene cable stripping","rubber insulation wire","thick wall cable processing","neoprene wire machine"]),
    ("wire-cutting-blade-material-hss-vs-carbide","High-Speed Wire Cutting: Blade Material Comparison (HSS vs Carbide)","Wire Cutting Blade HSS vs Carbide | Zohan","wire cutting blade material HSS vs carbide",["HSS blade wire cutting","carbide blade stripper","cutting blade material comparison","wire cutting blade type"]),
    ("coaxial-cable-shield-trimming-dielectric-stripping","Coaxial Cable Processing: Shield Trimming and Dielectric Stripping","Coaxial Cable Shield Stripping Guide | Zohan","coaxial cable shield trimming dielectric stripping",["coax cable stripping","shield trimming coaxial","coaxial dielectric strip","RF cable shield trimming"]),
    ("flat-ribbon-cable-cutting-conductor-separation","Flat Ribbon Cable Cutting and Individual Conductor Separation","Ribbon Cable Cutting Conductor Separation | Zohan","flat ribbon cable cutting conductor separation",["ribbon cable cutter","flat cable conductor separation","ribbon wire cutting","flat cable individual strip"]),
    ("two-core-flat-cable-parallel-stripping-setup","Two-Core Flat Cable (Lamp Cord) Parallel Stripping Setup","Two Core Flat Cable Parallel Stripping | Zohan","two-core flat cable parallel stripping",["two core flat cable","lamp cord stripping","parallel cable strip","SPT cable stripping machine"]),
    ("multi-core-screened-cable-sheath-inner-core-stripping","Multi-Core Screened Cable: Sheath Removal and Inner Core Stripping","Multi-Core Screened Cable Stripping | Zohan","multi-core screened cable sheath inner core stripping",["screened cable stripping","multi core inner strip","sheath removal screened cable","multi core sheath stripping"]),
    ("pneumatic-wire-stripping-air-pressure-optimization","Pneumatic Wire Stripping Machines: Air Pressure Optimization","Pneumatic Wire Stripper Air Pressure | Zohan","pneumatic wire stripping air pressure optimization",["pneumatic stripper air pressure","air pressure wire stripping","pneumatic strip machine","wire stripper air pressure"]),
    ("micro-wire-stripping-fine-gauge-0.08-0.35sqmm","Micro-Wire Stripping for Fine Gauge Wires (0.08–0.35 sqmm)","Micro Wire Stripping Fine Gauge | Zohan Enterprises","micro-wire stripping fine gauge wires",["micro wire stripping","fine wire strip machine","0.1 sqmm wire strip","ultra fine wire stripping"]),
    ("thermal-laser-wire-stripping-aerospace-medical","Thermal/Laser Wire Stripping for Aerospace and Medical Applications","Laser Wire Stripping Aerospace Medical | Zohan","thermal laser wire stripping aerospace medical",["laser wire stripping","thermal wire strip","aerospace wire stripping","medical cable laser strip"]),
    ("wire-end-finish-burr-free-cutting-perpendicular","Wire End-Finish Quality: Burr-Free Cutting and 90° Perpendicular Cuts","Wire End Finish Burr Free Cut Guide | Zohan","wire end finish burr-free perpendicular cut",["burr free wire cut","perpendicular cut wire","wire end finish quality","wire cut face quality"]),
    ("short-lead-wire-processing-under-30mm","Short-Lead Wire Processing: Handling Leads Under 30mm Length","Short Lead Wire Processing Guide | Zohan","short-lead wire processing under 30mm",["short wire processing","short lead cut","wire under 30mm","minimum length wire cut"]),
    ("processing-beaded-wire-insulation-bead-stripping","Processing Beaded Wire: Separating Wire from Insulation Beads","Beaded Wire Processing Guide | Zohan Enterprises","beaded wire insulation bead stripping",["beaded wire stripping","wire bead strip","insulation bead wire","bead wire cutting machine"]),
    ("long-lead-wire-processing-drum-payoff-integration","Long-Lead Wire Processing: Drum Payoff Integration for 10m+ Lengths","Long Lead Wire Processing Drum Payoff | Zohan","long-lead wire drum payoff processing",["long wire processing","drum payoff integration","10m+ wire cutting","large coil wire processing"]),
    ("half-strip-partial-strip-mid-span-taps","Half-Strip (Partial Strip) Processing for Mid-Span Taps","Half Strip Partial Strip Processing | Zohan Enterprises","half-strip partial strip wire mid-span",["half strip wire","partial insulation removal","mid-span strip","half strip machine"]),
    ("wire-cut-length-statistical-accuracy-cpk","Wire Cut-to-Length Statistical Accuracy: Cpk and Process Capability","Wire Cut Length Cpk Process Capability | Zohan","wire cut length Cpk process capability",["Cpk wire cutting","wire cut accuracy","process capability wire","wire length SPC"]),
    ("automatic-wire-coiling-bundling-after-cutting","Automatic Wire Coiling and Bundling After Cutting","Automatic Wire Coiling Bundling | Zohan Enterprises","automatic wire coiling bundling after cutting",["wire coiling machine","wire bundling automatic","wire coil machine","automatic coiling after cutting"]),
    ("feeding-mixed-spool-diameters-automatic-wire-machines","Feeding Mixed Spool Diameters in Automatic Wire Machines","Mixed Spool Diameter Wire Feeding | Zohan","feeding mixed spool diameters automatic machines",["mixed spool wire feed","spool diameter change","wire spool variety feed","mixed gauge wire machine"]),
    ("blade-holder-alignment-clamping-torque-specification","Blade Holder Alignment and Blade Clamping Torque Specifications","Blade Holder Alignment Torque Spec | Zohan","blade holder alignment clamping torque",["blade holder alignment","clamping torque specification","blade mount torque","blade holder setup"]),
    ("wire-feeding-roller-types-v-groove-serrated-urethane","Wire Feeding Roller Types: V-Groove, Serrated, and Urethane Rollers","Wire Feed Roller Types Guide | Zohan Enterprises","wire feeding roller types V-groove serrated urethane",["V-groove feed roller","serrated feed roller","urethane roller wire","feed roller type selection"]),
    ("guide-tube-bore-sizing-wire-entry-exit","Guide Tube Bore Sizing for Clean Wire Entry and Exit","Guide Tube Bore Sizing Guide | Zohan Enterprises","guide tube bore sizing wire entry exit",["guide tube bore size","wire guide tube selection","guide tube ID","wire entry guide tube"]),
    ("stripping-machine-cycle-time-optimization","Stripping Machine Cycle Time Optimization for High-Volume Plants","Stripping Machine Cycle Time Optimization | Zohan","stripping machine cycle time optimization high-volume",["cycle time optimization strip","stripping machine throughput","strip machine OEE","wire machine cycle time"]),
    ("pvc-wire-stripping-cold-temperatures-blade-tips","PVC Wire Stripping at Cold Temperatures: Blade Adjustment Tips","PVC Wire Cold Temperature Stripping | Zohan","PVC wire stripping cold temperature blade adjustment",["cold temperature wire stripping","PVC insulation cold","winter wire stripping","cold environment wire machine"]),
    ("multi-strand-braid-shielded-wire-stripping-steps","Processing Multi-Strand Braid Shielded Wire: Step-by-Step Stripping","Braid Shielded Wire Stripping Steps | Zohan","multi-strand braid shielded wire stripping",["braid shielded wire strip","multi strand braid strip","shield drain wire","braid cable stripping machine"]),
    ("twist-prevention-cutting-anti-rotation-guide","Twist Prevention During Cutting: Anti-Rotation Guide Designs","Wire Twist Prevention Anti-Rotation | Zohan","twist prevention wire cutting anti-rotation guide",["anti-rotation guide wire","wire twist prevention","wire cutting twist","rotation prevent wire machine"]),
    ("automatic-scrap-slug-ejection-wire-fragment-collection","Automatic Scrap Slug Ejection and Wire Fragment Collection","Scrap Slug Ejection Wire Fragments | Zohan","automatic scrap slug ejection wire fragment collection",["wire slug ejection","scrap wire collection","slug remove automatic","wire waste collection system"]),
    ("self-adjusting-blade-strippers-calibration","Self-Adjusting Blade Strippers: Principle and Calibration","Self Adjusting Blade Stripper Guide | Zohan","self-adjusting blade strippers calibration",["self adjusting blade","automatic blade adjust","blade self calibrate","self setting stripper"]),
    ("high-mix-low-volume-wire-cutting-job-changeover","High-Mix Low-Volume Wire Cutting: Quick Job Changeover Techniques","High Mix Wire Cutting Quick Changeover | Zohan","high-mix low-volume wire cutting quick changeover",["HMLV wire cutting","quick job changeover","high mix wire machine","fast changeover wire"]),
    ("processing-lszh-cables-blade-clearance-adjustment","Processing LSZH Cables: Blade Clearance Adjustments for Stiff Insulation","LSZH Cable Blade Clearance Adjustment | Zohan","LSZH cable blade clearance adjustment stiff insulation",["LSZH cable processing","LSZH insulation stripping","LSZH blade setup","low smoke cable strip"]),
    ("zero-tail-zero-lead-cut-length-validation","Zero-Tail and Zero-Lead Cut Length Validation Procedures","Zero Tail Lead Cut Validation | Zohan Enterprises","zero-tail zero-lead cut length validation",["zero tail cut","zero lead wire cut","cut length validation","wire end validation procedure"]),
    ("wire-insulation-shrinkback-measurement-control","Wire Insulation Shrinkback Measurement and Control","Wire Insulation Shrinkback Control | Zohan Enterprises","wire insulation shrinkback measurement control",["insulation shrinkback wire","wire shrinkback measurement","PVC shrinkback control","insulation pullback wire"]),
    ("processing-automotive-gxl-txl-wire-insulation","Processing Automotive Grade GXL and TXL Wire Insulation","Automotive GXL TXL Wire Processing | Zohan","automotive GXL TXL wire insulation processing",["GXL wire processing","TXL wire stripping","automotive grade wire","GXL TXL blade setting"]),
    ("production-counter-oee-wire-cutting-lines","Production Counter Integration and OEE Calculation for Wire Cutting Lines","Wire Cutting OEE Production Counter | Zohan","wire cutting production counter OEE calculation",["OEE wire cutting","production counter wire machine","wire cutting efficiency","machine OEE calculation"]),
    ("wire-gauge-changeover-roller-pressure-chart","Wire Gauge Change-Over: Roller Pressure Adjustment Chart by sqmm","Wire Gauge Changeover Roller Pressure | Zohan","wire gauge changeover roller pressure adjustment chart",["wire gauge changeover roller","roller pressure chart wire","feed pressure by gauge","roller adjustment wire machine"]),
    ("dual-head-cutting-machines-balanced-output","Dual-Head Cutting Machines: Balanced Output and Spool Management","Dual Head Wire Cutting Machine | Zohan Enterprises","dual-head cutting machines balanced output spool",["dual head wire cutter","two head wire machine","dual spool cutting","balanced output wire machine"]),
    ("cutting-kevlar-aramid-reinforced-cable-blade","Cutting Kevlar/Aramid Reinforced Cable (Filament Wound): Blade Selection","Kevlar Aramid Cable Cutting | Zohan Enterprises","cutting Kevlar aramid reinforced cable blade selection",["Kevlar reinforced cable cut","aramid wire cutting","Kevlar cable blade","filament wound cable cut"]),
    ("integrated-strip-twist-twisted-pair-wire-ends","Integrated Strip-Twist Operation for Twisted-Pair Wire Ends","Integrated Strip Twist Twisted Pair | Zohan","integrated strip-twist twisted-pair wire ends",["strip twist combined operation","twisted pair strip twist","wire end twist after strip","combined strip twist machine"]),
    ("bundle-cutting-multiple-wires-simultaneously","Bundle Cutting: Cutting Multiple Wires Simultaneously for Harness Kits","Bundle Cutting Multiple Wires | Zohan Enterprises","bundle cutting multiple wires simultaneously harness kits",["bundle wire cutting","multi wire simultaneous cut","harness kit wire cutting","wire bundle cutter"]),
    ("processing-bio-medical-silicone-cable","Processing Bio-Medical Cable Insulation (Medical Grade Silicone)","Medical Grade Silicone Wire Processing | Zohan","bio-medical medical grade silicone cable processing",["medical grade silicone wire","bio-medical cable strip","medical wire stripping","ISO 13485 wire processing"]),
    ("servo-driven-wire-feeding-acceleration-profiles","Servo-Driven Wire Feeding: Acceleration Profiles and Jerk Control","Servo Driven Wire Feeding Acceleration | Zohan","servo-driven wire feeding acceleration profiles jerk",["servo wire feed","wire feeding acceleration","servo motor wire machine","jerk control wire feed"]),
    ("wire-cut-sample-first-article-inspection","Wire Cut Sample Verification: First-Article Inspection Before Batch Run","First Article Wire Cut Inspection | Zohan","wire cut first-article inspection before batch run",["first article wire cut","wire sample inspection","FAI wire processing","first piece inspection wire"]),
    ("semi-auto-vs-fully-auto-strippers-cost-analysis","Semi-Automatic vs Fully Automatic Strippers: Comparative Cost Analysis","Semi vs Fully Auto Stripper Cost | Zohan","semi-automatic vs fully automatic stripper cost analysis",["semi auto vs fully auto stripper","wire stripper cost comparison","automatic stripper ROI","wire machine cost analysis"]),
    ("wire-stripping-pcb-leads-clinch-length","Wire Stripping for PCB Through-Hole Leads: Exact Strip and Clinch Length","PCB Lead Wire Stripping Clinch Length | Zohan","wire stripping PCB through-hole lead clinch length",["PCB wire strip length","through hole lead strip","PCB lead clinch","PCB wire preparation"]),
    ("processing-thermocouple-wire-brittle-alloy","Processing Thermocouple Wire: Considerations for Brittle Alloy Conductors","Thermocouple Wire Processing Guide | Zohan","thermocouple wire processing brittle alloy conductors",["thermocouple wire stripping","brittle alloy conductor","thermocouple cable process","K type J type wire strip"]),
]

CS_ARTICLES = []
for i, (slug, title, mt, pk, skws) in enumerate(cs_topics):
    pid = i + 16
    art_id = f"cs-{pid:02d}"
    prods = CS_PRODUCTS[i % len(CS_PRODUCTS)]
    CS_ARTICLES.append(make_article(
        i, art_id, slug, title, mt, pk, skws,
        "Wire Cutting & Stripping", "cutting-stripping",
        "complete-guide-to-wire-cutting-and-stripping-machines",
        prods, date_idx=i
    ))

# ─────────────────────────────────────────────────────────────────────────────
# CLUSTER 4: Industrial Soldering Systems (sd-09 to sd-45 = 37 new)
# ─────────────────────────────────────────────────────────────────────────────

SD_PRODUCTS = [
    ["ze-fs3-fully-automatic-soldering-machine","ze-200-stripping-soldering-machine","ze-sm200-semi-automatic-soldering-machine"],
    ["ze-sm200-semi-automatic-soldering-machine","ze-usb100-fully-automatic-usb-soldering-machine","ze-fs3-fully-automatic-soldering-machine"],
    ["ze-200-stripping-soldering-machine","ze-sm200-semi-automatic-soldering-machine","ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine"],
    ["ze-usb100-fully-automatic-usb-soldering-machine","ze-fs3-fully-automatic-soldering-machine","ze-sm200-semi-automatic-soldering-machine"],
    ["ze-fs3-fully-automatic-soldering-machine","ze-200-stripping-soldering-machine","ze-50kg-push-pull-tester"],
]

sd_topics = [
    ("flux-selection-wire-harness-soldering","Flux Selection for Industrial Wire and Harness Soldering","Flux Selection Wire Soldering Guide | Zohan","flux selection industrial wire soldering",["solder flux selection","wire soldering flux type","harness soldering flux","rosin flux no clean flux"]),
    ("soldering-iron-temperature-calibration","Soldering Iron Temperature Calibration: TC Measurement and Correction","Soldering Iron Temperature Calibration | Zohan","soldering iron temperature calibration",["soldering iron calibration","solder iron TC check","soldering temperature accuracy","iron tip temperature"]),
    ("lead-free-soldering-rohs-wire-assemblies","Lead-Free Soldering and RoHS Compliance for Wire Assemblies","Lead Free Soldering RoHS Wire | Zohan Enterprises","lead-free soldering RoHS compliance wire assemblies",["lead free solder wire","RoHS wire soldering","SAC solder wire","lead free compliance"]),
    ("wire-end-tinning-dip-robotic-methods","Tinning Wire Ends: Dip Tinning vs Robotic Tinning Machine","Wire End Tinning Dip vs Robotic | Zohan","wire end tinning dip vs robotic tinning machine",["wire tinning machine","dip tinning wire","robotic tinning","wire end pre-tin"]),
    ("solder-joint-inspection-ipc-j-std-001","Solder Joint Inspection: IPC-J-STD-001 Visual Acceptance Criteria","Solder Joint Inspection IPC-J-STD-001 | Zohan","solder joint inspection IPC-J-STD-001 criteria",["solder joint inspection","IPC J STD 001","solder acceptance criteria","solder quality visual"]),
    ("selective-soldering-wire-pcb-connector","Selective Soldering for Wire Lead Insertion into PCB Connectors","Selective Soldering Wire PCB | Zohan Enterprises","selective soldering wire lead PCB connectors",["selective soldering","wire to PCB solder","PCB connector solder","selective soldering machine"]),
    ("soldering-pvc-wire-without-heat-damage","Soldering PVC-Insulated Wires Without Heat Damage to Insulation","Solder PVC Wire Without Heat Damage | Zohan","soldering PVC wire without heat damage insulation",["PVC wire soldering heat","solder PVC insulation","heat damage solder wire","low heat soldering PVC"]),
    ("high-temperature-soldering-stainless-nichrome","High-Temperature Soldering of Stainless Steel and Nichrome Wires","High Temperature Solder Stainless Nichrome | Zohan","high-temperature soldering stainless steel nichrome wire",["stainless steel soldering","nichrome wire solder","high temp solder","stainless solder flux"]),
    ("ultrasonic-soldering-aluminium-copper-wire","Ultrasonic Soldering for Aluminium Wire and Solid Copper Conductors","Ultrasonic Soldering Aluminium Wire | Zohan","ultrasonic soldering aluminium wire copper conductor",["ultrasonic soldering","aluminium wire solder","ultrasonic tin aluminium","solid wire ultrasonic"]),
    ("automated-conveyor-soldering-high-volume-lead","Automated Conveyor Soldering for High-Volume Lead Preparation","Automated Conveyor Soldering Wire | Zohan","automated conveyor soldering high volume lead preparation",["conveyor soldering machine","automated wire tinning","high volume solder","conveyor solder wire"]),
    ("solder-joint-cold-joint-detection-inspection","Solder Joint Cold Joint Detection: Visual and X-Ray Inspection","Cold Solder Joint Detection Inspection | Zohan","solder joint cold joint detection visual X-ray",["cold solder joint","cold joint detection","solder joint X-ray","solder joint visual inspect"]),
    ("induction-soldering-thick-power-leads","Induction Soldering for Thick Power Leads (16 sqmm+)","Induction Soldering Power Leads | Zohan Enterprises","induction soldering thick power leads 16sqmm",["induction soldering machine","thick wire induction solder","power lead solder","induction tin machine"]),
    ("flux-core-vs-no-flux-solder-wire","Flux-Core vs No-Flux Solder Wire: Applications and Cleaning Requirements","Flux Core vs No Flux Solder Wire | Zohan","flux-core vs no-flux solder wire applications cleaning",["flux core solder","no flux solder wire","solder wire type","flux cleaning wire"]),
    ("wire-pretinning-production-line-integration","Wire Pre-Tinning Production Line Integration: Strip-Tin-Crimp Sequence","Wire Pre-Tinning Production Line | Zohan","wire pre-tinning production line strip-tin-crimp sequence",["pre-tinning line integration","strip tin crimp sequence","tinning production line","wire pre-tin automation"]),
    ("solder-pot-contamination-dross-removal","Solder Pot Contamination Management: Dross Removal and Top-Up","Solder Pot Dross Removal Management | Zohan","solder pot contamination dross removal top-up",["solder pot dross","solder pot contamination","dross removal solder","solder pot maintenance"]),
    ("soldering-ptfe-teflon-wires-flux-chemistry","Soldering PTFE / Teflon Wires: Surface Preparation and Flux Chemistry","PTFE Teflon Wire Soldering Flux | Zohan","soldering PTFE Teflon wires surface preparation flux",["PTFE wire soldering","Teflon wire solder","PTFE flux chemistry","solder PTFE wire"]),
    ("mechanical-vs-soldered-terminations-reliability","Mechanical vs Soldered Terminations: Reliability Data and Use Cases","Mechanical vs Solder Termination | Zohan Enterprises","mechanical vs soldered terminations reliability data",["mechanical vs solder termination","crimp vs solder reliability","solder termination data","termination method comparison"]),
    ("fume-extraction-wire-soldering-lev-sizing","Fume Extraction in Wire Soldering: LEV System Sizing and Placement","Fume Extraction Wire Soldering LEV | Zohan","fume extraction wire soldering LEV system sizing",["solder fume extraction","LEV solder machine","fume ventilation soldering","solder smoke extractor"]),
    ("wave-soldering-wire-harness-pcb-pigtail","Wave Soldering for Wire Harness Pigtail Lead Attachment to PCBs","Wave Soldering Wire Harness PCB | Zohan","wave soldering wire harness pigtail PCB attachment",["wave solder wire","PCB pigtail solder","wave soldering harness","wire PCB wave solder"]),
    ("soldering-rf-coaxial-cable-impedance-preservation","Soldering Connectors to RF Coaxial Cable: Impedance Preservation Tips","RF Coaxial Cable Soldering Guide | Zohan","RF coaxial cable soldering impedance preservation",["coax connector solder","RF cable soldering","impedance solder coax","coaxial solder connector"]),
    ("thermocouple-type-j-k-wire-soldering","Thermocouple Type J and K Wire Soldering: Joint Quality and Accuracy","Thermocouple Wire Soldering Guide | Zohan","thermocouple type J K wire soldering quality accuracy",["thermocouple solder","type J K wire solder","thermocouple joint quality","thermocouple wire solder accuracy"]),
    ("hand-vs-automated-soldering-defect-rate","Hand Soldering vs Automated Soldering: Defect Rate and Yield Comparison","Hand vs Automated Soldering Defect Rate | Zohan","hand vs automated soldering defect rate yield",["hand soldering defect rate","automated solder yield","manual vs automatic solder","solder defect comparison"]),
    ("solder-joint-fatigue-automotive-wire-harness","Solder Joint Fatigue Life in Vibrating Automotive Wire Harnesses","Solder Joint Fatigue Automotive Harness | Zohan","solder joint fatigue life automotive wire harness vibration",["solder joint fatigue","automotive solder vibration","solder fatigue life","harness solder durability"]),
    ("ze-200-stripping-soldering-setup-guide","Stripping-Soldering Machine (ZE-200): Setup and Parameter Guide","ZE-200 Stripping Soldering Machine Setup | Zohan","ZE-200 stripping soldering machine setup parameters",["ZE-200 setup","strip solder machine","automatic strip solder","ZE-200 parameter guide"]),
    ("ze-sm200-workflow-calibration","Semi-Automatic Soldering Machine (ZE-SM200): Workflow and Calibration","ZE-SM200 Soldering Machine Guide | Zohan","ZE-SM200 semi-automatic soldering machine workflow calibration",["ZE-SM200 setup","semi auto solder machine","ZE SM200 calibration","solder machine workflow"]),
    ("ze-fs3-production-throughput-guide","Fully Automatic Soldering Machine (ZE-FS3): Production Throughput Guide","ZE-FS3 Automatic Soldering Guide | Zohan","ZE-FS3 fully automatic soldering machine production throughput",["ZE-FS3 machine","automatic solder throughput","ZE-FS3 production","ZE FS3 guide"]),
    ("ze-usb100-usb-soldering-setup-yield","USB Cable Soldering Automation with ZE-USB100: Setup and Yield","ZE-USB100 USB Soldering Setup | Zohan Enterprises","ZE-USB100 USB soldering automation setup yield",["ZE-USB100 setup","USB cable solder","USB solder machine","ZE USB100 yield"]),
    ("soldering-silver-plated-wires-temperature","Soldering Silver-Plated Wires: Temperature Control and Joint Oxidation","Silver Plated Wire Soldering Guide | Zohan","soldering silver-plated wires temperature oxidation",["silver plated wire solder","solder silver wire","silver plated solder joint","silver wire temperature"]),
    ("desoldering-rework-wire-joints-heat-gun","De-Soldering and Rework of Wire Joints: Heat Gun and Desoldering Wick","Wire Joint Rework Desolder Guide | Zohan","de-soldering rework wire joints heat gun wick",["desolder wire joint","rework solder wire","heat gun desolder","solder wick wire rework"]),
    ("solder-joint-resistance-kelvin-method","Solder Joint Resistance Measurement Using 4-Wire Kelvin Method","Solder Joint Resistance Kelvin Method | Zohan","solder joint resistance measurement 4-wire Kelvin",["solder joint resistance","Kelvin measurement solder","4 wire resistance solder","solder joint ohm test"]),
    ("esd-safe-soldering-grounding-sensitive","ESD-Safe Soldering Stations and Grounding for Sensitive Wire Assemblies","ESD Safe Soldering Station | Zohan Enterprises","ESD-safe soldering stations grounding sensitive wire assemblies",["ESD safe soldering","antistatic solder station","ESD grounding solder","static safe soldering"]),
    ("solder-pot-temperature-pid-control","Managing Solder Pot Temperature Variation with Zone PID Control","Solder Pot Temperature PID Control | Zohan","solder pot temperature PID zone control variation",["solder pot PID","solder temperature control","pot temperature variation","solder zone PID"]),
    ("solder-splash-bridge-prevention-automatic","Solder Splash and Bridge Prevention During Automatic Machine Operation","Solder Splash Bridge Prevention | Zohan Enterprises","solder splash bridge prevention automatic soldering machine",["solder splash prevention","solder bridge prevent","automatic solder splash","bridge prevention soldering"]),
    ("flux-residue-cleaning-no-clean-water-washable","Flux Residue Cleaning: No-Clean vs Water-Washable Flux in Wire Shops","Flux Residue Cleaning Wire Shop | Zohan","flux residue cleaning no-clean water-washable wire shop",["flux cleaning no-clean","water washable flux","flux residue wire","no clean flux wire"]),
    ("wire-harness-traceability-solder-lot-number","Wire Harness Batch Traceability via Solder Lot Number Integration","Harness Traceability Solder Lot | Zohan Enterprises","wire harness traceability solder lot number integration",["solder lot traceability","harness batch traceability","solder lot number","wire harness solder trace"]),
    ("soldering-aluminium-specialist-flux-alloy","Soldering Aluminium Conductors: Specialist Flux and Alloy Requirements","Aluminium Wire Soldering Guide | Zohan Enterprises","soldering aluminium conductors specialist flux alloy",["aluminium wire soldering","aluminium solder flux","solder aluminium conductor","aluminium cable solder"]),
]

SD_ARTICLES = []
for i, (slug, title, mt, pk, skws) in enumerate(sd_topics):
    pid = i + 9  # sd-09 to sd-45
    art_id = f"sd-{pid:02d}"
    prods = SD_PRODUCTS[i % len(SD_PRODUCTS)]
    SD_ARTICLES.append(make_article(
        i, art_id, slug, title, mt, pk, skws,
        "Industrial Soldering Systems", "soldering",
        "complete-guide-to-industrial-soldering-machines",
        prods, date_idx=i
    ))

# ─────────────────────────────────────────────────────────────────────────────
# CLUSTER 5: Scrap Wire & Copper Recovery (sp-11 to sp-50 = 40 new)
# ─────────────────────────────────────────────────────────────────────────────

SP_PRODUCTS = [
    ["ze-038-scrap-wire-stripping-machine","ze-025-automatic-copper-scrap-wire-stripping-machine","ze-s80-automatic-copper-scrap-wire-stripping-machine"],
    ["ze-kof-automatic-copper-scrap-wire-stripping-machine","ze-120m-semi-automatic-copper-scrap-wire-stripping-machine","ze-038-scrap-wire-stripping-machine"],
    ["ze-100-electric-copper-granulator-copper-wire-separating-machine","ze-150-copper-wire-granulator-machine","ze-260-copper-wire-granulator-machine"],
    ["ze-3-7kw-plastic-crushing-machine","ze-5-5kw-plastic-crushing-machine","ze-7-5kw-plastic-crushing-machine"],
    ["ze-ka200-scrap-wire-machine-ka","ze-025-manual-scrap-wire-stripping-machine","ze-35-automatic-scrap-wire-stripping-machine"],
    ["ze-bladex-scrap-wire-machine-blade","ze-038-scrap-wire-stripping-machine","ze-s80-automatic-copper-scrap-wire-stripping-machine"],
]

sp_topics = [
    ("calculating-copper-recovery-yield-scrap-cable","Calculating Copper Recovery Yield from Mixed Scrap Cable","Copper Recovery Yield Calculation | Zohan Enterprises","calculating copper recovery yield mixed scrap cable",["copper recovery yield","scrap wire copper calculation","copper weight scrap cable","copper yield percentage"]),
    ("manual-vs-electric-scrap-wire-stripper-roi","Manual vs Electric Scrap Wire Stripping Machine ROI Comparison","Scrap Wire Stripper ROI Comparison | Zohan","manual vs electric scrap wire stripping machine ROI",["scrap wire stripper ROI","manual vs electric stripper","scrap machine payback","wire stripper investment"]),
    ("copper-price-scrap-wire-economics-revenue","Copper Price and Scrap Wire Economics: How to Maximize Revenue","Copper Scrap Wire Economics | Zohan Enterprises","copper price scrap wire economics maximize revenue",["copper scrap price","scrap wire revenue","copper metal price India","scrap wire business"]),
    ("blade-wear-rate-scrap-strippers-replacement","Blade Wear Rate in Scrap Wire Strippers: Predicting Replacement Intervals","Scrap Stripper Blade Wear Rate | Zohan","blade wear rate scrap wire strippers replacement intervals",["scrap stripper blade wear","blade replacement interval","wire stripper blade life","scrap machine blade change"]),
    ("processing-armored-cable-swa-steel-removal","Processing Armored Cable (SWA): Steel Wire Armor Removal Technique","Armored SWA Cable Processing | Zohan Enterprises","armored cable SWA steel wire armor removal",["SWA cable stripping","armored cable processing","steel wire armor removal","SWA scrap machine"]),
    ("processing-acsr-cable-aluminium-steel-conductor","Processing ACSR Cable (Aluminium Conductor Steel Reinforced)","ACSR Cable Processing Guide | Zohan Enterprises","ACSR cable aluminium conductor steel reinforced processing",["ACSR cable processing","aluminium conductor steel","ACSR scrap cable","ACSR wire stripping"]),
    ("processing-overhead-power-line-conductor-scrap","Processing Overhead Power Line Conductor Scrap: ACSR and AAC","Overhead Power Line Scrap Processing | Zohan","overhead power line conductor scrap ACSR AAC processing",["overhead conductor scrap","ACSR AAC scrap","power line conductor scrap","overhead wire recycling"]),
    ("copper-granulator-operation-feed-rate-separation","Copper Granulator Operation: Feed Rate and Separation Efficiency","Copper Granulator Operation Guide | Zohan","copper granulator operation feed rate separation efficiency",["copper granulator operation","granulator feed rate","copper separation efficiency","granulator machine operation"]),
    ("air-table-eddy-current-copper-plastic-granules","Air Table and Eddy Current Separation for Copper/Plastic Granules","Eddy Current Copper Plastic Separation | Zohan","air table eddy current copper plastic granule separation",["eddy current separator","air table separation","copper plastic granule","separation table copper"]),
    ("fire-damaged-cable-safety-value-recovery","Processing Fire-Damaged Cable: Safety Precautions and Value Recovery","Fire Damaged Cable Recovery | Zohan Enterprises","fire-damaged cable safety value recovery processing",["fire damaged cable","burnt wire scrap","fire cable value","damaged cable recovery"]),
    ("scrap-wire-moisture-drying-preprocessing","Scrap Wire Moisture Content: Drying and Pre-Processing Steps","Scrap Wire Moisture Drying | Zohan Enterprises","scrap wire moisture content drying pre-processing",["scrap wire moisture","wet wire scrap","scrap wire drying","wire scrap moisture content"]),
    ("processing-rubber-insulated-scrap-cable-butyl","Processing Rubber-Insulated Scrap Cable (Butyl, EPDM, Neoprene)","Rubber Insulated Scrap Cable | Zohan Enterprises","rubber insulated scrap cable butyl EPDM neoprene processing",["rubber cable scrap","butyl cable stripping","EPDM wire scrap","neoprene insulation scrap"]),
    ("pvc-regrind-cable-insulation-recycling-markets","PVC Regrind from Cable Insulation: Value and Recycling Markets","PVC Regrind Cable Insulation | Zohan Enterprises","PVC regrind cable insulation value recycling markets",["PVC regrind","cable PVC recycling","insulation regrind market","PVC cable scrap value"]),
    ("copper-purity-grades-no1-no2-berry-copper","Understanding Copper Purity Grades: No. 1, No. 2, and Berry Copper","Copper Purity Grades No 1 No 2 Berry | Zohan","copper purity grades No 1 No 2 berry copper",["copper purity grade","No 1 copper","berry copper","copper scrap grade"]),
    ("scrap-cable-inventory-sorting-conductor-material","Scrap Cable Inventory Sorting by Conductor Material and Gauge","Scrap Cable Inventory Sorting | Zohan Enterprises","scrap cable inventory sorting conductor material gauge",["scrap cable sorting","wire scrap inventory","copper scrap sorting","cable gauge sorting"]),
    ("lszh-scrap-wire-blade-adjustment","LSZH Scrap Wire Processing: Blade Adjustments for Stiff Compounds","LSZH Scrap Wire Blade Adjustment | Zohan","LSZH scrap wire processing blade adjustment stiff insulation",["LSZH scrap wire","LSZH blade adjust","low smoke halogen scrap","LSZH insulation stripping scrap"]),
    ("environmental-compliance-cable-recycling-india","Environmental Compliance for Cable Recycling Operations in India","Cable Recycling Environmental Compliance | Zohan","environmental compliance cable recycling India regulations",["cable recycling compliance India","wire scrap environment","recycling regulation India","CPCB cable recycling"]),
    ("small-scale-scrap-wire-stripping-workshop-setup","Setting Up a Small-Scale Scrap Wire Stripping Workshop","Scrap Wire Workshop Setup Guide | Zohan","small-scale scrap wire stripping workshop setup India",["scrap wire workshop","small scale wire stripper","wire recycling workshop setup","copper scrap workshop"]),
    ("cable-recycling-plant-design-equipment-layout","Cable Recycling Plant Design: Equipment Layout and Material Flow","Cable Recycling Plant Design | Zohan Enterprises","cable recycling plant design equipment layout material flow",["cable recycling plant design","wire recycling plant layout","scrap cable plant","copper recovery plant"]),
    ("comparing-ze-038-kof-s80-scrap-machines","Comparing Scrap Wire Stripping Machines: ZE-038, ZE-KOF, ZE-S80","Comparing ZE-038 ZE-KOF ZE-S80 | Zohan Enterprises","comparing scrap wire stripping machines ZE-038 ZE-KOF ZE-S80",["ZE-038 vs KOF","ZE-S80 comparison","scrap stripper comparison","wire stripper model compare"]),
    ("electric-scrap-wire-stripper-safety-guarding","Electric Scrap Wire Stripper Safety: Guarding and Operator Training","Scrap Wire Stripper Safety Training | Zohan","electric scrap wire stripper safety guarding operator training",["scrap stripper safety","wire stripper guard","operator safety scrap machine","wire recycling machine safety"]),
    ("copper-granulator-blade-sharpening-replacement","Copper Granulator Blade Sharpening and Replacement Schedule","Granulator Blade Sharpening | Zohan Enterprises","copper granulator blade sharpening replacement schedule",["granulator blade sharpening","copper granulator blade","blade replacement granulator","granulator blade change"]),
    ("catv-coaxial-cable-scrap-copper-recovery","Processing CATV and Coaxial Cable Scrap for Copper Recovery","CATV Coaxial Scrap Copper Recovery | Zohan","CATV coaxial cable scrap copper recovery processing",["CATV cable scrap","coaxial scrap copper","coax cable recycle","CATV wire copper"]),
    ("telephone-cable-telecom-scrap-copper","Recovering Copper from Telephone Cable and Telecom Cable Scrap","Telephone Telecom Cable Copper Recovery | Zohan","copper recovery telephone telecom cable scrap",["telephone cable scrap","telecom wire copper","telephone cable recycle","telecom scrap wire"]),
    ("welding-cable-scrap-thick-rubber-conductor","Processing Welding Cable Scrap: Thick Rubber and Flexible Conductor","Welding Cable Scrap Processing | Zohan Enterprises","welding cable scrap thick rubber flexible conductor processing",["welding cable scrap","welding wire recycle","rubber welding cable strip","flexible conductor scrap"]),
    ("motor-winding-wire-enamelled-magnet-recycling","Motor Winding Wire Recycling: Enamelled Wire (Magnet Wire) Stripping","Motor Winding Wire Recycling | Zohan Enterprises","motor winding wire recycling enamelled magnet wire stripping",["motor winding wire scrap","enamelled wire recycling","magnet wire scrap","winding copper recovery"]),
    ("transformer-winding-wire-fine-enamelled-copper","Transformer Core Winding Wire Recovery: Handling Fine Enamelled Copper","Transformer Winding Wire Recovery | Zohan","transformer winding wire recovery enamelled copper",["transformer wire scrap","transformer copper recovery","enamelled copper wire","winding wire reclaim"]),
    ("recovering-aluminium-from-cable-scrap","Recovering Aluminium from Cable Scrap: Pricing and Market Channels","Aluminium Cable Scrap Recovery | Zohan Enterprises","recovering aluminium cable scrap pricing market channels",["aluminium cable scrap","aluminium wire recovery","aluminium scrap price","aluminium cable recycling"]),
    ("processing-lead-sheathed-cable-safety","Processing Lead-Sheathed Cable: Safety, Handling, and Value Recovery","Lead Sheathed Cable Processing Safety | Zohan","lead-sheathed cable safety handling value recovery",["lead sheathed cable","lead cable safety","lead cable scrap","lead insulated wire"]),
    ("scrap-battery-automotive-harness-cable-stripping","Scrap Battery Cable and Automotive Harness Cable Stripping","Battery Cable Scrap Automotive | Zohan Enterprises","scrap battery cable automotive harness stripping",["battery cable scrap","automotive harness scrap","car wire recycle","battery cable strip"]),
    ("industrial-cable-scrap-buying-guide-pricing-tiers","Industrial Cable Scrap Buying Guide: Pricing Tiers and Negotiation","Cable Scrap Buying Guide India | Zohan Enterprises","industrial cable scrap buying guide pricing tiers India",["cable scrap buying guide","scrap wire price India","industrial scrap price","cable scrap negotiation"]),
    ("blade-holder-maintenance-lubrication-scrap-machines","Blade Holder Maintenance and Lubrication for Scrap Stripping Machines","Scrap Machine Blade Holder Maintenance | Zohan","blade holder maintenance lubrication scrap stripping machines",["blade holder lubrication","scrap stripper maintenance","blade mount maintenance","scrap machine blade care"]),
    ("machine-feed-rate-thick-vs-thin-scrap-cable","Setting Machine Feed Rate for Thick vs Thin Scrap Cable","Scrap Machine Feed Rate Setting | Zohan Enterprises","machine feed rate thick vs thin scrap cable setting",["feed rate scrap machine","thick thin scrap cable","scrap wire feed speed","scrap machine speed setting"]),
    ("granulator-screen-mesh-selection-chip-size","Granulator Screen Mesh Selection: Controlling Output Chip Size","Granulator Screen Mesh Selection | Zohan Enterprises","granulator screen mesh selection output chip size",["granulator screen mesh","copper chip size","granulator output size","mesh screen granulator"]),
    ("copper-purity-testing-fire-assay-xrf","Copper Purity Testing: Fire Assay vs XRF Spectrometer Comparison","Copper Purity Testing XRF Fire Assay | Zohan","copper purity testing fire assay XRF spectrometer comparison",["copper purity test","XRF copper testing","fire assay copper","purity spectrometer"]),
    ("plastic-fraction-granulation-recycler-markets","Plastic Fraction from Granulation: Recycler Markets and Pricing","Plastic Fraction Granulation Recycling | Zohan","plastic fraction cable granulation recycler markets pricing",["plastic fraction cable","granulation plastic","PVC granule market","cable plastic recycle market"]),
    ("recovering-copper-solar-pv-dc-cable-scrap","Recovering Copper from Solar PV DC Cable Scrap","Solar PV Cable Scrap Copper Recovery | Zohan","copper recovery solar PV DC cable scrap",["solar cable scrap","PV DC wire recycle","solar cable copper","solar wire scrap"]),
    ("export-regulations-copper-scrap-india-dgft","Export Regulations for Copper Scrap in India: DGFT and Customs","Copper Scrap Export India DGFT | Zohan Enterprises","copper scrap export regulations India DGFT customs",["copper scrap export India","DGFT copper scrap","copper export regulation","scrap copper customs India"]),
    ("scrap-wire-processing-capacity-planning-tons-hour","Scrap Wire Processing Capacity Planning: Tons/Hour Calculations","Scrap Wire Capacity Planning | Zohan Enterprises","scrap wire processing capacity planning tons per hour",["scrap wire capacity","tons per hour scrap","wire recycling capacity","scrap processing tonnage"]),
    ("maximizing-copper-recovery-low-grade-mixed-scrap","Maximizing Copper Recovery from Low-Grade Mixed Scrap Batches","Copper Recovery Low Grade Scrap | Zohan Enterprises","maximizing copper recovery low-grade mixed scrap batches",["low grade copper scrap","mixed scrap copper recovery","maximize copper yield","copper recovery efficiency"]),
]

SP_ARTICLES = []
for i, (slug, title, mt, pk, skws) in enumerate(sp_topics):
    pid = i + 11
    art_id = f"sp-{pid:02d}"
    prods = SP_PRODUCTS[i % len(SP_PRODUCTS)]
    SP_ARTICLES.append(make_article(
        i, art_id, slug, title, mt, pk, skws,
        "Scrap Wire & Copper Recovery", "scrap-processing",
        "complete-guide-to-scrap-wire-stripping-and-copper-recovery",
        prods, date_idx=i
    ))

# ─────────────────────────────────────────────────────────────────────────────
# CLUSTER 6: Cable Harness & Assembly (ch-13 to ch-55 = 44 new)
# ─────────────────────────────────────────────────────────────────────────────

CH_PRODUCTS = [
    ["ze-35mm-cable-tying-and-wire-winding-machine","ze-50mm-cable-tying-and-wire-winding-machine","ze-28mm-cable-tying-machine"],
    ["ze-zcut2-automatic-tape-dispenser","ze-zcut9-automatic-tape-dispenser","ze-m1000-automatic-tape-dispenser"],
    ["ze-asc100-automatic-sleeve-cutting-machine","ze-200mm-automatic-sleeve-cutting-machine","ze-c90-automatic-sleeve-cutting-machine"],
    ["ze-wt100-wire-twister","ze-ct100-copper-wire-twisting-machine","ze-hwt100-half-wire-stripping-twisting-machine"],
    ["ze-50kg-push-pull-tester","ze-100kg-push-pull-tester","ze-pct100-power-cord-wire-testing-machine"],
    ["ze-6t-automatic-wire-crimping-machine","ze-s1-fully-automatic-single-head-wire-crimping-machine","ze-cr2-fully-automatic-double-head-wire-crimping-machine"],
    ["ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-10mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-315-4mm-automatic-wire-cutting-stripping-machine"],
    ["ze-ut-usb-data-cable-tester","ze-pct100-power-cord-wire-testing-machine","ze-50kg-push-pull-tester"],
]

ch_topics = [
    ("wire-harness-assembly-board-formboard-manufacturing","Wire Harness Assembly Board Design and Formboard Manufacturing","Harness Assembly Board Formboard | Zohan","wire harness assembly board formboard manufacturing",["harness assembly board","formboard manufacturing","harness build board","wire harness layout board"]),
    ("wire-harness-bundling-methods-lacing-ties-tape","Wire Harness Bundling Methods: Lacing Cord vs Cable Ties vs Tape","Harness Bundling Methods Guide | Zohan Enterprises","wire harness bundling lacing cord cable ties tape methods",["harness bundling method","lacing cord harness","cable tie vs tape","harness wrap methods"]),
    ("automatic-wire-coiling-winding-toroidal","Automatic Wire Coiling and Winding: Spool and Toroidal Coiling","Automatic Wire Coiling Winding | Zohan Enterprises","automatic wire coiling winding spool toroidal",["wire coiling machine","toroidal wire coil","spool coiling machine","automatic wire winder"]),
    ("cable-tie-selection-automotive-industrial-harness","Cable Tie Selection for Automotive and Industrial Harness Environments","Cable Tie Selection Harness Guide | Zohan","cable tie selection automotive industrial harness",["cable tie harness","automotive cable tie","industrial cable tie","harness tie type"]),
    ("tape-wrapping-machines-half-lap-butt-spiral","Tape Wrapping Machines: Half-Lap, Butt-Wrap, and Spiral Wrap Setup","Tape Wrapping Machine Setup Guide | Zohan","tape wrapping machines half-lap butt-wrap spiral wrap",["tape wrapping machine","half lap tape wrap","spiral wrap harness","butt wrap tape machine"]),
    ("heatshrink-sleeve-selection-harness-branches","Heatshrink Sleeve Selection for Wire Harness Branches and Repairs","Heatshrink Sleeve Harness Guide | Zohan Enterprises","heatshrink sleeve selection wire harness branches repairs",["heatshrink sleeve harness","heat shrink selection","heatshrink wire branch","heat shrink tube size"]),
    ("connector-housing-assembly-terminal-insertion-force","Connector Housing Assembly: Terminal Insertion Force and Verification","Connector Housing Terminal Insertion | Zohan","connector housing assembly terminal insertion force verification",["connector housing assembly","terminal insertion force","housing assembly check","connector terminal fit"]),
    ("wire-harness-continuity-hipot-electrical-testing","Wire Harness Continuity and Hi-Pot Electrical Testing Procedures","Harness Continuity Hi-Pot Testing | Zohan","wire harness continuity hi-pot electrical testing procedures",["harness continuity test","hi-pot test harness","electrical test wire harness","harness dielectric test"]),
    ("wire-harness-routing-clip-attachment-vehicle","Wire Harness Routing and Clip Attachment in Vehicle Assembly","Harness Routing Vehicle Assembly | Zohan Enterprises","wire harness routing clip attachment vehicle assembly",["harness routing vehicle","harness clip attachment","wire harness vehicle","harness route installation"]),
    ("harness-branch-junction-point-construction","Wire Harness Branch-Out and Junction Point Construction Techniques","Harness Branch Junction Construction | Zohan","wire harness branch-out junction point construction",["harness branch construction","harness junction point","wire branch out","harness branching technique"]),
    ("wire-harness-documentation-cad-bom-management","Wire Harness Documentation: CAD Drawing and Assembly BOM Management","Harness Documentation BOM Management | Zohan","wire harness documentation CAD drawing assembly BOM",["harness CAD documentation","harness BOM management","wire harness drawing","harness assembly document"]),
    ("harness-assembly-time-study-line-balancing-takt","Harness Assembly Time Study and Line Balancing for Takt Time","Harness Assembly Line Balancing | Zohan Enterprises","harness assembly time study line balancing takt time",["harness line balancing","takt time harness","assembly time study","wire harness balance"]),
    ("pull-force-testing-connector-terminal-retention","Pull Force Testing for Connector and Terminal Retention","Pull Force Test Connector Terminal | Zohan","pull force testing connector terminal retention harness",["pull force connector","terminal retention test","connector pull test","terminal pull out force"]),
    ("wire-harness-moisture-sealing-grommets-potting","Wire Harness Moisture Sealing: Grommets, Silicone Gel, and Potting","Harness Moisture Sealing Guide | Zohan Enterprises","wire harness moisture sealing grommets silicone gel potting",["harness moisture seal","grommet sealing","silicone gel harness","harness potting seal"]),
    ("wire-colour-coding-control-panel-harnesses","Wire Color Coding Compliance in Industrial Control Panel Harnesses","Control Panel Wire Color Coding | Zohan","wire color coding industrial control panel harnesses",["control panel wire colour","harness colour code","panel wiring colour","wire colour compliance"]),
    ("cable-tying-machine-tension-trim-setup","Cable Tying Machine Setup for Consistent Tie Tension and Trim","Cable Tying Machine Setup Guide | Zohan","cable tying machine tie tension trim setup consistent",["cable tie machine setup","tie tension cable","automatic cable tying","tie machine trim"]),
    ("payoff-stand-take-up-winder-integration","Pay-Off Stand and Take-Up Winder Integration for Automated Assembly","Payoff Stand Take-Up Winder Integration | Zohan","pay-off stand take-up winder integration automated assembly",["payoff take-up winder","wire winder integration","take up reel wire","payoff winder automated"]),
    ("harness-testing-fixtures-bed-of-nails-flying-probe","Harness Testing Fixtures: Bed-of-Nails and Flying Probe Testers","Harness Testing Fixture Guide | Zohan Enterprises","harness testing fixtures bed-of-nails flying probe testers",["bed of nails tester","flying probe harness","harness test fixture","electrical test fixture"]),
    ("pre-crimped-wire-assemblies-reel-to-board-feeding","Pre-Crimped Wire Assemblies: Reel-to-Board Automated Feeding","Pre-Crimped Wire Reel-to-Board | Zohan Enterprises","pre-crimped wire assemblies reel-to-board automated feeding",["pre-crimped wire reel","reel to board feeding","pre-crimp wire assembly","automated wire board feed"]),
    ("braided-sleeving-conduit-harness-trunks","Braided Sleeving and Conduit Application on Wire Harness Trunks","Braided Sleeving Harness Trunk | Zohan Enterprises","braided sleeving conduit wire harness trunks application",["braided sleeving harness","conduit wire trunk","harness sleeve braid","expandable sleeve harness"]),
    ("wire-harness-stress-testing-flexure-vibration","Wire Harness Mechanical Stress Testing: Flexure and Vibration","Harness Stress Testing Flexure Vibration | Zohan","wire harness mechanical stress testing flexure vibration",["harness stress test","wire flexure test","harness vibration test","mechanical test harness"]),
    ("harness-assembly-cycle-time-optimization","End-to-End Wire Harness Assembly Cycle Time Optimization","Harness Assembly Cycle Time | Zohan Enterprises","wire harness assembly cycle time optimization",["harness cycle time","assembly time optimization","harness throughput","wire harness efficiency"]),
    ("multi-cavity-connector-insertion-semi-auto","Multi-Cavity Connector Terminal Insertion: Semi-Auto Insertion Tools","Multi-Cavity Connector Insertion | Zohan Enterprises","multi-cavity connector terminal insertion semi-auto tools",["multi-cavity connector","terminal insertion tool","semi auto insertion","connector terminal push"]),
    ("harness-sub-variants-part-number-matrix","Managing Harness Sub-Variants: Part Number Matrix and Configuration","Harness Sub-Variant Management | Zohan Enterprises","harness sub-variants part number matrix configuration",["harness variant management","part number matrix","harness configuration","wire harness variants"]),
    ("wire-marker-label-printing-harness-identification","Wire Marker and Label Printing for Harness Identification","Wire Marker Label Printing Harness | Zohan","wire marker label printing harness identification",["wire marker harness","label printing wire","harness ID label","wire identification marker"]),
    ("automotive-oem-harness-ppap-fmea-control-plan","Automotive OEM Harness Validation: PPAP, FMEA, and Control Plan","Automotive Harness PPAP FMEA | Zohan Enterprises","automotive OEM harness validation PPAP FMEA control plan",["harness PPAP","FMEA wire harness","automotive harness validation","control plan harness"]),
    ("wire-harness-shipping-packaging-transit","Wire Harness Shipping and Packaging for Damage-Free Transit","Harness Shipping Packaging Guide | Zohan","wire harness shipping packaging damage-free transit",["harness shipping","wire harness packaging","harness transit protection","harness shipping damage"]),
    ("cable-harness-solar-inverter-combiner-box","Cable Harness for Renewable Energy Inverter and Solar Combiner Boxes","Solar Inverter Harness Assembly | Zohan Enterprises","cable harness solar renewable energy inverter combiner box",["solar harness assembly","inverter cable harness","solar combiner box wiring","renewable energy harness"]),
    ("medical-device-harness-iso-13485-cleanroom","Medical Device Harness Assembly: ISO 13485 Cleanroom Requirements","Medical Device Harness ISO 13485 | Zohan","medical device harness assembly ISO 13485 cleanroom",["medical harness ISO 13485","cleanroom wire assembly","medical device cable","ISO 13485 harness"]),
    ("aerospace-harness-as23053-mil-w-22759","Aerospace Harness Fabrication: AS23053 Sleeving and Mil-W-22759 Wire","Aerospace Harness Fabrication | Zohan Enterprises","aerospace harness fabrication AS23053 Mil-W-22759",["aerospace harness","Mil-W-22759 wire","AS23053 sleeving","aerospace cable assembly"]),
    ("high-voltage-ev-battery-harness-orange-cable","High-Voltage EV Battery Harness Assembly: Orange Cable Processing","HV EV Battery Harness Assembly | Zohan","high-voltage EV battery harness orange cable assembly",["HV EV battery harness","orange EV cable","high voltage wire harness","EV battery cable assembly"]),
    ("shielded-harness-360-shield-termination-pigtail","Shielded Harness Assembly: 360° Shield Termination and Pigtail Drain","Shielded Harness 360 Shield | Zohan Enterprises","shielded harness 360 shield termination pigtail drain",["shielded harness termination","360 degree shield","pigtail drain wire","shield termination harness"]),
    ("data-cable-harness-can-lin-ethernet-assembly","Data Cable Harness (CAN, LIN, Ethernet) Assembly and Testing","CAN LIN Ethernet Harness Assembly | Zohan","data cable harness CAN LIN Ethernet assembly testing",["CAN bus harness","LIN data harness","Ethernet harness assembly","data cable harness test"]),
    ("harness-assembly-error-proofing-poka-yoke","Harness Assembly Error-Proofing (Poka-Yoke) with Color-Coded Tools","Harness Error Proofing Poka Yoke | Zohan","harness assembly error-proofing poka-yoke color-coded tools",["poka yoke harness","harness error proofing","color coded assembly","mistake proof harness"]),
    ("wire-harness-repair-modification-service","Wire Harness Repair and Modification Procedures for Service Centers","Harness Repair Modification Guide | Zohan","wire harness repair modification procedures service centers",["wire harness repair","harness modification","service center harness","wire harness rework"]),
    ("connector-secondary-locking-clip-installation","Connector Secondary Locking Clip Installation and Verification","Connector Secondary Lock Clip | Zohan Enterprises","connector secondary locking clip installation verification",["secondary lock connector","connector CPA clip","TPA installation","connector lock verify"]),
    ("sealed-connector-silicone-seal-retention-check","Sealed Connector Assembly: Silicone Seal Insertion and Retention Check","Sealed Connector Silicone Seal | Zohan Enterprises","sealed connector silicone seal insertion retention check",["sealed connector assembly","silicone seal insertion","connector seal check","IP67 seal connector"]),
    ("flat-flexible-cable-ffc-harness-termination","Flat Flexible Cable (FFC) Harness Assembly and Connector Termination","FFC Harness Assembly Termination | Zohan","flat flexible cable FFC harness assembly connector termination",["FFC harness","flat flexible cable","FFC connector termination","flexible cable assembly"]),
    ("rubber-grommet-sizing-panel-cutout-harness","Rubber Grommet Sizing for Panel Cutout Sealing in Harness Routing","Rubber Grommet Sizing Panel Cutout | Zohan","rubber grommet sizing panel cutout sealing harness routing",["rubber grommet sizing","grommet panel seal","harness grommet","panel cutout grommet"]),
    ("wire-harness-weight-lightweighting-analysis","Wire Harness Weight and Cross-Section Analysis for Vehicle Lightweighting","Harness Weight Lightweighting Analysis | Zohan","wire harness weight cross-section lightweighting analysis",["harness weight reduction","wire harness lightweighting","vehicle harness weight","harness cross section analysis"]),
    ("parallel-multi-wire-cutting-kits-harness-shops","Parallel Multi-Wire Cutting Kits for Harness Assembly Shops","Multi Wire Cutting Kits Harness | Zohan Enterprises","parallel multi-wire cutting kits harness assembly shops",["multi wire cutting kit","parallel wire cut","harness kit cutting","wire cut batch harness"]),
    ("crimp-insertion-workstation-ergonomics","Crimping and Insertion Workstation Ergonomics for Operator Efficiency","Crimp Insertion Workstation Ergonomics | Zohan","crimping insertion workstation ergonomics operator efficiency",["crimp workstation ergonomics","insertion workstation design","harness ergonomics","operator efficiency crimp station"]),
    ("qr-code-serialization-finished-harness","Labeling and QR Code Serialization of Finished Wire Harness Assemblies","QR Code Harness Serialization | Zohan Enterprises","QR code serialization finished wire harness assemblies",["harness QR code","wire harness serialization","QR label harness","harness barcode tracking"]),
    ("wire-harness-final-inspection-fai","Wire Harness Final Inspection and Customer FAI (First Article Inspection)","Harness Final Inspection FAI | Zohan Enterprises","wire harness final inspection customer FAI first article",["harness final inspection","FAI wire harness","first article harness","harness customer inspection"]),
]

CH_ARTICLES = []
for i, (slug, title, mt, pk, skws) in enumerate(ch_topics):
    pid = i + 13
    art_id = f"ch-{pid:02d}"
    prods = CH_PRODUCTS[i % len(CH_PRODUCTS)]
    CH_ARTICLES.append(make_article(
        i, art_id, slug, title, mt, pk, skws,
        "Cable Harness & Assembly", "cable-harness",
        "complete-guide-to-wire-harness-assembly-and-processing",
        prods, date_idx=i
    ))

# ─────────────────────────────────────────────────────────────────────────────
# CLUSTER 7: Industrial Automation & Efficiency (ia-11 to ia-55 = 45 new)
# ─────────────────────────────────────────────────────────────────────────────

IA_PRODUCTS = [
    ["ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-10mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-6t-automatic-wire-crimping-machine"],
    ["ze-s1-fully-automatic-single-head-wire-crimping-machine","ze-cr2-fully-automatic-double-head-wire-crimping-machine","ze-320-high-speed-cutting-stripping-machine"],
    ["ze-fs3-fully-automatic-soldering-machine","ze-6t-automatic-wire-crimping-machine","ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine"],
    ["ze-spo100-single-wire-pay-off-stand","ze-35mm-cable-tying-and-wire-winding-machine","ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine"],
    ["ze-100nt-nut-tightening-machine","ze-pct100-power-cord-wire-testing-machine","ze-6t-automatic-wire-crimping-machine"],
]

ia_topics = [
    ("takt-time-calculation-wire-processing-cell","Takt Time Calculation for Wire Processing Cell Design","Takt Time Wire Processing Cell | Zohan Enterprises","takt time calculation wire processing cell design",["takt time wire processing","cell design takt","production takt calculation","wire cell takt time"]),
    ("bottleneck-analysis-wire-preparation-lines","Bottleneck Analysis in Wire Preparation Production Lines","Bottleneck Analysis Wire Lines | Zohan Enterprises","bottleneck analysis wire preparation production lines",["bottleneck wire line","production bottleneck analysis","wire prep bottleneck","line constraint analysis"]),
    ("transitioning-semi-auto-to-fully-auto-wire","Transitioning from Semi-Automatic to Fully Automatic Wire Processing","Semi to Fully Auto Wire Processing | Zohan","transitioning semi-automatic to fully automatic wire processing",["semi to fully auto wire","upgrade wire machine","automatic wire transition","full automation wire"]),
    ("plc-controller-programming-wire-cutting-basics","PLC Controller Programming Basics for Wire Cutting Machines","PLC Programming Wire Cutting | Zohan Enterprises","PLC controller programming basics wire cutting machines",["PLC wire machine","PLC programming cutting","wire machine PLC","PLC controller wire"]),
    ("machine-oee-availability-performance-quality","Machine OEE Measurement: Availability, Performance, Quality","Machine OEE Wire Processing | Zohan Enterprises","machine OEE measurement availability performance quality wire",["OEE wire machine","machine availability OEE","OEE performance quality","wire machine OEE"]),
    ("smed-setup-time-reduction-wire-processing","Setup Time Reduction (SMED) for Wire Processing Job Changeovers","SMED Wire Processing Changeover | Zohan","SMED setup time reduction wire processing job changeovers",["SMED wire changeover","setup time reduction","quick changeover wire","SMED lean wire"]),
    ("line-balancing-wire-harness-work-content","Line Balancing in Wire Harness Assembly: Work Content Distribution","Line Balancing Harness Assembly | Zohan Enterprises","line balancing wire harness assembly work content distribution",["harness line balance","work content distribution","wire assembly balance","takt harness balance"]),
    ("automated-wire-feeding-payoff-plc-integration","Automated Wire Feeding: Active Payoff Integration with PLC Logic","Automated Wire Feeding PLC | Zohan Enterprises","automated wire feeding active payoff PLC logic integration",["PLC wire feed","automated payoff PLC","wire feeding automation","active payoff PLC"]),
    ("multi-machine-operator-assignment-one-to-many","Multi-Machine Operator Assignment: One Operator, Multiple Cells","Multi Machine Operator Cell | Zohan Enterprises","multi-machine operator assignment one operator multiple cells",["multi machine operator","one operator multiple cells","operator cell assignment","wire machine operator ratio"]),
    ("automated-wire-kitting-just-in-time-harness","Automated Wire Kitting Systems for Just-In-Time Harness Assembly","Automated Wire Kitting JIT | Zohan Enterprises","automated wire kitting just-in-time JIT harness assembly",["wire kitting system","JIT harness kit","automated kitting","wire harness JIT"]),
    ("servo-motor-technology-wire-cutting-accuracy","Servo Motor Technology in Wire Cutting Machines: Accuracy Benefits","Servo Motor Wire Cutting Accuracy | Zohan","servo motor technology wire cutting machines accuracy benefits",["servo wire machine","servo motor cutting","servo drive accuracy","servo wire processing"]),
    ("stepper-vs-servo-drives-wire-feeding","Stepper vs Servo Drives: Tradeoff Analysis for Wire Feeding Accuracy","Stepper vs Servo Wire Feeding | Zohan Enterprises","stepper vs servo drives wire feeding accuracy tradeoff",["stepper vs servo wire","drive comparison wire","servo stepper accuracy","wire feed motor type"]),
    ("conveyor-integration-cut-strip-crimp-stations","Conveyor Integration Between Wire Cut-Strip and Crimp Stations","Conveyor Cut Strip Crimp Integration | Zohan","conveyor integration wire cut-strip crimp stations",["conveyor wire integration","cut strip crimp conveyor","wire line conveyor","automated conveyor wire"]),
    ("palletizing-handling-finished-wire-assemblies","Palletizing and Handling of Finished Wire Assemblies: Automation Options","Wire Assembly Palletizing Automation | Zohan","palletizing handling finished wire assemblies automation",["wire assembly palletizing","finished harness handling","wire pallet automation","assembly handling system"]),
    ("robotic-wire-routing-cobot-applications","Robotic Wire Routing: Collaborative Robot (Cobot) Applications","Robotic Wire Routing Cobot | Zohan Enterprises","robotic wire routing collaborative robot cobot applications",["cobot wire routing","robotic wire harness","collaborative robot assembly","cobot wire application"]),
    ("vision-guided-automation-harness-connector-bots","Vision-Guided Automation in Harness Assembly: Connector Insertion Bots","Vision Guided Harness Assembly | Zohan Enterprises","vision-guided automation harness assembly connector insertion bots",["vision guided automation","harness connector robot","machine vision assembly","vision inspection harness"]),
    ("agv-integration-wire-processing-factories","AGV Integration in Wire Processing Factories","AGV Wire Processing Factory | Zohan Enterprises","AGV automated guided vehicle wire processing factory integration",["AGV wire factory","automated guided vehicle","AGV integration","wire plant AGV"]),
    ("machine-tool-monitoring-current-vibration-sensor","Machine Tool Monitoring via Current Transducer and Vibration Sensor","Machine Monitoring Current Vibration | Zohan","machine tool monitoring current transducer vibration sensor wire",["machine monitoring sensor","current transducer wire","vibration sensor machine","wire machine condition monitor"]),
    ("factory-capacity-planning-wire-machine-throughput","Factory Capacity Planning Using Wire Processing Machine Throughput Data","Wire Processing Capacity Planning | Zohan","factory capacity planning wire processing machine throughput data",["capacity planning wire","wire machine throughput","factory capacity wire","production capacity machine"]),
    ("roi-automating-manual-wire-stripping-sme","Calculating ROI of Automating Manual Wire Stripping in SME Factories","ROI Wire Stripping Automation SME | Zohan","ROI automating manual wire stripping SME factories India",["ROI wire automation","wire stripping ROI","SME wire machine ROI","automation payback wire"]),
    ("wire-processing-machine-selection-ems","Wire Processing Machine Selection for EMS (Electronics Manufacturing)","EMS Wire Processing Machine | Zohan Enterprises","wire processing machine selection EMS electronics manufacturing",["EMS wire processing","electronics manufacturing wire","wire machine EMS","EMS assembly wire machine"]),
    ("integrating-wire-processing-mes-tracking","Integrating Wire Processing Output with MES Production Tracking","Wire Processing MES Integration | Zohan Enterprises","integrating wire processing output MES production tracking systems",["MES wire integration","wire processing MES","production tracking wire","MES data integration"]),
    ("barcode-qr-scanning-wire-processing-traceability","Barcode and QR Scanning in Wire Processing: Batch Traceability","Barcode QR Wire Processing | Zohan Enterprises","barcode QR scanning wire processing batch traceability",["barcode wire processing","QR traceability wire","batch scan wire","wire barcode system"]),
    ("scada-dashboards-wire-processing-plant","SCADA Dashboards for Wire Processing Plant Monitoring","SCADA Wire Processing Plant | Zohan Enterprises","SCADA dashboards wire processing plant monitoring",["SCADA wire plant","wire processing SCADA","plant monitoring SCADA","wire factory SCADA"]),
    ("energy-audit-wire-processing-kwh-per-unit","Energy Audit of Wire Processing Equipment: Measuring kWh per Unit","Wire Processing Energy Audit | Zohan Enterprises","energy audit wire processing equipment kWh per unit",["energy audit wire machine","kWh wire processing","wire machine energy","power consumption wire"]),
    ("air-compressor-sizing-pneumatic-wire-lines","Air Compressor Sizing for Pneumatic Wire Stripping Machine Lines","Air Compressor Wire Machine Sizing | Zohan","air compressor sizing pneumatic wire stripping machine lines",["air compressor wire machine","pneumatic wire compressor","compressor sizing wire","wire machine air supply"]),
    ("multi-shift-production-scheduling-wire-factories","Multi-Shift Production Scheduling for Wire Processing Factories","Multi Shift Wire Factory Scheduling | Zohan","multi-shift production scheduling wire processing factories",["multi shift wire factory","production schedule wire","shift planning wire","wire factory schedule"]),
    ("5s-methodology-wire-processing-workstations","5S Methodology Applied to Wire Processing Workstations","5S Wire Processing Workstation | Zohan Enterprises","5S methodology applied wire processing workstations",["5S wire workstation","lean 5S wire","5S manufacturing wire","wire station 5S"]),
    ("kaizen-wire-preparation-defect-reduction","Kaizen Improvement Events for Reducing Wire Preparation Defects","Kaizen Wire Preparation Defects | Zohan Enterprises","kaizen improvement events reducing wire preparation defects",["kaizen wire preparation","wire defect kaizen","kaizen wire processing","wire quality kaizen event"]),
    ("sop-wire-cutting-machine-operators","Standard Operating Procedures (SOPs) for Wire Cutting Machine Operators","SOPs Wire Cutting Machine Operators | Zohan","SOPs wire cutting machine operators standard operating procedures",["SOP wire cutting","wire machine operator SOP","standard procedure wire","wire machine SOP guide"]),
    ("machine-guarding-safety-interlock-wire-processing","Machine Guarding and Safety Interlock Requirements for Wire Processing","Machine Guarding Safety Wire | Zohan Enterprises","machine guarding safety interlock requirements wire processing",["machine guarding wire","safety interlock wire machine","wire machine safety guard","interlock wire processing"]),
    ("noise-reduction-wire-cutting-crimping-production","Noise Reduction in Wire Cutting and Crimping Production Environments","Noise Reduction Wire Crimping | Zohan Enterprises","noise reduction wire cutting crimping production environments",["wire machine noise reduction","crimping noise","wire production noise","machine noise control"]),
    ("vibration-isolation-precision-wire-cutting-benches","Vibration Isolation for Precision Wire Cutting Benches","Vibration Isolation Wire Cutting | Zohan Enterprises","vibration isolation precision wire cutting benches",["wire bench vibration","vibration damping wire","precision bench isolation","wire machine vibration"]),
    ("preventive-maintenance-scheduling-cmms","Preventive Maintenance Scheduling: Computerized Maintenance Management","CMMS Wire Processing PM Scheduling | Zohan","preventive maintenance scheduling CMMS wire processing",["CMMS wire machine","preventive maintenance wire","PM schedule wire","maintenance management wire"]),
    ("spare-parts-inventory-wire-processing-machinery","Spare Parts Inventory Management for Wire Processing Machinery","Spare Parts Wire Machine Inventory | Zohan","spare parts inventory management wire processing machinery",["spare parts wire machine","wire machine inventory","critical spares wire","spare part management"]),
    ("ergonomic-workstation-wire-operators","Ergonomic Workstation Height and Reach Zone for Wire Operators","Ergonomic Workstation Wire Operators | Zohan","ergonomic workstation height reach zone wire operators",["ergonomic wire workstation","operator reach zone","wire station height","ergonomics wire machine"]),
    ("workplace-lighting-wire-inspection-assembly","Workplace Lighting Standards for Wire Inspection and Assembly Tasks","Workplace Lighting Wire Assembly | Zohan Enterprises","workplace lighting standards wire inspection assembly tasks",["wire inspection lighting","assembly area lighting","workstation lighting wire","lux level wire inspection"]),
    ("automated-length-verification-encoder-feedback","Automated Length Verification Using Encoder Feedback in CNC Wire Machines","Encoder Length Verification Wire | Zohan Enterprises","automated length verification encoder feedback CNC wire machines",["encoder wire machine","length verification encoder","CNC wire encoder","wire machine length feedback"]),
    ("wireless-machine-health-monitoring-vibration","Wireless Machine Health Monitoring: Vibration and Temperature Alerts","Wireless Machine Health Monitor Wire | Zohan","wireless machine health monitoring vibration temperature alerts",["wireless machine monitor","vibration alert wire","machine health wireless","IoT wire monitoring"]),
    ("production-kpi-dashboards-wire-shop-supervisors","Production KPI Dashboards for Wire Shop Supervisors","KPI Dashboard Wire Shop | Zohan Enterprises","production KPI dashboards wire shop supervisors",["KPI wire shop","production dashboard wire","wire shop KPI","supervisor dashboard wire"]),
    ("digital-work-instructions-esop-wire-cells","Digital Work Instructions and e-SOPs for Wire Processing Cells","Digital Work Instructions Wire | Zohan Enterprises","digital work instructions e-SOPs wire processing cells",["digital work instructions","e-SOP wire cell","electronic SOP wire","digital instruction wire"]),
    ("rapid-prototyping-wire-harness-new-programs","Rapid Prototyping Wire Harness Setups for New Vehicle Program Launches","Rapid Prototype Harness Program | Zohan Enterprises","rapid prototyping wire harness new vehicle program launches",["rapid prototype harness","new vehicle wire program","harness prototype setup","wire harness prototype"]),
    ("wire-processing-cell-design-hmlv-ems","Wire Processing Cell Design for High-Mix Low-Volume EMS Environments","HMLV EMS Wire Cell Design | Zohan Enterprises","wire processing cell design high-mix low-volume EMS",["HMLV wire cell","high mix wire processing","EMS wire cell design","flexible wire cell"]),
    ("supply-chain-lead-time-in-house-wire-processing","Supply Chain Lead Time Reduction Through In-House Wire Processing","In-House Wire Processing Lead Time | Zohan","supply chain lead time reduction in-house wire processing",["in-house wire processing","supply chain wire","lead time reduction wire","wire processing supply chain"]),
    ("tpm-pillars-wire-machinery","Total Productive Maintenance (TPM) Pillars for Wire Machinery","TPM Wire Machinery Guide | Zohan Enterprises","total productive maintenance TPM pillars wire machinery",["TPM wire machinery","total productive maintenance wire","wire machine TPM","TPM pillars manufacturing"]),
]

IA_ARTICLES = []
for i, (slug, title, mt, pk, skws) in enumerate(ia_topics):
    pid = i + 11
    art_id = f"ia-{pid:02d}"
    prods = IA_PRODUCTS[i % len(IA_PRODUCTS)]
    IA_ARTICLES.append(make_article(
        i, art_id, slug, title, mt, pk, skws,
        "Industrial Automation & Efficiency", "industrial-automation",
        "complete-guide-to-wire-processing-automation",
        prods, date_idx=i
    ))

# ─────────────────────────────────────────────────────────────────────────────
# CLUSTER 8: Manufacturing & Quality Engineering (me-11 to me-55 = 45 new)
# ─────────────────────────────────────────────────────────────────────────────

MQ_PRODUCTS = [
    ["ze-50kg-push-pull-tester","ze-100kg-push-pull-tester","ze-6t-automatic-wire-crimping-machine"],
    ["ze-pct100-power-cord-wire-testing-machine","ze-ut-usb-data-cable-tester","ze-50kg-push-pull-tester"],
    ["ze-6t-automatic-wire-crimping-machine","ze-cr2-fully-automatic-double-head-wire-crimping-machine","ze-s1-fully-automatic-single-head-wire-crimping-machine"],
    ["ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-10mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-315-4mm-automatic-wire-cutting-stripping-machine"],
    ["ze-fs3-fully-automatic-soldering-machine","ze-sm200-semi-automatic-soldering-machine","ze-50kg-push-pull-tester"],
]

mq_topics = [
    ("ipc-whma-a-620-wire-harness-standard-intro","Introduction to IPC/WHMA-A-620 Standard for Wire Harness Acceptability","IPC WHMA A 620 Harness Standard | Zohan","IPC WHMA A 620 wire harness acceptability standard",["IPC 620 harness standard","wire harness IPC-620","acceptability standard harness","IPC WHMA 620"]),
    ("crimped-joint-electrical-resistance-measurement","Crimped Joint Electrical Resistance Measurement and Pass/Fail Limits","Crimped Joint Resistance Measurement | Zohan","crimped joint electrical resistance measurement pass fail limits",["crimp resistance measurement","contact resistance crimp","crimp electrical test","milliohm crimp test"]),
    ("cross-section-microscopy-crimp-joints-guide","Cross-Section Microscopy of Crimp Joints: Sample Preparation Guide","Crimp Joint Cross Section Microscopy | Zohan","cross-section microscopy crimp joints sample preparation guide",["crimp cross section","crimp microscopy","crimp sample preparation","metallographic crimp"]),
    ("crimp-pull-force-testing-methodology-calibration","Crimp Pull-Force Testing Methodology and Equipment Calibration","Crimp Pull Force Test Calibration | Zohan","crimp pull-force testing methodology equipment calibration",["pull force test calibration","crimp pull test methodology","tensile test crimp","pull test equipment"]),
    ("terminal-contact-resistance-mating-force","Terminal Contact Resistance and Mating Force Specifications","Terminal Contact Resistance Spec | Zohan Enterprises","terminal contact resistance mating force specifications",["contact resistance terminal","terminal mating force","connector contact spec","terminal resistance spec"]),
    ("first-article-inspection-wire-harness","First Article Inspection (FAI) for Wire Harness Assemblies","First Article Inspection Wire Harness | Zohan","first article inspection FAI wire harness assemblies",["FAI wire harness","first article harness","harness first piece","FAI inspection wire"]),
    ("spc-charts-crimp-height-process","Statistical Process Control (SPC) Charts for Crimp Height Process","SPC Charts Crimp Height | Zohan Enterprises","SPC statistical process control charts crimp height process",["SPC crimp height","control chart crimp","crimp SPC","process control crimp"]),
    ("gauge-rr-study-crimp-measurement","Gauge Repeatability and Reproducibility (GR&R) in Crimp Measurement","Gauge RR Crimp Measurement | Zohan Enterprises","gauge repeatability reproducibility GR&R crimp measurement",["GR&R crimp","gauge R&R measurement","crimp gauge study","measurement system crimp"]),
    ("fmea-wire-harness-manufacturing-process","FMEA for Wire Harness Manufacturing Process Risks","FMEA Wire Harness Manufacturing | Zohan Enterprises","FMEA wire harness manufacturing process risks",["FMEA harness","wire harness FMEA","manufacturing process FMEA","harness risk FMEA"]),
    ("control-plan-wire-harness-assembly-line","Control Plan for Wire Harness Assembly Line: Columns and Entries","Control Plan Wire Harness | Zohan Enterprises","control plan wire harness assembly line columns entries",["harness control plan","wire assembly control plan","quality control plan","harness control column"]),
    ("measurement-system-analysis-wire-strip-length","Measurement System Analysis (MSA) for Wire Strip Length","MSA Wire Strip Length | Zohan Enterprises","measurement system analysis MSA wire strip length",["MSA wire strip","strip length MSA","measurement system wire","MSA strip length"]),
    ("wire-harness-qualification-testing-vibration-thermal","Wire Harness Qualification Testing: Vibration, Thermal, Humidity","Harness Qualification Testing | Zohan Enterprises","wire harness qualification testing vibration thermal humidity",["harness qualification test","vibration thermal harness","environmental harness test","harness qualification"]),
    ("ppap-wire-harness-tier2-suppliers","Production Part Approval Process (PPAP) for Wire Harness Tier-2 Suppliers","PPAP Wire Harness Tier-2 Suppliers | Zohan","PPAP wire harness tier-2 suppliers automotive",["PPAP harness","wire harness PPAP","tier 2 harness PPAP","automotive harness PPAP"]),
    ("visual-inspection-solder-joints-wire-assemblies","Visual Inspection Standards for Solder Joints in Wire Assemblies","Solder Joint Visual Inspection Wire | Zohan","visual inspection standards solder joints wire assemblies",["solder joint inspection","visual inspection solder","solder quality visual","IPC solder visual"]),
    ("defect-taxonomy-wire-processing-nicking-stripping","Defect Taxonomy for Wire Processing: Nicking, Incomplete Strip, Short Cut","Wire Processing Defect Taxonomy | Zohan","defect taxonomy wire processing nicking incomplete strip short cut",["wire defect types","nicking wire","incomplete strip defect","wire processing defect list"]),
    ("conductor-nick-acceptability-ipc-620","Conductor Nick Acceptability: Percentage Area Limits per IPC-620","Conductor Nick IPC-620 Limits | Zohan Enterprises","conductor nick acceptability percentage area limits IPC-620",["conductor nick IPC-620","wire nick acceptability","nick damage limit","conductor strand nick"]),
    ("wire-harness-drawing-interpretation-gdt","Wire Harness Drawing Interpretation: GD&T Symbols and Tolerances","Harness Drawing GD&T Interpretation | Zohan","wire harness drawing interpretation GD&T symbols tolerances",["harness drawing GD&T","wire drawing tolerances","GD&T harness symbols","harness drawing read"]),
    ("corrective-action-8d-wire-harness-defects","Corrective Action and 8D Problem Solving for Wire Harness Defects","8D Corrective Action Wire Harness | Zohan","corrective action 8D problem solving wire harness defects",["8D harness defect","corrective action wire","harness 8D problem","8D quality wire"]),
    ("cpk-process-capability-wire-cut-length","Cpk and Process Capability Analysis for Wire Cut Length Process","Cpk Wire Cut Length Process | Zohan Enterprises","Cpk process capability analysis wire cut length",["Cpk wire cut length","process capability wire","wire cut Cpk","Cpk analysis wire"]),
    ("calibration-intervals-crimp-gauges-pull-testers","Calibration Intervals for Crimp Height Gauges and Pull Testers","Calibration Crimp Gauges Pull Tester | Zohan","calibration intervals crimp height gauges pull testers",["calibration crimp gauge","pull tester calibration","gauge calibration interval","crimp tool calibrate"]),
    ("zero-defect-philosophy-wire-processing","Zero-Defect Manufacturing Philosophy Applied to Wire Processing","Zero Defect Wire Processing | Zohan Enterprises","zero-defect manufacturing philosophy applied wire processing",["zero defect wire","defect free wire processing","ZD manufacturing wire","wire zero defect"]),
    ("incoming-quality-control-wire-reels","Incoming Quality Control for Wire Reels: Sampling Plan and Inspection","Incoming QC Wire Reels | Zohan Enterprises","incoming quality control wire reels sampling plan inspection",["IQC wire reels","incoming wire inspection","wire spool QC","incoming quality wire"]),
    ("terminal-connector-incoming-inspection","Terminal and Connector Incoming Inspection: Dimensional and Visual Checks","Terminal Connector Incoming Inspection | Zohan","terminal connector incoming inspection dimensional visual checks",["terminal incoming inspection","connector QC check","incoming terminal check","terminal visual inspection"]),
    ("insulation-resistance-testing-wire-assemblies","Insulation Resistance Testing of Finished Wire Assemblies","Insulation Resistance Test Wire | Zohan Enterprises","insulation resistance testing finished wire assemblies",["insulation resistance test","wire IR test","megger wire harness","insulation test wire assembly"]),
    ("hipot-dielectric-withstand-wire-harness","Hi-Pot (Dielectric Withstand) Testing of Wire Harnesses: Procedure","Hi-Pot Wire Harness Testing | Zohan Enterprises","hi-pot dielectric withstand testing wire harnesses procedure",["hi-pot wire test","dielectric withstand test","voltage withstand harness","hi-pot test procedure"]),
    ("continuity-short-circuit-testing-multi-conductor","Continuity and Short-Circuit Testing of Multi-Conductor Assemblies","Continuity Short Circuit Testing | Zohan Enterprises","continuity short-circuit testing multi-conductor wire assemblies",["continuity test wire","short circuit test harness","multi conductor test","wire harness continuity"]),
    ("wire-harness-iatf-16949-documentation","Wire Harness OEM Quality Requirements: IATF 16949 Documentation","IATF 16949 Wire Harness Quality | Zohan","wire harness OEM IATF 16949 quality documentation",["IATF 16949 harness","wire harness IATF","automotive quality harness","IATF 16949 documentation"]),
    ("environmental-testing-harness-salt-spray-uv","Environmental Testing of Wire Harnesses: Salt Spray and UV Resistance","Environmental Wire Harness Testing | Zohan","environmental testing wire harnesses salt spray UV resistance",["salt spray harness test","UV resistance harness","environmental harness test","harness corrosion test"]),
    ("mechanical-abuse-testing-pull-bend-abrasion","Mechanical Abuse Testing: Pull, Bend, and Abrasion Resistance","Mechanical Abuse Wire Harness Test | Zohan","mechanical abuse testing pull bend abrasion wire harness",["mechanical abuse harness","pull bend test wire","abrasion resistance harness","wire harness mechanical test"]),
    ("wire-harness-fire-resistance-ul758-iso6722","Wire Harness Fire Resistance Testing: UL 758 and ISO 6722","Harness Fire Resistance Testing | Zohan Enterprises","wire harness fire resistance testing UL 758 ISO 6722",["fire resistance harness","UL 758 wire test","ISO 6722 harness","wire flame test"]),
    ("labeling-marking-wire-harness-traceability","Labeling and Marking Requirements for Wire Harness Traceability","Wire Harness Labeling Marking | Zohan Enterprises","labeling marking requirements wire harness traceability",["harness labeling requirements","wire harness marking","traceability label harness","harness ID marking"]),
    ("quality-assurance-automated-cut-strip-crimp-lines","Quality Assurance in Automated Cut-Strip-Crimp Lines: Inline Checks","Automated Cut Strip Crimp QA | Zohan Enterprises","quality assurance automated cut-strip-crimp inline checks",["automated line QA","inline quality check","cut strip crimp QA","automated wire QA"]),
    ("ncr-management-wire-harness-production","Non-Conformance Report (NCR) Management in Wire Harness Production","NCR Wire Harness Production | Zohan Enterprises","non-conformance report NCR management wire harness production",["NCR management harness","wire harness NCR","non-conformance wire","harness quality NCR"]),
    ("defect-rate-ppm-wire-harness-production","Defect Rate Analysis: PPM Calculation for Wire Harness Production","PPM Wire Harness Defect Rate | Zohan Enterprises","defect rate PPM calculation wire harness production",["PPM wire harness","defect rate wire","harness PPM calculation","wire production PPM"]),
    ("sampling-plans-wire-harness-final-inspection","Sampling Plans for Wire Harness Final Inspection: AQL Levels","AQL Sampling Wire Harness | Zohan Enterprises","sampling plans wire harness final inspection AQL levels",["AQL wire harness","sampling plan harness","inspection AQL level","harness final sample"]),
    ("reliability-engineering-wire-harness-mttf","Reliability Engineering for Wire Harness: MTTF and Failure Modes","Reliability Engineering Wire Harness | Zohan","reliability engineering wire harness MTTF failure modes",["MTTF wire harness","reliability harness","wire harness failure mode","harness MTBF reliability"]),
    ("soldering-quality-standards-j-std-001-class2-3","Soldering Quality Standards: J-STD-001 Class 2 vs Class 3","Soldering Quality J-STD-001 | Zohan Enterprises","soldering quality standards J-STD-001 Class 2 Class 3",["J-STD-001 Class 2","solder quality Class 3","IPC J-STD soldering","solder standard class"]),
    ("terminal-plating-tin-whisker-prevention","Terminal Plating Quality: Tin Whisker Prevention in Crimped Joints","Terminal Tin Whisker Prevention | Zohan Enterprises","terminal plating tin whisker prevention crimped joints",["tin whisker terminal","terminal plating quality","tin whisker prevention","crimp tin whisker"]),
    ("process-validation-iq-oq-pq-wire-lines","Process Validation (IQ/OQ/PQ) for Automated Wire Processing Lines","IQ OQ PQ Wire Process Validation | Zohan","process validation IQ OQ PQ automated wire processing lines",["IQ OQ PQ wire","process validation wire","wire machine validation","automated wire IQ OQ"]),
    ("wire-harness-reverse-engineering-legacy-drawing","Wire Harness Reverse Engineering and Legacy Drawing Digitization","Harness Reverse Engineering | Zohan Enterprises","wire harness reverse engineering legacy drawing digitization",["harness reverse engineering","legacy harness drawing","wire harness digitize","harness drawing recreation"]),
    ("new-wire-type-qualification-production-process","Qualification of New Wire Types into Existing Production Processes","New Wire Type Qualification | Zohan Enterprises","qualification new wire types existing production processes",["new wire qualification","wire type qualification","wire change production","new wire process validate"]),
    ("wire-harness-drawing-revision-ecn-management","Wire Harness Drawing Revision Control and ECN Management","Harness Drawing Revision ECN | Zohan Enterprises","wire harness drawing revision control ECN management",["harness ECN management","drawing revision wire","wire harness change control","ECN harness drawing"]),
    ("ground-fault-short-circuit-harness-design","Ground Fault and Short Circuit Protection in Wire Harness Design","Ground Fault Short Circuit Harness | Zohan","ground fault short circuit protection wire harness design",["ground fault harness","short circuit protection wire","harness electrical protection","wire fault protection"]),
    ("pull-off-force-overmoulded-wire-harness","Pull-Off Force Requirements for Over-Moulded Wire Harness Glands","Over-Moulded Harness Gland Pull-Off | Zohan","pull-off force over-moulded wire harness glands requirements",["over moulded harness","pull-off force gland","wire harness moulded gland","harness overmould test"]),
    ("six-sigma-dmaic-wire-harness-defects","Six Sigma DMAIC Project Example: Reducing Wire Harness Defects","Six Sigma DMAIC Wire Harness | Zohan Enterprises","Six Sigma DMAIC project reducing wire harness defects",["DMAIC wire harness","Six Sigma wire defects","harness DMAIC project","Six Sigma wire reduction"]),
]

MQ_ARTICLES = []
for i, (slug, title, mt, pk, skws) in enumerate(mq_topics):
    pid = i + 11
    art_id = f"me-{pid:02d}"
    prods = MQ_PRODUCTS[i % len(MQ_PRODUCTS)]
    MQ_ARTICLES.append(make_article(
        i, art_id, slug, title, mt, pk, skws,
        "Manufacturing & Quality Engineering", "manufacturing",
        "complete-guide-to-wire-harness-quality-and-standards",
        prods, date_idx=i
    ))

# ─────────────────────────────────────────────────────────────────────────────
# CLUSTER 9: Machinery Buying Guides (bg-13 to bg-55 = 43 new)
# ─────────────────────────────────────────────────────────────────────────────

BG_PRODUCTS = [
    ["ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-10mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-6mm-semi-automatic-wire-cutting-stripping-machine"],
    ["ze-6t-automatic-wire-crimping-machine","ze-s1-fully-automatic-single-head-wire-crimping-machine","ze-2t-terminal-crimping-machine"],
    ["ze-038-scrap-wire-stripping-machine","ze-kof-automatic-copper-scrap-wire-stripping-machine","ze-100-electric-copper-granulator-copper-wire-separating-machine"],
    ["ze-fs3-fully-automatic-soldering-machine","ze-sm200-semi-automatic-soldering-machine","ze-200-stripping-soldering-machine"],
    ["ze-35mm-cable-tying-and-wire-winding-machine","ze-zcut9-automatic-tape-dispenser","ze-asc100-automatic-sleeve-cutting-machine"],
    ["ze-50kg-push-pull-tester","ze-100kg-push-pull-tester","ze-pct100-power-cord-wire-testing-machine"],
    ["ze-3-7kw-plastic-crushing-machine","ze-150-copper-wire-granulator-machine","ze-038-scrap-wire-stripping-machine"],
    ["ze-30t-fully-automatic-thimble-wire-crimping-machine","ze-4t-semi-automatic-terminal-crimping-machine","ze-2t-terminal-crimping-machine"],
]

bg_topics = [
    ("how-to-choose-wire-cutting-machine-capacity","How to Choose a Wire Cutting Machine: Capacity Sizing Worksheet","Wire Cutting Machine Selection Guide | Zohan","how to choose wire cutting machine capacity sizing",["wire cutting machine selection","choose wire cutter","wire machine capacity","wire cutting machine guide India"]),
    ("semi-auto-vs-auto-wire-stripping-machine-comparison","Comparing Semi-Automatic vs Automatic Wire Stripping Machines","Semi vs Auto Wire Stripping Machine | Zohan","semi-automatic vs automatic wire stripping machine comparison",["semi vs auto stripper","wire stripping machine compare","automatic vs semi auto wire","wire machine comparison"]),
    ("wire-stripping-machine-price-guide-india","Wire Stripping Machine Price Guide India: Budget vs Premium Tiers","Wire Machine Price Guide India | Zohan Enterprises","wire stripping machine price guide India budget premium",["wire machine price India","stripping machine cost","wire stripper India price","machine cost guide"]),
    ("terminal-crimping-press-tonnage-selection","How to Select Terminal Crimping Press Tonnage for Your Terminal Range","Crimping Press Tonnage Selection | Zohan Enterprises","terminal crimping press tonnage selection guide",["crimp press tonnage","terminal machine tonnage","crimp machine force","press ton selection"]),
    ("crimp-applicator-buying-guide-side-front-feed","Crimp Applicator Buying Guide: Side-Feed vs Front-Feed Selection","Crimp Applicator Buying Guide | Zohan Enterprises","crimp applicator buying guide side-feed vs front-feed",["crimp applicator buy guide","applicator selection","side feed applicator buy","front feed applicator"]),
    ("copper-scrap-wire-stripping-machine-india-guide","Buying Guide for Copper Scrap Wire Stripping Machines in India","Copper Scrap Wire Machine India | Zohan Enterprises","copper scrap wire stripping machine buying guide India",["scrap machine India buy","copper wire stripper buy","scrap machine guide India","copper recovery machine"]),
    ("evaluating-machinery-supplier-credibility-after-sales","How to Evaluate Machinery Supplier Credibility and After-Sales Support","Machinery Supplier Credibility | Zohan Enterprises","evaluate machinery supplier credibility after-sales support India",["machinery supplier evaluation","after sales support machine","machine vendor credibility","supplier check machine"]),
    ("total-cost-ownership-wire-processing-lines","Total Cost of Ownership (TCO) Analysis for Automatic Wire Processing Lines","TCO Wire Processing Lines | Zohan Enterprises","total cost ownership TCO automatic wire processing lines",["TCO wire machine","total cost wire processing","machine TCO analysis","wire line total cost"]),
    ("msme-machinery-financing-india-loan-guide","Financing Options for Industrial Machinery in India: MSME Loan Guide","MSME Machinery Financing India | Zohan Enterprises","MSME machinery financing India loan guide options",["MSME machine loan","machinery financing India","industrial machine loan India","MSME loan guide"]),
    ("leasing-vs-buying-wire-processing-machinery","Leasing vs Buying Industrial Wire Processing Machinery: Decision Guide","Lease vs Buy Wire Machine | Zohan Enterprises","leasing vs buying industrial wire processing machinery India",["leasing wire machine","buy vs lease machine","machinery financing option","wire machine lease India"]),
    ("how-to-read-machine-technical-specifications","How to Read Machine Technical Specifications: A Buyer's Cheat Sheet","Machine Spec Reading Guide | Zohan Enterprises","how to read machine technical specifications buyers guide",["machine spec reading","technical specification machine","how to read machine specs","machine datasheet guide"]),
    ("negotiating-machinery-warranty-spares-training","Negotiating Machinery Purchase Terms: Warranty, Spares, and Training","Machine Purchase Negotiation | Zohan Enterprises","negotiating machinery warranty spares training purchase terms",["machine warranty negotiation","machinery spares terms","machine training agreement","wire machine warranty"]),
    ("factory-acceptance-test-wire-machinery-checklist","Factory Acceptance Test (FAT) Checklist for Wire Processing Machinery","FAT Wire Machinery Checklist | Zohan Enterprises","factory acceptance test FAT checklist wire processing machinery",["FAT wire machine","factory acceptance test","wire machine commissioning","FAT checklist"]),
    ("used-vs-new-wire-processing-machinery-analysis","Used vs New Wire Processing Machinery: Risk and Value Analysis","Used vs New Wire Machine | Zohan Enterprises","used vs new wire processing machinery risk value analysis",["used vs new machine","used wire machine","refurbished wire machine","second hand vs new"]),
    ("importing-wire-processing-machines-india-guide","How to Import Industrial Wire Processing Machines: IEC and Customs Guide","Import Wire Machine India Guide | Zohan Enterprises","import industrial wire processing machines India IEC customs",["import wire machine India","customs wire machine","importing wire machine","IEC import machine"]),
    ("soldering-machine-buying-guide-wire-assembly","Buying Guide: Soldering Machine Types for Wire Assembly Production","Soldering Machine Buying Guide | Zohan Enterprises","soldering machine buying guide wire assembly production",["soldering machine buy","solder machine guide","wire solder machine purchase","soldering machine types"]),
    ("cable-harness-testing-machine-selection","How to Choose a Cable Harness Assembly Testing Machine","Harness Testing Machine Selection | Zohan Enterprises","choose cable harness assembly testing machine",["harness testing machine","wire harness tester buy","harness test machine guide","cable assembly tester"]),
    ("machinery-installation-site-power-air-floor","Machinery Installation Site Preparation: Power, Air, and Floor Requirements","Machine Installation Site Prep | Zohan Enterprises","machinery installation site preparation power air floor requirements",["machine installation site","wire machine power requirement","machine floor prep","installation site wire"]),
    ("operator-training-new-machinery-curriculum","Training Plan for New Machinery Operators: Curriculum and Duration","Operator Training Wire Machine | Zohan Enterprises","operator training plan new machinery curriculum duration wire",["machine operator training","wire machine training","operator curriculum wire","machine training program"]),
    ("machinery-commissioning-checklist-delivery-production","Machinery Commissioning Checklist: From Delivery to First Production","Machine Commissioning Checklist | Zohan Enterprises","machinery commissioning checklist delivery to first production",["machine commissioning","wire machine checklist","delivery to production","commissioning wire machine"]),
    ("budget-planning-wire-processing-factory","Budget Planning for Equipping a New Wire Processing Factory","Wire Processing Factory Budget | Zohan Enterprises","budget planning equipping new wire processing factory India",["factory budget wire","wire machine budget plan","new factory machine cost","wire plant budget"]),
    ("wire-winding-cable-coiling-machine-buying-guide","Buying Guide: Wire Winding and Cable Coiling Machines","Wire Winding Coiling Machine | Zohan Enterprises","wire winding cable coiling machine buying guide India",["wire winding machine","cable coiling machine","wire coiler guide","winding machine buy"]),
    ("automatic-tape-dispenser-harness-wrapping","How to Choose an Automatic Tape Dispenser for Harness Wrapping","Tape Dispenser Harness Wrapping | Zohan Enterprises","choose automatic tape dispenser harness wrapping guide",["tape dispenser harness","automatic tape machine","tape dispenser buy","harness tape machine"]),
    ("wire-twisting-machine-selection-guide","Selecting Wire Twisting Machines for Twisted-Pair Cable Production","Wire Twisting Machine Selection | Zohan Enterprises","selecting wire twisting machine twisted-pair cable production",["wire twisting machine","twisted pair wire machine","wire twister selection","wire twist machine buy"]),
    ("pneumatic-wire-stripping-machine-buying-guide","Buying Guide for Pneumatic Wire Stripping Machines","Pneumatic Wire Stripper Buying | Zohan Enterprises","pneumatic wire stripping machine buying guide India",["pneumatic stripper buy","pneumatic wire machine guide","wire stripper pneumatic","buy pneumatic wire"]),
    ("plastic-granulator-cable-recycling-selection","How to Choose a Plastic Granulator for Cable Recycling Operations","Plastic Granulator Cable Recycling | Zohan Enterprises","plastic granulator cable recycling operations selection guide",["plastic granulator buy","cable granulator guide","granulator selection recycling","plastic crusher cable"]),
    ("payoff-stands-de-reelers-selection-guide","Selecting Pay-Off Stands and De-Reelers for Wire Processing Lines","Payoff Stand De-Reeler Selection | Zohan Enterprises","selecting pay-off stands de-reelers wire processing lines",["payoff stand buy","de-reeler selection","wire payoff guide","spool stand wire"]),
    ("push-pull-force-tester-buying-guide","Buying Guide for Push-Pull Force Testers in Harness Production","Push Pull Force Tester Guide | Zohan Enterprises","push-pull force tester buying guide harness production",["push pull tester buy","force tester wire","pull tester selection","tensile tester guide"]),
    ("wire-cutter-blades-replacement-parts-selection","How to Select Wire Cutter Blades and Replacement Parts","Wire Cutter Blade Selection | Zohan Enterprises","select wire cutter blades replacement parts guide",["wire blade selection","replacement blade wire","wire cutter blade buy","blade selection guide"]),
    ("critical-spare-parts-wire-machine-day-one","Machinery Spare Parts Planning: Critical Spares to Stock on Day One","Wire Machine Spare Parts Planning | Zohan Enterprises","critical spare parts wire machinery stock day one planning",["spare parts wire machine","critical spares stocking","machine spare planning","day one spare parts"]),
    ("roi-calculator-wire-processing-automation","Return on Investment (ROI) Calculator for Wire Processing Automation","ROI Calculator Wire Automation | Zohan Enterprises","return on investment ROI calculator wire processing automation",["ROI wire automation","wire machine ROI","automation ROI calculate","wire machine payback"]),
    ("evaluating-wire-machine-after-sales-local-support","Evaluating Wire Processing Machine After-Sales and Local Support","Wire Machine After-Sales Support | Zohan Enterprises","evaluating wire processing machine after-sales local support",["after sales wire machine","local support wire machine","machine service support","wire machine service India"]),
    ("cable-tie-machines-harness-bundling-guide","Buying Guide for Cable Tie Machines for Harness Bundling","Cable Tie Machine Buying Guide | Zohan Enterprises","cable tie machines harness bundling buying guide",["cable tie machine buy","harness bundling machine","automatic cable tying buy","cable tie machine guide"]),
    ("automatic-sleeve-cutting-machine-selection","How to Select Automatic Sleeve Cutting Machines for Harness Shops","Sleeve Cutting Machine Selection | Zohan Enterprises","select automatic sleeve cutting machine harness shops",["sleeve cutting machine buy","automatic sleeve cutter","heat shrink cutter buy","sleeve machine guide"]),
    ("machinery-inspection-factory-visit-guide","Machinery Inspection During Factory Visit: What to Check and Test","Factory Visit Machine Inspection | Zohan Enterprises","machinery inspection factory visit what to check test",["factory visit machine check","machine inspection guide","visit machine factory","wire machine factory test"]),
    ("wire-processing-machinery-small-business-msme","Wire Processing Machinery for Small Businesses and MSMEs: Starter Guide","Wire Machine MSME Starter Guide | Zohan Enterprises","wire processing machinery small business MSME starter guide India",["MSME wire machine","small business wire","starter wire machine","MSME machine guide"]),
    ("chinese-vs-indian-wire-processing-machines","Comparing Chinese vs Indian Manufactured Wire Processing Machines","Chinese vs Indian Wire Machines | Zohan Enterprises","Chinese vs Indian wire processing machines comparison",["Chinese vs Indian machine","imported wire machine","Indian made wire machine","wire machine origin"]),
    ("spec-custom-wire-processing-machine-configurations","How to Spec and Order Custom Wire Processing Machine Configurations","Custom Wire Machine Configuration | Zohan Enterprises","spec order custom wire processing machine configurations",["custom wire machine","bespoke wire machine","wire machine customization","special wire machine order"]),
    ("high-tonnage-thimble-ferrule-crimping-machine","Buying Guide for High-Tonnage Thimble Ferrule Crimping Machines","High Tonnage Ferrule Crimp Machine | Zohan Enterprises","high-tonnage thimble ferrule crimping machine buying guide",["high tonnage ferrule crimp","thimble crimp machine buy","ferrule machine guide","heavy duty crimp machine"]),
    ("machinery-ce-bis-safety-certification-requirements","Understanding Machinery CE Marking, BIS, and Safety Certification","Machine CE BIS Safety Certification | Zohan Enterprises","machinery CE marking BIS safety certification requirements India",["CE marking machine","BIS certification machine","machine safety cert","wire machine CE BIS"]),
    ("wire-harness-production-bay-layout","Planning Machinery Layout for a New Wire Harness Production Bay","Wire Harness Production Bay Layout | Zohan Enterprises","planning machinery layout new wire harness production bay",["harness bay layout","wire production bay","machine layout harness","wire factory bay plan"]),
    ("extended-warranty-amc-machine-negotiation","Negotiating Extended Warranty and AMC (Annual Maintenance Contract)","Extended Warranty AMC Machine | Zohan Enterprises","negotiating extended warranty AMC annual maintenance contract wire machine",["AMC machine warranty","extended warranty wire","machine AMC contract","annual maintenance machine"]),
    ("coaxial-cable-stripping-rf-assembly-equipment","Buying Guide for Coaxial Cable Stripping Machines and RF Assembly Equipment","Coaxial Cable Stripping Machine Buy | Zohan Enterprises","coaxial cable stripping machines RF assembly equipment buying guide",["coaxial stripping machine","RF assembly machine","coax cable cutter buy","RF cable machine guide"]),
]

BG_ARTICLES = []
for i, (slug, title, mt, pk, skws) in enumerate(bg_topics):
    pid = i + 13
    art_id = f"bg-{pid:02d}"
    prods = BG_PRODUCTS[i % len(BG_PRODUCTS)]
    BG_ARTICLES.append(make_article(
        i, art_id, slug, title, mt, pk, skws,
        "Machinery Buying Guides", "buying-guides",
        "complete-industrial-machinery-buying-guide",
        prods, search_intent="Commercial", priority="High", date_idx=i
    ))

# ─────────────────────────────────────────────────────────────────────────────
# CLUSTER 10: Maintenance & Troubleshooting (mt-13 to mt-60 = 48 new)
# ─────────────────────────────────────────────────────────────────────────────

MT_PRODUCTS = [
    ["ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-10mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-315-4mm-automatic-wire-cutting-stripping-machine"],
    ["ze-6t-automatic-wire-crimping-machine","ze-s1-fully-automatic-single-head-wire-crimping-machine","ze-2t-terminal-crimping-machine"],
    ["ze-038-scrap-wire-stripping-machine","ze-kof-automatic-copper-scrap-wire-stripping-machine","ze-s80-automatic-copper-scrap-wire-stripping-machine"],
    ["ze-fs3-fully-automatic-soldering-machine","ze-sm200-semi-automatic-soldering-machine","ze-200-stripping-soldering-machine"],
    ["ze-bladex-scrap-wire-machine-blade","ze-6mm-semi-automatic-wire-cutting-stripping-machine","ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine"],
]

mt_topics = [
    ("wire-stripping-machine-daily-startup-shutdown","Wire Stripping Machine Daily Startup and Shutdown Checklist","Wire Machine Daily Startup Checklist | Zohan","wire stripping machine daily startup shutdown checklist",["wire machine startup","daily checklist wire","machine startup procedure","wire machine shutdown"]),
    ("blade-change-procedure-automatic-wire-cutting","Blade Change Procedure for Automatic Wire Cutting Machines","Wire Machine Blade Change Procedure | Zohan","blade change procedure automatic wire cutting machines",["blade change wire machine","wire cutter blade replace","blade replacement procedure","wire machine blade change"]),
    ("diagnosing-inconsistent-cut-lengths-wire-machines","Diagnosing and Fixing Inconsistent Cut Lengths in Wire Cutting Machines","Inconsistent Cut Length Fix | Zohan Enterprises","diagnosing fixing inconsistent cut lengths wire cutting machines",["inconsistent cut length","wire cut length fix","cut length diagnosis","wire machine cut problem"]),
    ("fixing-conductor-strand-nicking-stripping-machines","Fixing Conductor Strand Nicking in Wire Stripping Machines","Conductor Nicking Fix Wire Machine | Zohan","fixing conductor strand nicking wire stripping machines",["conductor nicking fix","strand nick wire","wire nicking repair","blade nick fix"]),
    ("troubleshooting-wire-feed-slippage-roller-pressure","Troubleshooting Wire Feed Slippage: Roller Pressure and Groove Wear","Wire Feed Slippage Fix | Zohan Enterprises","troubleshooting wire feed slippage roller pressure groove wear",["wire feed slip","roller slip wire","feed roller groove","wire feed problem fix"]),
    ("guide-tube-replacement-alignment-wire-machines","Guide Tube Replacement and Alignment for Wire Cutting Machines","Guide Tube Replacement Alignment | Zohan","guide tube replacement alignment wire cutting machines",["guide tube replace","wire machine guide tube","guide tube alignment","tube replacement wire"]),
    ("pneumatic-system-maintenance-frl-unit-care","Pneumatic System Maintenance: Filter, Regulator, Lubricator (FRL) Care","Pneumatic FRL Maintenance Wire | Zohan Enterprises","pneumatic system maintenance filter regulator lubricator FRL care",["FRL maintenance pneumatic","pneumatic wire machine care","air filter wire machine","pneumatic FRL unit"]),
    ("crimp-height-variation-diagnosis-die-ram","Crimp Height Variation Diagnosis: Die Wear and Ram Alignment Checks","Crimp Height Variation Fix | Zohan Enterprises","crimp height variation diagnosis die wear ram alignment",["crimp height variation","die wear crimp","ram alignment crimp","crimp height fix"]),
    ("applicator-die-inspection-replacement-schedule","Applicator Die Inspection and Replacement Schedule","Applicator Die Inspection | Zohan Enterprises","applicator die inspection replacement schedule crimping",["applicator die inspection","die replacement crimp","crimping die schedule","die wear inspection"]),
    ("troubleshooting-terminal-feed-jams-crimping","Troubleshooting Terminal Feed Jams in Automatic Crimping Machines","Terminal Feed Jam Fix | Zohan Enterprises","troubleshooting terminal feed jams automatic crimping machines",["terminal feed jam","crimp machine jam","terminal feed problem","jam fix crimping"]),
    ("feeder-ratchet-mechanism-spring-replacement","Feeder Ratchet Mechanism Inspection and Spring Replacement","Feeder Ratchet Mechanism | Zohan Enterprises","feeder ratchet mechanism inspection spring replacement crimping",["ratchet mechanism crimp","feeder spring replace","crimp feeder ratchet","terminal feed spring"]),
    ("motor-overheating-troubleshooting-wire-machines","Motor Overheating Troubleshooting in Wire Processing Machines","Motor Overheating Wire Machine | Zohan Enterprises","motor overheating troubleshooting wire processing machines",["motor overheat wire machine","wire machine motor heat","motor cooling wire","machine motor temperature"]),
    ("drive-belt-tension-replacement-wire-feeding","Drive Belt Tension and Replacement in Wire Feeding Systems","Drive Belt Wire Feeding System | Zohan Enterprises","drive belt tension replacement wire feeding systems",["drive belt wire machine","belt tension replace","wire machine belt","belt feed system wire"]),
    ("electrical-fault-diagnosis-plc-error-codes","Electrical Fault Diagnosis: PLC Error Codes in Wire Cutting Machines","PLC Error Code Wire Machine | Zohan Enterprises","electrical fault diagnosis PLC error codes wire cutting machines",["PLC error wire machine","wire machine fault code","PLC diagnosis wire","machine error code"]),
    ("touch-screen-calibration-hmi-troubleshooting","Touch Screen Calibration and HMI Troubleshooting for Wire Machines","HMI Touchscreen Calibration Wire | Zohan","touch screen calibration HMI troubleshooting wire machines",["HMI calibration wire","touchscreen wire machine","machine HMI problem","wire machine touch screen"]),
    ("gearbox-oil-lubrication-crimping-press","Gearbox Oil Level and Lubrication Interval for Crimping Presses","Crimping Press Gearbox Lubrication | Zohan","gearbox oil lubrication interval crimping press wire machine",["gearbox oil crimp press","crimp machine lubrication","crimping press gearbox","machine gear oil"]),
    ("blade-holder-misalignment-correction-shimming","Blade Holder Misalignment: Correction Procedure and Shimming","Blade Holder Misalignment Fix | Zohan Enterprises","blade holder misalignment correction shimming procedure wire machine",["blade holder alignment fix","shimming blade","blade misalignment correction","wire blade holder shim"]),
    ("wire-insulation-slug-ejection-failure-fix","Wire Insulation Slug Ejection Failure: Troubleshooting and Fix","Insulation Slug Ejection Fix | Zohan Enterprises","wire insulation slug ejection failure troubleshooting fix",["slug ejection failure","insulation slug stuck","wire slug problem","slug removal fix"]),
    ("diagnosing-short-cuts-over-cuts-wire-machines","Diagnosing Short Cuts and Over-Cuts in Automatic Wire Machines","Short Cuts Over Cuts Wire Machine | Zohan","diagnosing short cuts over-cuts automatic wire machines",["short cut wire machine","over cut wire","wire length wrong","cut length problem fix"]),
    ("fixing-wire-tangles-bird-caging-stripping","Fixing Wire Tangles and Bird-Caging During High-Speed Stripping","Wire Tangle Bird-Caging Fix | Zohan Enterprises","fixing wire tangles bird-caging high-speed stripping",["wire tangle fix","bird caging wire","wire spool tangle","wire bird cage fix"]),
    ("soldering-machine-temperature-instability-heater-tc","Soldering Machine Temperature Instability: Heater and TC Diagnosis","Solder Machine Temperature Fix | Zohan Enterprises","soldering machine temperature instability heater TC diagnosis",["solder machine temperature","heater TC solder","soldering instability fix","solder temp problem"]),
    ("solder-pot-flux-contamination-cleaning","Solder Pot Flux Contamination: Cleaning and Top-Up Procedures","Solder Pot Flux Cleaning | Zohan Enterprises","solder pot flux contamination cleaning top-up procedures",["solder pot cleaning","flux contamination pot","solder pot top up","pot flux clean"]),
    ("copper-granulator-blade-sharpening-procedure","Copper Granulator Blade Sharpening: Angle, Grit, and Procedure","Granulator Blade Sharpening | Zohan Enterprises","copper granulator blade sharpening angle grit procedure",["granulator blade sharpen","copper blade sharpening","granulator blade angle","blade grit granulator"]),
    ("granulator-screen-clogging-cleaning-replacement","Granulator Screen Clogging: Cleaning and Mesh Replacement","Granulator Screen Cleaning | Zohan Enterprises","granulator screen clogging cleaning mesh replacement",["granulator screen clean","screen mesh replace","granulator screen clog","mesh cleaning granulator"]),
    ("scrap-wire-machine-blade-replacement-step-by-step","Scrap Wire Machine Blade Replacement: Step-by-Step Procedure","Scrap Wire Machine Blade Replacement | Zohan","scrap wire machine blade replacement step-by-step procedure",["scrap machine blade replace","blade replacement scrap","wire stripper blade step","scrap blade procedure"]),
    ("air-leak-diagnosis-pneumatic-wire-stripping","Air Leak Diagnosis in Pneumatic Wire Stripping Machine Circuits","Pneumatic Air Leak Diagnosis Wire | Zohan","air leak diagnosis pneumatic wire stripping machine circuits",["air leak pneumatic wire","pneumatic leak find","wire machine air leak","pneumatic circuit leak"]),
    ("wire-twisting-machine-pitch-variation-adjustment","Wire Twisting Machine Pitch Variation: Speed Ratio Adjustment","Wire Twisting Machine Pitch Fix | Zohan","wire twisting machine pitch variation speed ratio adjustment",["wire twisting pitch","twisting machine speed","pitch variation wire twister","twist machine ratio"]),
    ("tape-dispenser-blade-tension-calibration","Tape Dispenser Blade Replacement and Tension Calibration","Tape Dispenser Blade Calibration | Zohan Enterprises","tape dispenser blade replacement tension calibration harness",["tape dispenser blade","tape machine tension","automatic tape calibration","dispenser blade replace"]),
    ("cable-tying-machine-jam-drive-reset","Cable Tying Machine Jam Clearance and Drive Reset Procedures","Cable Tying Machine Jam Fix | Zohan Enterprises","cable tying machine jam clearance drive reset procedures",["cable tie machine jam","tying machine reset","cable tie jam clear","tie machine drive reset"]),
    ("pull-force-tester-calibration-load-cell-correction","Pull-Force Tester Calibration and Load Cell Zero-Offset Correction","Pull Force Tester Calibration | Zohan Enterprises","pull-force tester calibration load cell zero-offset correction",["pull force calibration","load cell calibrate","pull tester zero","tester load cell correction"]),
    ("annual-maintenance-schedule-wire-processing-line","Annual Maintenance Schedule for a Complete Wire Processing Line","Annual Wire Processing Maintenance | Zohan Enterprises","annual maintenance schedule complete wire processing line",["annual maintenance wire","wire line PM schedule","yearly maintenance wire","wire machine annual PM"]),
    ("spare-parts-forecast-failure-rates-mtbf-wire","Spare Parts Forecast: Failure Rates and MTBF Data for Wire Machines","Spare Parts MTBF Wire Machine | Zohan Enterprises","spare parts forecast failure rates MTBF wire machines",["spare parts MTBF wire","machine MTBF forecast","wire machine spare forecast","MTBF spare plan"]),
    ("noise-vibration-diagnosis-wire-cutting-machines","Noise and Vibration Diagnosis in Wire Cutting Machines","Wire Machine Noise Vibration Diagnosis | Zohan","noise vibration diagnosis wire cutting machines troubleshoot",["wire machine noise","vibration wire machine","machine noise fix","wire cutting vibration"]),
    ("wire-machine-safety-interlock-testing","Wire Machine Safety Interlock Testing and Bypass Override Prevention","Wire Machine Safety Interlock | Zohan Enterprises","wire machine safety interlock testing bypass override prevention",["safety interlock wire machine","interlock testing wire","machine safety test","bypass interlock prevent"]),
    ("corrosion-prevention-humid-coastal-factory","Corrosion Prevention for Machines in Humid Coastal Factory Environments","Machine Corrosion Prevention Coastal | Zohan","corrosion prevention machines humid coastal factory environments",["machine corrosion prevention","humid factory machine","coastal machine rust","wire machine corrosion"]),
    ("cleaning-solvents-lubrication-wire-processing-machines","Cleaning Solvents and Lubrication Guide for Wire Processing Machines","Machine Cleaning Lubrication Guide | Zohan","cleaning solvents lubrication guide wire processing machines",["machine cleaning solvent","wire machine lubrication","cleaning guide machine","lubrication wire machine"]),
    ("post-repair-validation-first-article-run","Post-Repair Validation: First-Article Run and Inspection After Maintenance","Post Repair Validation Wire Machine | Zohan","post-repair validation first-article run inspection after maintenance",["post repair validation","machine first article repair","wire machine after repair","repair validation inspection"]),
    ("machine-downtime-root-cause-analysis-5why","Machine Downtime Root Cause Analysis (5-Why) for Wire Processing","Wire Machine 5-Why Analysis | Zohan Enterprises","machine downtime root cause analysis 5-why wire processing",["5 why wire machine","root cause analysis wire","machine downtime analysis","wire machine 5 why"]),
    ("cmms-log-entry-machine-breakdown-data","Managing Machine Breakdown Data: CMMS Log Entry Best Practices","CMMS Machine Breakdown Log | Zohan Enterprises","managing machine breakdown data CMMS log entry best practices",["CMMS machine log","breakdown data CMMS","machine log entry","CMMS wire machine"]),
    ("preventive-vs-predictive-maintenance-wire","Preventive vs Predictive Maintenance for Wire Processing Factories","Preventive vs Predictive Maintenance | Zohan","preventive vs predictive maintenance wire processing factories",["preventive vs predictive","predictive maintenance wire","wire machine PM CBM","maintenance strategy wire"]),
    ("remote-diagnostics-teleconsultation-machine-faults","Remote Diagnostics and Teleconsultation Support for Machine Faults","Remote Diagnostics Wire Machine | Zohan Enterprises","remote diagnostics teleconsultation support machine faults wire",["remote machine diagnosis","teleconsultation wire machine","remote support wire","machine remote diagnostics"]),
    ("operator-level-daily-maintenance-training","Operator-Level Daily Maintenance Tasks: Training and Documentation","Operator Daily Maintenance Training | Zohan Enterprises","operator level daily maintenance tasks training documentation wire",["operator maintenance training","daily maintenance wire","wire operator maintenance","operator PM tasks"]),
    ("spare-parts-sourcing-zohan-machines-india","Spare Parts Sourcing for Zohan Machines: India-Wide Service Support","Zohan Machine Spare Parts India | Zohan Enterprises","spare parts sourcing Zohan machines India-wide service support",["Zohan spare parts","Zohan machine service","wire machine spare India","Zohan machine parts"]),
    ("emergency-blade-sourcing-unplanned-failures","Emergency Blade Sourcing and Interim Workarounds for Unplanned Failures","Emergency Blade Sourcing Wire | Zohan Enterprises","emergency blade sourcing interim workarounds unplanned failures",["emergency blade sourcing","blade emergency wire","wire machine emergency blade","blade workaround"]),
    ("hydraulic-system-maintenance-high-tonnage-crimping","Hydraulic System Maintenance in High-Tonnage Crimping Presses","Hydraulic System Crimp Press | Zohan Enterprises","hydraulic system maintenance high-tonnage crimping presses",["hydraulic crimp press","crimp press hydraulic","high tonnage hydraulic","hydraulic maintenance crimping"]),
    ("alignment-fixtures-reassembling-wire-machine-heads","Alignment Fixtures and Jigs for Reassembling Wire Processing Machine Heads","Machine Head Alignment Fixture | Zohan Enterprises","alignment fixtures jigs reassembling wire processing machine heads",["wire machine alignment jig","machine head reassembly","alignment fixture wire","machine reassembly fixture"]),
    ("calibration-frequency-traceability-wire-machinery","Calibration Frequency and Traceability Requirements for Wire Machinery","Wire Machine Calibration Traceability | Zohan","calibration frequency traceability requirements wire machinery",["calibration wire machine","machine calibration frequency","traceability calibration wire","wire machine calibrate"]),
    ("planned-maintenance-shutdown-production-coordination","Planned Maintenance Shutdown Coordination with Production Scheduling","Planned Maintenance Shutdown Wire | Zohan Enterprises","planned maintenance shutdown coordination production scheduling wire",["maintenance shutdown wire","planned downtime wire","shutdown coordination wire","production PM wire"]),
]

MT_ARTICLES = []
for i, (slug, title, mt_t, pk, skws) in enumerate(mt_topics):
    pid = i + 13
    art_id = f"mt-{pid:02d}"
    prods = MT_PRODUCTS[i % len(MT_PRODUCTS)]
    MT_ARTICLES.append(make_article(
        i, art_id, slug, title, mt_t, pk, skws,
        "Maintenance & Troubleshooting", "maintenance-troubleshooting",
        "complete-guide-to-machinery-maintenance-and-troubleshooting",
        prods, date_idx=i
    ))

# ─────────────────────────────────────────────────────────────────────────────
# CLUSTER 11: Industry-Specific Applications (ind-11 to ind-56 = 46 new)
# Note: Existing IDs are in-01 to in-10. New use prefix ind-
# ─────────────────────────────────────────────────────────────────────────────

IND_PRODUCTS = [
    ["ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-6t-automatic-wire-crimping-machine","ze-35mm-cable-tying-and-wire-winding-machine"],
    ["ze-10mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-s1-fully-automatic-single-head-wire-crimping-machine","ze-zcut9-automatic-tape-dispenser"],
    ["ze-25mm-automatic-wire-cutting-stripping-machine","ze-30t-fully-automatic-thimble-wire-crimping-machine","ze-asc100-automatic-sleeve-cutting-machine"],
    ["ze-6t-automatic-wire-crimping-machine","ze-cr2-fully-automatic-double-head-wire-crimping-machine","ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine"],
    ["ze-70sqmm-automatic-wire-cutting-stripping-machine","ze-6t-automatic-wire-crimping-machine","ze-038-scrap-wire-stripping-machine"],
]

ind_topics = [
    ("wire-processing-two-three-wheeler-ev-harness","Wire Processing for Two-Wheeler and Three-Wheeler EV Harnesses","EV 2W 3W Harness Wire Processing | Zohan","wire processing two-wheeler three-wheeler EV harnesses India",["2W 3W EV harness","two wheeler wire processing","e-bike harness wire","three wheeler EV wire"]),
    ("wire-processing-four-wheeler-automotive-body-harness","Wire Processing for Four-Wheeler Automotive Main Body Harness","Automotive Main Body Harness | Zohan Enterprises","wire processing four-wheeler automotive main body harness",["automotive main harness","car body harness wire","four wheeler harness","body harness automotive"]),
    ("wire-processing-engine-room-high-temperature","Wire Processing for Engine Room Wiring: High-Temperature Insulation","Engine Room Wire High Temperature | Zohan","wire processing engine room high-temperature insulation",["engine room wire","high temperature wire harness","engine wiring insulation","under hood wire processing"]),
    ("wire-processing-commercial-truck-bus-harness","Wire Processing for Commercial Truck and Bus Wiring Harnesses","Truck Bus Wire Harness | Zohan Enterprises","wire processing commercial truck bus wiring harnesses India",["truck bus wire harness","commercial vehicle wiring","bus harness wire","truck wire processing"]),
    ("wire-processing-agricultural-tractor-control-loom","Wire Processing for Agricultural Tractor Wiring and Control Looms","Tractor Wiring Loom Wire | Zohan Enterprises","wire processing agricultural tractor wiring control looms India",["tractor wiring harness","agriculture wire processing","tractor control loom","farm equipment wiring"]),
    ("wire-processing-construction-equipment-excavators","Wire Processing for Off-Highway Construction Equipment (Excavators)","Construction Equipment Wire | Zohan Enterprises","wire processing off-highway construction equipment excavators India",["excavator wire harness","construction machine wiring","off highway wire","earthmover harness"]),
    ("wire-processing-electrical-switchgear-panels","Wire Processing for Electrical Distribution and Switchgear Panels","Switchgear Panel Wire Processing | Zohan Enterprises","wire processing electrical distribution switchgear panels India",["switchgear panel wire","electrical panel wire","distribution board wiring","switchgear harness"]),
    ("wire-processing-motor-control-centres-mcc","Wire Processing for Industrial Motor Control Centres (MCCs)","Motor Control Centre Wire | Zohan Enterprises","wire processing industrial motor control centres MCCs India",["MCC wire processing","motor control centre wiring","MCC harness","motor control wiring"]),
    ("wire-processing-plc-automation-control-panels","Wire Processing for PLC and Automation Control Panels","PLC Control Panel Wire | Zohan Enterprises","wire processing PLC automation control panels India",["PLC panel wire","automation panel wiring","PLC wire processing","control panel PLC wire"]),
    ("wire-processing-din-rail-enclosure-ferrule-guide","Wire Processing for DIN Rail Enclosure Wiring: Ferrule Crimping Guide","DIN Rail Enclosure Wire | Zohan Enterprises","wire processing DIN rail enclosure wiring ferrule crimping",["DIN rail wiring","enclosure ferrule crimp","DIN rail wire guide","enclosure wiring crimp"]),
    ("wire-processing-solar-pv-dc-string-wiring","Wire Processing for Solar PV DC String and Combiner Box Wiring","Solar PV DC Wire Processing | Zohan Enterprises","wire processing solar PV DC string combiner box wiring India",["solar DC wire","PV string wiring","solar combiner box","solar wire processing"]),
    ("wire-processing-solar-rooftop-installation","Wire Processing for Solar Rooftop Installation Companies","Solar Rooftop Wire Processing | Zohan Enterprises","wire processing solar rooftop installation companies India",["solar rooftop wiring","rooftop solar wire","solar installation wire","solar rooftop cable"]),
    ("wire-processing-wind-turbine-nacelle-cables","Wire Processing for Wind Turbine Nacelle Wiring and Tower Cables","Wind Turbine Wire Processing | Zohan Enterprises","wire processing wind turbine nacelle wiring tower cables India",["wind turbine wiring","nacelle cable processing","wind tower wire","turbine harness"]),
    ("wire-processing-power-transformer-manufacturing","Wire Processing for Power Transformer Manufacturing","Transformer Wire Processing | Zohan Enterprises","wire processing power transformer manufacturing India",["transformer wire processing","power transformer wiring","transformer harness","transformer cable"]),
    ("wire-processing-low-voltage-switchgear-acb-mccb","Wire Processing for Low-Voltage Switchgear (ACB, MCCB Wiring)","LV Switchgear MCCB Wire | Zohan Enterprises","wire processing low-voltage switchgear ACB MCCB wiring India",["MCCB wiring wire","ACB switchgear wire","LV switchgear harness","circuit breaker wiring"]),
    ("wire-processing-ups-battery-cable-assembly","Wire Processing for UPS Battery Cable Assembly and Interconnects","UPS Battery Cable Wire | Zohan Enterprises","wire processing UPS battery cable assembly interconnects India",["UPS battery wire","battery cable UPS","UPS wiring harness","battery interconnect wire"]),
    ("wire-processing-railway-signal-rolling-stock","Wire Processing for Railway Signal and Rolling Stock Harnesses","Railway Signal Wire Processing | Zohan Enterprises","wire processing railway signal rolling stock harnesses India",["railway wire harness","rolling stock wiring","signal cable railway","train wire processing"]),
    ("wire-processing-metro-rail-control-wiring","Wire Processing for Metro Rail Electrical Systems and Control Wiring","Metro Rail Wire Processing | Zohan Enterprises","wire processing metro rail electrical systems control wiring India",["metro rail wiring","metro electrical wire","train control wire","metro rail harness"]),
    ("wire-processing-defence-military-harnesses","Wire Processing for Defence and Military Wiring Harnesses","Defence Military Wire Harness | Zohan Enterprises","wire processing defence military wiring harnesses India",["military wire harness","defence wiring","military harness India","defence cable processing"]),
    ("wire-processing-marine-shipbuilding-electrical","Wire Processing for Marine and Shipbuilding Electrical Systems","Marine Shipbuilding Wire | Zohan Enterprises","wire processing marine shipbuilding electrical systems India",["marine wire processing","shipbuilding cable","marine harness","ship electrical wire"]),
    ("wire-processing-white-goods-refrigerators-washing","Wire Processing for White Goods (Refrigerators, Washing Machines)","White Goods Wire Processing | Zohan Enterprises","wire processing white goods refrigerators washing machines India",["white goods wiring","refrigerator wire harness","washing machine wire","appliance harness"]),
    ("wire-processing-air-conditioning-indoor-outdoor","Wire Processing for Air Conditioning Units: Indoor and Outdoor Units","AC Unit Wire Processing | Zohan Enterprises","wire processing air conditioning units indoor outdoor India",["AC unit wiring","air conditioner wire","HVAC wire harness","AC harness India"]),
    ("wire-processing-microwave-oven-cooking-appliances","Wire Processing for Microwave Oven and Cooking Appliance Harnesses","Microwave Oven Wire Processing | Zohan Enterprises","wire processing microwave oven cooking appliance harnesses India",["microwave wire harness","cooking appliance wire","oven wiring harness","appliance wire India"]),
    ("wire-processing-commercial-kitchen-equipment","Wire Processing for Commercial Kitchen Equipment Wiring","Commercial Kitchen Wire | Zohan Enterprises","wire processing commercial kitchen equipment wiring India",["commercial kitchen wire","restaurant equipment wiring","kitchen appliance harness","commercial kitchen cable"]),
    ("wire-processing-medical-diagnostic-equipment","Wire Processing for Medical Diagnostic Equipment Harnesses","Medical Diagnostic Wire | Zohan Enterprises","wire processing medical diagnostic equipment harnesses India",["medical equipment wire","diagnostic harness","medical device wiring","healthcare wire processing"]),
    ("wire-processing-hospital-patient-monitoring","Wire Processing for Hospital Patient Monitoring Device Cabling","Hospital Patient Monitor Wire | Zohan Enterprises","wire processing hospital patient monitoring device cabling India",["hospital wire harness","patient monitor cable","medical monitor wire","hospital device wiring"]),
    ("wire-processing-led-street-lighting-luminaires","Wire Processing for LED Street Lighting and Commercial Luminaires","LED Street Light Wire | Zohan Enterprises","wire processing LED street lighting commercial luminaires India",["LED light wire","street lighting wire","luminaire cable","LED harness India"]),
    ("wire-processing-industrial-hvac-control-systems","Wire Processing for Industrial HVAC Control Systems","HVAC Control Wire Processing | Zohan Enterprises","wire processing industrial HVAC control systems India",["HVAC control wire","industrial HVAC wiring","HVAC harness","climate control wire"]),
    ("wire-processing-data-centre-power-distribution","Wire Processing for Data Centre Power Distribution Wiring","Data Centre Wire Processing | Zohan Enterprises","wire processing data centre power distribution wiring India",["data centre wiring","power distribution wire","data center harness","server power wire"]),
    ("wire-processing-server-rack-cabling-pdu","Wire Processing for Server Rack Internal Cabling and PDUs","Server Rack Wire Processing | Zohan Enterprises","wire processing server rack internal cabling PDUs India",["server rack wiring","PDU cable wire","server internal wire","rack cabling wire"]),
    ("wire-processing-telecom-bts-antenna-cabling","Wire Processing for Telecom Equipment: BTS and Antenna Cabling","Telecom BTS Wire Processing | Zohan Enterprises","wire processing telecom equipment BTS antenna cabling India",["telecom wire processing","BTS antenna cable","telecom harness India","BTS cabling wire"]),
    ("wire-processing-fire-alarm-life-safety-system","Wire Processing for Fire Alarm and Life Safety System Cabling","Fire Alarm Wire Processing | Zohan Enterprises","wire processing fire alarm life safety system cabling India",["fire alarm wire","life safety cable","fire alarm harness","safety system wire"]),
    ("wire-processing-security-cctv-wiring","Wire Processing for Security and CCTV System Wiring","Security CCTV Wire Processing | Zohan Enterprises","wire processing security CCTV system wiring India",["CCTV wire processing","security system wiring","CCTV cable harness","security wire India"]),
    ("wire-processing-instrumentation-process-control","Wire Processing for Instrumentation and Process Control Cables","Instrumentation Wire Processing | Zohan Enterprises","wire processing instrumentation process control cables India",["instrumentation wire","process control cable","instrument harness","control cable wire"]),
    ("wire-processing-petrochemical-instrument-loops","Wire Processing for Petrochemical Plant Instrument Loops","Petrochemical Wire Processing | Zohan Enterprises","wire processing petrochemical plant instrument loops India",["petrochemical wire","instrument loop wire","refinery wire harness","petrochemical cable"]),
    ("wire-processing-oil-gas-offshore-platform","Wire Processing for Oil and Gas Offshore Platform Cabling","Oil Gas Offshore Wire | Zohan Enterprises","wire processing oil gas offshore platform cabling India",["oil gas wire","offshore platform cable","marine oil wire","offshore wire harness"]),
    ("wire-processing-mining-equipment-underground","Wire Processing for Mining Equipment and Underground Cable","Mining Equipment Wire | Zohan Enterprises","wire processing mining equipment underground cable India",["mining wire processing","underground wire cable","mining harness India","mine cable wire"]),
    ("wire-processing-water-treatment-pumping-station","Wire Processing for Water Treatment and Pumping Station Wiring","Water Treatment Wire Processing | Zohan Enterprises","wire processing water treatment pumping station wiring India",["water treatment wire","pumping station wire","water plant cable","pumping wire harness"]),
    ("wire-processing-food-beverage-processing-plant","Wire Processing for Food and Beverage Processing Plant Cabling","Food Beverage Wire Processing | Zohan Enterprises","wire processing food beverage processing plant cabling India",["food processing wire","beverage plant cable","food industry wire","F&B harness India"]),
    ("wire-processing-pharmaceutical-cleanroom-wiring","Wire Processing for Pharmaceutical Cleanroom Facility Wiring","Pharma Cleanroom Wire | Zohan Enterprises","wire processing pharmaceutical cleanroom facility wiring India",["pharma cleanroom wire","pharmaceutical wire","cleanroom cable harness","pharma wiring India"]),
    ("wire-processing-aerospace-ground-support-equipment","Wire Processing for Aerospace Ground Support Equipment Harnesses","Aerospace GSE Wire Processing | Zohan Enterprises","wire processing aerospace ground support equipment harnesses India",["aerospace GSE wire","ground support cable","aerospace harness India","GSE wire processing"]),
    ("wire-processing-ev-charging-station-type2-ccs","Wire Processing for EV Charging Station Cable Assembly (Type 2/CCS)","EV Charging Station Wire | Zohan Enterprises","wire processing EV charging station cable Type 2 CCS India",["EV charging cable wire","Type 2 CCS cable","EV charger wire harness","charging station cable"]),
    ("wire-processing-battery-management-system-bms","Wire Processing for Battery Management System (BMS) Wiring Harnesses","BMS Wire Processing | Zohan Enterprises","wire processing battery management system BMS wiring harnesses India",["BMS wire harness","battery management wiring","BMS cable harness","battery system wire"]),
    ("wire-processing-industrial-robot-arm-servo-harness","Wire Processing for Industrial Robot Arm and Servo Harness Fabrication","Robot Arm Servo Harness Wire | Zohan Enterprises","wire processing industrial robot arm servo harness fabrication India",["robot arm wire harness","servo wire harness","industrial robot wiring","robot harness fabrication"]),
    ("wire-processing-scada-rtu-panel-wiring","Wire Processing for SCADA and Remote Terminal Unit (RTU) Panel Wiring","SCADA RTU Panel Wire | Zohan Enterprises","wire processing SCADA remote terminal unit RTU panel wiring India",["SCADA panel wire","RTU wiring","SCADA harness","remote terminal wiring"]),
]

IND_ARTICLES = []
for i, (slug, title, mt_t, pk, skws) in enumerate(ind_topics):
    pid = i + 11
    art_id = f"ind-{pid:02d}"
    prods = IND_PRODUCTS[i % len(IND_PRODUCTS)]
    IND_ARTICLES.append(make_article(
        i, art_id, slug, title, mt_t, pk, skws,
        "Industry-Specific Applications", "industries",
        "complete-guide-to-wire-processing-across-industries",
        prods, date_idx=i
    ))

# ─────────────────────────────────────────────────────────────────────────────
# CLUSTER 12: Industrial Technology & Trends (tt-07 to tt-45 = 39 new)
# ─────────────────────────────────────────────────────────────────────────────

TT_PRODUCTS = [
    ["ze-6mm-pvc-wire-automatic-wire-cutting-stripping-machine","ze-6t-automatic-wire-crimping-machine","ze-fs3-fully-automatic-soldering-machine"],
    ["ze-320-high-speed-cutting-stripping-machine","ze-360-high-speed-cutting-stripping-machine","ze-cr2-fully-automatic-double-head-wire-crimping-machine"],
    ["ze-s1-fully-automatic-single-head-wire-crimping-machine","ze-6t-automatic-wire-crimping-machine","ze-10mm-pvc-wire-automatic-wire-cutting-stripping-machine"],
    ["ze-pct100-power-cord-wire-testing-machine","ze-ut-usb-data-cable-tester","ze-100kg-push-pull-tester"],
]

tt_topics = [
    ("servo-motor-technology-wire-cutting-deep-dive","Servo Motor Technology in Modern Wire Cutting Machines: Deep Dive","Servo Motor Wire Cutting Technology | Zohan","servo motor technology modern wire cutting machines deep dive",["servo motor wire machine","servo drive cutting","servo technology wire","advanced servo wire"]),
    ("digital-twin-wire-harness-manufacturing","Digital Twin Applications in Wire Harness Manufacturing Simulation","Digital Twin Wire Harness | Zohan Enterprises","digital twin applications wire harness manufacturing simulation",["digital twin harness","wire manufacturing simulation","digital twin wire","simulation harness factory"]),
    ("ar-guided-wire-harness-assembly","Augmented Reality (AR) Guided Wire Harness Assembly: Pilot Programs","AR Wire Harness Assembly | Zohan Enterprises","augmented reality AR guided wire harness assembly pilots",["AR wire assembly","augmented reality harness","AR guided wire","mixed reality harness"]),
    ("blockchain-wire-harness-supply-chain","Blockchain for Wire Harness Supply Chain Traceability","Blockchain Harness Supply Chain | Zohan Enterprises","blockchain wire harness supply chain traceability",["blockchain wire harness","supply chain blockchain","wire harness traceability tech","blockchain cable"]),
    ("machine-learning-predictive-crimp-quality","Machine Learning for Predictive Crimp Quality Monitoring","ML Crimp Quality Monitoring | Zohan Enterprises","machine learning predictive crimp quality monitoring",["ML crimp quality","machine learning crimping","predictive crimp","AI crimp monitoring"]),
    ("edge-ai-wire-stripping-defect-detection","Edge AI Compute in Wire Stripping Machines: Real-Time Defect Detection","Edge AI Wire Stripping Defect | Zohan Enterprises","edge AI compute wire stripping machines real-time defect detection",["edge AI wire machine","AI defect detection wire","real time AI wire","edge compute wire"]),
    ("5g-remote-wire-machine-diagnostics","5G Connectivity Enabling Remote Wire Processing Machine Diagnostics","5G Remote Wire Machine Diagnostics | Zohan","5G connectivity remote wire processing machine diagnostics",["5G wire machine","remote diagnostics 5G","5G machine monitoring","wire machine 5G IoT"]),
    ("collaborative-robots-wire-harness-safety","Collaborative Robots in Wire Harness Assembly: ROI and Safety Standards","Cobots Wire Harness Assembly | Zohan Enterprises","collaborative robots cobots wire harness assembly ROI safety",["cobot wire assembly","collaborative robot harness","cobot ROI wire","wire harness cobot safety"]),
    ("additive-manufacturing-wire-harness-tooling","Additive Manufacturing (3D Printing) for Wire Harness Tooling and Fixtures","3D Printing Wire Harness Tooling | Zohan Enterprises","additive manufacturing 3D printing wire harness tooling fixtures",["3D printing wire tooling","additive manufacturing harness","wire fixture 3D print","printed harness fixture"]),
    ("green-manufacturing-voc-wire-harness-factories","Green Manufacturing: Reducing VOC Emissions in Wire Harness Factories","Green Manufacturing Wire Harness | Zohan Enterprises","green manufacturing reducing VOC emissions wire harness factories",["green wire manufacturing","VOC reduction harness","sustainable wire factory","eco wire harness"]),
    ("carbon-footprint-wire-processing-operations","Carbon Footprint Calculation for Wire Processing Operations","Carbon Footprint Wire Processing | Zohan Enterprises","carbon footprint calculation wire processing operations",["carbon footprint wire","wire processing carbon","sustainable wire","wire factory emissions"]),
    ("lean-manufacturing-wire-processing-value-stream","Lean Manufacturing Principles Applied to Wire Processing: Value Stream Map","Lean Wire Processing Value Stream | Zohan","lean manufacturing wire processing value stream map",["lean wire manufacturing","VSM wire processing","value stream wire","lean harness factory"]),
    ("industry-4-maturity-model-wire-harness","Industry 4.0 Maturity Model for Wire Harness Factories","Industry 4.0 Wire Harness Maturity | Zohan Enterprises","industry 4.0 maturity model wire harness factories",["Industry 4.0 wire harness","smart factory maturity","wire harness I4.0","digital maturity wire"]),
    ("digital-work-orders-paperless-wire-processing","Digital Work Orders and Paperless Production in Wire Processing","Digital Work Orders Wire | Zohan Enterprises","digital work orders paperless production wire processing",["digital work orders wire","paperless wire production","digital production wire","wire factory paperless"]),
    ("machine-learning-wire-scrap-prediction","Machine Learning for Wire Scrap Prediction and Waste Reduction","ML Wire Scrap Prediction | Zohan Enterprises","machine learning wire scrap prediction waste reduction",["ML scrap wire","machine learning wire waste","AI wire scrap","scrap prediction wire"]),
    ("predictive-blade-life-extension-machine-learning","Predictive Blade Life Extension Using Machine Learning Models","Predictive Blade Life ML | Zohan Enterprises","predictive blade life extension machine learning models wire",["predictive blade life","ML blade prediction","blade life machine learning","AI blade wear wire"]),
    ("cloud-erp-integration-wire-machine-data","Cloud ERP Integration with Wire Processing Machine Data Streams","Cloud ERP Wire Machine Data | Zohan Enterprises","cloud ERP integration wire processing machine data streams",["cloud ERP wire","wire machine ERP","machine data cloud","ERP wire processing"]),
    ("real-time-energy-monitoring-wire-shops","Real-Time Energy Monitoring and Demand Management in Wire Shops","Real Time Energy Wire Shop | Zohan Enterprises","real-time energy monitoring demand management wire shops",["real time energy wire","wire shop energy","demand management wire","energy monitor wire machine"]),
    ("automated-fixture-design-harness-testing","Automated Fixture Design for Wire Harness Testing and Inspection","Automated Harness Test Fixture | Zohan Enterprises","automated fixture design wire harness testing inspection",["automated test fixture","harness testing fixture","wire test automation","fixture design wire"]),
    ("flexible-manufacturing-high-mix-wire-harness","Flexible Manufacturing Systems for High-Mix Wire Harness Production","Flexible Wire Harness Manufacturing | Zohan Enterprises","flexible manufacturing systems high-mix wire harness production",["flexible wire manufacturing","high mix harness","FMS wire harness","flexible harness production"]),
    ("simulation-software-wire-processing-capacity","Simulation Software for Wire Processing Cell Capacity Planning","Wire Processing Simulation Software | Zohan Enterprises","simulation software wire processing cell capacity planning",["simulation wire processing","capacity simulation wire","wire cell simulation","digital simulation harness"]),
    ("new-insulation-materials-ev-autonomous-harness","New Insulation Materials for EV and Autonomous Vehicle Harnesses","EV Autonomous Vehicle Insulation | Zohan Enterprises","new insulation materials EV autonomous vehicle harnesses",["new wire insulation EV","autonomous vehicle wire","EV insulation material","next gen wire insulation"]),
    ("miniaturization-micro-coaxial-fine-pitch-wire","Miniaturization Trends: Micro-Coaxial and Fine-Pitch Wire Processing","Miniaturization Wire Processing Trends | Zohan Enterprises","miniaturization micro-coaxial fine-pitch wire processing trends",["micro coaxial wire","fine pitch wire","wire miniaturization","micro wire future"]),
    ("high-voltage-insulation-800v-ev-architectures","High-Voltage Insulation Developments for 800V EV Architectures","800V EV Wire Insulation | Zohan Enterprises","high-voltage insulation 800V EV architecture wire harness",["800V EV insulation","high voltage EV wire","800V wire harness","EV architecture insulation"]),
    ("zonal-electrical-architecture-vehicle-harness","Zonal Electrical Architecture in Next-Generation Vehicles: Harness Impact","Zonal Architecture Vehicle Harness | Zohan Enterprises","zonal electrical architecture next-generation vehicles harness impact",["zonal architecture harness","next gen vehicle harness","zonal electrical vehicle","vehicle wire architecture"]),
    ("software-defined-vehicles-wire-harness-complexity","Software-Defined Vehicles and Their Impact on Wire Harness Complexity","Software Defined Vehicle Harness | Zohan Enterprises","software-defined vehicles impact wire harness complexity",["software defined vehicle wire","SDV harness","software vehicle wiring","digital vehicle harness"]),
    ("aluminium-conductor-automotive-harnesses-processing","Aluminium Conductor Adoption in Automotive Harnesses: Processing Needs","Aluminium Conductor Harness | Zohan Enterprises","aluminium conductor adoption automotive harnesses processing needs",["aluminium conductor harness","aluminium wire automotive","lightweight conductor wire","aluminium harness processing"]),
    ("bio-based-recyclable-wire-insulation-rd","Bio-Based and Recyclable Wire Insulation Materials: R&D Overview","Bio Based Wire Insulation | Zohan Enterprises","bio-based recyclable wire insulation materials R&D overview",["bio based wire insulation","recyclable wire material","sustainable wire insulation","green wire material"]),
    ("wire-harness-digital-product-passport-eu","Wire Harness Digital Product Passport: EU Regulation and Compliance","Digital Product Passport Wire | Zohan Enterprises","wire harness digital product passport EU regulation compliance",["digital product passport","EU wire regulation","harness DPP","wire passport EU"]),
    ("smart-applicator-embedded-sensors-cfm","Smart Applicator Tooling with Embedded Sensors for CFM Integration","Smart Applicator CFM Sensors | Zohan Enterprises","smart applicator tooling embedded sensors CFM integration",["smart applicator CFM","sensor applicator","embedded sensor crimp","smart tooling CFM"]),
    ("photonic-wire-bonding-optical-vs-copper-harness","Photonic Wire Bonding and Optical Interconnect vs Copper Harness Future","Optical Interconnect vs Copper Harness | Zohan Enterprises","photonic wire bonding optical interconnect vs copper harness future",["optical interconnect wire","photonic bonding","copper vs optical harness","future wire harness"]),
    ("robotics-cobot-vision-wire-harness-advances","Robotics and Cobot Vision System Advances for Wire Harness Assembly","Cobot Vision Wire Harness Advances | Zohan Enterprises","robotics cobot vision system advances wire harness assembly",["cobot vision harness","robot wire assembly advances","vision cobot wire","advanced robot harness"]),
    ("plasma-surface-activation-solder-fine-wires","Plasma Surface Activation for Improving Solder Wettability on Fine Wires","Plasma Surface Activation Soldering | Zohan Enterprises","plasma surface activation improving solder wettability fine wires",["plasma activation solder","solder wettability improve","plasma wire prep","fine wire plasma"]),
    ("hybrid-bonding-crimp-solder-high-reliability","Hybrid Bonding: Combining Crimp and Solder in High-Reliability Joints","Hybrid Crimp Solder Bonding | Zohan Enterprises","hybrid bonding combining crimp solder high-reliability joints",["hybrid bonding wire","crimp and solder joint","hybrid wire termination","reliability hybrid bond"]),
    ("ultrasonic-metal-welding-ev-battery-wire","Advanced Ultrasonic Metal Welding for EV Battery Tab and Wire Joining","Ultrasonic Welding EV Battery Wire | Zohan Enterprises","ultrasonic metal welding EV battery tab wire joining",["ultrasonic welding EV","battery tab welding","wire ultrasonic weld","EV battery join"]),
    ("india-semiconductor-electronics-harness-demand","India's Semiconductor and Electronics Push: Wire Harness Demand Growth","India Electronics Wire Harness Demand | Zohan Enterprises","India semiconductor electronics manufacturing push wire harness demand",["India electronics wire","semiconductor wire harness","India wire demand","electronics manufacturing India"]),
    ("quantum-dot-wire-marking-harness-traceability","Quantum Dot Wire Marking Technology for Harness Traceability","Quantum Dot Wire Marking | Zohan Enterprises","quantum dot wire marking technology harness traceability",["quantum dot wire mark","future wire marking","wire traceability tech","quantum dot harness"]),
    ("self-healing-insulation-materials-wire-research","Self-Healing Insulation Materials: Research and Future Prospects","Self-Healing Wire Insulation | Zohan Enterprises","self-healing insulation materials research future prospects wire",["self healing wire insulation","smart insulation wire","future insulation material","self repair wire"]),
    ("zohan-technology-roadmap-next-generation-wire","Zohan Enterprises Technology Roadmap: Next-Generation Wire Machinery","Zohan Technology Roadmap Wire | Zohan Enterprises","Zohan Enterprises technology roadmap next-generation wire machinery",["Zohan technology roadmap","Zohan future machine","wire machine future Zohan","next gen Zohan wire"]),
]

TT_ARTICLES = []
for i, (slug, title, mt_t, pk, skws) in enumerate(tt_topics):
    pid = i + 7
    art_id = f"tt-{pid:02d}"
    prods = TT_PRODUCTS[i % len(TT_PRODUCTS)]
    TT_ARTICLES.append(make_article(
        i, art_id, slug, title, mt_t, pk, skws,
        "Industrial Technology & Trends", "industrial-technology",
        "complete-guide-to-wire-processing-technology-trends",
        prods, date_idx=i
    ))

# ─────────────────────────────────────────────────────────────────────────────
# EXECUTE: Append all clusters
# ─────────────────────────────────────────────────────────────────────────────

def run():
    clusters = [
        (os.path.join(BASE, 'crimping.js'), CM_ARTICLES, "Cluster 2 — cm-17 to cm-65 (49 new)"),
        (os.path.join(BASE, 'cuttingStripping.js'), CS_ARTICLES, "Cluster 3 — cs-16 to cs-62 (47 new)"),
        (os.path.join(BASE, 'soldering.js'), SD_ARTICLES, "Cluster 4 — sd-09 to sd-45 (37 new)"),
        (os.path.join(BASE, 'scrapProcessing.js'), SP_ARTICLES, "Cluster 5 — sp-11 to sp-50 (40 new)"),
        (os.path.join(BASE, 'cableHarness.js'), CH_ARTICLES, "Cluster 6 — ch-13 to ch-56 (44 new)"),
        (os.path.join(BASE, 'industrialAutomation.js'), IA_ARTICLES, "Cluster 7 — ia-11 to ia-55 (45 new)"),
        (os.path.join(BASE, 'manufacturingEngineering.js'), MQ_ARTICLES, "Cluster 8 — me-11 to me-55 (45 new)"),
        (os.path.join(BASE, 'buyingGuides.js'), BG_ARTICLES, "Cluster 9 — bg-13 to bg-55 (43 new)"),
        (os.path.join(BASE, 'maintenanceTroubleshooting.js'), MT_ARTICLES, "Cluster 10 — mt-13 to mt-60 (48 new)"),
        (os.path.join(BASE, 'industryApplications.js'), IND_ARTICLES, "Cluster 11 — ind-11 to ind-56 (46 new)"),
        (os.path.join(BASE, 'technologyTrends.js'), TT_ARTICLES, "Cluster 12 — tt-07 to tt-45 (39 new)"),
    ]
    
    total = 0
    for filepath, articles, comment in clusters:
        append_articles_to_file(filepath, articles, comment)
        total += len(articles)
    
    print(f"\n{'='*60}")
    print(f"✓ TOTAL: {total} articles appended across 11 cluster files")
    print(f"  + 45 articles already added to wireProcessing.js")
    print(f"  = {total + 45} articles total added")
    print(f"{'='*60}")

if __name__ == '__main__':
    run()
