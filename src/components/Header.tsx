export function Header() {
  return (
    <header className="lf-header">
      <div className="lf-brand">
        <span className="lf-logo" aria-hidden>
          ♫
        </span>
        <div>
          <h1>LyricForge</h1>
          <p className="lf-tagline">Paste → Analyze → Clean → Copy → Suno</p>
        </div>
      </div>
      <p className="lf-disclaimer">
        Client-side only. Paste lyrics you may use. No lyric-site scraping.
      </p>
    </header>
  )
}
