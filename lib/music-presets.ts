export const MUSIC_PRESETS: { id: string; label: string; file: string }[] = [
  {
    id: "katt_chata",
    label: "Katt Chata",
    file: "/katt_chata.mp3",
  },
  {
    id: "lazy_song",
    label: "The Lazy Song",
    file: "/the_lazy_song.mp3",
  },
]

export function resolveMusicPreset(presetId: string): string | null {
  const preset = MUSIC_PRESETS.find((p) => p.id === presetId)
  return preset?.file ?? null
}
