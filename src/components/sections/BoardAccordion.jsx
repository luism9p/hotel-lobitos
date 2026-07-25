import { useEffect, useState } from 'react'
import Photo from '../ui/Photo.jsx'
import Button from '../ui/Button.jsx'

/**
 * "Alquiler de Tablas y Equipo" — interactive flex accordion (Soft-Top /
 * Funboard / Shortboard). Every card starts at an equal flex:1 share;
 * on devices with real mouse hover, `:hover`/`:focus-within` grows that
 * card to flex-grow:3 while the others stay at 1 — pure CSS, no JS needed
 * there: flex-grow is an animatable property, so `transition: flex-grow`
 * alone drives the whole expand/contract motion.
 *
 * Below 900px (see .board-card in global.css) the layout stacks to a
 * column and every card's description/CTA is shown unconditionally — no
 * interaction needed to reveal them there, so a click handler wouldn't do
 * anything meaningful on true mobile.
 *
 * The gap this component adds JS for: `(hover: hover) and (pointer: fine)`
 * is a CAPABILITY check, not a width check — a touchscreen laptop or an
 * iPad in landscape can render the desktop row layout (>900px) with zero
 * way to trigger `:hover`. `isTouch` below tracks exactly the inverse of
 * that query, live (via `change`, not just on mount, since e.g. a 2-in-1
 * can flip between tablet/laptop mode), and toggles `.is-active-touch` —
 * the same visual state `:hover`/`:focus-within` already produce in CSS —
 * from an onClick instead.
 */
export default function BoardAccordion({ items }) {
  const [isTouch, setIsTouch] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setIsTouch(!mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const handleToggle = (index) => {
    setActiveIndex((current) => (current === index ? null : index))
  }

  return (
    <div className="board-accordion" data-reveal-group>
      {items.map((item, i) => (
        <div
          key={item.title}
          className={
            isTouch && activeIndex === i ? 'board-card reveal is-active-touch' : 'board-card reveal'
          }
          tabIndex={0}
          onClick={isTouch ? () => handleToggle(i) : undefined}
        >
          <div className="board-card-media">
            <Photo
              src={item.image}
              alt={item.imageAlt}
              placeholder={item.placeholder}
              width={item.imageWidth}
              height={item.imageHeight}
              loading="lazy"
            />
          </div>
          <div className="board-card-scrim" />
          <div className="board-card-content">
            {item.tag ? <span className="board-card-tag">{item.tag}</span> : null}
            <h3 className="board-card-title">{item.title}</h3>
            <div className="board-card-reveal">
              <p className="board-card-text">{item.text}</p>
              {item.ctaLabel ? (
                <Button variant="outline-crema" href={item.ctaHref}>
                  {item.ctaLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
