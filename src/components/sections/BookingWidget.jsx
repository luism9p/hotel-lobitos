import { useState } from 'react'
import Button from '../ui/Button.jsx'

const WA_HREF = 'https://wa.me/51974578082'

// Static content — zero dependencies, so a plain module-level constant is
// enough; useMemo exists for recomputing against changing props/state,
// which doesn't apply here.
const TABS = [
  {
    id: 'clase',
    tabLabel: 'Surf Clase',
    title: 'Surf Clase',
    description: 'Clases con instructores locales, para todos los niveles, con un enfoque personalizado.',
    buttonText: 'Reservar por WhatsApp',
    ctaHref: WA_HREF,
  },
  {
    id: 'tabla',
    tabLabel: 'Alquiler Tabla',
    title: 'Alquiler Tabla',
    description: 'Soft-Top, Funboard o Shortboard — todo el equipo está incluido.',
    buttonText: 'Reservar por WhatsApp',
    ctaHref: WA_HREF,
  },
  {
    id: 'trip',
    tabLabel: 'Surf Trip',
    title: 'Surf Trip',
    description: 'Exploración marina, rutas costeras y exploración terrestre guiadas por locales.',
    buttonText: 'Reservar por WhatsApp',
    ctaHref: WA_HREF,
  },
]

/**
 * "Reserva Rápida" tabs (Surf Clase / Alquiler Tabla / Surf Trip) — plain
 * React state, no external tabs library.
 *
 * `.booking-panel` is keyed by `activeTab` (see global.css) so React mounts
 * a fresh DOM node per switch instead of mutating the existing one — that's
 * what makes the CSS enter animation (fade + translateY(10px)→0) replay on
 * every tab change instead of just once on first mount.
 */
export default function BookingWidget({ eyebrow }) {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const currentContent = TABS.find((tab) => tab.id === activeTab)

  return (
    <>
      <span className="eyebrow reveal">{eyebrow}</span>
      <div className="booking-widget reveal" style={{ marginTop: 26 }}>
        <div className="booking-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={tab.id === activeTab ? 'booking-tab active' : 'booking-tab'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.tabLabel}
            </button>
          ))}
        </div>

        <div className="booking-panel" key={activeTab}>
          <h3>{currentContent.title}</h3>
          <p>{currentContent.description}</p>
          <Button variant="terracota" href={currentContent.ctaHref}>
            {currentContent.buttonText}
          </Button>
        </div>
      </div>
    </>
  )
}
