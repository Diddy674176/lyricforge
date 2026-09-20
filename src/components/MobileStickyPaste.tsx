export function MobileStickyPaste({
  onPaste,
  onPasteAndClean,
}: {
  onPaste: () => void
  onPasteAndClean: () => void
}) {
  return (
    <div className="mobile-sticky" role="region" aria-label="Quick paste">
      <button type="button" className="btn btn-secondary" onClick={onPaste}>
        Paste from Clipboard
      </button>
      <button type="button" className="btn btn-accent" onClick={onPasteAndClean}>
        Paste &amp; Clean
      </button>
    </div>
  )
}
