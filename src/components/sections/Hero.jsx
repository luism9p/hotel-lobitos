import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Photo from '../ui/Photo.jsx'
import Button from '../ui/Button.jsx'
import BlurText from '../ui/BlurText.jsx'
import AvailabilityWidget from './AvailabilityWidget.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * variant="centered": Home's full-bleed photo hero — centered wordmark over
 * a verde-tinted overlay, with the availability widget floating on the
 * photo's bottom edge. Wordmark + subhead blur into focus on load (React
 * Bits' BlurText, see components/ui/BlurText.jsx); the photo drifts slower
 * than scroll (parallax).
 * variant="page": the smaller headline hero used on Hotel Lobitos / Surf
 * Academy — plain .reveal fade+rise, no letter-split, no parallax.
 */
export default function Hero({
  variant = 'page',
  eyebrow,
  titleLines,
  title,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  placeholder,
  description,
  cta,
}) {
  const heroRef = useRef(null)
  const photoRef = useRef(null)

  useLayoutEffect(() => {
    if (variant !== 'centered') return undefined

    const ctx = gsap.context(() => {
      if (!photoRef.current) return

      const mm = gsap.matchMedia()

      // Continuous scrub parallax is real per-frame main-thread work while
      // scrolling — on mobile that's exactly what chokes the thread, so it
      // never gets created there at all (not just visually disabled).
      mm.add('(min-width: 769px)', () => {
        gsap.to(photoRef.current, {
          y: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }, heroRef)

    return () => ctx.revert()
  }, [variant])

  if (variant === 'centered') {
    return (
      <section className="hero-full" ref={heroRef}>
        {/* .hero-full-media clips the bg's parallax overdraw (inset -3%) —
            the section itself can't be overflow:hidden or it would clip the
            floating availability widget / calendar popover. */}
        <div className="hero-full-media">
          <div className="hero-full-bg" ref={photoRef}>
            {/* This is the page's actual LCP element (full-bleed hero photo,
                largest above-fold content) — eager + fetchPriority="high"
                pushes it to the front of the network queue instead of
                competing with everything else the browser discovers. */}
            <Photo
              src={image}
              alt={imageAlt}
              placeholder={placeholder}
              width={imageWidth}
              height={imageHeight}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="hero-full-overlay" />
        </div>
        <div className="hero-full-content" data-reveal-group>
          <span className="eyebrow reveal">{eyebrow}</span>
          <div className="hero-full-title" role="heading" aria-level="1" aria-label={titleLines.join(' ')}>
            <div aria-hidden="true">
              {titleLines.map((line) => (
                <BlurText
                  key={line}
                  text={line}
                  animateBy="letters"
                  direction="bottom"
                  delay={40}
                  stepDuration={0.4}
                  className="wm-line"
                />
              ))}
            </div>
          </div>
          <BlurText
            text={description}
            animateBy="words"
            direction="bottom"
            delay={60}
            className="hero-full-desc"
          />
          {cta ? (
            <Button href={cta.href} arrow={cta.arrow} className="reveal">
              {cta.label}
            </Button>
          ) : null}
        </div>
        <AvailabilityWidget />
      </section>
    )
  }

  return (
    <section className="page-hero">
      <div className="page-hero-inner" data-reveal-group>
        <div className="page-hero-photo reveal">
          <Photo src={image} alt={imageAlt} placeholder={placeholder} width={imageWidth} height={imageHeight} />
        </div>
        <span className="eyebrow reveal">{eyebrow}</span>
        <h1 className="reveal">{title}</h1>
        <div className="page-hero-copy reveal">
          <p>{description}</p>
          {cta ? (
            <Button href={cta.href} arrow={cta.arrow}>
              {cta.label}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
