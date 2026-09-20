import type { EmotionScore } from './types'
import { lineSyllables } from './syllables'

export function analyzeProduction(lyrics: string, emotions: EmotionScore[], songReference?: string): string {
  const lines = lyrics.split('\n').filter((l) => l.trim() && !/^\s*\[/.test(l))
  const avg = lines.length ? lines.map(lineSyllables).reduce((a, b) => a + b, 0) / lines.length : 8
  const top = emotions.slice(0, 3).map((e) => e.emotion)

  let genre = 'melodic trap / emo-rap'
  let bpm = '140–150'
  let drums = 'restrained trap drums in verses, wider hats on the hook'
  let harmony = 'soft electric guitar or keys with atmospheric pads'
  let bass = 'deep but clean 808s'
  let fx = 'spacious reverb, subtle delay throws on phrase ends'

  if (avg >= 12) {
    genre = 'trap / melodic rap'
    bpm = '140–160'
    drums = 'crisp trap hi-hats, snappy snare/clap, rolling hat variations'
  }
  if (avg <= 7) {
    genre = 'alternative R&B / atmospheric pop'
    bpm = '70–95 (or half-time 140)'
    drums = 'minimal kick/snare with roomy ambience'
    harmony = 'lush pads, soft piano, washed guitars'
  }
  if (top.includes('Euphoric') || top.includes('Confidence')) {
    genre = 'hyperpop-tinged melodic rap / club-leaning trap'
    bpm = '130–150'
    drums = 'punchy kick, bright claps, energetic hat patterns'
  }
  if (top.includes('Dark') || top.includes('Anger')) {
    genre = 'dark trap / industrial-tinged hip-hop'
    bpm = '130–145'
    harmony = 'minor synth stabs, dissonant pads'
    bass = 'distorted or growling 808s'
  }
  if (top.includes('Romance') || top.includes('Dreamy')) {
    genre = 'dreamy alternative R&B'
    bpm = '80–100'
    harmony = 'warm chords, glassy synths, soft guitar melody'
  }

  const mood = top.length ? top.join(', ').toLowerCase() : 'introspective'
  const ref = songReference?.trim()
    ? ` Reference mood/style cues from "${songReference.trim()}" (genre/era only).`
    : ''

  return (
    `${genre} instrumental around ${bpm} BPM with ${harmony}, ${bass}, ${drums}, ` +
    `${fx}, intimate vocal mix, mood: ${mood}.${ref}`
  )
}

export function buildSunoPrompt(
  production: string,
  vocal: string,
  emotions: EmotionScore[],
  flowHint: string,
): string {
  const mood = emotions
    .slice(0, 3)
    .map((e) => e.emotion.toLowerCase())
    .join(', ')

  // Compact single paragraph — musical characteristics only
  const vocalOneLiner = vocal
    .split('\n')
    .filter((l) => l.startsWith('•'))
    .map((l) => l.replace(/^•\s*/, ''))
    .slice(0, 4)
    .join(', ')

  const flowBit = /rap/i.test(flowHint)
    ? 'melodic sing-rap delivery'
    : /slow melodic/i.test(flowHint)
      ? 'slow melodic sung delivery'
      : 'sing-rap hybrid delivery'

  // Derive short production core
  const prodShort = production.split('.')[0]

  return (
    `${prodShort}, ${flowBit}, ${vocalOneLiner || 'expressive lead vocal'}, ` +
    `catchy layered hook, energy builds into the chorus, mood: ${mood || 'emotional'}.`
  ).replace(/\s+/g, ' ').trim()
}
