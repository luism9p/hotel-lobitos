import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import SectionTitle from '../ui/SectionTitle.jsx'
import Photo from '../ui/Photo.jsx'

/**
 * "Servicios & Comodidades" — interactive full-width list. Each row shows
 * a large title + short description; a floating image (fixed, hidden by
 * default) fades in and tracks the cursor while that row is hovered.
 *
 * Cursor-follow uses gsap.quickTo — one x/y setter pair PER IMAGE, built
 * once on mount — instead of animating x/y directly on every mousemove.
 * quickTo precompiles an optimized tween setter, so the high-frequency
 * stream of pointer coordinates never spins up a fresh tween (and the GC
 * churn that comes with it); it just nudges the existing one.
 *
 * The hover/follow wiring only activates for genuine pointing devices
 * (hover: hover) and (pointer: fine) — not a width breakpoint, since a
 * touchscreen laptop at desktop width still has no meaningful "hover".
 * Rows themselves (title, text, entrance reveal) work identically
 * everywhere; only the floating-image behaviour is gated.
 *
 * contextSafe wraps the row handlers so their imperative gsap.to/set calls
 * are tracked by the same scoped context useGSAP creates — without it,
 * tweens started from a mouse event (as opposed to inside the setup
 * callback) wouldn't be cleaned up on route change/unmount.
 */
export default function ServicesGrid({ title, sub, onVerde = false, items }) {
  const sectionRef = useRef(null)
  const imageRefs = useRef([])
  const quickSetters = useRef([])
  const reduceMotionRef = useRef(false)

  const { contextSafe } = useGSAP(
    () => {
      reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Centering baseline (image follows the cursor from its own middle,
      // not its top-left corner) — set once via GSAP so it composes
      // correctly with the x/y translations quickTo drives later; mixing
      // a plain CSS transform with GSAP-driven x/y on the same element is
      // what causes them to fight/overwrite each other.
      gsap.set(imageRefs.current, { xPercent: -50, yPercent: -50 })

      const mm = gsap.matchMedia()
      mm.add('(hover: hover) and (pointer: fine)', () => {
        quickSetters.current = imageRefs.current.map((el) =>
          el
            ? {
                x: gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3' }),
                y: gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3' }),
              }
            : null,
        )
      })
    },
    { scope: sectionRef },
  )

  const showImage = contextSafe((index, event) => {
    const el = imageRefs.current[index]
    if (!el) return
    // Snap instantly to the entry point so the image doesn't fly in from
    // wherever it was left after a previous hover elsewhere in the list.
    gsap.set(el, { x: event.clientX, y: event.clientY })
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration: reduceMotionRef.current ? 0.2 : 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  })

  const moveImage = contextSafe((index, event) => {
    if (reduceMotionRef.current) return
    const setters = quickSetters.current[index]
    if (!setters) return
    setters.x(event.clientX)
    setters.y(event.clientY)
  })

  const hideImage = contextSafe((index) => {
    const el = imageRefs.current[index]
    if (!el) return
    gsap.to(el, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
  })

  return (
    <section ref={sectionRef} className="services-list-section">
      {/* No paddingLeft/Right:0 override here (unlike BoardAccordion's and
          BookingWidget's .container usages in SurfAcademy.jsx) — THOSE sit
          inside an outer <section className="section-pad"> that already
          supplies 44px/24px horizontal padding, so zeroing .container's own
          avoids doubling it up. This section has no such outer wrapper —
          .container's default padding (44px desktop / 24px mobile, see
          global.css) is the ONLY horizontal padding this content gets. */}
      <div className="container" style={{ maxWidth: 1440 }}>
        <SectionTitle title={title} sub={sub} onVerde={onVerde} />
      </div>

      <div className="services-list container" style={{ maxWidth: 1440 }} data-reveal-group>
        {items.map((item, i) => (
          <div
            key={item.title}
            className="service-row reveal"
            onMouseEnter={(e) => showImage(i, e)}
            onMouseMove={(e) => moveImage(i, e)}
            onMouseLeave={() => hideImage(i)}
          >
            <span className="service-row-index">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="service-row-title">{item.title}</h3>
            <p className="service-row-text">{item.text}</p>
            <span className="service-row-arrow" aria-hidden="true">→</span>
          </div>
        ))}
      </div>

      {/* Fixed floating layer, one image per row, hidden until hovered.
          Lives outside .services-list on purpose: position:fixed inside a
          transformed/pinned ancestor (there are GSAP pins elsewhere on this
          page) can get trapped as if it were absolute — this section has
          no such ancestor, but keeping the layer as a direct section child
          keeps that assumption easy to verify at a glance. */}
      <div className="service-image-layer" aria-hidden="true">
        {items.map((item, i) => (
          <div
            key={item.title}
            ref={(el) => {
              imageRefs.current[i] = el
            }}
            className="service-image"
          >
            <Photo src={item.image} alt="" placeholder={item.placeholder} />
          </div>
        ))}
      </div>
    </section>
  )
}
