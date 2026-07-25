/**
 * Renders a real <img> when `src` is provided, otherwise falls back to the
 * site's striped "photo pending" placeholder labeled with the path the
 * image should eventually live at. Used by every section that has an
 * image slot (Hero, CommitmentBlock, gallery, editorial, board cards).
 *
 * `width`/`height` are the image's real natural dimensions (not its
 * rendered CSS size) — the browser uses their ratio to reserve layout
 * space before the file loads, which is what actually prevents CLS; the
 * element still renders at whatever size its CSS gives it (almost always
 * `width:100%; height:100%; object-fit:cover` in this codebase).
 *
 * `fetchPriority` and `loading` are two ends of the same choreography and
 * deliberately not both wired to a default — a caller sets `fetchPriority
 * ="high"` for the LCP candidate (hero photo, parallax banner) and
 * `loading="lazy"` for anything below the fold, never both on the same
 * image.
 *
 * `mobileSrc` is opt-in — only pass it when a dedicated small-viewport
 * asset exists (e.g. a downscaled banner). When present, renders a
 * <picture> with a `(max-width: mobileBreakpoint)` source so phones fetch
 * the lighter file instead of the desktop one; every other caller that
 * doesn't pass it keeps rendering a plain <img>, unchanged.
 */
export default function Photo({
  src,
  alt = '',
  placeholder,
  className = '',
  loading,
  width,
  height,
  fetchPriority,
  mobileSrc,
  mobileBreakpoint = 767,
}) {
  if (src) {
    const img = (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        fetchPriority={fetchPriority}
      />
    )
    if (mobileSrc) {
      return (
        <picture>
          <source media={`(max-width: ${mobileBreakpoint}px)`} srcSet={mobileSrc} />
          {img}
        </picture>
      )
    }
    return img
  }
  return (
    <div className={`img-placeholder ${className}`.trim()}>
      <span>{placeholder}</span>
    </div>
  )
}
