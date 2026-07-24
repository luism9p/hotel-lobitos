import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import ScrollReveal from '../ui/ScrollReveal.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * Nuestra Historia — sticky split layout.
 *
 * Left column: giant display title pinned to the viewport top while the
 * right column scrolls. The pin is released exactly when the right column's
 * last paragraph exits the bottom of the viewport (end: "bottom bottom").
 *
 * Right column: eyebrow + three text blocks (intro paragraph + the two
 * supporting blocks from TextBlockPair) that flow up naturally. Each block
 * fades/rises in via a lightweight GSAP ScrollTrigger so the content feels
 * alive, not static.
 *
 * Architecture notes:
 * - useGSAP scopes all context to `sectionRef` and auto-reverts on unmount,
 *   so there are zero dangling ScrollTriggers on route change.
 * - The pin spacer GSAP injects is transparent and inherits the section's
 *   background, so there is no colour flash as pinning begins.
 * - On mobile (<900px) the sticky layout collapses to a standard stacked
 *   flow — pin is disabled and the title reverts to normal document flow.
 */
export default function StickyHistoria({
  id,
  eyebrow = 'Nuestra Historia',
  title = 'Experiencia frente al mar',
  paragraphs = [],
  tone = 'verde',
}) {
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
          end: () => `+=${rightRef.current.offsetHeight - window.innerHeight * 0.6}`,
          pin: leftRef.current,
          pinSpacing: false,
          anticipatePin: 1,
        })

        // Stagger-reveal each right-column block as it enters
        const blocks = rightRef.current.querySelectorAll('.sh-block')
        gsap.set(blocks, { opacity: 0, y: 32 })
        blocks.forEach((block, i) => {
          gsap.to(block, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 82%',
              once: true,
            },
            delay: i * 0.08,
          })
        })

        return () => st.kill()
      })

      // ── Mobile: no pin, standard stacked flow ─────────────────────────────
      mm.add('(max-width: 900px)', () => {
        const blocks = rightRef.current.querySelectorAll('.sh-block')
        gsap.set(blocks, { opacity: 0, y: 20 })
        blocks.forEach((block, i) => {
          gsap.to(block, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 88%',
              once: true,
            },
            delay: i * 0.1,
          })
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`sh-section on-${tone}`}
    >
      {/* .sh-inner carries the max-width + grid — section itself is full-bleed */}
      <div className="sh-inner">
        {/* ── Left: giant sticky title ─────────────────────────── */}
        <div ref={leftRef} className="sh-left">
          <span className="sh-eyebrow eyebrow">{eyebrow}</span>
          <h2 className="sh-title">{title}</h2>

          {/* Vertical rule accent */}
          <div className="sh-rule" aria-hidden="true" />
        </div>

        {/* ── Right: flowing content blocks ────────────────────── */}
        <div ref={rightRef} className="sh-right">
          {paragraphs.map((p, i) => (
            <div className="sh-block" key={i}>
              {p.eyebrow && (
                <span className="sh-block-eyebrow eyebrow">{p.eyebrow}</span>
              )}
              {p.animatedText ? (
                <ScrollReveal
                  as="div"
                  containerClassName="sh-block-scrollreveal"
                  textClassName="sh-block-scrollreveal-text"
                  baseOpacity={0.2}
                  baseRotation={2}
                  blurStrength={5}
                >
                  {p.text}
                </ScrollReveal>
              ) : (
                <p className="sh-block-text">{p.text}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
