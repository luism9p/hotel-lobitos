import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const MENU_MARGIN = 12
// Same fixed nav clearance DateRangePicker.jsx uses — space "above" the
// trigger isn't usable up to the very top of the viewport.
const NAV_CLEARANCE = 84
const MENU_FALLBACK_HEIGHT = 200

/**
 * Custom dropdown replacing the native <select> for "Habitaciones" and
 * "Huéspedes" — a native select's popup can't be styled, which broke the
 * premium look established by DateRangePicker's calendar popover. Reuses
 * that popover's visual language (crema bg, subtle border, terracota
 * hover) and the same click-outside/Escape-to-close technique.
 *
 * `value`/`onChange` are controlled by the parent (AvailabilityWidget),
 * matching how DateRangePicker itself is wired — only `isOpen` (and the
 * derived `placement`) is local state. A dropdown that owned its selected
 * value internally would leave AvailabilityWidget's own `rooms`/`guests`
 * state (which the WhatsApp message text is built from) out of sync with
 * whatever the user actually picked.
 */
export default function Dropdown({ id, label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [placement, setPlacement] = useState('down')
  const wrapRef = useRef(null)
  const menuRef = useRef(null)

  const reposition = useCallback(() => {
    const trigger = wrapRef.current
    if (!trigger) return
    const triggerRect = trigger.getBoundingClientRect()
    const menuHeight = menuRef.current?.offsetHeight || MENU_FALLBACK_HEIGHT
    const spaceBelow = window.innerHeight - triggerRect.bottom
    const spaceAbove = triggerRect.top - NAV_CLEARANCE
    const fitsBelow = spaceBelow >= menuHeight + MENU_MARGIN
    setPlacement(!fitsBelow && spaceAbove > spaceBelow ? 'up' : 'down')
  }, [])

  useLayoutEffect(() => {
    if (!isOpen) return undefined
    reposition()
    const raf = requestAnimationFrame(reposition)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [isOpen, reposition])

  useEffect(() => {
    if (!isOpen) return undefined
    const handlePointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setIsOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (option) => {
    onChange(String(option))
    setIsOpen(false)
  }

  return (
    <div className="aw-field aw-dropdown" ref={wrapRef}>
      <span className="aw-label" id={`${id}-label`}>{label}</span>
      <button
        type="button"
        className="aw-input aw-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label`}
        onClick={() => setIsOpen((o) => !o)}
      >
        {value}
      </button>

      {isOpen ? (
        <ul
          ref={menuRef}
          className={`aw-dropdown-menu aw-dropdown-menu-${placement}`}
          role="listbox"
          aria-labelledby={`${id}-label`}
        >
          {options.map((option) => (
            <li key={option} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={String(option) === value}
                className={String(option) === value ? 'aw-dropdown-option active' : 'aw-dropdown-option'}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
