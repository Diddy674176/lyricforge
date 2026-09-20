import { lineSyllables } from './syllables'
import type { EmotionScore } from './types'

export function analyzeVocal(
  lyrics: string,
  emotions: EmotionScore[],
  songReference?: string,
): string {
  const lines = lyrics.split('\n').filter((l) => l.trim() && !/^\s*\[/.test(l))
  const syls = lines.map(lineSyllables)
  const avg = syls.length ? syls.reduce((a, b) => a + b, 0) / syls.length : 8
  const top = emotions[0]?.emotion || 'Introspection'

  let register = 'mid register'
  let tone = 'smooth with light air'
  let delivery = 'conversational melodic delivery'
  let energy = 'medium energy'

  if (avg >= 12) {
    delivery = 'melodic rap / sing-rap verses with tighter rhythmic pockets'
    energy = 'forward, pocket-focused energy'
  } else if (avg <= 7) {
    delivery = 'sustained sung lines with stretched vowels'
    register = 'upper-mid register'
    tone = 'airy, slightly vulnerable tone'
  }

  if (['Anger', 'Confidence', 'Dark'].includes(top)) {
    tone = 'darker, slightly raspy edge'
    energy = 'aggressive-to-intense energy with controlled grit'
  }
  if (['Heartbreak', 'Melancholy', 'Loneliness', 'Regret'].includes(top)) {
    tone = 'airy and slightly raspy, emotional cracks welcome'
    delivery = 'vulnerable sing-rap with breathy phrases'
    energy = 'intimate low-to-mid energy that blooms on the hook'
  }
  if (['Euphoric', 'Romance', 'Hope'].includes(top)) {
    tone = 'bright, polished tone'
    energy = 'uplifting energy with layered hook enthusiasm'
  }

  const parts = [
    `${register}, ${tone}`,
    delivery,
    energy,
    'layered hook vocals with subtle harmonies',
    'occasional improvised ad-libs in the pocket',
    'intimate close-mic feel, light vocal compression',
  ]

  let refNote = ''
  if (songReference?.trim()) {
    refNote =
      `\nInspiration reference (style hints only — not a voice clone): "${songReference.trim()}". ` +
      `Use general musical characteristics from that reference era/genre; do not sound exactly like any specific artist.`
  }

  return (
    'Vocal delivery (derived from pasted lyrics — not an artist clone):\n' +
    parts.map((p) => `• ${p}`).join('\n') +
    refNote
  )
}
