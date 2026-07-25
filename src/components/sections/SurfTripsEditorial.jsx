import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Button from '../ui/Button.jsx'
import Photo from '../ui/Photo.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * "Surf Trips & Yacht Tours" — sticky sidebar. Same pin technique as
 * StickyHistoria.jsx (proven elsewhere in this codebase): the left column
 * (title + intro + CTA) pins to the viewport top for exactly the scroll
 * duration of the right column — `end: 'bottom bottom'` releases the pin
 * the instant the section's own bottom edge (which, since pinSpacing:false
 * means the pinned column doesn't contribute to layout height, is really
 * just the right column's height) reaches the bottom of the viewport. No
 * manually-computed pixel offset to fall out of sync with the real DOM.
 *
 * Left column: title + intro ONLY — no per-category copy, so it reads the
 * same regardless of which card is currently passing by on the right.
 * Right column: one full-bleed-image card per category, stacked, each
 * fading/rising in as it enters (not tied to the pin itself).
 *
 * Desktop/mobile split is gsap.matchMedia, not a CSS breakpoint alone:
 * pinning never gets created at all under 901px, so there's no pinned
 * element to reconcile with the column stack collapsing to 1fr.
 */
export default function SurfTripsEditorial({ title, intro, categories, ctaLabel, ctaHref }) {
  const sectionRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // ── Desktop: pin the left column ─────────────────────────────────────
      mm.add('(min-width: 901px)', () => {
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: leftRef.current,
          pinSpacing: false,
          anticipatePin: 1,
        })

        const cards = rightRef.current.querySelectorAll('.trip-card')
        gsap.set(cards, { opacity: 0, y: 40 })
        cards.forEach((card, i) => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
            delay: i * 0.05,
          })
        })

        return () => st.kill()
      })

      // ── Mobile: no pin, standard stacked flow ─────────────────────────────
      mm.add('(max-width: 900px)', () => {
        const cards = rightRef.current.querySelectorAll('.trip-card')
        gsap.set(cards, { opacity: 0, y: 24 })
        cards.forEach((card, i) => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
            delay: i * 0.08,
          })
        })
      })

      // This section sits well below the fold (Hero + the board accordion's
      // large images/placeholders come first) — if any of that is still
      // settling its final layout when the pin ScrollTrigger above is
      // created, its start/end pixel positions get computed against a
      // shorter page and never get reconciled with the real one. Refresh
      // once more so they match final layout, same as TheatricalReveal.jsx.
      ScrollTrigger.refresh()

      // Web fonts (Playfair Display / Archivo, loaded via @import in
      // variables.css) can finish swapping in AFTER the refresh above —
      // a font-metric change on a text-heavy section like this one is
      // exactly the kind of thing that reflows total page height a beat
      // later, leaving the pin's start/end stuck at pre-swap positions.
      // Refresh again once fonts are actually settled.
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="trips-section">
      <div className="trips-inner">
        {/* ── Left: pinned title + intro ──────────────────────── */}
        <div ref={leftRef} className="trips-left">
          <h2 className="trips-title">{title}</h2>
          <p className="trips-intro">{intro}</p>
          {ctaLabel ? <Button href={ctaHref}>{ctaLabel}</Button> : null}
        </div>

        {/* ── Right: scrolling tour cards ─────────────────────── */}
        <div ref={rightRef} className="trips-right">
          {categories.map((cat) => (
            <div className="trip-card" key={cat.title}>
              <div className="trip-card-media">
                <Photo
                  src={cat.image}
                  alt={cat.imageAlt}
                  placeholder={cat.placeholder}
                  width={cat.imageWidth}
                  height={cat.imageHeight}
                  loading="lazy"
                />
              </div>
              <h3 className="trip-card-title">{cat.title}</h3>
              <p className="trip-card-text">{cat.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
