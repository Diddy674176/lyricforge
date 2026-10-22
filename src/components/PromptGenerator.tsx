import { useEffect, useMemo, useState } from 'react'
import { CopyButton } from './CopyButton'
import {
  DELIVERIES, ENERGIES, ERAS, GENRES, INSTRUMENTS, KEYS, LIMIT_COMPACT, LIMIT_FULL, MODES, MOODS, PRODUCTION,
  STRUCTURES, VOCAL_TYPES, buildPrompt, buildSkeleton, buildVariations, clearHistory, defaultBpm, loadHistory,
  loadPresets, loadState, mergeWithLyrics, pushHistory, randomState, sanitizeArtists, savePresets, saveState, uid,
  type HistoryItem, type Preset, type PromptState,
} from '../lib/promptGen'

function Chips({ options, selected, onToggle, max }: { options: string[]; selected: string[]; onToggle: (v: string) => void; max?: number }) {
  return (
    <div className="pg-chips">
      {options.map((o) => {
        const on = selected.includes(o)
        return (
          <button key={o} type="button" className={`pg-chip ${on ? 'on' : ''}`} aria-pressed={on}
            disabled={!on && max != null && selected.length >= max} onClick={() => onToggle(o)}>
            {o}
          </button>
        )
      })}
    </div>
  )
}

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

export function PromptGenerator({ lyrics, onSendToEditor }: { lyrics: string; onSendToEditor: (text: string) => void }) {
  const [s, setS] = useState<PromptState>(() => loadState())
  const [presets, setPresets] = useState<Preset[]>(() => loadPresets())
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory())
  const [variations, setVariations] = useState<string[]>([])
  const [presetName, setPresetName] = useState('')
  const [mergeLyrics, setMergeLyrics] = useState(true)

  useEffect(() => saveState(s), [s])
  const set = (patch: Partial<PromptState>) => { setS((p) => ({ ...p, ...patch })); setVariations([]) }

  const genre = GENRES.find((g) => g.name === s.genre) ?? GENRES[0]
  const prompt = useMemo(() => buildPrompt(s), [s])
  const limit = s.compact ? LIMIT_COMPACT : LIMIT_FULL
  const artistCheck = useMemo(() => sanitizeArtists(s.custom), [s.custom])
  const excludeCheck = useMemo(() => sanitizeArtists(s.exclude), [s.exclude])
  const exclude = excludeCheck.cleaned
  const hasLyrics = lyrics.trim().length > 0
  const skeleton = useMemo(() => (hasLyrics && mergeLyrics ? mergeWithLyrics(s, lyrics) : buildSkeleton(s)), [s, lyrics, hasLyrics, mergeLyrics])

  // record history when the prompt settles
  useEffect(() => {
    const t = window.setTimeout(() => setHistory((h) => pushHistory(h, { id: uid(), prompt, exclude, state: s, at: Date.now() })), 1500)
    return () => window.clearTimeout(t)
  }, [prompt, exclude]) // eslint-disable-line react-hooks/exhaustive-deps

  const setGenre = (name: string) => {
    const g = GENRES.find((x) => x.name === name) ?? GENRES[0]
    const sub = g.subs[0]
    set({ genre: name, sub, bpm: s.bpmAuto ? defaultBpm(name, sub) : s.bpm })
  }
  const setSub = (sub: string) => set({ sub, bpm: s.bpmAuto ? defaultBpm(s.genre, sub) : s.bpm })

  const savePreset = () => {
    const name = presetName.trim() || `${s.sub || s.genre} · ${s.mood[0] ?? ''}`.trim()
    const next = [{ id: uid(), name, state: s, createdAt: Date.now() }, ...presets]
    setPresets(next); savePresets(next); setPresetName('')
  }
  const deletePreset = (id: string) => { const next = presets.filter((p) => p.id !== id); setPresets(next); savePresets(next) }

  return (
    <div className="app-main pg">
      <section className="panel panel-accent">
        <div className="panel-head">
          <h2>Suno Prompt Generator</h2>
          <span className="hint">Free · runs on your device · no keys</span>
        </div>
        <div className="btn-row wrap">
          <button type="button" className="btn btn-accent" onClick={() => setS(randomState(s))}>🎲 Surprise me</button>
          <button type="button" className="btn btn-secondary" onClick={() => setVariations(buildVariations(s))}>Variations ×3</button>
          <label className="pg-toggle">
            <input type="checkbox" checked={s.compact} onChange={(e) => set({ compact: e.target.checked })} />
            Compact mode (≤{LIMIT_COMPACT} chars, older Suno models)
          </label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Genre</h2></div>
        <div className="pg-grid">
          <label className="control"><strong>Genre</strong>
            <select value={s.genre} onChange={(e) => setGenre(e.target.value)}>
              {GENRES.map((g) => <option key={g.name}>{g.name}</option>)}
            </select>
          </label>
          <label className="control"><strong>Subgenre</strong>
            <select value={s.sub} onChange={(e) => setSub(e.target.value)}>
              {genre.subs.map((x) => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="control"><strong>Era / decade feel</strong>
            <select value={s.era} onChange={(e) => set({ era: e.target.value })}>
              {ERAS.map((x) => <option key={x} value={x}>{x || 'Any'}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Mood &amp; energy</h2><span className="hint">Pick up to 4 moods</span></div>
        <Chips options={MOODS} selected={s.mood} max={4} onToggle={(v) => set({ mood: toggle(s.mood, v) })} />
        <div className="seg pg-seg">
          {ENERGIES.map((e) => <button key={e} type="button" className={s.energy === e ? 'active' : ''} onClick={() => set({ energy: e })}>{e}</button>)}
        </div>
        <div className="pg-grid">
          <label className="control"><strong>BPM: {s.bpm}</strong>
            <input type="range" min={50} max={200} value={s.bpm} onChange={(e) => set({ bpm: Number(e.target.value), bpmAuto: false })} />
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => set({ bpm: defaultBpm(s.genre, s.sub), bpmAuto: true })}>
              Use {s.sub || s.genre} default ({defaultBpm(s.genre, s.sub)})
            </button>
          </label>
          <label className="control"><strong>Key (optional)</strong>
            <div className="pg-row">
              <select value={s.key} onChange={(e) => set({ key: e.target.value })}>
                <option value="">Any key</option>
                {KEYS.map((k) => <option key={k}>{k}</option>)}
              </select>
              <select value={s.mode} disabled={!s.key} onChange={(e) => set({ mode: e.target.value })}>
                {MODES.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Vocals</h2></div>
        <div className="seg pg-seg">
          {VOCAL_TYPES.map((v) => <button key={v} type="button" className={s.vocal === v ? 'active' : ''} onClick={() => set({ vocal: v })}>{v.replace(' (no vocals)', '')}</button>)}
        </div>
        {!s.vocal.startsWith('Instrumental') && (
          <>
            <p className="hint pg-sub">Delivery (up to 4)</p>
            <Chips options={DELIVERIES} selected={s.delivery} max={4} onToggle={(v) => set({ delivery: toggle(s.delivery, v) })} />
          </>
        )}
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Instruments</h2><span className="hint">Suggested for {s.genre}: {genre.instruments.join(', ')}</span></div>
        <Chips options={[...new Set([...genre.instruments, ...INSTRUMENTS])]} selected={s.instruments} max={10} onToggle={(v) => set({ instruments: toggle(s.instruments, v) })} />
        <p className="hint pg-sub">Production / mix</p>
        <Chips options={PRODUCTION} selected={s.production} max={6} onToggle={(v) => set({ production: toggle(s.production, v) })} />
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Extra details</h2></div>
        <input className="input" placeholder="Anything else, e.g. 'cowbell in the hook, like Drake'" value={s.custom} onChange={(e) => set({ custom: e.target.value })} />
        {(artistCheck.converted.length > 0 || artistCheck.flagged.length > 0) && (
          <div className="pg-note">
            {artistCheck.converted.map((c) => <p key={c.name}>🎙 <strong>{c.name}</strong> → “{c.traits}”</p>)}
            {artistCheck.flagged.map((f) => <p key={f}>🚫 Removed “{f}”: describe the sound instead (genre, voice, instruments).</p>)}
            <p className="hint">Suno rejects artist names and doesn't clone real voices, so LyricForge swaps names for descriptions of the sound.</p>
          </div>
        )}
        <label className="control pg-sub"><strong>Exclude styles (optional)</strong>
          <input className="input" placeholder="e.g. autotune, heavy distortion, spoken word" value={s.exclude} onChange={(e) => set({ exclude: e.target.value })} />
        </label>
        <label className="control pg-sub"><strong>Song structure</strong>
          <select value={s.structure} onChange={(e) => set({ structure: e.target.value })}>
            {Object.keys(STRUCTURES).map((k) => <option key={k}>{k}</option>)}
          </select>
        </label>
      </section>

      <section className="panel panel-accent" id="pg-output">
        <div className="panel-head">
          <h2>Style of Music</h2>
          <span className={`hint ${prompt.length > limit ? 'warn' : ''}`}>{prompt.length}/{limit} chars</span>
        </div>
        <pre className="suno-prompt pg-out" data-testid="pg-prompt">{prompt}</pre>
        <div className="btn-row wrap"><CopyButton text={prompt} label="Copy style prompt" className="btn-primary" /></div>
        {exclude && (
          <>
            <p className="hint pg-sub">Exclude styles</p>
            <pre className="suno-prompt pg-out">{exclude}</pre>
            <div className="btn-row"><CopyButton text={exclude} label="Copy exclude" /></div>
          </>
        )}
        {variations.length > 0 && (
          <div className="pg-vars">
            <p className="hint pg-sub">Variations</p>
            {variations.map((v, i) => (
              <div key={i} className="pg-var">
                <pre className="suno-prompt pg-out">{v}</pre>
                <CopyButton text={v} label={`Copy #${i + 1}`} className="btn-sm" />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Lyrics skeleton</h2>
          {hasLyrics && (
            <label className="pg-toggle">
              <input type="checkbox" checked={mergeLyrics} onChange={(e) => setMergeLyrics(e.target.checked)} />
              Merge with my lyrics
            </label>
          )}
        </div>
        <p className="hint">{hasLyrics && mergeLyrics ? 'Your editor lyrics, tagged with Suno section markers.' : 'Paste into Suno’s Lyrics box and replace the (line) placeholders.'}</p>
        <pre className="suno-prompt pg-out pg-skel">{skeleton}</pre>
        <div className="btn-row wrap">
          <CopyButton text={skeleton} label="Copy lyrics" className="btn-primary" />
          <button type="button" className="btn btn-secondary" onClick={() => onSendToEditor(skeleton)}>Send to editor</button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Presets</h2></div>
        <div className="pg-row">
          <input className="input" placeholder="Preset name" value={presetName} onChange={(e) => setPresetName(e.target.value)} />
          <button type="button" className="btn btn-primary" onClick={savePreset}>★ Save</button>
        </div>
        {presets.length === 0 ? <p className="hint pg-sub">No presets yet. Save your current settings to reuse them.</p> : (
          <ul className="pg-list">
            {presets.map((p) => (
              <li key={p.id}>
                <button type="button" className="btn btn-sm" onClick={() => setS({ ...s, ...p.state })}>{p.name}</button>
                <button type="button" className="btn btn-sm btn-ghost" aria-label={`Delete ${p.name}`} onClick={() => deletePreset(p.id)}>✕</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>History</h2>
          <span className="hint">Last {history.length}/20</span>
        </div>
        {history.length === 0 ? <p className="hint">Prompts you build show up here.</p> : (
          <>
            <ul className="pg-list pg-hist">
              {history.map((h) => (
                <li key={h.id}>
                  <span className="pg-hist-text">{h.prompt}</span>
                  <span className="pg-hist-btns">
                    <CopyButton text={h.prompt} className="btn-sm" />
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => setS({ ...s, ...h.state })}>Load</button>
                  </span>
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => { clearHistory(); setHistory([]) }}>Clear history</button>
          </>
        )}
      </section>
    </div>
  )
}
