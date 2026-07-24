/** Small "Requisitos" strip on Surf Academy. */
export default function RequisitosBlock({ tag, text }) {
  return (
    <section className="requisitos">
      <div className="requisitos-inner reveal">
        <span className="tag">{tag}</span>
        <p>{text}</p>
      </div>
    </section>
  )
}
