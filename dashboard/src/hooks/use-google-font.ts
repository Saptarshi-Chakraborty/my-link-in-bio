import { useEffect } from 'react'

/**
 * Dynamically loads a Google Font by injecting/updating a <link> tag in <head>.
 * Reuses a single element (keyed by font name) to avoid duplicate requests.
 * Cleans up the tag when the component unmounts and no other consumers exist.
 *
 * @param fontName - The Google Font family name (e.g. 'Inter', 'Playfair Display')
 */
export function useGoogleFont(fontName: string) {
  useEffect(() => {
    if (!fontName) return

    const linkId = `gfont-${fontName.replace(/\s+/g, '-').toLowerCase()}`
    let link = document.getElementById(linkId) as HTMLLinkElement | null

    if (!link) {
      link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`
      document.head.appendChild(link)
    }

    // Track how many components are using this font
    const refCount = parseInt(link.dataset.refCount || '0', 10)
    link.dataset.refCount = String(refCount + 1)

    return () => {
      const el = document.getElementById(linkId) as HTMLLinkElement | null
      if (!el) return
      const count = parseInt(el.dataset.refCount || '1', 10) - 1
      if (count <= 0) {
        el.remove()
      } else {
        el.dataset.refCount = String(count)
      }
    }
  }, [fontName])
}
