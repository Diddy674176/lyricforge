import type { SongAnalysis } from '../lib/types'
import { buildEverythingMarkdown, buildEverythingText, downloadFile } from '../lib/export'
import { CopyButton } from './CopyButton'

export function ExportBar({
  original,
  analysis,
  songReference,
}: {
  original: string
  analysis: SongAnalysis | null
  songReference: string
}) {
  if (!analysis) return null

  const everything = buildEverythingText(original, analysis, songReference)
  const md = buildEverythingMarkdown(original, analysis, songReference)

  return (
    <section className="panel export-panel">
      <div className="panel-head">
        <h2>Export</h2>
      </div>
      <div className="btn-row wrap">
        <CopyButton text={everything} label="Copy Everything" className="btn-accent" />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => downloadFile('lyricforge-export.txt', everything, 'text/plain')}
        >
          Download TXT
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => downloadFile('lyricforge-export.md', md, 'text/markdown')}
        >
          Download Markdown
        </button>
        <CopyButton text={analysis.sunoPrompt} label="Copy Suno Prompt" />
        <CopyButton text={analysis.cleaned.cleaned} label="Copy Clean Version" />
      </div>
    </section>
  )
}
