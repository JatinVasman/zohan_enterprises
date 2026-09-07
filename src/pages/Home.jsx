import Hero from "../components/Hero"
import StatsBand from "../components/StatsBand"
import Products from "../components/Products"
import Categories from "../components/Categories"
import About from "../components/About"
import WhyChooseUs from "../components/WhyChooseUs"
import CTA from "../components/CTA"
import PresenceSummary from "../components/PresenceSummary"
import SocialFollow from "../components/SocialFollow"
import SectionNav from "../components/SectionNav"

const HOME_SECTIONS = [
  { id: "home",         label: "Hero" },
  { id: "our-products", label: "Products" },
  { id: "categories",   label: "Categories" },
  { id: "about-us",     label: "About Us" },
  { id: "why-us",       label: "Why Choose Us" },
  { id: "cta",          label: "Talk To Us" },
  { id: "presence",     label: "Our Presence" },
  { id: "social",       label: "Follow Us" },
]

export default function Home() {
  return (
    <>
      <SectionNav sections={HOME_SECTIONS} />
      <Hero />
      <StatsBand />
      {/* Best sellers appear before category browse — visitors see popular products first */}
      <Products />
      <Categories />
      <About />
      <WhyChooseUs />
      <CTA />
      <PresenceSummary />
      <SocialFollow />
    </>
  )
}
