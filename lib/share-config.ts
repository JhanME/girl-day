import { siteConfig } from "./site-config"
import { resolveMusicPreset } from "./music-presets"
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
  return btoa(encodeURIComponent(JSON.stringify(payload)))
}

export function decodeConfigFromUrl(): { config: RuntimeConfig; cursorPreset: string; musicPreset: string } | null {
  if (typeof window === "undefined") return null

  const params = new URLSearchParams(window.location.search)
  const encoded = params.get("d")
  if (!encoded) return null

  try {
    const payload: SharePayload = JSON.parse(decodeURIComponent(atob(encoded)))

    const musicPreset = payload.m || "katt_chata"
    const musicFile = resolveMusicPreset(musicPreset) ?? siteConfig.musicFile

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
