import { motion } from 'motion/react'
import { useEffect, useRef, useState, useMemo } from 'react'

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))])

  const keyframes = {}
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])]
  })
  return keyframes
}

/**
 * React Bits' BlurText, vendored as-is — only the Tailwind utility classes
 * on the root <p> / each <motion.span> were swapped for the plain
 * `.blur-text` / `.blur-text-segment` classes (see global.css), since this
 * project has no Tailwind. Animation/timing logic is unchanged.
 */
export default function BlurText({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  // Not a GSAP hook (this is Framer Motion), so no gsap.matchMedia() here —
  // same intent as the GSAP components though: filter:blur is a real
  // paint/composite cost, skipped on mobile in favor of a plain fade.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!ref.current) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(ref.current)
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  // No `opacity` key in either variant, on purpose: Framer Motion's `initial`
  // prop is applied as an inline style on the very first paint, so an
  // opacity:0 starting keyframe means this text is literally invisible
  // until this component's JS runs — for above-the-fold text (the Hero
  // wordmark/description use this component) that's exactly the "hidden
  // initial content" pattern Lighthouse penalizes. The entrance motion is
  // carried entirely by `y` (+ `filter` on desktop) with the text itself
  // visible from the first frame.
  const defaultFrom = useMemo(() => {
    const y = direction === 'top' ? -50 : 50
    return isMobile ? { y } : { filter: 'blur(10px)', y }
  }, [direction, isMobile])

  const defaultTo = useMemo(() => {
    const midY = direction === 'top' ? 5 : -5
    return isMobile
      ? [{ y: midY }, { y: 0 }]
      : [
          { filter: 'blur(5px)', y: midY },
          { filter: 'blur(0px)', y: 0 },
        ]
  }, [direction, isMobile])

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo

  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)))

  return (
    <p ref={ref} className={`blur-text ${className}`.trim()}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)

        const spanTransition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
        }
        spanTransition.ease = easing

        return (
          <motion.span
            className="blur-text-segment"
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          >
            {segment === ' ' ? ' ' : segment}
            {animateBy === 'words' && index < elements.length - 1 && ' '}
          </motion.span>
        )
      })}
    </p>
  )
}
