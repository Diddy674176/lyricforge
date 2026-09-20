import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Header } from './components/Header'
import { SongReference } from './components/SongReference'
import { GeniusImport } from './components/GeniusImport'
import { LyricsEditor } from './components/LyricsEditor'
import { CleanControls } from './components/CleanControls'
import { SideBySide } from './components/SideBySide'
import { AnalysisPanels } from './components/AnalysisPanels'
import { MobileStickyPaste } from './components/MobileStickyPaste'
import { ExportBar } from './components/ExportBar'
import { processEverything } from './lib/analyze'
import { cleanGeniusPaste } from './lib/geniusCleaner'
import { detectStructure } from './lib/structure'
import { cleanLyrics } from './lib/profanity'
import { readClipboard } from './lib/clipboard'
import { loadDraft, saveDraft } from './lib/storage'
import { tokenizeWords } from './lib/syllables'
import { DEFAULT_SETTINGS, type CleanSettings, type SongAnalysis } from './lib/types'
import './App.css'

const HISTORY_LIMIT = 50

export default function App() {
  const [lyrics, setLyrics] = useState('')
  const [songReference, setSongReference] = useState('')
  const [geniusUrl, setGeniusUrl] = useState('')
  const [settings, setSettings] = useState<CleanSettings>(DEFAULT_SETTINGS)
  const [analysis, setAnalysis] = useState<SongAnalysis | null>(null)
  const [pasteHint, setPasteHint] = useState('')
  const [focusToken, setFocusToken] = useState(0)
  const [status, setStatus] = useState('')
  const [rawPasteBackup, setRawPasteBackup] = useState<string | null>(null)
  const [pastePreview, setPastePreview] = useState<{
    original: string
    cleaned: string
    removed: string[]
  } | null>(null)
  const [histTick, setHistTick] = useState(0)

  const history = useRef<string[]>([''])
  const histIndex = useRef(0)
  const skipHist = useRef(false)

  // Load draft
  useEffect(() => {
    const d = loadDraft()
    if (d?.lyrics) {
      skipHist.current = true
      setLyrics(d.lyrics)
      history.current = [d.lyrics]
      histIndex.current = 0
    }
    if (d?.songReference) setSongReference(d.songReference)
    if (d?.geniusUrl) setGeniusUrl(d.geniusUrl)
    if (d?.settings) setSettings({ ...DEFAULT_SETTINGS, ...d.settings })
  }, [])

  // Persist draft
  useEffect(() => {
    const t = window.setTimeout(() => {
      saveDraft({ lyrics, songReference, geniusUrl, settings })
    }, 400)
    return () => window.clearTimeout(t)
  }, [lyrics, songReference, geniusUrl, settings])

  const pushHistory = useCallback((next: string) => {
    if (skipHist.current) {
      skipHist.current = false
      return
    }
    const cur = history.current[histIndex.current]
    if (cur === next) return
    const sliced = history.current.slice(0, histIndex.current + 1)
    sliced.push(next)
    if (sliced.length > HISTORY_LIMIT) sliced.shift()
    history.current = sliced
    histIndex.current = sliced.length - 1
    setHistTick((n) => n + 1)
  }, [])

  const updateLyrics = useCallback(
    (next: string) => {
      setLyrics(next)
      pushHistory(next)
    },
    [pushHistory],
  )

  const undo = useCallback(() => {
    if (histIndex.current <= 0) return
    histIndex.current -= 1
    skipHist.current = true
    setLyrics(history.current[histIndex.current])
    setHistTick((n) => n + 1)
  }, [])

  const redo = useCallback(() => {
    if (histIndex.current >= history.current.length - 1) return
    histIndex.current += 1
    skipHist.current = true
    setLyrics(history.current[histIndex.current])
    setHistTick((n) => n + 1)
  }, [])

  const stats = useMemo(() => {
    const lines = lyrics.split('\n').filter((l) => l.trim()).length
    return {
      words: tokenizeWords(lyrics).length,
      lines,
      chars: lyrics.length,
    }
  }, [lyrics])

  const structurePreview = useMemo(() => (lyrics.trim() ? detectStructure(lyrics) : []), [lyrics])

  const flash = useCallback((msg: string) => {
    setStatus(msg)
    window.setTimeout(() => setStatus(''), 2200)
  }, [])

  const applyPasteClean = useCallback(
    (text: string) => {
      const result = cleanGeniusPaste(text)
      setRawPasteBackup(text)
      setPastePreview({
        original: text,
        cleaned: result.cleaned,
        removed: result.removedLines,
      })
      updateLyrics(result.cleaned)
      flash('Lyrics imported ✓')
    },
    [updateLyrics, flash],
  )

  const pasteFromClipboard = useCallback(
    async (andClean: boolean) => {
      const res = await readClipboard()
      if (!res.ok) {
        setPasteHint('Long-press here and tap Paste')
        setFocusToken((n) => n + 1)
        flash('Clipboard blocked — paste manually in the editor')
        return
      }
      setPasteHint('')
      if (andClean) applyPasteClean(res.text)
      else {
        setRawPasteBackup(res.text)
        const result = cleanGeniusPaste(res.text)
        setPastePreview({
          original: res.text,
          cleaned: result.cleaned,
          removed: result.removedLines,
        })
        updateLyrics(result.cleaned)
        flash('Lyrics imported ✓')
      }
    },
    [applyPasteClean, updateLyrics, flash],
  )

  const runAnalyze = useCallback(() => {
    if (!lyrics.trim()) return
    const result = processEverything(lyrics, settings, songReference)
    setAnalysis(result)
    flash('Analysis ready')
    document.getElementById('analysis-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [lyrics, settings, songReference, flash])

  const runProcessEverything = useCallback(() => {
    if (!lyrics.trim()) return
    // Formatting cleanup already done on paste; re-run light genius clean if clutter markers remain
    let working = lyrics
    if (/embed|you might also like|contributors/i.test(lyrics)) {
      const cleaned = cleanGeniusPaste(lyrics)
      working = cleaned.cleaned
      setRawPasteBackup(lyrics)
      setPastePreview({
        original: lyrics,
        cleaned: cleaned.cleaned,
        removed: cleaned.removedLines,
      })
      updateLyrics(working)
    }
    const result = processEverything(working, settings, songReference)
    setAnalysis(result)
    flash('Processed everything ✓')
    document.getElementById('analysis-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [lyrics, settings, songReference, flash, updateLyrics])

  // Re-clean when settings change if we already have analysis
  useEffect(() => {
    if (!analysis) return
    const cleaned = cleanLyrics(lyrics, settings)
    setAnalysis((prev) => (prev ? { ...prev, cleaned } : prev))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  const applyAlternative = useCallback(
    (index: number, alt: string) => {
      if (!analysis) return
      const reps = [...analysis.cleaned.replacements]
      const target = reps[index]
      if (!target) return
      // Replace nth occurrence of the current replacement word carefully by line
      const lines = analysis.cleaned.cleaned.split('\n')
      const line = lines[target.lineIndex]
      if (line == null) return
      let seen = -1
      const nextLine = line.replace(/[A-Za-z']+/g, (w) => {
        seen++
        if (seen === target.wordIndex && w === target.replacement) return alt
        // also allow matching if user already changed
        if (seen === target.wordIndex) return alt
        return w
      })
      lines[target.lineIndex] = nextLine
      const newCleanedText = lines.join('\n')
      reps[index] = {
        ...target,
        replacement: alt,
        replacementSyllables: target.replacementSyllables,
      }
      const refreshed = cleanLyrics(lyrics, { ...settings, level: 'off' })
      // Keep manual overrides: rebuild highlighted from current clean text vs original roughly
      setAnalysis({
        ...analysis,
        cleaned: {
          ...analysis.cleaned,
          cleaned: newCleanedText,
          replacements: reps,
          highlightedHtml: analysis.cleaned.highlightedHtml.replace(
            new RegExp(`data-i="${index}"[^>]*>([^<]*)</mark>`),
            `data-i="${index}" title="${target.original} → ${alt}">${alt}</mark>`,
          ),
          scores: refreshed.scores,
        },
      })
    },
    [analysis, lyrics, settings],
  )

  // Keyboard shortcut Ctrl/Cmd+Shift+V
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault()
        void pasteFromClipboard(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pasteFromClipboard])

  return (
    <div className="app-shell">
      <Header />
      {status ? <div className="global-toast">{status}</div> : null}

      <main className="app-main">
        <GeniusImport
          url={geniusUrl}
          onUrlChange={setGeniusUrl}
          onPasteFromClipboard={() => void pasteFromClipboard(false)}
          onPasteAndClean={() => void pasteFromClipboard(true)}
        />

        <SongReference value={songReference} onChange={setSongReference} />

        <LyricsEditor
          value={lyrics}
          onChange={updateLyrics}
          onUndo={undo}
          onRedo={redo}
          canUndo={histTick >= 0 && histIndex.current > 0}
          canRedo={histTick >= 0 && histIndex.current < history.current.length - 1}
          onClear={() => {
            updateLyrics('')
            setAnalysis(null)
            setPastePreview(null)
            setRawPasteBackup(null)
          }}
          onAnalyze={runAnalyze}
          onProcessEverything={runProcessEverything}
          stats={stats}
          structurePreview={structurePreview}
          focusToken={focusToken}
          pasteHint={pasteHint}
        />

        <CleanControls settings={settings} onChange={setSettings} />

        <SideBySide
          original={lyrics}
          clean={analysis?.cleaned ?? null}
          onApplyAlternative={applyAlternative}
          pastePreview={pastePreview}
          onUndoCleaning={() => {
            if (rawPasteBackup != null) {
              updateLyrics(rawPasteBackup)
              setPastePreview(null)
              flash('Cleaning undone')
            }
          }}
          onKeepOnlyLyrics={() => {
            const source = rawPasteBackup ?? lyrics
            applyPasteClean(source)
          }}
          onPreserveEverything={() => {
            if (rawPasteBackup != null) {
              updateLyrics(rawPasteBackup)
              setPastePreview({
                original: rawPasteBackup,
                cleaned: rawPasteBackup,
                removed: [],
              })
              flash('Preserved everything')
            }
          }}
        />

        <div id="analysis-anchor" />
        <AnalysisPanels analysis={analysis} />
        <ExportBar original={lyrics} analysis={analysis} songReference={songReference} />
      </main>

      <MobileStickyPaste
        onPaste={() => void pasteFromClipboard(false)}
        onPasteAndClean={() => void pasteFromClipboard(true)}
      />

      <footer className="app-footer">
        <p>
          <strong>LyricForge</strong> — lyrics stay on your device. Never scrapes Genius or lyric sites.
        </p>
        <p className="hint">Shortcut: Ctrl/Cmd + Shift + V → Paste &amp; Clean</p>
      </footer>
    </div>
  )
}
