export interface MusicPreset {
  id: string
  label: string
  file: string
}

export async function fetchMusicPresets(): Promise<MusicPreset[]> {
  try {
    const res = await fetch("/api/music")
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export function resolveMusicFile(presets: MusicPreset[], presetId: string): string | null {
  const preset = presets.find((p) => p.id === presetId)
  return preset?.file ?? null
}
