/**
 * Two supporting text blocks side by side on the real 12-column grid
 * (col-1-6 / col-7-12) instead of two separate full-width sections with a
 * grid re-implementation in between — keeps both readable in one glance
 * and avoids the large unjustified empty space a lone off-center text
 * block leaves on a 1440px row.
 */
export default function TextBlockPair({ tone = 'crema', blocks }) {
  return (
    <section className={`text-pair on-${tone}`}>
      <div className="grid-12" data-reveal-group>
        {blocks.map((block, i) => (
          <div className={`text-pair-item reveal ${i === 0 ? 'col-1-6' : 'col-7-12'}`} key={block.eyebrow}>
            <span className="eyebrow" style={tone === 'crema' ? { color: 'var(--color-terracota)', opacity: 1 } : undefined}>
              {block.eyebrow}
            </span>
            <p>{block.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
