import { useEffect, useState } from 'react'
import WhatsAppIcon from '../ui/WhatsAppIcon.jsx'

/**
 * Sticky bottom-right WhatsApp CTA — a conversion point that doesn't
 * depend on the user scrolling to a specific section or noticing the nav
 * button. Fades in shortly after mount rather than popping in instantly.
 */
export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <a
      href="https://wa.me/51974578082"
      target="_blank"
      rel="noopener"
      className={`floating-whatsapp${visible ? ' is-visible' : ''}`}
      aria-label="Reservar por WhatsApp"
    >
      <WhatsAppIcon size={26} />
    </a>
  )
}
