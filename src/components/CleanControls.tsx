import type { CleanMode, CleaningLevel, CleanSettings, Preservation } from '../lib/types'

export function CleanControls({
  settings,
  onChange,
}: {
  settings: CleanSettings
  onChange: (s: CleanSettings) => void
}) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Clean Lyrics</h2>
        <span className="hint">Preserves flow — only rewrites flagged words</span>
      </div>

      <div className="control-grid">
        <label className="control">
          <span>Mode</span>
          <select
            value={settings.mode}
            onChange={(e) => onChange({ ...settings, mode: e.target.value as CleanMode })}
          >
            <option value="exact">Exact Flow</option>
            <option value="natural">Natural Clean</option>
            <option value="radio">Radio Edit</option>
          </select>
        </label>

        <label className="control">
          <span>Profanity Cleaning</span>
          <div className="seg">
            {(['off', 'light', 'radio', 'full'] as CleaningLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={settings.level === lvl ? 'active' : ''}
                onClick={() => onChange({ ...settings, level: lvl })}
              >
                {lvl.toUpperCase()}
              </button>
            ))}
          </div>
        </label>

        <PresSlider
          label="Flow Preservation"
          value={settings.flowPreservation}
          onChange={(flowPreservation) => onChange({ ...settings, flowPreservation })}
        />
        <PresSlider
          label="Meaning Preservation"
          value={settings.meaningPreservation}
          onChange={(meaningPreservation) => onChange({ ...settings, meaningPreservation })}
        />
        <PresSlider
          label="Rhyme Preservation"
          value={settings.rhymePreservation}
          onChange={(rhymePreservation) => onChange({ ...settings, rhymePreservation })}
        />
      </div>
    </section>
  )
}

function PresSlider({
  label,
  value,
  onChange,
}: {
  label: string
  value: Preservation
  onChange: (v: Preservation) => void
}) {
  const order: Preservation[] = ['low', 'medium', 'maximum']
  const idx = order.indexOf(value)
  return (
    <label className="control">
      <span>
        {label}: <strong>{value.toUpperCase()}</strong>
      </span>
      <input
        type="range"
        min={0}
        max={2}
        step={1}
        value={idx}
        onChange={(e) => onChange(order[Number(e.target.value)])}
      />
    </label>
  )
}
