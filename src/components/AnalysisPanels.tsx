import type { ReactNode } from 'react'
import type { SongAnalysis } from '../lib/types'
import { CopyButton } from './CopyButton'

export function AnalysisPanels({ analysis }: { analysis: SongAnalysis | null }) {
  if (!analysis) {
    return (
      <section className="panel muted-panel">
        <div className="panel-head">
          <h2>AI Analysis</h2>
          <span className="hint">Runs entirely on-device from lyrics you paste</span>
        </div>
        <p className="empty">Paste lyrics, then hit Analyze Song or Process Everything.</p>
      </section>
    )
  }

  const emotionBlock = analysis.emotions.map((e) => `${e.emotion} — ${e.percent}%`).join('\n')

  return (
    <div className="analysis-stack">
      <div className="section-label-bar">
        <span className="badge badge-accent">AI Analysis</span>
        <span className="hint">Derived from LYRICS PROVIDED BY USER — not scraped</span>
      </div>

      <Panel title="Song Structure" copyText={analysis.structuredLyrics} copyLabel="Copy Song Structure">
        <pre>{analysis.structuredLyrics}</pre>
      </Panel>

      <Panel title="Flow Analysis" copyText={analysis.flow} copyLabel="Copy Flow Analysis">
        <pre>{analysis.flow}</pre>
      </Panel>

      <Panel title="Rhyme Schemes" copyText={analysis.rhymeSummary} copyLabel="Copy Rhyme Analysis">
        <div className="rhyme-blocks">
          {analysis.rhyme.map((r) => (
            <div key={r.sectionLabel} className="rhyme-block">
              <h4>{r.sectionLabel}</h4>
              <div className="scheme-letters">
                {r.scheme.map((letter, i) => (
                  <span key={i}>{letter}</span>
                ))}
              </div>
              {r.notes.map((n) => (
                <p key={n} className="hint">
                  {n}
                </p>
              ))}
            </div>
          ))}
        </div>
        <pre className="subtle">{analysis.rhymeSummary}</pre>
      </Panel>

      <Panel title="Vocal Delivery" copyText={analysis.vocal} copyLabel="Copy Vocal Style">
        <pre>{analysis.vocal}</pre>
      </Panel>

      <Panel
        title="Emotions"
        copyText={`${emotionBlock}\n\n${analysis.emotionNarrative}`}
        copyLabel="Copy Emotions"
      >
        <div className="emotion-bars">
          {analysis.emotions.map((e) => (
            <div key={e.emotion} className="emotion-row">
              <span>{e.emotion}</span>
              <div className="bar">
                <div style={{ width: `${e.percent}%` }} />
              </div>
              <strong>{e.percent}%</strong>
            </div>
          ))}
        </div>
        <p className="narrative">{analysis.emotionNarrative}</p>
        <p className="hint">Percentages are heuristic estimates from lyric keywords.</p>
      </Panel>

      <Panel title="Production" copyText={analysis.production} copyLabel="Copy Production Style">
        <pre>{analysis.production}</pre>
      </Panel>

      <Panel title="Suno Style" copyText={analysis.sunoPrompt} copyLabel="Copy Suno Prompt" accent>
        <pre className="suno-prompt">{analysis.sunoPrompt}</pre>
      </Panel>
    </div>
  )
}

function Panel({
  title,
  copyText,
  copyLabel,
  children,
  accent,
}: {
  title: string
  copyText: string
  copyLabel: string
  children: ReactNode
  accent?: boolean
}) {
  return (
    <section className={`panel ${accent ? 'panel-accent' : ''}`}>
      <div className="panel-head">
        <h2>{title}</h2>
        <CopyButton text={copyText} label={copyLabel} />
      </div>
      {children}
    </section>
  )
}
