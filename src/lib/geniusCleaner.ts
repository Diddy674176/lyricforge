/** Strip Genius webpage clutter from user-pasted text. Never fetches lyrics. */

const CLUTTER_LINE = new RegExp(
  [
    '^\\s*Embed\\s*\\d*\\s*$',
    '^\\s*\\d*Embed\\s*$',
    '^Share\\b',
    '^Copy\\b',
    '^Follow\\b',
    '^Sign up\\b',
    '^Log in\\b',
    '^Create account\\b',
    '^Become a Genius\\b',
    '^Genius\\s*News\\b',
    '^About Genius\\b',
    '^Contributor',
    '^Verified',
    '^Translation',
    '^Translations?\\b',
    '^Read More\\b',
    '^Show more\\b',
    '^Hide\\b',
    '^Advertisement\\b',
    '^Sponsored\\b',
    '^You might also like\\b',
    '^Related songs\\b',
    '^Popular songs\\b',
    '^Album tracklist\\b',
    '^Tracklist\\b',
    '^Home\\s*$',
    '^Charts\\s*$',
    '^Shop\\s*$',
    '^News\\s*$',
    '^Forum\\s*$',
    '^Add a song\\b',
    '^Edit lyrics\\b',
    '^Annotate\\b',
    '^See all\\b',
    '^Produced by\\b',
    '^Written by\\b',
    '^Featuring\\b',
    '^Released on\\b',
    '^\\d+\\s+Contributors?\\b',
    '^\\d+\\s+Embed',
    '^Lyrics from\\b',
    '^Powered by\\b',
    '^Cookie\\b',
    '^Privacy\\b',
    '^Terms\\b',
    '^©',
    '^http',
    '^www\\.',
  ].join('|'),
  'i',
)

const SECTION_LABEL = /^\s*\[(Intro|Verse\s*\d*|Pre-?Chorus|Chorus|Hook|Bridge|Outro|Refrain|Interlude|Break|Solo|Drop|Post-?Chorus|Skit|Spoken|Ad-?libs?)[^\]]*\]\s*$/i

export interface GeniusCleanResult {
  cleaned: string
  original: string
  removedLines: string[]
  keptSectionLabels: boolean
}

export function looksLikeGeniusPaste(text: string): boolean {
  const t = text.toLowerCase()
  return (
    t.includes('embed') ||
    t.includes('genius') ||
    t.includes('you might also like') ||
    t.includes('contributors') ||
    /\[\s*(verse|chorus|intro|outro|bridge)/i.test(text)
  )
}

export function cleanGeniusPaste(text: string, opts?: { keepLabels?: boolean }): GeniusCleanResult {
  const keepLabels = opts?.keepLabels !== false
  const original = text
  const removed: string[] = []
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  const kept: string[] = []

  for (let raw of lines) {
    let line = raw.replace(/\u00a0/g, ' ')
    // Strip trailing "Embed" glued to lyric lines
    const embedStrip = line.replace(/\s*\d*Embed\d*\s*$/i, '').replace(/\s+Embed\s*$/i, '')
    if (embedStrip !== line) {
      removed.push(line)
      line = embedStrip
    }

    const trimmed = line.trim()
    if (!trimmed) {
      // collapse later
      kept.push('')
      continue
    }

    if (SECTION_LABEL.test(trimmed)) {
      if (keepLabels) kept.push(normalizeSectionLabel(trimmed))
      else removed.push(line)
      continue
    }

    if (CLUTTER_LINE.test(trimmed)) {
      removed.push(line)
      continue
    }

    // Drop lines that are only punctuation / UI chrome
    if (/^[\d\W_]{1,4}$/.test(trimmed) && !/[A-Za-z]/.test(trimmed)) {
      removed.push(line)
      continue
    }

    kept.push(line.replace(/\s+$/g, ''))
  }

  // Collapse 3+ blank lines to max 1 blank between content
  const collapsed: string[] = []
  let blankRun = 0
  for (const l of kept) {
    if (!l.trim()) {
      blankRun++
      if (blankRun <= 1) collapsed.push('')
    } else {
      blankRun = 0
      collapsed.push(l)
    }
  }

  // Trim leading/trailing blanks
  while (collapsed.length && !collapsed[0].trim()) collapsed.shift()
  while (collapsed.length && !collapsed[collapsed.length - 1].trim()) collapsed.pop()

  // Deduplicate consecutive identical section headings
  const deduped: string[] = []
  for (const l of collapsed) {
    const prev = deduped[deduped.length - 1]
    if (prev && SECTION_LABEL.test(prev.trim()) && SECTION_LABEL.test(l.trim()) && prev.trim().toLowerCase() === l.trim().toLowerCase()) {
      removed.push(l)
      continue
    }
    deduped.push(l)
  }

  return {
    original,
    cleaned: deduped.join('\n'),
    removedLines: removed,
    keptSectionLabels: keepLabels,
  }
}

function normalizeSectionLabel(label: string): string {
  const inner = label.replace(/^\s*\[|\]\s*$/g, '').trim()
  const map: Record<string, string> = {
    hook: 'Chorus',
    'pre chorus': 'Pre-Chorus',
    prechorus: 'Pre-Chorus',
    'post chorus': 'Post-Chorus',
    postchorus: 'Post-Chorus',
    adlibs: 'Ad-libs',
    'ad libs': 'Ad-libs',
  }
  const key = inner.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ')
  const pretty = map[key] || inner.replace(/\b\w/g, (c) => c.toUpperCase())
  return `[${pretty}]`
}

export function isGeniusUrl(url: string): boolean {
  try {
    const u = new URL(url.trim())
    return /(^|\.)genius\.com$/i.test(u.hostname)
  } catch {
    return /genius\.com/i.test(url)
  }
}
