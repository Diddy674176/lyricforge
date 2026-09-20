import { useCallback } from 'react'

type Props = {
  onPaste: (text: string) => void
  disabled?: boolean
}

export function MobileStickyPaste({ onPaste, disabled }: Props) {
  const handle = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text?.trim()) onPaste(text)
    } catch {
      /* permission denied — user can paste manually */
    }
  }, [onPaste])

  return (
    <div className="mobile-sticky-paste">
      <button type="button" className="btn btn-neon" onClick={handle} disabled={disabled}>
        Paste from Clipboard
      </button>
    </div>
  )
}
