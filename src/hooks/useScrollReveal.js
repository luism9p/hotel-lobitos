import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fades + rises every `.reveal` element inside containerRef into view as it
 * crosses the viewport. Elements sharing the nearest [data-reveal-group]
 * ancestor get an incremental delay (0, 130, 260, capped at 390ms) so paired
 * text/image blocks never animate in perfect sync — same grouping logic the
 * static build used with IntersectionObserver, now GSAP/ScrollTrigger-driven.
 *
 * Pass a dependency array (e.g. [] per page mount) — the hook re-scans the
 * container and tears down its own ScrollTriggers on cleanup, which matters
 * in a SPA where pages mount/unmount on route change.
 */
export default function useScrollReveal(containerRef, deps = []) {
  useLayoutEffect(() => {
    const root = containerRef?.current
    if (!root) return undefined

    const items = Array.from(root.querySelectorAll('.reveal'))
    if (!items.length) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const groups = new Map()
    items.forEach((el) => {
      const group = el.closest('[data-reveal-group]') || root
      if (!groups.has(group)) groups.set(group, [])
      groups.get(group).push(el)
    })

    const triggers = []

    if (reduceMotion) {
      gsap.set(items, { opacity: 1, y: 0, clearProps: 'transform' })
    } else {
      groups.forEach((els) => {
        els.forEach((el, i) => {
          const delay = Math.min(i, 3) * 0.13
          gsap.set(el, { opacity: 0, y: 18 })
          const tween = gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          })
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
        })
      })
      ScrollTrigger.refresh()
    }

    return () => {
      triggers.forEach((st) => st.kill())
      gsap.killTweensOf(items)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
