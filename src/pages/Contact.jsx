import { motion } from "framer-motion"
import { ChevronRight, Mail, MapPin, Phone } from "lucide-react"
import { useEffect } from "react"
import { IconWhatsApp } from "../components/SocialIcons"
import Breadcrumb from "../components/Breadcrumb"
import EnquiryForm from "../components/EnquiryForm"
import OfficeCard from "../components/OfficeCard"
import { SectionHeading } from "../components/Categories"
import { socialIconMap } from "../components/SocialIcons"
import { company } from "../data/content"
import { offices } from "../data/offices"
import { socialLinks } from "../data/socials"
import { setPageSeo, injectJsonLd, removeJsonLd, SITE_URL } from "../lib/seo"
import saifImg from "../assets/saif.png"

export default function Contact() {
  useEffect(() => {
    const title = 'Contact Zohan Enterprises — Get a Quote for Industrial Machinery | Noida';
    const description = `Reach out to Zohan Enterprises, Noida for terminal crimping machines, wire cutting & stripping machines, and scrap wire machinery. Call ${company.phone}, email ${company.email} or fill the enquiry form for a quick quote.`;
    const canonicalUrl = `${SITE_URL}/contact`;

    setPageSeo({ title, description, canonical: canonicalUrl });

    injectJsonLd('contact-schema', {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ContactPage',
          '@id': `${canonicalUrl}#page`,
          url: canonicalUrl,
          name: title,
          description,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Contact Us', item: canonicalUrl },
            ],
          },
        },
        {
          '@type': 'LocalBusiness',
          '@id': `${SITE_URL}/#localbusiness`,
          name: company.name,
          url: SITE_URL,
          telephone: company.phone,
          email: company.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'A-279, Sector 69, Transport Nagar',
            addressLocality: 'Noida',
            addressRegion: 'Uttar Pradesh',
            postalCode: '201301',
            addressCountry: 'IN',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: '28.5355',
            longitude: '77.3910',
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '09:30',
              closes: '18:30',
            },
          ],
          priceRange: '₹₹',
          currenciesAccepted: 'INR',
          paymentAccepted: 'Cash, Bank Transfer, Online',
          hasMap: 'https://maps.google.com/?q=Zohan+Enterprises+Noida+Sector+69',
        },
      ],
    });

    return () => {
      removeJsonLd('contact-schema');
    };
  }, []);

  return (
    <>
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Contact Us" }]} />

      <section className="bg-white dark:bg-[#0B1120] py-16 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className="text-xs font-bold tracking-[0.2em] text-[#0D5C3A] dark:text-emerald-400 uppercase">Get In Touch</span>
              <h1 className="font-display mt-2 text-3xl font-bold text-[#0F172A] dark:text-white lg:text-4xl">Contact Us</h1>

              <div className="card-lift mt-8 rounded-sm border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/90 p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <img
                    src={saifImg}
                    alt={company.ceo}
                    className="h-12 w-12 rounded-full object-cover object-top border-2 border-[#10B981] shadow-sm ring-2 ring-[#ECFDF5] dark:ring-emerald-950/50"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#0F172A] dark:text-white">{company.ceo}</p>
                    <p className="text-xs text-[#64748B] dark:text-slate-400">Chief Executive Officer</p>
                  </div>
                </div>
                <p className="mt-4 font-display text-base font-bold text-[#0F172A] dark:text-white">{company.name}</p>

                <ul className="mt-5 space-y-4 text-sm text-[#475569] dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <MapPin size={17} className="mt-0.5 shrink-0 text-[#10B981]" />
                    {company.address}
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone size={17} className="shrink-0 text-[#10B981]" />
                    <a href={`tel:${company.phone}`} className="font-semibold text-[#0F172A] dark:text-white transition-colors hover:text-[#0D5C3A] dark:hover:text-emerald-400">
                      {company.phone}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail size={17} className="shrink-0 text-[#10B981]" />
                    <a href={`mailto:${company.email}`} className="font-semibold text-[#0F172A] dark:text-white transition-colors hover:text-[#0D5C3A] dark:hover:text-emerald-400">
                      {company.email}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <a
                      href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
                        "Hi, I would like to enquire about your wire processing machines."
                      )}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 bg-[#DCFCE7] dark:bg-emerald-950/40 border border-[#86EFAC] dark:border-emerald-700 rounded-lg px-4 py-2.5 text-sm font-bold text-[#15803D] dark:text-emerald-300 hover:bg-[#BBF7D0] dark:hover:bg-emerald-950/60 transition-colors"
                    >
                      <IconWhatsApp size={17} />
                      Chat on WhatsApp
                    </a>
                  </li>
                </ul>

                <div className="mt-5 border-t border-slate-200 dark:border-slate-800 pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#64748B] dark:text-slate-400">
                    Connect With Us
                  </p>
                  <div className="mt-3 flex items-center gap-2.5">
                    {socialLinks.map(({ id, url, ariaLabel, label }) => {
                      const Icon = socialIconMap[id]
                      return (
                        <a
                          key={id}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={ariaLabel}
                          title={label}
                          className="group flex h-11 w-11 items-center justify-center rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-[#475569] dark:text-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A7F3D0] hover:bg-[#ECFDF5] hover:text-[#0D5C3A] dark:hover:border-emerald-500/60 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
                        >
                          <Icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="group mt-4 flex items-center justify-between rounded-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 px-6 py-4 text-sm font-semibold text-[#0F172A] dark:text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#10B981] hover:text-[#0D5C3A] dark:hover:border-emerald-500/60 dark:hover:text-emerald-400"
              >
                View Additional Details &amp; Get Directions
                <ChevronRight size={16} className="text-[#0D5C3A] dark:text-emerald-400 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <EnquiryForm />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] dark:bg-slate-900/50 py-20 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <SectionHeading
            eyebrow="Nationwide Reach"
            title="Our Offices"
            desc="Reach out to your nearest office for technical guidance, quotations and after-sales support."
          />

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {offices.map((office, i) => (
              <OfficeCard key={office.id} office={office} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
