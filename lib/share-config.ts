import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string"
import { siteConfig } from "./site-config"
import type { MusicPreset } from "./music-presets"
import type { RuntimeConfig } from "./config-context"

interface SharePayload {
  h: string   // header
  b: string[] // body lines
  c: string   // closing
  p: string   // cursor preset id
  m: string   // music preset id
}

export function encodeConfig(config: RuntimeConfig, cursorPreset: string, musicPreset: string): string {
  const payload: SharePayload = {
    h: config.dedication.header,
    b: config.dedication.body,
    c: config.dedication.closing,
    p: cursorPreset,
    m: musicPreset,
  }
  return compressToEncodedURIComponent(JSON.stringify(payload))
}

export function decodeConfigFromUrl(musicPresets: MusicPreset[] = []): { config: RuntimeConfig; cursorPreset: string; musicPreset: string } | null {
  if (typeof window === "undefined") return null

  const params = new URLSearchParams(window.location.search)
  const encoded = params.get("d")
  if (!encoded) return null

  try {
    // Try lz-string first
    let json = decompressFromEncodedURIComponent(encoded)

    // Fallback: old base64 format for backwards compatibility
    if (!json) {
      json = decodeURIComponent(atob(encoded))
    }

    const payload: SharePayload = JSON.parse(json)

    const musicPreset = payload.m || "katt_chata"
    const found = musicPresets.find((p) => p.id === musicPreset)
    const musicFile = found?.file ?? siteConfig.musicFile

    return {
      cursorPreset: payload.p || "default",
      musicPreset,
      config: {
        musicFile,
        cursorImage: siteConfig.cursorImage,
        cursorTrailImage: siteConfig.cursorImage,
        dedication: {
          header: payload.h || siteConfig.dedication.header,
          body: payload.b || [...siteConfig.dedication.body],
          closing: payload.c || siteConfig.dedication.closing,
        },
      },
    }
  } catch {
    return null
  }
}

export function buildShareUrl(config: RuntimeConfig, cursorPreset: string, musicPreset: string): string {
  const base = typeof window !== "undefined"
    ? window.location.origin + window.location.pathname
    : ""
  return `${base}?d=${encodeConfig(config, cursorPreset, musicPreset)}`
}
