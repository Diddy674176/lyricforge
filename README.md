# LyricForge

Premium dark neon songwriter workspace: **paste lyrics you can use → analyze → clean → copy → Suno**.

**Live:** https://diddy674176.github.io/lyricforge/

## Copyright

- Never scrapes or downloads lyrics from Genius or any lyric site
- Genius URL only opens a new tab; you paste text you have permission to use
- Clear UI labels: **LYRICS PROVIDED BY USER** vs **AI ANALYSIS**
- Does not invent missing lyrics

## Stack

- Vite + React + TypeScript
- Client-side heuristics (profanity/synonym lists, structure, flow, rhyme, emotion, production)
- Optional `localStorage` drafts
- PWA-friendly
- GitHub Pages (`base: /lyricforge/`)

## Develop

```bash
npm install
npm run dev
npm run build
```

## Genius paste workflow

1. Paste a Genius link → **Open Genius**
2. Copy the lyric text you may use
3. Return → **Paste & Clean** (or Ctrl/Cmd+Shift+V)
4. **Process Everything** → copy Suno style prompt
