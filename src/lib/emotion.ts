import type { EmotionScore } from './types'

const LEXICON: Record<string, string[]> = {
  Heartbreak: ['heartbreak', 'broke my heart', 'tears', 'crying', 'cry', 'left me', 'goodbye', 'miss you', 'without you', 'empty', 'hurt'],
  Nostalgia: ['remember', 'used to', 'back then', 'memories', 'memory', 'old days', 'nostalgia', 'flashback', 'yesterday', 'childhood'],
  Confidence: ['boss', 'crown', 'win', 'winning', 'top', 'king', 'queen', 'flex', 'rich', 'money', 'unstoppable', 'better', 'greatest'],
  Loneliness: ['alone', 'lonely', 'nobody', 'no one', 'isolated', 'empty room', 'by myself', 'solitude'],
  Anger: ['hate', 'angry', 'rage', 'furious', 'mad', 'fight', 'kill', 'destroy', 'betray', 'liar', 'revenge'],
  Anxiety: ['anxious', 'anxiety', 'worried', 'panic', 'overthink', 'scared', 'fear', 'nervous', 'stress', 'pressure'],
  Hope: ['hope', 'better days', 'sunrise', 'faith', 'believe', 'dream', 'rise', 'heal', 'tomorrow', 'light'],
  Regret: ['regret', 'should have', 'shoulda', 'sorry', 'apologize', 'mistake', 'wish i', 'if only'],
  Romance: ['love', 'kiss', 'baby', 'darling', 'hold me', 'romance', 'lover', 'heart', 'together', 'forever'],
  Introspection: ['think', 'wonder', 'mirror', 'inside', 'soul', 'mind', 'question', 'who am i', 'reflect'],
  Melancholy: ['sad', 'blue', 'rain', 'grey', 'gray', 'melancholy', 'gloom', 'heavy', 'down'],
  Euphoric: ['high', 'alive', 'ecstatic', 'party', 'dance', 'celebrate', 'euphoria', 'fly', 'lit', 'vibes'],
  Dark: ['dark', 'shadow', 'death', 'dead', 'blood', 'demon', 'hell', 'nightmare', 'void', 'black'],
  Dreamy: ['dream', 'dreaming', 'clouds', 'float', 'haze', 'neon', 'star', 'space', 'surreal', 'fade'],
}

export function analyzeEmotions(lyrics: string): { scores: EmotionScore[]; narrative: string } {
  const lower = lyrics.toLowerCase()
  const raw: Record<string, number> = {}
  let total = 0

  for (const [emotion, words] of Object.entries(LEXICON)) {
    let score = 0
    for (const w of words) {
      const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi')
      const m = lower.match(re)
      if (m) score += m.length
    }
    raw[emotion] = score
    total += score
  }

  if (total === 0) {
    return {
      scores: [
        { emotion: 'Introspection', percent: 40 },
        { emotion: 'Melancholy', percent: 30 },
        { emotion: 'Hope', percent: 20 },
        { emotion: 'Confidence', percent: 10 },
      ],
      narrative:
        'Limited emotional keyword hits — defaulting to a reflective blend. Paste more verse content for a tighter read. (Estimate)',
    }
  }

  const sorted = Object.entries(raw)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const sum = sorted.reduce((a, [, v]) => a + v, 0)
  let scores: EmotionScore[] = sorted.map(([emotion, v]) => ({
    emotion,
    percent: Math.round((v / sum) * 100),
  }))
  // Fix rounding to 100
  const diff = 100 - scores.reduce((a, s) => a + s.percent, 0)
  if (scores.length) scores[0].percent += diff

  const top = scores[0]?.emotion || 'Introspection'
  const second = scores[1]?.emotion
  const narrative = [
    `Emotional progression (estimate): the lyric leans ${top}${second ? ` with secondary ${second}` : ''}.`,
    scores.length >= 3
      ? `Verses likely carry the denser ${scores.slice(0, 2).map((s) => s.emotion.toLowerCase()).join('/')} weight; hooks may lift toward ${(scores[2] || scores[0]).emotion.toLowerCase()}.`
      : 'Keep the vocal intimate on verses and open up slightly on the hook.',
  ].join(' ')

  return { scores, narrative }
}
