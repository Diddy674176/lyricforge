export type CleanMode = 'exact' | 'natural' | 'radio'
export type CleaningLevel = 'off' | 'light' | 'radio' | 'full'
export type Preservation = 'low' | 'medium' | 'maximum'

export interface CleanSettings {
  mode: CleanMode
  level: CleaningLevel
  flowPreservation: Preservation
  meaningPreservation: Preservation
  rhymePreservation: Preservation
}

export interface WordReplacement {
  original: string
  replacement: string
  lineIndex: number
  wordIndex: number
  originalSyllables: number
  replacementSyllables: number
  alternatives: string[]
  flowMatch: number
  rhymeMatch: number
  meaningMatch: number
}

export interface CleanResult {
  cleaned: string
  replacements: WordReplacement[]
  highlightedHtml: string
  scores: {
    flowMatch: number
    syllableMatch: number
    rhymeMatch: number
    meaningMatch: number
  }
}

export interface StructureSection {
  label: string
  lines: string[]
  startLine: number
  endLine: number
}

export interface RhymeScheme {
  sectionLabel: string
  scheme: string[]
  endSounds: string[]
  notes: string[]
}

export interface EmotionScore {
  emotion: string
  percent: number
}

export interface SongAnalysis {
  structure: StructureSection[]
  structuredLyrics: string
  flow: string
  rhyme: RhymeScheme[]
  rhymeSummary: string
  vocal: string
  emotions: EmotionScore[]
  emotionNarrative: string
  production: string
  sunoPrompt: string
  stats: {
    words: number
    lines: number
    chars: number
    uniqueWords: number
    avgSyllablesPerLine: number
  }
  cleaned: CleanResult
}

export const DEFAULT_SETTINGS: CleanSettings = {
  mode: 'exact',
  level: 'radio',
  flowPreservation: 'maximum',
  meaningPreservation: 'maximum',
  rhymePreservation: 'maximum',
}
