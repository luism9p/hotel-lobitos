import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Photo from '../ui/Photo.jsx'
import Button from '../ui/Button.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * Full-width alternating feature sections (Desayuno / Relajación on Hotel
 * Lobitos). DOM/CSS is the untouched Flexbox baseline — this hook only
 * ever writes clip-path/transform/opacity via GSAP, never anything that
 * affects box size or layout, so the Flexbox structure can't be disturbed.
 *
 * Scope: `listRef` is on `.feature-list`, the single parent wrapping every
 * `.feature-section` — passed as `scope` to useGSAP so all selectors below
 * resolve inside it and everything it creates auto-reverts together on
 * unmount/route change.
 *
 * `dependencies: [items.length]`, not `[items]` — `items` is a fresh array
 * literal on every render of the parent page, so depending on the array
 * itself made useGSAP revert and rebuild every ScrollTrigger on any
 * unrelated re-render of the page (a real bug: mid-scroll, that tears down
 * the trigger and rebuilds it against a stale scroll position, which is
 * exactly what "the animation doesn't run" looks like from the outside).
 * The section count is what actually needs to be watched.
 */
export default function TheatricalReveal({ items }) {
  const listRef = useRef(null)

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const sections = gsap.utils.toArray('.feature-section', listRef.current)

      sections.forEach((section) => {
        const imgWrap = section.querySelector('.feature-img-wrap')
        const img = imgWrap.querySelector('img, .img-placeholder')
        const textEls = section.querySelector('.feature-text-wrap').children

        if (reduceMotion) {
          gsap.set(imgWrap, { clipPath: 'inset(0% 0% 0% 0%)' })
          gsap.set(img, { scale: 1 })
          gsap.set(textEls, { opacity: 1, y: 0 })
          return
        }

        gsap.set(imgWrap, { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set(img, { scale: 1.2 })
        gsap.set(textEls, { opacity: 0, y: 40 })

        gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        })
          .to(imgWrap, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.out' })
          .to(img, { scale: 1, duration: 1.2, ease: 'power3.out' }, '<')
          .to(textEls, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15 }, '-=0.5')
      })

      // Async image loads (or anything above these sections settling late)
      // can shift where "top 75%" actually falls after the triggers above
      // were first computed — refresh once more so positions match final
      // layout, same defensive call useScrollReveal.js already makes.
      ScrollTrigger.refresh()
    },
    { scope: listRef, dependencies: [items.length] },
  )

  return (
    <div className="feature-list" ref={listRef}>
      {items.map((item, i) => (
        <section key={item.title} className={`feature-section${i % 2 === 1 ? ' feature-reverse' : ''}`}>
          <div className="feature-img-wrap">
            <Photo
              src={item.image}
              alt={item.imageAlt}
              placeholder={item.placeholder}
              width={item.imageWidth}
              height={item.imageHeight}
              loading="lazy"
            />
          </div>
          <div className="feature-text-wrap">
            {item.eyebrow ? <span className="feature-eyebrow eyebrow">{item.eyebrow}</span> : null}
            <h3 className="feature-title">{item.title}</h3>
            <p className="feature-text">{item.text}</p>
            {item.ctaLabel ? (
              <Button variant="terracota" href={item.ctaHref} className="feature-cta">
                {item.ctaLabel}
              </Button>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  )
}
