export async function readClipboard(): Promise<{ ok: true; text: string } | { ok: false; reason: string }> {
  try {
    if (!navigator.clipboard?.readText) {
      return { ok: false, reason: 'Clipboard API unavailable' }
    }
    const text = await navigator.clipboard.readText()
    return { ok: true, text }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Permission denied'
    return { ok: false, reason: msg }
  }
}

export async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}
