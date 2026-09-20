export function SongReference({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Song Reference</h2>
        <span className="hint">Title/link for style hints only — never fetches lyrics</span>
      </div>
      <input
        className="input"
        type="text"
        placeholder="e.g. Song Title — Artist, or a link (style cues only)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
    </section>
  )
}
