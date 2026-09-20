export function Header() {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="logo-mark" aria-hidden>
          <span />
          <span />
        </div>
        <div>
          <h1>LyricForge</h1>
          <p className="tagline">Paste → Analyze → Clean → Copy → Suno</p>
        </div>
      </div>
      <div className="header-badges">
        <span className="badge">Client-side</span>
        <span className="badge badge-accent">No lyric scraping</span>
      </div>
    </header>
  )
}
