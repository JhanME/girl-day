export const MUSIC_PRESETS: { id: string; label: string; file: string }[] = [
  {
    id: "katt_chata",
    label: "Katt Chata",
    file: "/katt_chata.mp3",
  },
  {
    id: "fin_del_mundo",
    label: "El Fin del Mundo",
    file: "/El fin del mundo.mp3",
  },
  {
    id: "lazy_song",
    label: "The Lazy Song",
    file: "/the_lazy_song.mp3",
  },
  {
    id: "gusttavo_lima",
    label: "Gusttavo Lima",
    file: "/gusttavo lima.mp3",
  },
  {
    id: "samba_to_brasil",
    label: "Samba to Brasil",
    file: "/samba to brasil.mp3",
  },
  {
    id: "tic_tic_tac",
    label: "Tic Tic Tac",
    file: "/tic tic tac.mp3",
  },
]

export function resolveMusicPreset(presetId: string): string | null {
  const preset = MUSIC_PRESETS.find((p) => p.id === presetId)
  return preset?.file ?? null
}
