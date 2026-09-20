import type { StructureSection } from './types'

const EXPLICIT = /^\s*\[(Intro|Verse\s*\d*|Pre-?Chorus|Chorus|Hook|Bridge|Outro|Refrain|Interlude|Break|Solo|Drop|Post-?Chorus|Skit|Spoken|Ad-?libs?)[^\]]*\]\s*$/i

const ADLIB = /^\s*[\(\[][^\)\]]{1,40}[\)\]]\s*$/

export function detectStructure(lyrics: string): StructureSection[] {
  const lines = lyrics.replace(/\r\n/g, '\n').split('\n')
  if (!lines.some((l) => l.trim())) return []

  // Prefer explicit labels if present
  const hasExplicit = lines.some((l) => EXPLICIT.test(l.trim()))
  if (hasExplicit) return parseExplicit(lines)
  return inferStructure(lines)
}

function parseExplicit(lines: string[]): StructureSection[] {
  const sections: StructureSection[] = []
  let current: StructureSection | null = null

  lines.forEach((line, i) => {
    const t = line.trim()
    if (EXPLICIT.test(t)) {
      if (current) {
        current.endLine = i - 1
        sections.push(current)
      }
      const label = t.replace(/^\s*\[|\]\s*$/g, '')
      current = { label, lines: [], startLine: i, endLine: i }
      return
    }
    if (!current) {
      current = { label: 'Untitled', lines: [], startLine: i, endLine: i }
    }
    current.lines.push(line)
    current.endLine = i
  })
  if (current) sections.push(current)
  return sections
}

function inferStructure(lines: string[]): StructureSection[] {
  // Split on blank lines into blocks
  const blocks: { start: number; end: number; lines: string[] }[] = []
  let buf: string[] = []
  let start = 0
  lines.forEach((line, i) => {
    if (!line.trim()) {
      if (buf.length) {
        blocks.push({ start, end: i - 1, lines: [...buf] })
        buf = []
      }
      start = i + 1
    } else {
      if (!buf.length) start = i
      buf.push(line)
    }
  })
  if (buf.length) blocks.push({ start, end: lines.length - 1, lines: buf })

  if (!blocks.length) return []

  // Find likely chorus = most repeated block (normalized)
  const norms = blocks.map((b) => normalizeBlock(b.lines))
  const counts = new Map<string, number>()
  norms.forEach((n) => counts.set(n, (counts.get(n) || 0) + 1))
  let chorusNorm = ''
  let max = 1
  counts.forEach((c, n) => {
    if (c > max && n.split(/\s+/).length >= 4) {
      max = c
      chorusNorm = n
    }
  })

  const sections: StructureSection[] = []
  let verseN = 0
  let chorusSeen = 0
  blocks.forEach((b, idx) => {
    const n = norms[idx]
    const wordCount = b.lines.join(' ').split(/\s+/).filter(Boolean).length
    const isAdlib = b.lines.every((l) => ADLIB.test(l.trim()) || l.trim().length < 12) && wordCount < 12

    let label: string
    if (isAdlib) label = 'Ad-libs'
    else if (chorusNorm && n === chorusNorm) {
      chorusSeen++
      label = 'Chorus'
    } else if (idx === 0 && wordCount < 20) label = 'Intro'
    else if (idx === blocks.length - 1 && wordCount < 25) label = 'Outro'
    else if (idx > 0 && idx < blocks.length - 1 && verseN >= 2 && wordCount < 40 && chorusSeen > 0) {
      label = 'Bridge'
    } else {
      verseN++
      label = `Verse ${verseN}`
    }

    sections.push({
      label,
      lines: b.lines,
      startLine: b.start,
      endLine: b.end,
    })
  })
  return sections
}

function normalizeBlock(lines: string[]): string {
  return lines
    .map((l) => l.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(' | ')
}

export function formatStructuredLyrics(sections: StructureSection[]): string {
  return sections
    .map((s) => `[${s.label}]\n${s.lines.join('\n')}`.trimEnd())
    .join('\n\n')
}
