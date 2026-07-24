import ScrollReveal from '../ui/ScrollReveal.jsx'

/**
 * Left-bordered accent text block, deliberately off-center (never
 * full-width/centered). `heading` is optional. `animatedText`: the
 * paragraph reveals word-by-word (rotation + opacity + blur, tied to
 * scroll) via React Bits' ScrollReveal, see components/ui/ScrollReveal.jsx
 * — eyebrow and heading stay static, ScrollReveal is built for a passage
 * of prose, not short labels/titles.
 */
export default function TextBlock({ id, eyebrow, heading, text, tone = 'crema', animatedText = false }) {
  return (
    <section id={id} className={`text-block on-${tone}`}>
      <div className="text-block-inner container">
        <div className="text-block-content reveal">
          <span className="eyebrow">{eyebrow}</span>
          {heading ? <h2>{heading}</h2> : null}
          {animatedText ? (
            <ScrollReveal as="div" containerClassName="paragraph-scrollreveal" textClassName="paragraph-scrollreveal-text" baseOpacity={0.15} baseRotation={2} blurStrength={6}>
              {text}
            </ScrollReveal>
          ) : (
            <p>{text}</p>
          )}
        </div>
      </div>
    </section>
  )
}
