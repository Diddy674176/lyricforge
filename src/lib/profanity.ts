import { countSyllables } from './syllables'
import type { CleanMode, CleaningLevel, CleanResult, CleanSettings, WordReplacement } from './types'

/** Local synonym lists — client-side only, no external API. */
type Entry = { word: string; alts: Record<CleanMode, string[]> }

const ENTRIES: Entry[] = [
  { word: 'fuck', alts: { exact: ['freak', 'flip', 'fudge'], natural: ['damn', 'heck', 'mess'], radio: ['freak', 'dang', 'fudge'] } },
  { word: 'fucking', alts: { exact: ['freaking', 'flipping', 'effing'], natural: ['really', 'seriously', 'damn'], radio: ['freaking', 'flipping', 'dang'] } },
  { word: 'fucked', alts: { exact: ['messed', 'wrecked', 'screwed'], natural: ['ruined', 'messed', 'broken'], radio: ['messed', 'wrecked', 'done'] } },
  { word: 'fuckin', alts: { exact: ['freakin', 'flippin', 'effin'], natural: ['really', 'damn', 'wild'], radio: ['freakin', 'flippin', 'dang'] } },
  { word: 'shit', alts: { exact: ['stuff', 'trash', 'mess'], natural: ['crap', 'junk', 'mess'], radio: ['stuff', 'trash', 'mess'] } },
  { word: 'bullshit', alts: { exact: ['nonsense', 'garbage', 'rubbish'], natural: ['nonsense', 'garbage', 'lies'], radio: ['nonsense', 'garbage', 'BS'] } },
  { word: 'bitch', alts: { exact: ['witch', 'snitch', 'switch'], natural: ['girl', 'foe', 'rival'], radio: ['witch', 'chick', 'foe'] } },
  { word: 'bitches', alts: { exact: ['witches', 'snitches', 'switches'], natural: ['haters', 'rivals', 'foes'], radio: ['witches', 'haters', 'foes'] } },
  { word: 'ass', alts: { exact: ['butt', 'rear', 'self'], natural: ['butt', 'self', 'back'], radio: ['butt', 'rear', 'self'] } },
  { word: 'asshole', alts: { exact: ['jerk', 'fool', 'clown'], natural: ['jerk', 'idiot', 'fool'], radio: ['jerk', 'fool', 'clown'] } },
  { word: 'damn', alts: { exact: ['dang', 'darn', 'dang'], natural: ['dang', 'man', 'wow'], radio: ['dang', 'darn', 'hey'] } },
  { word: 'damned', alts: { exact: ['darned', 'cursed', 'doomed'], natural: ['cursed', 'doomed', 'wrecked'], radio: ['darned', 'cursed', 'doomed'] } },
  { word: 'hell', alts: { exact: ['heck', 'hay', 'pain'], natural: ['heck', 'chaos', 'fire'], radio: ['heck', 'pain', 'dark'] } },
  { word: 'piss', alts: { exact: ['tick', 'irk', 'vex'], natural: ['annoy', 'bug', 'irk'], radio: ['tick', 'irk', 'bug'] } },
  { word: 'pissed', alts: { exact: ['ticked', 'irked', 'mad'], natural: ['angry', 'ticked', 'mad'], radio: ['ticked', 'mad', 'heated'] } },
  { word: 'dick', alts: { exact: ['dude', 'jerk', 'fool'], natural: ['dude', 'guy', 'jerk'], radio: ['dude', 'guy', 'fool'] } },
  { word: 'cock', alts: { exact: ['dude', 'jerk', 'fool'], natural: ['guy', 'jerk', 'fool'], radio: ['dude', 'guy', 'fool'] } },
  { word: 'pussy', alts: { exact: ['scaredy', 'coward', 'softie'], natural: ['coward', 'scared', 'soft'], radio: ['coward', 'scaredy', 'softie'] } },
  { word: 'bastard', alts: { exact: ['rascal', 'scoundrel', 'villain'], natural: ['jerk', 'villain', 'traitor'], radio: ['rascal', 'jerk', 'villain'] } },
  { word: 'whore', alts: { exact: ['sore', 'foe', 'snare'], natural: ['traitor', 'liar', 'fake'], radio: ['foe', 'fake', 'liar'] } },
  { word: 'slut', alts: { exact: ['nut', 'cut', 'rut'], natural: ['flirt', 'player', 'fake'], radio: ['flirt', 'fake', 'player'] } },
  { word: 'nigga', alts: { exact: ['homie', 'brother', 'partner'], natural: ['homie', 'brother', 'friend'], radio: ['homie', 'brother', 'partner'] } },
  { word: 'nigger', alts: { exact: ['person', 'brother', 'partner'], natural: ['person', 'friend', 'brother'], radio: ['person', 'friend', 'brother'] } },
  { word: 'faggot', alts: { exact: ['loser', 'hater', 'coward'], natural: ['hater', 'loser', 'foe'], radio: ['loser', 'hater', 'foe'] } },
  { word: 'fag', alts: { exact: ['foe', 'dude', 'guy'], natural: ['dude', 'guy', 'foe'], radio: ['dude', 'guy', 'foe'] } },
  { word: 'cunt', alts: { exact: ['jerk', 'fool', 'clown'], natural: ['jerk', 'idiot', 'fool'], radio: ['jerk', 'fool', 'clown'] } },
  { word: 'motherfucker', alts: { exact: ['motherlover', 'troublemaker', 'heartbreaker'], natural: ['jerk', 'villain', 'hater'], radio: ['troublemaker', 'heartbreaker', 'jerk'] } },
  { word: 'motherfuckin', alts: { exact: ['motherlovin', 'everlovin', 'godforsaken'], natural: ['darn', 'crazy', 'wild'], radio: ['everlovin', 'godforsaken', 'crazy'] } },
  { word: 'goddamn', alts: { exact: ['gol-darn', 'doggone', 'dang'], natural: ['darn', 'dang', 'crazy'], radio: ['doggone', 'dang', 'darn'] } },
  { word: 'goddamned', alts: { exact: ['gol-darned', 'doggone', 'cursed'], natural: ['cursed', 'darn', 'crazy'], radio: ['doggone', 'cursed', 'darn'] } },
]

const LIGHT = new Set(['fuck', 'fucking', 'fucked', 'fuckin', 'shit', 'bullshit', 'bitch', 'bitches', 'asshole', 'motherfucker', 'motherfuckin', 'cunt', 'nigga', 'nigger', 'faggot', 'fag', 'whore', 'slut'])
const RADIO = new Set([...LIGHT, 'damn', 'damned', 'hell', 'piss', 'pissed', 'dick', 'cock', 'pussy', 'bastard', 'ass', 'goddamn', 'goddamned'])
const FULL = new Set([...RADIO])

function levelAllows(word: string, level: CleaningLevel): boolean {
  if (level === 'off') return false
  if (level === 'light') return LIGHT.has(word)
  if (level === 'radio') return RADIO.has(word)
  return FULL.has(word)
}

function findEntry(raw: string): Entry | undefined {
  const key = raw.toLowerCase().replace(/[^a-z']/g, '')
  return ENTRIES.find((e) => e.word === key)
}

function matchCase(source: string, replacement: string): string {
  if (!source) return replacement
  if (source === source.toUpperCase()) return replacement.toUpperCase()
  if (source[0] === source[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1)
  }
  return replacement
}

function endSound(word: string): string {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (w.length <= 2) return w
  const m = w.match(/([aeiouy]*[^aeiouy]*[aeiouy]+[^aeiouy]*)$/)
  return m ? m[1] : w.slice(-3)
}

function pickBest(
  original: string,
  alts: string[],
  mode: CleanMode,
  settings: CleanSettings,
): { choice: string; flow: number; rhyme: number; meaning: number } {
  const oSyl = countSyllables(original)
  const oEnd = endSound(original)
  let best = alts[0] || original
  let bestScore = -1
  let bestFlow = 0
  let bestRhyme = 0
  let bestMeaning = 70

  const flowW = settings.flowPreservation === 'maximum' ? 3 : settings.flowPreservation === 'medium' ? 2 : 1
  const rhymeW = settings.rhymePreservation === 'maximum' ? 3 : settings.rhymePreservation === 'medium' ? 2 : 1
  const meaningW = settings.meaningPreservation === 'maximum' ? 2 : 1

  for (const alt of alts) {
    const sSyl = countSyllables(alt)
    const sylDiff = Math.abs(sSyl - oSyl)
    const flow = Math.max(0, 100 - sylDiff * 25 - Math.abs(alt.length - original.length) * 5)
    const rhyme = endSound(alt) === oEnd ? 100 : endSound(alt).slice(-2) === oEnd.slice(-2) ? 70 : 40
    const meaning = mode === 'radio' ? 85 : mode === 'exact' ? 75 : 80
    const score = flow * flowW + rhyme * rhymeW + meaning * meaningW
    if (score > bestScore) {
      bestScore = score
      best = alt
      bestFlow = flow
      bestRhyme = rhyme
      bestMeaning = meaning
    }
  }
  return { choice: best, flow: bestFlow, rhyme: bestRhyme, meaning: bestMeaning }
}

export function cleanLyrics(text: string, settings: CleanSettings): CleanResult {
  if (!text.trim() || settings.level === 'off') {
    return {
      cleaned: text,
      replacements: [],
      highlightedHtml: escapeHtml(text).replace(/\n/g, '<br/>'),
      scores: { flowMatch: 100, syllableMatch: 100, rhymeMatch: 100, meaningMatch: 100 },
    }
  }

  const lines = text.split('\n')
  const replacements: WordReplacement[] = []
  const outLines: string[] = []
  const highlightParts: string[] = []

  let flowSum = 0
  let sylSum = 0
  let rhymeSum = 0
  let meaningSum = 0
  let n = 0

  lines.forEach((line, lineIndex) => {
    const tokens = line.split(/(\s+)/)
    let wordIndex = 0
    const outTokens: string[] = []
    const hiTokens: string[] = []

    for (const tok of tokens) {
      if (/^\s+$/.test(tok) || tok === '') {
        outTokens.push(tok)
        hiTokens.push(tok)
        continue
      }
      const entry = findEntry(tok)
      const key = tok.toLowerCase().replace(/[^a-z']/g, '')
      if (entry && levelAllows(key, settings.level)) {
        const { choice, flow, rhyme, meaning } = pickBest(key, entry.alts[settings.mode], settings.mode, settings)
        const replacement = matchCase(tok, choice)
        const oSyl = countSyllables(key)
        const rSyl = countSyllables(choice)
        replacements.push({
          original: tok,
          replacement,
          lineIndex,
          wordIndex,
          originalSyllables: oSyl,
          replacementSyllables: rSyl,
          alternatives: entry.alts[settings.mode].map((a) => matchCase(tok, a)),
          flowMatch: flow,
          rhymeMatch: rhyme,
          meaningMatch: meaning,
        })
        outTokens.push(replacement)
        hiTokens.push(`<mark class="changed" data-i="${replacements.length - 1}" title="${escapeHtml(tok)} → ${escapeHtml(replacement)}">${escapeHtml(replacement)}</mark>`)
        flowSum += flow
        sylSum += oSyl === rSyl ? 100 : Math.max(0, 100 - Math.abs(oSyl - rSyl) * 30)
        rhymeSum += rhyme
        meaningSum += meaning
        n++
      } else {
        outTokens.push(tok)
        hiTokens.push(escapeHtml(tok))
      }
      wordIndex++
    }
    outLines.push(outTokens.join(''))
    highlightParts.push(hiTokens.join(''))
  })

  const cleaned = outLines.join('\n')
  const scores =
    n === 0
      ? { flowMatch: 100, syllableMatch: 100, rhymeMatch: 100, meaningMatch: 100 }
      : {
          flowMatch: Math.round(flowSum / n),
          syllableMatch: Math.round(sylSum / n),
          rhymeMatch: Math.round(rhymeSum / n),
          meaningMatch: Math.round(meaningSum / n),
        }

  return {
    cleaned,
    replacements,
    highlightedHtml: highlightParts.join('<br/>'),
    scores,
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
