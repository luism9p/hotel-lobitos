import SectionTitle from '../ui/SectionTitle.jsx'
import Photo from '../ui/Photo.jsx'

/**
 * "Nuestra Casa" — asymmetric 3-photo grid (tall left + two stacked right,
 * offset). Column ratio is 7:5, the same asymmetric split used elsewhere
 * on the site, so it reads as one grid system rather than a one-off.
 * Items without a real `image` render the labeled placeholder.
 */
export default function Gallery({ title, sub, onVerde = false, items }) {
  return (
    <>
      <SectionTitle title={title} sub={sub} onVerde={onVerde} />
      <div className="galeria" data-reveal-group>
        {items.map((item, i) => (
          <div className={`galeria-item item-0${i + 1} reveal`} key={item.placeholder || item.image}>
            <Photo src={item.image} alt={item.alt} placeholder={item.placeholder} />
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
    </>
  )
}
