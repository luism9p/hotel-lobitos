import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Button from '../ui/Button.jsx'
import Photo from '../ui/Photo.jsx'

gsap.registerPlugin(ScrollTrigger)

const MARQUEE_REPEATS = 3 // per half — see the xPercent:-50 loop comment below

/**
 * Generic CTA strip reused for "CTA intermedio", "CTA final" and the
 * WhatsApp banner on Surf Academy — title + optional copy/phone line + a
 * button (optionally with a leading icon, e.g. the WhatsApp glyph).
 *
 * Two opt-in props each turn ONE specific instance into a different
 * treatment — the rest of CTABanner's call sites stay exactly as they
 * were (plain solid color, `.reveal` fade-in):
 *
 * `immersive` — full-bleed parallax (background photo + terracota overlay
 * + scroll parallax + mask text reveal). Used by "Tu Refugio en el Mar
 * de Lobitos".
 *
 * `marquee` — infinite horizontal scrolling typographic band with the
 * CTA button centered on top, hover-to-slow. Used by "Reserva tu
 * Estancia" (the pre-footer CTA).
 *
 * The phone line is a clickable wa.me link (same href as the button) —
 * reduces friction for anyone who reads the number but ignores buttons.
 */
export default function CTABanner({
  variant = 'on-terracota',
  title,
  copy,
  phone,
  ctaLabel,
  ctaHref,
  icon,
  buttonVariant = 'outline-crema',
  immersive = false,
  image,
  mobileImage,
  imageAlt = '',
  imageWidth,
  imageHeight,
  // Opt-in per call site, not a blanket "immersive is always LCP" default —
  // only "Tu Refugio en el Mar de Lobitos" (Home) actually is; a future
  // immersive CTA further down a page should still lazy-load normally.
  imagePriority = false,
  placeholder,
  marquee = false,
  marqueeText,
}) {
  const sectionRef = useRef(null)
  const mediaRef = useRef(null)
  const trackRef = useRef(null)
  const tweenRef = useRef(null)

  // Read once per render (no SSR here), not via useEffect — a marquee is
  // exactly the kind of continuous, never-ending motion
  // prefers-reduced-motion exists for, so this also decides whether the
  // JSX renders the looping duplicated track at all or a plain heading.
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (immersive && sectionRef.current) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        // ── Parallax: background drifts on Y for as long as the section
        // is anywhere in the viewport. .cta-block-media is overscanned
        // -70px at the top (see CSS) specifically to cover this 0→60px
        // downward travel with zero gap at the top edge.
        // Scrub-tied parallax recomputes every scroll frame — real
        // main-thread cost — so it's never created below 769px, not just
        // visually suppressed.
        if (mediaRef.current && !reduce) {
          gsap.matchMedia().add('(min-width: 769px)', () => {
            gsap.to(mediaRef.current, {
              y: 60,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            })
          })
        }

        // ── Text reveal: each masked element (title, copy) rises out
        // from under its own overflow:hidden wrapper as the section
        // scrolls in.
        const revealEls = sectionRef.current.querySelectorAll('.cta-reveal-el')
        if (revealEls.length) {
          if (reduce) {
            gsap.set(revealEls, { yPercent: 0 })
          } else {
            gsap.set(revealEls, { yPercent: 110 })
            gsap.to(revealEls, {
              yPercent: 0,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.1,
              scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
            })
          }
        }
      }

      if (marquee && trackRef.current && !reduceMotion) {
        // xPercent:-50 (not a pixel value) — the track holds exactly TWO
        // identical copies of the repeated phrase, so shifting it left by
        // half of its OWN total width moves precisely one copy's worth,
        // landing on pixel-identical content to where it started. The
        // tween then jumps back to xPercent:0 and repeats — invisible
        // seam, regardless of text length, font, or viewport width.
        tweenRef.current = gsap.to(trackRef.current, {
          xPercent: -50,
          duration: 26,
          repeat: -1,
          ease: 'none',
        })
      }
    },
    { scope: sectionRef, dependencies: [immersive, marquee] },
  )

  const handleMarqueeEnter = () => {
    if (!tweenRef.current) return
    gsap.to(tweenRef.current, { timeScale: 0.22, duration: 0.6, ease: 'power2.out', overwrite: true })
  }

  const handleMarqueeLeave = () => {
    if (!tweenRef.current) return
    gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6, ease: 'power2.out', overwrite: true })
  }

  if (marquee) {
    const phrase = `${marqueeText || title} • Hotel Lobitos • `.toUpperCase()
    const half = Array.from({ length: MARQUEE_REPEATS }, () => phrase).join('')

    return (
      <section
        ref={sectionRef}
        className={`cta-block cta-block-marquee ${variant}`}
        onMouseEnter={handleMarqueeEnter}
        onMouseLeave={handleMarqueeLeave}
      >
        {/* Decorative — the real heading text is the sr-only h2 below, so
            AT doesn't hear the phrase repeated 6 times. */}
        <div className="marquee-viewport" aria-hidden="true">
          {reduceMotion ? (
            <div className="marquee-track marquee-track-static">
              <span className="marquee-text">{phrase}</span>
            </div>
          ) : (
            <div className="marquee-track" ref={trackRef}>
              <span className="marquee-text">{half}</span>
              <span className="marquee-text">{half}</span>
            </div>
          )}
        </div>

        <h2 className="sr-only">{title}</h2>

        <div className="marquee-cta">
          <Button variant="terracota" href={ctaHref} icon={icon}>
            {ctaLabel}
          </Button>
        </div>
      </section>
    )
  }

  if (immersive) {
    return (
      <section ref={sectionRef} className={`cta-block ${variant} cta-block-immersive`}>
        <div className="cta-block-media-clip">
          <div className="cta-block-media" ref={mediaRef}>
            <Photo
              src={image}
              mobileSrc={mobileImage}
              alt={imageAlt}
              placeholder={placeholder}
              width={imageWidth}
              height={imageHeight}
              loading={imagePriority ? 'eager' : 'lazy'}
              fetchPriority={imagePriority ? 'high' : undefined}
            />
          </div>
        </div>
        <div className="cta-block-overlay" />

        <div className="cta-block-inner">
          <div>
            <div className="cta-reveal-mask">
              <h2 className="cta-reveal-el">{title}</h2>
            </div>
            {copy ? (
              <div className="cta-reveal-mask">
                <p className="cta-copy cta-reveal-el">{copy}</p>
              </div>
            ) : null}
            {phone ? (
              <p className="cta-phone">
                <a href={ctaHref} target="_blank" rel="noopener">{phone}</a>
              </p>
            ) : null}
          </div>
          <Button variant={buttonVariant} href={ctaHref} icon={icon}>
            {ctaLabel}
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className={`cta-block ${variant}`}>
      <div className="cta-block-inner" data-reveal-group>
        <div className="reveal">
          <h2>{title}</h2>
          {copy ? <p className="cta-copy">{copy}</p> : null}
          {phone ? (
            <p className="cta-phone">
              <a href={ctaHref} target="_blank" rel="noopener">{phone}</a>
            </p>
          ) : null}
        </div>
        <Button variant={buttonVariant} href={ctaHref} icon={icon} className="reveal">
          {ctaLabel}
        </Button>
      </div>
    </section>
  )
}
