import { Routes, Route, useLocation } from 'react-router-dom'
import { useLayoutEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LenisProvider, useLenis } from './hooks/useLenis.js'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import FloatingWhatsApp from './components/layout/FloatingWhatsApp.jsx'
import Home from './pages/Home.jsx'
import HotelLobitos from './pages/HotelLobitos.jsx'
import SurfAcademy from './pages/SurfAcademy.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  const lenisRef = useLenis()

  useLayoutEffect(() => {
    if (lenisRef?.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      // behavior:'instant' — a bare scrollTo would inherit any smooth
      // scroll-behavior and visibly animate the route-change reset.
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
    // Defer to the next frame so the new route's DOM has committed before
    // ScrollTrigger recalculates trigger bounds against it.
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname, lenisRef])

  return null
}

function App() {
  const location = useLocation()

  return (
    <LenisProvider>
      <ScrollToTop />
      <Navbar />
      <main key={location.pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotel-lobitos" element={<HotelLobitos />} />
          <Route path="/surf-academy" element={<SurfAcademy />} />
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </LenisProvider>
  )
}

export default App
