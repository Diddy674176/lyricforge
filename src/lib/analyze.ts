import { cleanLyrics } from './profanity'
import { detectStructure, formatStructuredLyrics } from './structure'
import { analyzeRhymes } from './rhyme'
import { analyzeFlow } from './flow'
import { analyzeEmotions } from './emotion'
import { analyzeVocal } from './vocal'
import { analyzeProduction, buildSunoPrompt } from './production'
import { lineSyllables, tokenizeWords } from './syllables'
import type { CleanSettings, SongAnalysis } from './types'

export function analyzeSong(
  lyrics: string,
  settings: CleanSettings,
  songReference?: string,
): SongAnalysis {
  const structure = detectStructure(lyrics)
  const structuredLyrics = formatStructuredLyrics(structure)
  const { schemes, summary: rhymeSummary } = analyzeRhymes(structure.length ? structure : detectStructure(lyrics || ' '))
  const flow = analyzeFlow(lyrics, structure)
  const { scores: emotions, narrative: emotionNarrative } = analyzeEmotions(lyrics)
  const vocal = analyzeVocal(lyrics, emotions, songReference)
  const production = analyzeProduction(lyrics, emotions, songReference)
  const sunoPrompt = buildSunoPrompt(production, vocal, emotions, flow)
  const cleaned = cleanLyrics(lyrics, settings)

  const lines = lyrics.split('\n').filter((l) => l.trim())
  const words = tokenizeWords(lyrics)
  const contentLines = lyrics.split('\n').filter((l) => l.trim() && !/^\s*\[/.test(l))
  const avgSyl =
    contentLines.length === 0
      ? 0
      : contentLines.map(lineSyllables).reduce((a, b) => a + b, 0) / contentLines.length

  return {
    structure,
    structuredLyrics,
    flow,
    rhyme: schemes,
    rhymeSummary,
    vocal,
    emotions,
    emotionNarrative,
    production,
    sunoPrompt,
    cleaned,
    stats: {
      words: words.length,
      lines: lines.length,
      chars: lyrics.length,
      uniqueWords: new Set(words.map((w) => w.toLowerCase())).size,
      avgSyllablesPerLine: Math.round(avgSyl * 10) / 10,
    },
  }
}

export function processEverything(
  lyrics: string,
  settings: CleanSettings,
  songReference?: string,
): SongAnalysis {
  return analyzeSong(lyrics, settings, songReference)
}
