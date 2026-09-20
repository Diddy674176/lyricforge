import { useState } from 'react'
import type { CleanResult, WordReplacement } from '../lib/types'
import { CopyButton } from './CopyButton'

export function SideBySide({
  original,
  clean,
  onApplyAlternative,
  pastePreview,
  onUndoCleaning,
  onKeepOnlyLyrics,
  onPreserveEverything,
}: {
  original: string
  clean: CleanResult | null
  onApplyAlternative: (index: number, alt: string) => void
  pastePreview: { original: string; cleaned: string; removed: string[] } | null
  onUndoCleaning: () => void
  onKeepOnlyLyrics: () => void
  onPreserveEverything: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)

  if (!clean && !pastePreview) return null

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Original | Clean</h2>
        <div className="btn-row">
          <CopyButton text={original} label="Copy Original" />
          <CopyButton text={clean?.cleaned || ''} label="Copy Clean Version" />
        </div>
      </div>

      {pastePreview ? (
        <div className="paste-preview">
          <p className="toast-inline success">Lyrics imported ✓</p>
          <div className="btn-row wrap">
            <button type="button" className="btn btn-ghost" onClick={onUndoCleaning}>
              Undo Cleaning
            </button>
            <button type="button" className="btn btn-secondary" onClick={onKeepOnlyLyrics}>
              Keep Only Lyrics
            </button>
            <button type="button" className="btn btn-ghost" onClick={onPreserveEverything}>
              Preserve Everything
            </button>
          </div>
          {pastePreview.removed.length > 0 ? (
            <details className="removed-details">
              <summary>Removed clutter ({pastePreview.removed.length})</summary>
              <pre>{pastePreview.removed.slice(0, 40).join('\n')}</pre>
            </details>
          ) : (
            <p className="hint">No clutter detected — paste preserved.</p>
          )}
        </div>
      ) : null}

      {clean ? (
        <>
          <div className="scores-row">
            <Score label="Flow Match" value={clean.scores.flowMatch} />
            <Score label="Syllable Match" value={clean.scores.syllableMatch} />
            <Score label="Rhyme Match" value={clean.scores.rhymeMatch} />
            <Score label="Meaning Match" value={clean.scores.meaningMatch} />
          </div>
          <p className="hint">Scores are heuristic estimates from syllable/rhyme matching.</p>

          <div className="compare-grid">
            <div className="compare-col">
              <h3>Original Lyrics</h3>
              <pre className="compare-pre">{original}</pre>
            </div>
            <div className="compare-col">
              <h3>Clean Lyrics</h3>
              <div
                className="compare-pre html-pre"
                dangerouslySetInnerHTML={{ __html: clean.highlightedHtml }}
                onClick={(e) => {
                  const t = e.target as HTMLElement
                  if (t.classList.contains('changed')) {
                    const i = Number(t.dataset.i)
                    if (!Number.isNaN(i)) setSelected(i)
                  }
                }}
              />
            </div>
          </div>

          {clean.replacements.length > 0 ? (
            <div className="replacements">
              <h3>Original → Replacement</h3>
              <ul>
                {clean.replacements.map((r, i) => (
                  <ReplacementRow
                    key={`${r.lineIndex}-${r.wordIndex}-${i}`}
                    r={r}
                    active={selected === i}
                    onSelect={() => setSelected(i)}
                    onPick={(alt) => onApplyAlternative(i, alt)}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <p className="hint">No words rewritten at current cleaning level.</p>
          )}
        </>
      ) : null}
    </section>
  )
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="score-pill">
      <span>{label}</span>
      <strong>{value}%</strong>
    </div>
  )
}

function ReplacementRow({
  r,
  active,
  onSelect,
  onPick,
}: {
  r: WordReplacement
  active: boolean
  onSelect: () => void
  onPick: (alt: string) => void
}) {
  return (
    <li className={active ? 'active' : ''} onClick={onSelect}>
      <div className="rep-main">
        <code>{r.original}</code>
        <span aria-hidden>→</span>
        <code className="rep-new">{r.replacement}</code>
      </div>
      <div className="rep-meta">
        Syllables: {r.originalSyllables} → {r.replacementSyllables} · Flow {r.flowMatch}% · Rhyme{' '}
        {r.rhymeMatch}% · Meaning {r.meaningMatch}% <em>(estimates)</em>
      </div>
      {active ? (
        <div className="alt-row">
          {r.alternatives.map((a) => (
            <button key={a} type="button" className="btn btn-ghost btn-sm" onClick={() => onPick(a)}>
              {a}
            </button>
          ))}
        </div>
      ) : null}
    </li>
  )
}
