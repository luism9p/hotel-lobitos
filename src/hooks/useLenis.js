import { createContext, createElement, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext(null)

// t===1 guard avoids floating-point noise right at the end of the curve
// settling a hair short of 1.
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - 2 ** (-10 * t)
}

/**
 * Mounts ONE Lenis instance for the app's whole lifetime — wrap this around
 * the top-level layout (see App.jsx), not per-page, or every route change
 * would spin up a duplicate smooth-scroll loop. Descendants read the
 * instance via useLenis() (e.g. Navbar pausing it while the nav panel is
 * open, or ScrollToTop resetting position on route change).
 *
 * Ticks via gsap.ticker instead of Lenis's own rAF loop (autoRaf defaults
 * to false) and forwards every Lenis 'scroll' tick into
 * ScrollTrigger.update(), so parallax/reveals always track the smoothed
 * position instead of lagging a frame behind it.
 */
export function LenisProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    // anchors: true — hash links ("Descubre el hotel" → #historia) would
    // otherwise jump natively and fight Lenis's own lerp loop; this makes
    // Lenis smooth-scroll them itself, respecting each target's
    // scroll-margin-top (nav clearance).
    const lenis = new Lenis({
      duration: 1.1,
      easing: easeOutExpo,
      smoothWheel: true,
      anchors: true,
    })
    lenisRef.current = lenis

    const onTick = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    const offScroll = lenis.on('scroll', ScrollTrigger.update)

    return () => {
      offScroll?.()
      gsap.ticker.remove(onTick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // createElement, not JSX — this file is .js (per the hook naming convention),
  // and the build only parses JSX syntax in .jsx files.
  return createElement(LenisContext.Provider, { value: lenisRef }, children)
}

/** Returns a ref whose `.current` is the live Lenis instance, or null before
 * mount — always read it as `lenisRef?.current`. */
export function useLenis() {
  return useContext(LenisContext)
}
