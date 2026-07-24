/**
 * Renders a real <img> when `src` is provided, otherwise falls back to the
 * site's striped "photo pending" placeholder labeled with the path the
 * image should eventually live at. Used by every section that has an
 * image slot (Hero, CommitmentBlock, gallery, editorial, board cards).
 */
export default function Photo({ src, alt = '', placeholder, className = '', loading }) {
  if (src) {
    return <img src={src} alt={alt} className={className} loading={loading} />
  }
  return (
    <div className={`img-placeholder ${className}`.trim()}>
      <span>{placeholder}</span>
    </div>
  )
}
