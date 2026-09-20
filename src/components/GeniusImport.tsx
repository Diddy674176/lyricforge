import { useState } from 'react'
import { isGeniusUrl } from '../lib/geniusCleaner'
import { writeClipboard } from '../lib/clipboard'

export function GeniusImport({
  url,
  onUrlChange,
  onPasteFromClipboard,
  onPasteAndClean,
}: {
  url: string
  onUrlChange: (v: string) => void
  onPasteFromClipboard: () => void
  onPasteAndClean: () => void
}) {
  const [toast, setToast] = useState('')

  function openGenius() {
    const u = url.trim()
    if (!u) {
      window.open('https://genius.com', '_blank', 'noopener,noreferrer')
      return
    }
    const href = /^https?:\/\//i.test(u) ? u : `https://${u}`
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  async function copyLink() {
    if (!url.trim()) return
    const ok = await writeClipboard(url.trim())
    setToast(ok ? 'Link copied ✓' : 'Copy failed')
    window.setTimeout(() => setToast(''), 1500)
  }

  const validHint = url.trim() && !isGeniusUrl(url) ? 'Not a Genius URL — Open still works for any link' : ''

  return (
    <section className="panel genius-panel">
      <div className="panel-head">
        <h2>Genius Quick Import</h2>
        <span className="hint">Opens a tab only — you paste lyrics you may use</span>
      </div>
      <p className="copyright-note">
        LyricForge never scrapes or downloads lyrics from Genius. Paste text you have permission to use.
      </p>
      <label className="sr-only" htmlFor="genius-url">
        Paste Genius Link
      </label>
      <input
        id="genius-url"
        className="input"
        type="url"
        placeholder="Paste Genius link (https://genius.com/...-lyrics)"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        autoComplete="off"
      />
      {validHint ? <p className="hint warn">{validHint}</p> : null}
      <div className="btn-row wrap">
        <button type="button" className="btn btn-primary" onClick={openGenius}>
          Open Genius
        </button>
        <button type="button" className="btn btn-ghost" onClick={copyLink} disabled={!url.trim()}>
          Copy Link
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => onUrlChange('')}>
          Clear
        </button>
        <button type="button" className="btn btn-secondary" onClick={onPasteFromClipboard}>
          Paste Lyrics
        </button>
        <button type="button" className="btn btn-accent" onClick={onPasteAndClean}>
          Paste &amp; Clean
        </button>
      </div>
      {toast ? <p className="toast-inline">{toast}</p> : null}
      <ol className="workflow-steps">
        <li>Paste Genius link</li>
        <li>Open Genius → copy lyrics</li>
        <li>Return → Paste &amp; Clean</li>
        <li>Process Everything</li>
      </ol>
    </section>
  )
}
