import { useState } from 'react'
import { writeClipboard } from '../lib/clipboard'

export function CopyButton({
  text,
  label = 'Copy',
  className = '',
}: {
  text: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    if (!text) return
    const ok = await writeClipboard(text)
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    }
  }

  return (
    <button type="button" className={`btn btn-ghost copy-btn ${className}`} onClick={onCopy} disabled={!text}>
      {copied ? 'Copied ✓' : label}
    </button>
  )
}
