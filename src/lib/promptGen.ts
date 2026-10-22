// Suno prompt generator — pure, client-side.

export interface GenreDef {
  name: string
  bpm: number
  subs: string[]
  instruments: string[]
}

export const GENRES: GenreDef[] = [
  { name: 'Hip-Hop', bpm: 90, subs: ['Boom Bap', 'Trap', 'Drill', 'UK Drill', 'Cloud Rap', 'Conscious Hip-Hop', 'G-Funk', 'Phonk', 'Rage', 'Jersey Club', 'Memphis Rap', 'Plugg'], instruments: ['808s', 'hi-hats', 'sampled piano', 'vinyl crackle'] },
  { name: 'R&B', bpm: 72, subs: ['Contemporary R&B', 'Neo-Soul', 'Alt R&B', '90s R&B', 'Trap Soul', 'Quiet Storm', 'New Jack Swing'], instruments: ['Rhodes', 'bass guitar', 'soft drums', 'strings'] },
  { name: 'Pop', bpm: 118, subs: ['Dance Pop', 'Synth-Pop', 'Electropop', 'Indie Pop', 'Bedroom Pop', 'K-Pop', 'Dream Pop', 'Hyperpop', 'Teen Pop', 'Power Pop'], instruments: ['synths', 'claps', 'bass', 'drum machine'] },
  { name: 'Rock', bpm: 124, subs: ['Classic Rock', 'Alternative Rock', 'Indie Rock', 'Punk Rock', 'Pop Punk', 'Grunge', 'Garage Rock', 'Post-Rock', 'Psychedelic Rock', 'Shoegaze', 'Emo'], instruments: ['electric guitar', 'bass guitar', 'live drums'] },
  { name: 'Metal', bpm: 150, subs: ['Heavy Metal', 'Thrash Metal', 'Death Metal', 'Black Metal', 'Metalcore', 'Nu Metal', 'Djent', 'Doom Metal', 'Power Metal', 'Symphonic Metal'], instruments: ['distorted guitars', 'double kick drums', 'bass guitar'] },
  { name: 'EDM', bpm: 128, subs: ['House', 'Deep House', 'Tech House', 'Progressive House', 'Techno', 'Trance', 'Dubstep', 'Drum and Bass', 'Future Bass', 'Big Room', 'Hardstyle', 'UK Garage', 'Melodic Techno', 'Amapiano'], instruments: ['supersaw synths', 'sidechained bass', 'four-on-the-floor kick', 'risers'] },
  { name: 'Country', bpm: 100, subs: ['Modern Country', 'Country Pop', 'Outlaw Country', 'Bluegrass', 'Americana', 'Country Rock', 'Honky Tonk'], instruments: ['acoustic guitar', 'pedal steel', 'fiddle', 'banjo'] },
  { name: 'Lo-Fi', bpm: 80, subs: ['Lo-Fi Hip-Hop', 'Chillhop', 'Lo-Fi Jazz', 'Lo-Fi House', 'Study Beats'], instruments: ['dusty drums', 'Rhodes', 'vinyl crackle', 'mellow bass'] },
  { name: 'Afrobeats', bpm: 105, subs: ['Afrobeats', 'Afro-Fusion', 'Afro-Swing', 'Afro-House', 'Highlife', 'Alté'], instruments: ['log drums', 'shakers', 'guitar licks', 'talking drum'] },
  { name: 'Latin', bpm: 95, subs: ['Reggaeton', 'Latin Trap', 'Dembow', 'Bachata', 'Salsa', 'Cumbia', 'Corridos Tumbados', 'Latin Pop'], instruments: ['dembow drums', 'congas', 'nylon guitar', 'brass'] },
  { name: 'Gospel', bpm: 88, subs: ['Contemporary Gospel', 'Traditional Gospel', 'Worship', 'Gospel Choir', 'Christian Hip-Hop'], instruments: ['Hammond organ', 'piano', 'choir', 'live drums'] },
  { name: 'Reggae', bpm: 76, subs: ['Roots Reggae', 'Dancehall', 'Dub', 'Lovers Rock', 'Reggae Fusion'], instruments: ['offbeat skank guitar', 'deep bass', 'organ bubble'] },
  { name: 'Jazz', bpm: 110, subs: ['Smooth Jazz', 'Bebop', 'Jazz Fusion', 'Swing', 'Nu Jazz', 'Bossa Nova'], instruments: ['upright bass', 'saxophone', 'brushed drums', 'piano'] },
  { name: 'Soul / Funk', bpm: 104, subs: ['Classic Soul', 'Motown', 'Funk', 'Disco', 'Nu-Disco', 'Boogie'], instruments: ['slap bass', 'horn section', 'wah guitar', 'clavinet'] },
  { name: 'Folk / Acoustic', bpm: 92, subs: ['Indie Folk', 'Singer-Songwriter', 'Folk Rock', 'Celtic Folk', 'Acoustic Ballad'], instruments: ['acoustic guitar', 'harmonica', 'mandolin', 'cello'] },
  { name: 'Blues', bpm: 84, subs: ['Delta Blues', 'Chicago Blues', 'Blues Rock', 'Soul Blues'], instruments: ['slide guitar', 'harmonica', 'organ'] },
  { name: 'Cinematic', bpm: 90, subs: ['Epic Orchestral', 'Film Score', 'Ambient', 'Trailer Music', 'Video Game Music', 'Synthwave'], instruments: ['orchestra', 'taiko drums', 'choir', 'piano'] },
]

export const MOODS = ['Happy', 'Sad', 'Melancholic', 'Hype', 'Aggressive', 'Dark', 'Romantic', 'Chill', 'Dreamy', 'Nostalgic', 'Euphoric', 'Angry', 'Hopeful', 'Mysterious', 'Triumphant', 'Sensual', 'Anxious', 'Uplifting', 'Bittersweet', 'Playful']
export const ENERGIES = ['Low', 'Medium', 'High', 'Explosive']
export const KEYS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
export const MODES = ['major', 'minor', 'dorian', 'phrygian', 'mixolydian']
export const VOCAL_TYPES = ['Male vocals', 'Female vocals', 'Duet', 'Choir', 'Rap', 'Melodic rap', 'Instrumental (no vocals)']
export const DELIVERIES = ['raspy', 'airy', 'breathy', 'auto-tuned', 'powerful belting', 'falsetto', 'smooth', 'gritty', 'whispered', 'soulful runs', 'fast flow', 'laid-back flow', 'chopped', 'vocal harmonies', 'ad-libs', 'spoken word', 'operatic', 'screamed']
export const INSTRUMENTS = ['808s', 'hi-hats', 'trap snares', 'live drums', 'drum machine', 'acoustic guitar', 'electric guitar', 'distorted guitars', 'bass guitar', 'slap bass', 'sub bass', 'piano', 'Rhodes', 'Hammond organ', 'synths', 'supersaw synths', 'arpeggiated synth', 'pads', 'strings', 'orchestra', 'brass', 'saxophone', 'trumpet', 'flute', 'violin', 'cello', 'choir', 'log drums', 'congas', 'steel drums', 'banjo', 'fiddle', 'pedal steel', 'harmonica', 'sitar', 'koto', 'vinyl crackle', 'risers', 'claps', 'bells']
export const PRODUCTION = ['polished', 'lo-fi', 'raw', 'punchy mix', 'wide stereo', 'heavy bass', 'crisp highs', 'warm analog', 'tape saturation', 'reverb-drenched', 'dry and intimate', 'sidechain pumping', 'big drop', 'minimal', 'layered', 'radio-ready', 'live room feel', 'glitchy', 'cinematic build']
export const ERAS = ['', '60s', '70s', '80s', '90s', '2000s', '2010s', 'modern', 'futuristic']

export interface Section { tag: string; lines: number }
export const STRUCTURES: Record<string, Section[]> = {
  'Standard (V-C-V-C-B-C)': [
    { tag: 'Intro', lines: 0 }, { tag: 'Verse 1', lines: 8 }, { tag: 'Pre-Chorus', lines: 2 }, { tag: 'Chorus', lines: 4 },
    { tag: 'Verse 2', lines: 8 }, { tag: 'Pre-Chorus', lines: 2 }, { tag: 'Chorus', lines: 4 }, { tag: 'Bridge', lines: 4 },
    { tag: 'Chorus', lines: 4 }, { tag: 'Outro', lines: 2 },
  ],
  'Hip-Hop (16s + hooks)': [
    { tag: 'Intro', lines: 2 }, { tag: 'Hook', lines: 4 }, { tag: 'Verse 1', lines: 16 }, { tag: 'Hook', lines: 4 },
    { tag: 'Verse 2', lines: 16 }, { tag: 'Hook', lines: 4 }, { tag: 'Outro', lines: 2 },
  ],
  'EDM (build + drop)': [
    { tag: 'Intro', lines: 0 }, { tag: 'Verse', lines: 4 }, { tag: 'Build', lines: 2 }, { tag: 'Drop', lines: 0 },
    { tag: 'Break', lines: 4 }, { tag: 'Build', lines: 2 }, { tag: 'Drop', lines: 0 }, { tag: 'Outro', lines: 0 },
  ],
  'Ballad': [
    { tag: 'Intro', lines: 0 }, { tag: 'Verse 1', lines: 6 }, { tag: 'Chorus', lines: 4 }, { tag: 'Verse 2', lines: 6 },
    { tag: 'Chorus', lines: 4 }, { tag: 'Instrumental break', lines: 0 }, { tag: 'Bridge', lines: 4 }, { tag: 'Final Chorus', lines: 4 }, { tag: 'Outro', lines: 2 },
  ],
  'Short (V-C-V-C)': [
    { tag: 'Verse 1', lines: 6 }, { tag: 'Chorus', lines: 4 }, { tag: 'Verse 2', lines: 6 }, { tag: 'Chorus', lines: 4 }, { tag: 'End', lines: 0 },
  ],
  'Instrumental': [
    { tag: 'Intro', lines: 0 }, { tag: 'Main Theme', lines: 0 }, { tag: 'Instrumental break', lines: 0 }, { tag: 'Solo', lines: 0 },
    { tag: 'Main Theme', lines: 0 }, { tag: 'Outro', lines: 0 },
  ],
}

// Artist name → descriptive traits. Suno blocks artist names; we describe the sound instead.
export const ARTIST_TRAITS: Record<string, string> = {
  'drake': 'moody melodic rap, smooth R&B-tinged hooks, atmospheric trap',
  'kendrick lamar': 'conscious West Coast rap, intricate shifting flows, jazzy samples',
  'travis scott': 'psychedelic trap, heavy auto-tuned vocals, dark reverb-soaked ad-libs',
  'future': 'melodic trap, auto-tuned melancholy vocals, booming 808s',
  'lil baby': 'rapid melodic trap flow, Atlanta trap beats',
  'young thug': 'eccentric melodic trap, elastic warbling vocals',
  'playboi carti': 'rage beats, minimal repetitive hooks, high-pitched baby-voice delivery',
  'kanye west': 'soulful chopped samples, bold maximalist production, gospel touches',
  'eminem': 'rapid-fire technical rap, aggressive multisyllabic rhymes',
  'jay-z': 'confident laid-back East Coast rap, soulful sample beats',
  'nas': 'gritty East Coast boom bap, vivid storytelling rap',
  'j. cole': 'introspective rap, warm jazzy boom bap, soulful samples',
  'j cole': 'introspective rap, warm jazzy boom bap, soulful samples',
  '21 savage': 'menacing monotone trap, dark minimal beats',
  'pop smoke': 'Brooklyn drill, deep gravelly vocals, sliding 808s',
  'central cee': 'UK drill, laid-back melodic flow, sliding bass',
  'nicki minaj': 'playful animated female rap, character voices, pop-rap hooks',
  'cardi b': 'brash energetic female rap, punchy club trap',
  'doja cat': 'playful pop-rap, disco-tinged grooves, sultry female vocals',
  'megan thee stallion': 'confident Southern female rap, bouncy trap',
  'snoop dogg': 'laid-back G-funk, smooth drawl, West Coast synth leads',
  'tupac': 'passionate 90s West Coast rap, G-funk, emotional storytelling',
  '2pac': 'passionate 90s West Coast rap, G-funk, emotional storytelling',
  'biggie': '90s East Coast rap, smooth heavy-voiced flow, soulful samples',
  'the weeknd': 'dark 80s synth-pop, falsetto male vocals, nocturnal atmosphere',
  'sza': 'alt R&B, airy conversational female vocals, lush dreamy production',
  'frank ocean': 'introspective alt R&B, minimal warm production, falsetto',
  'beyonce': 'powerful female R&B pop vocals, bold layered production',
  'beyoncé': 'powerful female R&B pop vocals, bold layered production',
  'rihanna': 'Caribbean-tinged pop R&B, confident sultry female vocals',
  'usher': 'smooth 2000s R&B, silky male vocals, dance grooves',
  'chris brown': 'slick R&B pop, agile male vocals, dance energy',
  'bryson tiller': 'trap soul, moody R&B over trap drums',
  'taylor swift': 'narrative pop, bright catchy hooks, confessional female vocals',
  'ariana grande': 'airy high-register female pop, whistle notes, R&B-pop beats',
  'billie eilish': 'whispery intimate female vocals, dark minimal bedroom pop, deep sub bass',
  'olivia rodrigo': 'angsty pop punk, emotional female vocals, driving guitars',
  'dua lipa': 'retro disco-pop, groovy bass, confident female vocals',
  'ed sheeran': 'acoustic pop, looped guitar, warm male vocals',
  'justin bieber': 'smooth pop R&B, light male vocals, polished beats',
  'bruno mars': 'retro funk-pop, energetic male vocals, live horns',
  'lady gaga': 'theatrical dance-pop, powerful female vocals',
  'harry styles': '70s soft-rock-inflected pop, warm male vocals',
  'adele': 'soulful piano ballad, powerful emotive female vocals',
  'sabrina carpenter': 'cheeky retro pop, bright female vocals',
  'post malone': 'genre-blending melodic rap-rock, raspy sung male vocals',
  'bad bunny': 'Latin trap and reggaeton, deep baritone male vocals',
  'karol g': 'romantic reggaeton, bright female vocals',
  'j balvin': 'colorful reggaeton pop, smooth male vocals',
  'burna boy': 'Afro-fusion, warm grooves, smooth male vocals',
  'wizkid': 'smooth Afrobeats, laid-back male vocals, lilting guitars',
  'rema': 'Afro-rave, melodic auto-tuned male vocals',
  'tems': 'smoky alt R&B with Afro influences, deep female vocals',
  'bob marley': 'roots reggae, warm offbeat guitar, soulful male vocals',
  'metallica': 'thrash metal, fast palm-muted riffs, gritty male vocals',
  'linkin park': 'nu metal, rap-rock verses, soaring screamed choruses',
  'nirvana': '90s grunge, raw distorted guitars, raspy male vocals',
  'foo fighters': 'anthemic alternative rock, big guitars, shouted male vocals',
  'arctic monkeys': 'indie rock, wry crooned male vocals, groovy guitar',
  'radiohead': 'atmospheric art rock, haunting falsetto, experimental textures',
  'queen': 'theatrical 70s arena rock, layered harmonies, piano',
  'the beatles': '60s British pop rock, jangly guitars, vocal harmonies',
  'green day': 'pop punk, fast power chords, snotty male vocals',
  'slipknot': 'aggressive nu metal, heavy percussion, screamed vocals',
  'morgan wallen': 'modern country, Southern twang male vocals, rock-tinged drums',
  'luke combs': 'country, warm baritone male vocals, acoustic and steel guitar',
  'dolly parton': 'classic country, bright twangy female vocals, acoustic',
  'johnny cash': 'outlaw country, deep baritone, boom-chicka rhythm',
  'zach bryan': 'raw Americana, heartfelt raspy male vocals, acoustic',
  'daft punk': 'French house, vocoder vocals, funky filtered loops',
  'skrillex': 'aggressive dubstep, glitchy wobble bass drops',
  'calvin harris': 'radio dance-pop, bright house synths',
  'avicii': 'folk-tinged progressive house, euphoric piano leads',
  'fred again': 'emotional UK house, chopped vocal samples',
  'kirk franklin': 'contemporary gospel, energetic choir, funky grooves',
  'michael jackson': 'energetic 80s pop-funk, crisp grooves, signature hiccup ad-libs',
  'prince': 'Minneapolis funk-pop, falsetto, synth and guitar',
  'whitney houston': 'soaring powerhouse female ballad vocals',
  'frank sinatra': 'swing jazz crooner, big band',
  'nujabes': 'jazzy lo-fi hip-hop, mellow piano and sax samples',
  'hans zimmer': 'epic cinematic orchestral, pulsing strings, huge brass',
}

const TITLE_CASE = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase())

export interface ArtistFix { cleaned: string; converted: { name: string; traits: string }[]; flagged: string[] }

/** Replace any known artist names with descriptive traits; strip "like X"/"style of X" phrasing. */
export function sanitizeArtists(input: string): ArtistFix {
  let text = input
  const converted: { name: string; traits: string }[] = []
  const names = Object.keys(ARTIST_TRAITS).sort((a, b) => b.length - a.length)
  for (const n of names) {
    const re = new RegExp(`(?:(?:in the )?style of |sounds? like |like |inspired by |à la |a la |by )?\\b${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b(?:['’]s)?(?: style| type beat| vibes?)?`, 'gi')
    if (re.test(text)) {
      converted.push({ name: TITLE_CASE(n), traits: ARTIST_TRAITS[n] })
      text = text.replace(re, ARTIST_TRAITS[n])
    }
  }
  // Leftover "like <Capitalized Name>" patterns we don't know — strip and flag them.
  const flagged: string[] = []
  text = text.replace(/\b(?:in the style of|sounds? like|inspired by|type beat of)\s+([A-Z][\w.'’-]*(?:\s+[A-Z][\w.'’-]*){0,3})/g, (_m, name: string) => {
    flagged.push(name)
    return ''
  })
  text = text.replace(/\s{2,}/g, ' ').replace(/\s+,/g, ',').replace(/,{2,}/g, ',').replace(/^[\s,]+|[\s,]+$/g, '')
  return { cleaned: text, converted, flagged }
}

export interface PromptState {
  genre: string
  sub: string
  mood: string[]
  energy: string
  bpm: number
  bpmAuto: boolean
  key: string
  mode: string
  vocal: string
  delivery: string[]
  instruments: string[]
  production: string[]
  era: string
  structure: string
  custom: string
  exclude: string
  compact: boolean
}

export function defaultState(): PromptState {
  return {
    genre: 'Hip-Hop', sub: 'Trap', mood: ['Dark'], energy: 'High', bpm: 140, bpmAuto: true,
    key: '', mode: 'minor', vocal: 'Rap', delivery: ['auto-tuned'], instruments: ['808s', 'hi-hats'],
    production: ['punchy mix', 'heavy bass'], era: 'modern', structure: 'Hip-Hop (16s + hooks)', custom: '', exclude: '', compact: false,
  }
}

const SUB_BPM: Record<string, number> = {
  Trap: 140, Drill: 142, 'UK Drill': 142, Phonk: 130, Rage: 150, 'Jersey Club': 140, Plugg: 150, 'Boom Bap': 90, 'G-Funk': 94,
  House: 124, 'Deep House': 120, 'Tech House': 126, Techno: 132, Trance: 138, Dubstep: 140, 'Drum and Bass': 174,
  'Future Bass': 150, 'Big Room': 128, Hardstyle: 150, 'UK Garage': 132, 'Melodic Techno': 124, Amapiano: 112,
  Reggaeton: 95, Dembow: 120, Bachata: 128, Salsa: 180, Cumbia: 95, Hyperpop: 160, 'Punk Rock': 170, 'Pop Punk': 165,
  'Thrash Metal': 180, 'Death Metal': 190, 'Doom Metal': 70, Bluegrass: 130, Disco: 118, Funk: 106, Dancehall: 98,
  'Afro-House': 122, Synthwave: 100, 'Trap Soul': 70, 'Neo-Soul': 78, 'New Jack Swing': 108, Swing: 140, Bebop: 200,
}

export function defaultBpm(genre: string, sub: string): number {
  return SUB_BPM[sub] ?? GENRES.find((g) => g.name === genre)?.bpm ?? 100
}

function energyWord(e: string) {
  return ({ Low: 'low-energy', Medium: 'mid-tempo energy', High: 'high-energy', Explosive: 'explosive energy' } as Record<string, string>)[e] ?? ''
}

interface Parts {
  genre: string; era: string; mood: string; energy: string; bpm: string; key: string
  vocal: string; instruments: string; production: string; custom: string
}

function buildParts(s: PromptState, compact: boolean): Parts {
  const custom = sanitizeArtists(s.custom).cleaned
  const vocal = s.vocal.startsWith('Instrumental')
    ? 'instrumental, no vocals'
    : [s.delivery.slice(0, compact ? 1 : 4).join(', '), s.vocal.toLowerCase()].filter(Boolean).join(' ')
  return {
    genre: s.sub && s.sub !== s.genre ? `${s.sub}${compact ? '' : ` ${s.genre.toLowerCase().includes(s.sub.toLowerCase()) ? '' : `(${s.genre.toLowerCase()})`}`}`.trim() : s.genre,
    era: s.era ? (s.era === 'modern' || s.era === 'futuristic' ? s.era : `${s.era}-inspired`) : '',
    mood: s.mood.slice(0, compact ? 2 : 4).map((m) => m.toLowerCase()).join(', '),
    energy: energyWord(s.energy),
    bpm: `${s.bpm} BPM`,
    key: s.key ? `${s.key} ${s.mode}` : '',
    vocal,
    instruments: s.instruments.slice(0, compact ? 3 : 10).join(', '),
    production: s.production.slice(0, compact ? 2 : 6).join(', '),
    custom,
  }
}

/** Trim a comma list to a limit at a clean boundary. */
export function fitLimit(text: string, limit: number): string {
  const t = text.replace(/\s+/g, ' ').replace(/(,\s*)+/g, ', ').replace(/^[,\s]+|[,\s]+$/g, '')
  if (t.length <= limit) return t
  const pieces = t.split(', ')
  let out = ''
  for (const p of pieces) {
    const next = out ? `${out}, ${p}` : p
    if (next.length > limit) break
    out = next
  }
  return out || t.slice(0, limit)
}

export const LIMIT_FULL = 1000
export const LIMIT_COMPACT = 200

export function buildPrompt(s: PromptState): string {
  const p = buildParts(s, s.compact)
  const order = [p.era && `${p.era} ${p.genre}`.trim() || p.genre, p.mood, p.energy, p.bpm, p.key, p.vocal, p.instruments, p.production, p.custom]
  return fitLimit(order.filter(Boolean).join(', '), s.compact ? LIMIT_COMPACT : LIMIT_FULL)
}

/** Three alternate phrasings of the same choices. */
export function buildVariations(s: PromptState): string[] {
  const p = buildParts(s, s.compact)
  const limit = s.compact ? LIMIT_COMPACT : LIMIT_FULL
  const v1 = [p.genre, p.bpm, p.key, p.vocal, p.instruments, p.mood, p.energy, p.era, p.production, p.custom]
  const lead = `${cap(p.mood || 'Expressive')} ${p.era ? p.era + ' ' : ''}${p.genre}`
  const v2parts = [
    lead,
    p.vocal && `featuring ${p.vocal}`,
    p.instruments && `driven by ${p.instruments}`,
    p.production && `${p.production} production`,
    [p.energy, p.bpm, p.key].filter(Boolean).join(' at ').replace(' at ', ', ').trim(),
    p.custom,
  ]
  const v3 = [
    p.genre, p.instruments, p.production, `${p.bpm}${p.key ? ` in ${p.key}` : ''}`, p.vocal,
    p.mood && `${p.mood} atmosphere`, p.energy, p.era && `${p.era} feel`, p.custom,
  ]
  return [v1, v2parts, v3].map((arr) => fitLimit(arr.filter(Boolean).join(', '), limit))
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const INLINE: Record<string, string> = {
  Intro: '[Intro]', Build: '[Build-up]', Drop: '[Drop]', 'Instrumental break': '[Instrumental break]',
  Solo: '[Guitar Solo]', 'Main Theme': '[Main Theme]', Break: '[Break]', End: '[End]',
}

export function buildSkeleton(s: PromptState): string {
  const secs = STRUCTURES[s.structure] ?? STRUCTURES['Standard (V-C-V-C-B-C)']
  const instr = s.vocal.startsWith('Instrumental')
  return secs
    .map((sec) => {
      const head = INLINE[sec.tag] ?? `[${sec.tag}]`
      if (instr || sec.lines === 0) return head
      const body = Array.from({ length: sec.lines }, (_, i) => `(line ${i + 1})`).join('\n')
      return `${head}\n${body}`
    })
    .join('\n\n')
}

/** Merge skeleton tags with the user's existing lyrics: untagged stanzas get the next tag in order. */
export function mergeWithLyrics(s: PromptState, lyrics: string): string {
  const stanzas = lyrics.replace(/\r/g, '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)
  if (!stanzas.length) return buildSkeleton(s)
  const secs = (STRUCTURES[s.structure] ?? STRUCTURES['Standard (V-C-V-C-B-C)']).filter((x) => x.lines > 0 || x.tag === 'Intro' || x.tag === 'Outro' || x.tag === 'End')
  const lyricSecs = secs.filter((x) => x.lines > 0)
  const out: string[] = []
  const first = secs[0]
  if (first && first.lines === 0 && !/^\[/.test(stanzas[0])) out.push(INLINE[first.tag] ?? `[${first.tag}]`)
  let i = 0
  for (const st of stanzas) {
    if (/^\[[^\]]+\]/.test(st)) { out.push(st); continue }
    const tag = lyricSecs[i]?.tag ?? (i % 2 === 0 ? `Verse ${Math.floor(i / 2) + 1}` : 'Chorus')
    i++
    out.push(`[${tag}]\n${st}`)
  }
  const last = secs[secs.length - 1]
  if (last && last.lines === 0 && !out.some((o) => o.startsWith(`[${last.tag}]`))) out.push(INLINE[last.tag] ?? `[${last.tag}]`)
  else if (!out.some((o) => /^\[(Outro|End)\]/.test(o))) out.push('[End]')
  return out.join('\n\n')
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
function pickN<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

export function randomState(prev: PromptState): PromptState {
  const g = pick(GENRES)
  const sub = pick(g.subs)
  const vocal = pick(VOCAL_TYPES)
  const structure = vocal.startsWith('Instrumental') ? 'Instrumental' : pick(Object.keys(STRUCTURES).filter((k) => k !== 'Instrumental'))
  return {
    ...prev,
    genre: g.name, sub,
    mood: pickN(MOODS, 1 + Math.floor(Math.random() * 2)),
    energy: pick(ENERGIES),
    bpm: defaultBpm(g.name, sub), bpmAuto: true,
    key: Math.random() < 0.5 ? pick(KEYS) : '', mode: pick(MODES.slice(0, 2)),
    vocal, delivery: vocal.startsWith('Instrumental') ? [] : pickN(DELIVERIES, 2),
    instruments: [...new Set([...pickN(g.instruments, 2), ...pickN(INSTRUMENTS, 1)])],
    production: pickN(PRODUCTION, 2),
    era: pick(ERAS.filter(Boolean)), structure, custom: '',
  }
}

// ---- persistence ----
const PRESETS_KEY = 'lyricforge-prompt-presets-v1'
const HISTORY_KEY = 'lyricforge-prompt-history-v1'
const STATE_KEY = 'lyricforge-prompt-state-v1'

export interface Preset { id: string; name: string; state: PromptState; createdAt: number }
export interface HistoryItem { id: string; prompt: string; exclude: string; state: PromptState; at: number }

function read<T>(k: string, fallback: T): T {
  try { const r = localStorage.getItem(k); return r ? (JSON.parse(r) as T) : fallback } catch { return fallback }
}
function write(k: string, v: unknown) {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ }
}

export const loadPresets = () => read<Preset[]>(PRESETS_KEY, [])
export const savePresets = (p: Preset[]) => write(PRESETS_KEY, p)
export const loadHistory = () => read<HistoryItem[]>(HISTORY_KEY, [])
export const HISTORY_MAX = 20
export function pushHistory(list: HistoryItem[], item: HistoryItem): HistoryItem[] {
  const next = [item, ...list.filter((h) => h.prompt !== item.prompt)].slice(0, HISTORY_MAX)
  write(HISTORY_KEY, next)
  return next
}
export const clearHistory = () => write(HISTORY_KEY, [])
export const loadState = (): PromptState => ({ ...defaultState(), ...read<Partial<PromptState>>(STATE_KEY, {}) })
export const saveState = (s: PromptState) => write(STATE_KEY, s)
export const uid = () => Math.random().toString(36).slice(2, 10)
