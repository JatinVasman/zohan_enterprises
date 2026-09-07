import { createContext, useContext, useState, useCallback } from "react"

const QuoteModalContext = createContext(null)

export function QuoteModalProvider({ children }) {
  const [product, setProduct] = useState(null)

  const openModal = useCallback((p) => {
    if (!p) {
      setProduct({ isGeneral: true, name: "General Machinery Enquiry" })
    } else {
      setProduct(p)
    }
  }, [])
  const closeModal = useCallback(() => setProduct(null), [])

  return (
    <QuoteModalContext.Provider value={{ product, openModal, closeModal }}>
      {children}
    </QuoteModalContext.Provider>
  )
}

export function useQuoteModal() {
  return useContext(QuoteModalContext)
}
