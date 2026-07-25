import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

// react-day-picker (JS + its stylesheet) is only fetched once the user
// actually opens the calendar (see `open`, guarding the popover below) —
// not on initial page load, where its DOM would otherwise sit hidden but
// its JS would still have shipped and executed on the main thread for
// zero immediate benefit.
const DayPicker = lazy(async () => {
  await import('react-day-picker/style.css')
  const mod = await import('react-day-picker')
  return { default: mod.DayPicker }
})

function toDateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function toISODate(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function fromISODate(value) {
  if (!value) return undefined
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDisplay(value) {
  if (!value) return ''
  const [y, m, d] = value.split('-')
  return `${d}/${m}/${y}`
}

const POPOVER_MARGIN = 12
const POPOVER_FALLBACK_HEIGHT = 400
const POPOVER_FALLBACK_WIDTH = 320
const POPOVER_MIN_HEIGHT = 240
// Fixed nav header height — space "above" the trigger isn't usable up to
// the very top of the viewport, or the calendar renders under the logo.
const NAV_CLEARANCE = 84

/**
 * Replaces the two native <input type="date"> fields with a single range
 * calendar (react-day-picker, mode="range") — check-in and check-out are
 * picked in one flow, and dates before check-in (or before today) are
 * disabled rather than just "resetting" the range on an out-of-order click.
 *
 * Reports back plain 'YYYY-MM-DD' strings via onChange, same shape the
 * native inputs produced — AvailabilityWidget's validation/WhatsApp message
 * logic downstream never has to know a calendar library is involved.
 *
 * Positioning is measured manually (no floating-ui dependency): on open,
 * and on resize/scroll while open, it re-checks available space to flip
 * above/below the trigger and clamps horizontally so it never renders off
 * the edge of the viewport.
 */
export default function DateRangePicker({ checkIn, checkOut, onChange }) {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState('down')
  const [popoverLeft, setPopoverLeft] = useState(0)
  const [popoverMaxHeight, setPopoverMaxHeight] = useState(null)
  const groupRef = useRef(null)
  const popoverRef = useRef(null)

  const range = { from: fromISODate(checkIn), to: fromISODate(checkOut) }
  const today = toDateOnly(new Date())

  const reposition = useCallback(() => {
    const trigger = groupRef.current
    if (!trigger) return
    const triggerRect = trigger.getBoundingClientRect()
    const popoverRect = popoverRef.current?.getBoundingClientRect()
    const popoverHeight = popoverRect?.height || POPOVER_FALLBACK_HEIGHT
    const popoverWidth = popoverRect?.width || POPOVER_FALLBACK_WIDTH

    const spaceBelow = window.innerHeight - triggerRect.bottom
    const spaceAbove = triggerRect.top - NAV_CLEARANCE
    const fitsBelow = spaceBelow >= popoverHeight + POPOVER_MARGIN
    const fitsAbove = spaceAbove >= popoverHeight + POPOVER_MARGIN
    // Prefer whichever side actually fits; if NEITHER does (a short
    // viewport + a 2-month calendar), fall back to whichever has more
    // room — max-height + overflow-y on the popover itself is the real
    // safety net for that case, this just picks the less-cramped side.
    let next = 'down'
    if (!fitsBelow && fitsAbove) next = 'up'
    else if (!fitsBelow && !fitsAbove && spaceAbove > spaceBelow) next = 'up'
    setPlacement(next)

    // The CSS max-height:calc(100vh - Npx) fallback isn't enough on its
    // own — the trigger sits mid-viewport, not flush against an edge, so
    // "almost the full viewport tall" can still overflow past whichever
    // edge it's anchored from. Cap it to what's ACTUALLY available in the
    // chosen direction instead.
    const availableSpace = (next === 'down' ? spaceBelow : spaceAbove) - POPOVER_MARGIN * 2
    setPopoverMaxHeight(Math.max(POPOVER_MIN_HEIGHT, availableSpace))

    const maxLeft = window.innerWidth - popoverWidth - POPOVER_MARGIN
    const clampedLeft = Math.max(POPOVER_MARGIN, Math.min(triggerRect.left, maxLeft))
    setPopoverLeft(clampedLeft - triggerRect.left)
  }, [])

  useLayoutEffect(() => {
    if (!open) return undefined
    reposition()
    // A second pass once the popover has actually rendered/measured itself.
    const raf = requestAnimationFrame(reposition)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open, reposition])

  useEffect(() => {
    if (!open) return undefined
    const handlePointerDown = (event) => {
      if (groupRef.current && !groupRef.current.contains(event.target)) setOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleSelect = (nextRange) => {
    const from = nextRange?.from
    const to = nextRange?.to
    onChange({ checkIn: toISODate(from), checkOut: toISODate(to) })
    if (from && to) setOpen(false)
  }

  const isDisabledDay = (date) => {
    const day = toDateOnly(date)
    if (day < today) return true
    if (range.from && !range.to && day <= toDateOnly(range.from)) return true
    return false
  }

  return (
    <div className="aw-daterange" ref={groupRef}>
      <button
        type="button"
        className="aw-field aw-daterange-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="aw-label">Check-in</span>
        <span className={`aw-input aw-daterange-value${checkIn ? '' : ' is-empty'}`}>
          {checkIn ? formatDisplay(checkIn) : 'dd/mm/aaaa'}
        </span>
      </button>
      <button
        type="button"
        className="aw-field aw-daterange-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="aw-label">Check-out</span>
        <span className={`aw-input aw-daterange-value${checkOut ? '' : ' is-empty'}`}>
          {checkOut ? formatDisplay(checkOut) : 'dd/mm/aaaa'}
        </span>
      </button>

      {/* data-lenis-prevent lives ONLY on the popover: it's the one element
          with real internal scroll (overflow-y on short viewports), and
          without it the wheel would scroll the page under the open
          calendar. The bar/form itself must NOT have it — it has no
          internal scroll, and preventing there made page scrolling stutter
          whenever the cursor passed over the widget. */}
      {open ? (
        <div
          ref={popoverRef}
          className={`aw-calendar-popover aw-calendar-popover-${placement}`}
          style={{ left: `${popoverLeft}px`, maxHeight: popoverMaxHeight ? `${popoverMaxHeight}px` : undefined }}
          role="dialog"
          aria-label="Selecciona check-in y check-out"
          data-lenis-prevent
        >
          <Suspense fallback={<div className="aw-calendar-loading">Cargando calendario…</div>}>
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleSelect}
              disabled={isDisabledDay}
              defaultMonth={range.from || today}
              numberOfMonths={2}
              weekStartsOn={1}
              min={1}
            />
          </Suspense>
        </div>
      ) : null}
    </div>
  )
}
