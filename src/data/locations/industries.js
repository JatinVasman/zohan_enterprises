// ─────────────────────────────────────────────────────────────────────────────
// Standardized Industry Profiles for Zohan Enterprises Local SEO Engine
// ─────────────────────────────────────────────────────────────────────────────

export const industries = [
  {
    id: "automotive-harness",
    name: "Automotive Wire Harness & Components",
    slug: "automotive-wire-harness",
    icon: "Car",
    tagline: "High-precision wire processing for 2-wheeler, 4-wheeler & commercial vehicle harnesses",
    description:
      "Automotive wiring demands zero-defect terminal crimping, precise jacket stripping without strand damage, and high-speed multi-core cable processing. Zohan Enterprises supplies heavy-duty automatic crimping and stripping machinery to Tier-1 and Tier-2 automotive component manufacturers across India.",
    keyApplications: ["terminal-crimping", "wire-cutting-stripping", "multi-core-stripping", "wire-twisting"],
    recommendedCategories: [
      "wire-crimping-machine",
      "wire-cutting-stripping-machine",
      "automatic-terminal-crimping-machine",
      "wire-stripping-machinery",
    ],
  },
  {
    id: "electrical-switchgear",
    name: "Electrical Panels, Switchgear & Transformers",
    slug: "electrical-panels-switchgear",
    icon: "Zap",
    tagline: "Heavy-duty wire processing for control panels, distribution boxes and power switchgears",
    description:
      "Control panel builders and electrical switchgear assemblers require robust crimping force up to 6 tons and multi-conductor wire preparation. Zohan's bench-top presses and thick-cable stripping machines ensure firm terminal connections and high dielectric integrity.",
    keyApplications: ["terminal-crimping", "wire-cutting-stripping", "pneumatic-stripping", "multi-core-stripping"],
    recommendedCategories: [
      "wire-crimping-machine",
      "wire-cutting-stripping-machine",
      "pneumatic-wire-stripping-machine",
      "wire-stripping-machinery",
    ],
  },
  {
    id: "electronics-appliances",
    name: "Consumer Electronics & Home Appliances",
    slug: "electronics-home-appliances",
    icon: "Tv",
    tagline: "Fine-pitch cutting, ribbon wire processing and precision soldering systems",
    description:
      "Modern appliance and electronics manufacturing lines require fast cycle times on fine-gauge wires, ribbon cables, and precision automated soldering. Zohan Enterprises provides compact, programmable machines designed for high-density electronic assemblies.",
    keyApplications: ["wire-cutting-stripping", "soldering", "ribbon-wire", "twisting"],
    recommendedCategories: [
      "wire-cutting-stripping-machine",
      "soldering-machine",
      "automatic-wire-cutting-stripping-twisting-machine",
      "ribbon-wire-cutting-stripping-machine",
    ],
  },
  {
    id: "cable-manufacturing",
    name: "Cable & Wire Manufacturing Plants",
    slug: "cable-wire-manufacturing",
    icon: "Radio",
    tagline: "Heavy-duty reeling, peeling, winding and testing machinery for cable producers",
    description:
      "Cable production facilities benefit from Zohan's high-speed payoff stands, multi-core peeling systems, outer jacket stripping units, and automated cable bundling machines designed for continuous industrial operation.",
    keyApplications: ["multi-core-stripping", "wire-winding", "coaxial-stripping", "cable-testing"],
    recommendedCategories: [
      "wire-stripping-machinery",
      "cable-tying-and-wire-winding-machine",
      "wire-pay-off-stand",
      "coaxial-cable-stripping-machine",
    ],
  },
  {
    id: "solar-renewable",
    name: "Solar Energy & EV Battery Harnessing",
    slug: "solar-ev-battery-harnessing",
    icon: "Sun",
    tagline: "Thick solar DC cables, battery terminal lugs and high-voltage harness tooling",
    description:
      "Solar rooftop installations, EV battery packs, and inverter manufacturers require heavy-gauge cable stripping (up to 15mm/25mm) and high-tonnage lug crimping. Zohan equipment delivers consistent pull-force strength and weather-resistant terminations.",
    keyApplications: ["terminal-crimping", "wire-cutting-stripping", "multi-core-stripping"],
    recommendedCategories: [
      "wire-crimping-machine",
      "wire-cutting-stripping-machine",
      "wire-stripping-machinery",
    ],
  },
  {
    id: "scrap-copper-recycling",
    name: "Copper Scrap Recycling & Wire Recovery",
    slug: "copper-scrap-wire-recycling",
    icon: "Recycle",
    tagline: "High-yield scrap wire stripping and copper granulation systems",
    description:
      "Scrap metal recyclers and industrial copper recovery yards rely on Zohan Enterprises' ZE-038 and ZE-KOF series scrap strippers and granulators to cleanly separate copper conductor cores from PVC/rubber insulation without metal loss.",
    keyApplications: ["scrap-stripping", "copper-granulation", "plastic-crushing"],
    recommendedCategories: [
      "scrap-wire-stripping-machine",
      "granulator-machine",
      "plastic-crushing-machine",
      "machine-blade",
    ],
  },
  {
    id: "telecom-networking",
    name: "Telecom, Networking & Coaxial Cables",
    slug: "telecom-networking-cables",
    icon: "Network",
    tagline: "Multi-layer coaxial peeling and RJ45/modular connector crimping machinery",
    description:
      "Telecom equipment suppliers and data infrastructure contractors use Zohan's precision rotary coaxial stripping machines and RJ45 connector crimpers for flawless RF and Ethernet cable termination.",
    keyApplications: ["coaxial-stripping", "connector-crimping", "cable-testing"],
    recommendedCategories: [
      "coaxial-cable-stripping-machine",
      "connector-crimping-machine",
      "cable-tester",
    ],
  },
  {
    id: "msme-engineering",
    name: "MSME General Engineering & Light Manufacturing",
    slug: "msme-engineering-manufacturing",
    icon: "Wrench",
    tagline: "Cost-effective, versatile benchtop machinery for small & medium manufacturing units",
    description:
      "For small-to-medium manufacturing workshops and job-work contractors, Zohan Enterprises delivers reliable, easy-to-operate semi-automatic wire stripping and crimping machines that maximize worker productivity and minimize material scrap.",
    keyApplications: ["wire-cutting-stripping", "terminal-crimping", "pneumatic-stripping"],
    recommendedCategories: [
      "wire-cutting-stripping-machine",
      "wire-crimping-machine",
      "pneumatic-wire-stripping-machine",
      "scrap-wire-stripping-machine",
    ],
  },
  {
    id: "general-msme-manufacturing",
    name: "MSME General Engineering & Light Manufacturing",
    slug: "general-msme-manufacturing",
    icon: "Wrench",
    tagline: "Cost-effective, versatile benchtop machinery for small & medium manufacturing units",
    description:
      "For small-to-medium manufacturing workshops and job-work contractors, Zohan Enterprises delivers reliable, easy-to-operate semi-automatic wire stripping and crimping machines that maximize worker productivity and minimize material scrap.",
    keyApplications: ["wire-cutting-stripping", "terminal-crimping", "pneumatic-stripping"],
    recommendedCategories: [
      "wire-cutting-stripping-machine",
      "wire-crimping-machine",
      "pneumatic-wire-stripping-machine",
      "scrap-wire-stripping-machine",
    ],
  },
]

export const getIndustryById = (id) => industries.find((i) => i.id === id)
