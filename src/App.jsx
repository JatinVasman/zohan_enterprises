import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import ScrollManager from "./components/ScrollManager"
import Home from "./pages/Home"
import Contact from "./pages/Contact"
import ThankYou from "./pages/ThankYou"
import ProductList from "./pages/ProductList"
import ProductDetail from "./pages/ProductDetail"
import About from "./pages/About"
import NotFound from "./pages/NotFound"
import { ThemeProvider } from "./context/ThemeContext"
import { QuoteModalProvider } from "./context/QuoteModalContext"
import QuoteModal from "./components/QuoteModal"
import QuoteReminderPopup from "./components/QuoteReminderPopup"

import LocationDirectory from "./pages/LocationDirectory"
import LocationDetail from "./pages/LocationDetail"
import BlogIndex from "./pages/BlogIndex"
import BlogCategory from "./pages/BlogCategory"
import BlogDetail from "./pages/BlogDetail"
import EnquiryPage from "./pages/EnquiryPage"

function App() {
  return (
    <ThemeProvider>
      <QuoteModalProvider>
        <QuoteReminderPopup />
        <QuoteModal />
        <Layout>
          <ScrollManager />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:categorySlug" element={<ProductList />} />
            <Route path="/product/:productSlug" element={<ProductDetail />} />
            <Route path="/industrial-machinery/locations" element={<LocationDirectory />} />
            <Route path="/industrial-machinery/:citySlug" element={<LocationDetail />} />
            {/* Redirect legacy /locations to canonical URL */}
            <Route path="/locations" element={<Navigate to="/industrial-machinery/locations" replace />} />
            <Route path="/enquiry" element={<EnquiryPage />} />
            <Route path="/enquiry/:productSlug" element={<EnquiryPage />} />
            {/* SEO Industrial Blog & Knowledge Hub Routes */}
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/category/:categorySlug" element={<BlogCategory />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </QuoteModalProvider>
    </ThemeProvider>
  )
}

export default App
