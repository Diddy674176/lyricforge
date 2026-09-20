import type { SongAnalysis } from './types'

export function buildEverythingText(original: string, analysis: SongAnalysis, songReference?: string): string {
  const emotions = analysis.emotions.map((e) => `${e.emotion} — ${e.percent}%`).join('\n')
  return [
    '=== LyricForge Export ===',
    '',
    '--- LYRICS PROVIDED BY USER ---',
    original,
    '',
    '--- CLEAN LYRICS ---',
    analysis.cleaned.cleaned,
    '',
    '--- SONG STRUCTURE ---',
    analysis.structuredLyrics,
    '',
    '--- FLOW ANALYSIS (estimates) ---',
    analysis.flow,
    '',
    '--- RHYME ANALYSIS (estimates) ---',
    analysis.rhymeSummary,
    '',
    '--- VOCAL DELIVERY ---',
    analysis.vocal,
    '',
    '--- EMOTIONS (estimates) ---',
    emotions,
    analysis.emotionNarrative,
    '',
    '--- PRODUCTION ---',
    analysis.production,
    '',
    '--- SUNO STYLE ---',
    analysis.sunoPrompt,
    '',
    songReference ? `--- SONG REFERENCE (style hints only) ---\n${songReference}\n` : '',
    '--- PRESERVATION SCORES (estimates) ---',
    `Flow Match: ${analysis.cleaned.scores.flowMatch}%`,
    `Syllable Match: ${analysis.cleaned.scores.syllableMatch}%`,
    `Rhyme Match: ${analysis.cleaned.scores.rhymeMatch}%`,
    `Meaning Match: ${analysis.cleaned.scores.meaningMatch}%`,
  ]
    .filter((x) => x !== undefined)
    .join('\n')
}

export function buildEverythingMarkdown(original: string, analysis: SongAnalysis, songReference?: string): string {
  const emotions = analysis.emotions.map((e) => `- **${e.emotion}** — ${e.percent}%`).join('\n')
  return [
    '# LyricForge Export',
    '',
    '## Lyrics Provided by User',
    '```',
    original,
    '```',
    '',
    '## Clean Lyrics',
    '```',
    analysis.cleaned.cleaned,
    '```',
    '',
    '## Song Structure',
    '```',
    analysis.structuredLyrics,
    '```',
    '',
    '## Flow Analysis *(estimates)*',
    analysis.flow,
    '',
    '## Rhyme Analysis *(estimates)*',
    '```',
    analysis.rhymeSummary,
    '```',
    '',
    '## Vocal Delivery',
    analysis.vocal,
    '',
    '## Emotions *(estimates)*',
    emotions,
    '',
    analysis.emotionNarrative,
    '',
    '## Production',
    analysis.production,
    '',
    '## Suno Style',
    '```',
    analysis.sunoPrompt,
    '```',
    '',
    songReference ? `## Song Reference (style hints only)\n${songReference}\n` : '',
    '## Preservation Scores *(estimates)*',
    `- Flow Match: ${analysis.cleaned.scores.flowMatch}%`,
    `- Syllable Match: ${analysis.cleaned.scores.syllableMatch}%`,
    `- Rhyme Match: ${analysis.cleaned.scores.rhymeMatch}%`,
    `- Meaning Match: ${analysis.cleaned.scores.meaningMatch}%`,
  ].join('\n')
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
