/** Heuristic syllable counting for flow-preservation estimates. */
const VOWELS = /[aeiouy]+/gi

export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z']/g, '')
  if (!w) return 0
  if (w.length <= 3) return 1
  let matches = w.match(VOWELS) || []
  let count = matches.length
  if (w.endsWith('e') && !w.endsWith('le') && count > 1) count--
  if (w.endsWith('ed') && !/(ted|ded)$/.test(w) && count > 1) count--
  if (w.endsWith('es') && !/(ses|zes|ches|shes)$/.test(w) && count > 1) count--
  return Math.max(1, count)
}

export function lineSyllables(line: string): number {
  return line
    .split(/\s+/)
    .filter(Boolean)
    .reduce((n, w) => n + countSyllables(w), 0)
}

export function tokenizeWords(text: string): string[] {
  return text.match(/[A-Za-z']+/g) || []
}
