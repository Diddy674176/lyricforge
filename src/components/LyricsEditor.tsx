import { useRef, useEffect } from 'react'
import type { StructureSection } from '../lib/types'

export function LyricsEditor({
  value,
  onChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClear,
  onAnalyze,
  onProcessEverything,
  stats,
  structurePreview,
  focusToken,
  pasteHint,
}: {
  value: string
  onChange: (v: string) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  onClear: () => void
  onAnalyze: () => void
  onProcessEverything: () => void
  stats: { words: number; lines: number; chars: number }
  structurePreview: StructureSection[]
  focusToken: number
  pasteHint: string
}) {
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (focusToken > 0) {
      taRef.current?.focus()
    }
  }, [focusToken])

  return (
    <section className="panel lyrics-panel">
      <div className="panel-head">
        <div>
          <h2>Lyrics Provided by User</h2>
          <span className="hint">Paste or edit — line breaks preserved</span>
        </div>
        <div className="counts">
          <span>{stats.words} words</span>
          <span>{stats.lines} lines</span>
          <span>{stats.chars} chars</span>
        </div>
      </div>

      {pasteHint ? <div className="paste-hint">{pasteHint}</div> : null}

      <textarea
        ref={taRef}
        className="lyrics-editor"
        placeholder="Paste lyrics you are allowed to use here…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        rows={16}
      />

      <div className="btn-row wrap">
        <button type="button" className="btn btn-ghost" onClick={onUndo} disabled={!canUndo}>
          Undo
        </button>
        <button type="button" className="btn btn-ghost" onClick={onRedo} disabled={!canRedo}>
          Redo
        </button>
        <button type="button" className="btn btn-ghost" onClick={onClear} disabled={!value}>
          Clear
        </button>
        <button type="button" className="btn btn-primary btn-lg" onClick={onAnalyze} disabled={!value.trim()}>
          Analyze Song
        </button>
        <button
          type="button"
          className="btn btn-accent btn-lg"
          onClick={onProcessEverything}
          disabled={!value.trim()}
        >
          Process Everything
        </button>
      </div>

      {structurePreview.length > 0 ? (
        <div className="structure-chips">
          <span className="hint">Detected structure:</span>
          {structurePreview.map((s, i) => (
            <span key={`${s.label}-${i}`} className="chip">
              {s.label}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  )
}
