import { useEffect, useState } from 'react'
import StaggeredMenu from './StaggeredMenu.jsx'
import { useLenis } from '../../hooks/useLenis.js'
import logoMark from '../../assets/icons/logo-surf-lobitos.png'

// Matches the live site's 4-item nav exactly: Inicio / HOTEL LOBITOS
// (Nuestro Compromiso + Desayuno/Relajación) / Surf Academy / Reservar.
const MENU_ITEMS = [
  { label: 'Inicio', ariaLabel: 'Ir a Inicio', link: '/' },
  { label: 'Hotel Lobitos', ariaLabel: 'Ver Hotel Lobitos', link: '/hotel-lobitos' },
  { label: 'Surf Academy', ariaLabel: 'Ver Surf Academy', link: '/surf-academy' },
  { label: 'Reservar', ariaLabel: 'Reservar por WhatsApp', link: 'https://wa.me/51974578082' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const lenisRef = useLenis()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <StaggeredMenu
      className={scrolled ? 'nav-scrolled' : ''}
      position="right"
      items={MENU_ITEMS}
      displaySocials={false}
      displayItemNumbering
      logoUrl={logoMark}
      menuButtonColor="#1D4331"
      openMenuButtonColor="#1D4331"
      changeMenuColorOnOpen={false}
      colors={['#1D4331', '#8F3E1E']}
      accentColor="#8F3E1E"
      isFixed
      closeOnClickAway
      onMenuOpen={() => lenisRef?.current?.stop()}
      onMenuClose={() => lenisRef?.current?.start()}
    />
  )
}
