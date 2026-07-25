import Photo from '../ui/Photo.jsx'

/**
 * "Nuestro Compromiso" — reused verbatim (verde bg, text column + photo
 * column) on both Home and Hotel Lobitos, each with its own copy/photo.
 * `title` and `text` accept JSX so callers can drop in <em>/.highlight spans.
 * `isPageOpen`: this section is the very first thing on Hotel Lobitos (no
 * hero above it) — adds clearance for the fixed nav.
 */
export default function CommitmentBlock({
  eyebrow,
  title,
  text,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  placeholder,
  caption,
  isPageOpen = false,
}) {
  return (
    <section className={`compromiso${isPageOpen ? ' compromiso-page-open' : ''}`}>
      <div className="compromiso-inner" data-reveal-group>
        <div className="compromiso-text reveal">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="compromiso-photo reveal">
          <div className="frame">
            {/* No loading="lazy" here on purpose — with isPageOpen, this is
                the very first thing on the page (no Hero above it), i.e.
                this page's own LCP candidate. */}
            <Photo src={image} alt={imageAlt} placeholder={placeholder} width={imageWidth} height={imageHeight} />
          </div>
          {caption ? <div className="caption">{caption}</div> : null}
        </div>
      </div>
    </section>
  )
}
