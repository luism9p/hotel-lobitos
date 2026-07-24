import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SectionTitle from '../ui/SectionTitle.jsx'
import Photo from '../ui/Photo.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * Nuestra Casa — horizontal scroll gallery.
 *
 * How it works:
 * 1. The outer `.hg-outer` wrapper is pinned to the viewport for the entire
 *    duration of the horizontal scroll (pin: true, pinSpacing: true so the
 *    page has enough height to accommodate the full travel distance).
 * 2. The `.hg-track` contains all cards laid out in a single horizontal row
 *    (white-space: nowrap / flex). GSAP animates its `x` from 0 to
 *    -(totalWidth - viewportWidth), translating the vertical scroll offset
 *    into horizontal movement.
 * 3. The section header (title + subtitle) sits ABOVE the pinned area so it
 *    scrolls past naturally before the pin activates.
 * 4. On mobile (<900px) the horizontal layout collapses to a standard
 *    vertical stack — no pin, no x-animation.
 *
 * Key layout rules (enforced in CSS):
 * - `.hg-outer` must have overflow: hidden so the translated track never
 *   shows a horizontal scrollbar.
 * - `.hg-track` must NOT have max-width constraints; it grows to fit all
 *   cards side by side.
 * - Each `.hg-card` has a fixed viewport-relative width (e.g. 65vw) so the
 *   travel distance is predictable.
 */
export default function HorizontalGallery({ title, sub, onVerde = false, items }) {
  const outerRef = useRef(null)
  const trackRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 901px)', () => {
        // Wait one frame so layout is fully committed before measuring
        const ctx = gsap.context(() => {
          const track = trackRef.current
          const outer = outerRef.current

          // Total horizontal travel = track width minus the visible viewport width
          const getDistance = () =>
            -(track.scrollWidth - outer.offsetWidth)

          const tween = gsap.to(track, {
            x: getDistance,
            ease: 'none', // linear mapping → 1px scroll = 1px slide
            scrollTrigger: {
              trigger: outer,
              start: 'top top',
              // end is dynamic: scroll distance == horizontal travel distance
              end: () => `+=${track.scrollWidth - outer.offsetWidth}`,
              scrub: 1.2,   // slight lag for cinematic feel (1.2s smoothing)
              pin: true,    // pin the outer wrapper
              pinSpacing: true, // add spacer so page has enough scroll room
              anticipatePin: 1,
              invalidateOnRefresh: true, // recalculate on resize
            },
          })

          // Per-card subtle scale reveal as cards enter the viewport
          const cards = track.querySelectorAll('.hg-card')
          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { scale: 0.92, opacity: 0.6 },
              {
                scale: 1,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: tween, // tie to horizontal scroll tween
                  start: 'left 80%',
                  end: 'left 30%',
                  scrub: true,
                },
              },
            )
          })
        })

        return () => ctx.revert()
      })

      // Mobile: standard vertical stack, no animation
      mm.add('(max-width: 900px)', () => {
        const cards = trackRef.current.querySelectorAll('.hg-card')
        gsap.set(cards, { opacity: 0, y: 24 })
        cards.forEach((card, i) => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            delay: i * 0.12,
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              once: true,
            },
          })
        })
      })
    },
    { scope: outerRef },
  )

  return (
    <div className="hg-section">
      {/* Header scrolls past naturally BEFORE the pin activates */}
      <div className="hg-header">
        <SectionTitle title={title} sub={sub} onVerde={onVerde} />
      </div>

      {/* This wrapper gets pinned by ScrollTrigger */}
      <div ref={outerRef} className="hg-outer">
        <div ref={trackRef} className="hg-track">
          {items.map((item, i) => (
            <div className="hg-card" key={item.image || item.placeholder || i}>
              <div className="hg-card-img">
                <Photo src={item.image} alt={item.alt} placeholder={item.placeholder} />
              </div>
              <div className="hg-card-meta">
                <span className="hg-card-num">{String(i + 1).padStart(2, '0')}</span>
                {item.caption && (
                  <p className="hg-card-caption">{item.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll-progress indicator */}
        <div className="hg-progress" aria-hidden="true">
          <div className="hg-progress-track">
            {items.map((_, i) => (
              <span className="hg-progress-dot" key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
