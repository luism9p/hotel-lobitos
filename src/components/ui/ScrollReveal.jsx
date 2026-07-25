import { useEffect, useRef, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import './ScrollReveal.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * React Bits' ScrollReveal, vendored with one adaptation: an `as` prop
 * (default 'h2', matching the original) for the outer container — the
 * vendored source hardcodes <h2><p>...</p></h2>, which is fine for a real
 * heading-length passage but wraps a plain paragraph in a heading tag it
 * isn't (see TextBlock.jsx, used here with as="div"). Animation logic is
 * unchanged; cleanup only kills this instance's own triggers instead of
 * every ScrollTrigger on the page (the vendored `ScrollTrigger.getAll()
 * .forEach(kill)` would tear down other components' triggers too, e.g.
 * the Hero's parallax or another ScrollReveal/ScrollFloat instance).
 */
export default function ScrollReveal({
  children,
  as = 'h2',
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
}) {
  const containerRef = useRef(null)
  const Tag = as

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : ''
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word
      return (
        // eslint-disable-next-line react/no-array-index-key
        <span className="word" key={index}>
          {word}
        </span>
      )
    })
  }, [children])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window
    const wordElements = el.querySelectorAll('.word')
    const mm = gsap.matchMedia()

    // Desktop: the full effect — rotation + per-word opacity + blur, all
    // scrub-tied to scroll (recomputed every scroll frame). Writes are
    // batched via gsap.set() before any ScrollTrigger.create() read, so
    // the three tweens don't interleave read/write and force reflow.
    mm.add('(min-width: 769px)', () => {
      gsap.set(el, { transformOrigin: '0% 50%', rotate: baseRotation })
      gsap.set(wordElements, { opacity: baseOpacity, willChange: 'opacity' })
      if (enableBlur) {
        gsap.set(wordElements, { filter: `blur(${blurStrength}px)` })
      }

      const rotationTween = gsap.to(el, {
        ease: 'none',
        rotate: 0,
        scrollTrigger: { trigger: el, scroller, start: 'top bottom', end: rotationEnd, scrub: true },
      })

      const opacityTween = gsap.to(wordElements, {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: { trigger: el, scroller, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true },
      })

      let blurTween
      if (enableBlur) {
        blurTween = gsap.to(wordElements, {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: { trigger: el, scroller, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true },
        })
      }

      return () => {
        rotationTween.kill()
        opacityTween.kill()
        blurTween?.kill()
      }
    })

    // Mobile: no rotation, no blur, no scrub — scrub recalculates on every
    // scroll frame and blur is an expensive paint/composite, exactly what
    // chokes the main thread on phones. A single once-off opacity fade
    // covers the whole "reveals as it enters" intent at near-zero cost.
    mm.add('(max-width: 768px)', () => {
      gsap.set(wordElements, { opacity: 0 })
      const tween = gsap.to(wordElements, {
        opacity: 1,
        duration: 0.5,
        ease: 'power1.out',
        scrollTrigger: { trigger: el, scroller, start: 'top 88%', once: true },
      })

      return () => tween.kill()
    })

    return () => mm.revert()
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength])

  return (
    <Tag ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </Tag>
  )
}
