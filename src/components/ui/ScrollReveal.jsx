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
    const triggers = []
    const wordElements = el.querySelectorAll('.word')

    // Write every initial state up front (gsap.set, applied synchronously)
    // before any ScrollTrigger.create() runs its own layout read. Doing this
    // as three separate gsap.fromTo() calls interleaved read-after-write
    // three times in a row, which is what forces the synchronous reflow
    // Lighthouse flags — batching writes then reads avoids it.
    gsap.set(el, { transformOrigin: '0% 50%', rotate: baseRotation })
    gsap.set(wordElements, { opacity: baseOpacity, willChange: 'opacity' })
    if (enableBlur) {
      gsap.set(wordElements, { filter: `blur(${blurStrength}px)` })
    }

    const rotationTween = gsap.to(el, {
      ease: 'none',
      rotate: 0,
      scrollTrigger: {
        trigger: el,
        scroller,
        start: 'top bottom',
        end: rotationEnd,
        scrub: true,
      },
    })
    if (rotationTween.scrollTrigger) triggers.push(rotationTween.scrollTrigger)

    const opacityTween = gsap.to(wordElements, {
      ease: 'none',
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
        trigger: el,
        scroller,
        start: 'top bottom-=20%',
        end: wordAnimationEnd,
        scrub: true,
      },
    })
    if (opacityTween.scrollTrigger) triggers.push(opacityTween.scrollTrigger)

    let blurTween
    if (enableBlur) {
      blurTween = gsap.to(wordElements, {
        ease: 'none',
        filter: 'blur(0px)',
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true,
        },
      })
      if (blurTween.scrollTrigger) triggers.push(blurTween.scrollTrigger)
    }

    return () => {
      triggers.forEach((st) => st.kill())
      rotationTween.kill()
      opacityTween.kill()
      blurTween?.kill()
    }
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength])

  return (
    <Tag ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </Tag>
  )
}
