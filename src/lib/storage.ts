import type { CleanSettings } from './types'
import { DEFAULT_SETTINGS } from './types'

const KEY = 'lyricforge-draft-v1'

export interface DraftState {
  lyrics: string
  songReference: string
  geniusUrl: string
  settings: CleanSettings
  updatedAt: number
}

export function loadDraft(): DraftState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as DraftState
    return {
      lyrics: data.lyrics || '',
      songReference: data.songReference || '',
      geniusUrl: data.geniusUrl || '',
      settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) },
      updatedAt: data.updatedAt || 0,
    }
  } catch {
    return null
  }
}

export function saveDraft(partial: Partial<DraftState>) {
  try {
    const prev = loadDraft()
    const next: DraftState = {
      lyrics: partial.lyrics ?? prev?.lyrics ?? '',
      songReference: partial.songReference ?? prev?.songReference ?? '',
      geniusUrl: partial.geniusUrl ?? prev?.geniusUrl ?? '',
      settings: partial.settings ?? prev?.settings ?? DEFAULT_SETTINGS,
      updatedAt: Date.now(),
    }
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore quota */
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
