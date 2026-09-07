import Header from "./Header"
import Footer from "./Footer"

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-[#0B1120] transition-colors duration-200">
      <Header />
      {/* pt accounts for fixed floating pill nav height + gap */}
      <div className="pt-[88px]">
        {children}
      </div>
      <Footer />
    </div>
  )
}

