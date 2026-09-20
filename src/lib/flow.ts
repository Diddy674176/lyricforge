import { lineSyllables, tokenizeWords } from './syllables'
import type { StructureSection } from './types'

export function analyzeFlow(lyrics: string, sections: StructureSection[]): string {
  const lines = lyrics.split('\n').filter((l) => l.trim() && !/^\s*\[/.test(l))
  if (!lines.length) return 'No lyric lines to analyze yet.'

  const syls = lines.map(lineSyllables)
  const avg = syls.reduce((a, b) => a + b, 0) / syls.length
  const max = Math.max(...syls)
  const min = Math.min(...syls)
  const words = tokenizeWords(lyrics)
  const avgWordLen = words.length ? words.reduce((a, w) => a + w.length, 0) / words.length : 0

  const shortPunchy = syls.filter((s) => s <= 6).length / syls.length
  const longDrawn = syls.filter((s) => s >= 14).length / syls.length
  const variance = syls.reduce((a, s) => a + (s - avg) ** 2, 0) / syls.length

  const delivery: string[] = []
  if (avg >= 12 && avgWordLen < 5.2) delivery.push('rap-leaning cadence')
  else if (avg <= 8) delivery.push('slow melodic / sung phrasing')
  else delivery.push('sing-rap hybrid feel')

  if (shortPunchy > 0.35) delivery.push('short punchy lines')
  if (longDrawn > 0.25) delivery.push('drawn-out phrases')
  if (variance > 12) delivery.push('dynamic syllable swings (possible double-time pockets)')
  else delivery.push('relatively even pacing')

  if (max >= 16) delivery.push('likely double-time or dense bars in places')
  if (min <= 3) delivery.push('breath pauses / sparse emphasis moments')

  const repeats = detectRepeats(lines)
  if (repeats) delivery.push(repeats)

  const adlibs = lines.filter((l) => /^\s*[\(\[].+[\)\]]\s*$/.test(l.trim())).length
  if (adlibs) delivery.push(`${adlibs} parenthetical ad-lib line(s)`)

  const sectionNotes = sections.map((s) => {
    const sSyl = s.lines.filter((l) => l.trim()).map(lineSyllables)
    if (!sSyl.length) return null
    const a = sSyl.reduce((x, y) => x + y, 0) / sSyl.length
    let feel = 'steady'
    if (a >= 13) feel = 'dense / faster'
    else if (a <= 7) feel = 'spacious / half-time leaning'
    return `${s.label}: ~${a.toFixed(1)} syl/line (${feel})`
  }).filter(Boolean)

  return [
    'Flow engine (heuristic estimates from the pasted lyrics):',
    `• Avg syllables/line: ${avg.toFixed(1)} (min ${min}, max ${max})`,
    `• Delivery read: ${delivery.join('; ')}`,
    sectionNotes.length ? '• By section:\n  - ' + sectionNotes.join('\n  - ') : '',
    '• Emphasis likely on end-of-line rhymes; pauses estimated at blank lines and short bars.',
  ]
    .filter(Boolean)
    .join('\n')
}

function detectRepeats(lines: string[]): string | null {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
  const counts = new Map<string, number>()
  lines.forEach((l) => {
    const n = norm(l)
    if (n.split(/\s+/).length >= 3) counts.set(n, (counts.get(n) || 0) + 1)
  })
  const reps = [...counts.entries()].filter(([, c]) => c >= 2)
  if (!reps.length) return null
  return `${reps.length} repeated phrase(s) — hook/motif reinforcement`
}
