export interface CursorPreset {
  id: string
  label: string
  svg: string
  image?: string
  locked?: boolean
}

export const CURSOR_PRESETS: CursorPreset[] = [
  {
    id: "default",
    label: "Cara 1",
    svg: "",
    locked: true,
  },
  {
    id: "cabeza3",
    label: "Cara 2",
    svg: "",
    image: "/cabeza3.png",
    locked: true,
  },
  {
    id: "heart",
    label: "Corazon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><path d="M16 28S3 18 3 10a6.5 6.5 0 0 1 13-1 6.5 6.5 0 0 1 13 1c0 8-13 18-13 18z" fill="#e74c6f" stroke="#c0395e" stroke-width="1"/></svg>`,
  },
  {
    id: "flower",
    label: "Flor",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><ellipse cx="16" cy="8" rx="5" ry="7" fill="#f59e0b"/><ellipse cx="8" cy="16" rx="5" ry="7" fill="#f59e0b" transform="rotate(90,8,16)"/><ellipse cx="24" cy="16" rx="5" ry="7" fill="#f59e0b" transform="rotate(90,24,16)"/><ellipse cx="16" cy="24" rx="5" ry="7" fill="#f59e0b"/><ellipse cx="9" cy="9" rx="5" ry="7" fill="#fbbf24" transform="rotate(45,9,9)"/><ellipse cx="23" cy="9" rx="5" ry="7" fill="#fbbf24" transform="rotate(-45,23,9)"/><ellipse cx="9" cy="23" rx="5" ry="7" fill="#fbbf24" transform="rotate(-45,9,23)"/><ellipse cx="23" cy="23" rx="5" ry="7" fill="#fbbf24" transform="rotate(45,23,23)"/><circle cx="16" cy="16" r="5" fill="#92400e"/></svg>`,
  },
  {
    id: "star",
    label: "Estrella",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><polygon points="16,2 20,12 30,12 22,19 25,30 16,23 7,30 10,19 2,12 12,12" fill="#facc15" stroke="#eab308" stroke-width="0.8"/></svg>`,
  },
  {
    id: "butterfly",
    label: "Mariposa",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><ellipse cx="10" cy="11" rx="8" ry="9" fill="#c084fc" opacity="0.9"/><ellipse cx="22" cy="11" rx="8" ry="9" fill="#e879f9" opacity="0.9"/><ellipse cx="10" cy="22" rx="6" ry="8" fill="#a78bfa" opacity="0.85"/><ellipse cx="22" cy="22" rx="6" ry="8" fill="#d946ef" opacity="0.85"/><rect x="15" y="5" width="2" height="22" rx="1" fill="#4a2060"/><line x1="14" y1="6" x2="9" y2="2" stroke="#4a2060" stroke-width="1.2" stroke-linecap="round"/><line x1="18" y1="6" x2="23" y2="2" stroke="#4a2060" stroke-width="1.2" stroke-linecap="round"/><circle cx="9" cy="2" r="1.2" fill="#4a2060"/><circle cx="23" cy="2" r="1.2" fill="#4a2060"/></svg>`,
  },
  {
    id: "brazil",
    label: "Brasil",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect x="1" y="4" width="30" height="24" rx="3" fill="#009c3b"/><polygon points="16,6 30,16 16,26 2,16" fill="#ffdf00"/><circle cx="16" cy="16" r="5.5" fill="#002776"/><path d="M10.5 16.8 Q16 13.5 21.5 16.8" fill="none" stroke="white" stroke-width="1"/><circle cx="14" cy="15" r="0.5" fill="white"/><circle cx="17" cy="14.5" r="0.5" fill="white"/><circle cx="16" cy="17" r="0.5" fill="white"/><circle cx="13" cy="17.5" r="0.4" fill="white"/><circle cx="18.5" cy="16" r="0.4" fill="white"/><circle cx="15" cy="18.5" r="0.4" fill="white"/><circle cx="18" cy="18" r="0.4" fill="white"/><circle cx="12" cy="16" r="0.4" fill="white"/><circle cx="19.5" cy="17.5" r="0.3" fill="white"/></svg>`,
  },
  {
    id: "rose",
    label: "Rosa",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect x="14.5" y="18" width="3" height="12" rx="1.5" fill="#22c55e"/><ellipse cx="11" cy="22" rx="4" ry="3" fill="#16a34a" transform="rotate(-20,11,22)"/><ellipse cx="21" cy="24" rx="4" ry="3" fill="#16a34a" transform="rotate(20,21,24)"/><circle cx="16" cy="12" r="9" fill="#f43f5e"/><circle cx="16" cy="12" r="6.5" fill="#fb7185"/><circle cx="16" cy="12" r="4" fill="#fda4af"/><circle cx="16" cy="12" r="2" fill="#fecdd3"/></svg>`,
  },
]

export const CURSOR_UNLOCK_CODE = "1304"

export function svgToDataUrl(svg: string): string {
  return "data:image/svg+xml," + encodeURIComponent(svg)
}

/** Get the preview image src for a preset (used in the config panel) */
export function presetPreviewSrc(preset: CursorPreset): string {
  if (preset.image) return preset.image
  if (preset.svg) return svgToDataUrl(preset.svg)
  return ""
}

const CURSOR_SIZE = 32

function resizeImageToDataUrl(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = CURSOR_SIZE
      canvas.height = CURSOR_SIZE
      const ctx = canvas.getContext("2d")!
      const scale = Math.min(CURSOR_SIZE / img.width, CURSOR_SIZE / img.height)
      const w = img.width * scale
      const h = img.height * scale
      const x = (CURSOR_SIZE - w) / 2
      const y = (CURSOR_SIZE - h) / 2
      ctx.clearRect(0, 0, CURSOR_SIZE, CURSOR_SIZE)
      ctx.drawImage(img, x, y, w, h)
      resolve(canvas.toDataURL("image/png"))
    }
    img.onerror = reject
    img.src = src
  })
}

/** Resolve a preset id to cursor + trail image URLs */
export async function resolvePresetCursor(presetId: string): Promise<{ cursorImage: string; cursorTrailImage: string } | null> {
  if (presetId === "default") return null
  const preset = CURSOR_PRESETS.find((p) => p.id === presetId)
  if (!preset) return null

  if (preset.image) {
    const resized = await resizeImageToDataUrl(preset.image)
    return { cursorImage: resized, cursorTrailImage: preset.image }
  }
  if (preset.svg) {
    const dataUrl = svgToDataUrl(preset.svg)
    return { cursorImage: dataUrl, cursorTrailImage: dataUrl }
  }
  return null
}
