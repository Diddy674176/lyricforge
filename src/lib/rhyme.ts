import type { RhymeScheme, StructureSection } from './types'

function endSound(word: string): string {
  const w = word.toLowerCase().replace(/[^a-z']/g, '')
  if (!w) return ''
  if (w.length <= 2) return w
  const m = w.match(/([aeiouy]{1,2}[^aeiouy]*)$/i)
  return (m ? m[1] : w.slice(-3)).toLowerCase()
}

function lastWord(line: string): string {
  const words = line.match(/[A-Za-z']+/g)
  return words ? words[words.length - 1] : ''
}

export function analyzeRhymes(sections: StructureSection[]): { schemes: RhymeScheme[]; summary: string } {
  const schemes: RhymeScheme[] = []
  const globalSounds = new Map<string, number>()

  for (const sec of sections) {
    const contentLines = sec.lines.filter((l) => l.trim() && !/^\s*\[/.test(l))
    const sounds = contentLines.map((l) => endSound(lastWord(l)))
    const letterOf = new Map<string, string>()
    let next = 0
    const scheme: string[] = []
    const notes: string[] = []

    sounds.forEach((s) => {
      if (!s) {
        scheme.push('-')
        return
      }
      globalSounds.set(s, (globalSounds.get(s) || 0) + 1)
      if (!letterOf.has(s)) {
        letterOf.set(s, String.fromCharCode(65 + (next % 26)))
        next++
      }
      scheme.push(letterOf.get(s)!)
    })

    // Internal rhyme hint
    let internal = 0
    contentLines.forEach((line) => {
      const words = line.match(/[A-Za-z']+/g) || []
      const ends = words.map(endSound)
      for (let i = 0; i < ends.length; i++) {
        for (let j = i + 1; j < ends.length; j++) {
          if (ends[i] && ends[i] === ends[j]) internal++
        }
      }
    })
    if (internal > 0) notes.push(`~${internal} internal rhyme pair(s) detected (estimate)`)
    const unique = new Set(sounds.filter(Boolean))
    if (unique.size === 1 && sounds.filter(Boolean).length >= 2) notes.push('Couplet / mono-rhyme tendency')
    if (scheme.join('') === 'ABAB' || scheme.slice(0, 4).join('') === 'ABAB') notes.push('Alternating pattern (ABAB-like)')

    schemes.push({
      sectionLabel: sec.label,
      scheme,
      endSounds: sounds,
      notes,
    })
  }

  const top = [...globalSounds.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  const summaryParts = [
    'Rhyme analysis (heuristic estimates):',
    ...schemes.map((s) => `${s.sectionLabel}: ${s.scheme.join(' ') || '(no lines)'}${s.notes.length ? ' — ' + s.notes.join('; ') : ''}`),
  ]
  if (top.length) {
    summaryParts.push('Repeated end sounds: ' + top.map(([s, c]) => `"${s}"×${c}`).join(', '))
  }

  return { schemes, summary: summaryParts.join('\n') }
}
