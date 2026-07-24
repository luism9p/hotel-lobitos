/**
 * The recurring "title + right-aligned meta" header used above every grid
 * section (Tres pilares, Nuestra Casa, Servicios & Comodidades, boards,
 * Surf Trips). `sub` is a short descriptive line; `tagSub` is the small
 * uppercase label variant (e.g. "Hotel · Restaurant · Surf").
 */
export default function SectionTitle({ title, sub, tagSub, onVerde = false, className = '' }) {
  return (
    <div className={`section-head reveal ${onVerde ? 'on-verde' : ''} ${className}`.trim()}>
      <h2>{title}</h2>
      {tagSub ? <span className="tag-sub">{tagSub}</span> : null}
      {sub ? <span className="sub">{sub}</span> : null}
    </div>
  )
}
