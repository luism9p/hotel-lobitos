import Photo from '../ui/Photo.jsx'
import './ServicesGallery.css'

/**
 * Photo strip that widens each image on hover — same flex-grow +
 * transition technique BoardAccordion.jsx already uses elsewhere on the
 * site, but with no hidden text/CTA behind the hover state, so unlike
 * BoardAccordion this needs no touch/JS handling at all: every image is
 * always fully visible, hover only changes width. On touch devices (no
 * real :hover) it degrades to a horizontally scrollable filmstrip via a
 * plain CSS media query — 100% CSS, zero JS on mobile.
 */
export default function ServicesGallery({ items }) {
  return (
    <div className="services-gallery" data-reveal-group>
      {items.map((item) => (
        <div key={item.title} className="sg-card reveal" tabIndex={0}>
          <Photo
            src={item.image}
            alt={item.imageAlt || item.title}
            placeholder={item.placeholder}
            width={item.imageWidth}
            height={item.imageHeight}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
}
