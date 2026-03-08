"use client"

import { useState, useRef } from "react"
import type { RuntimeConfig } from "@/lib/config-context"
import { siteConfig } from "@/lib/site-config"
import { CURSOR_PRESETS, CURSOR_UNLOCK_CODE, presetPreviewSrc } from "@/lib/cursor-presets"
import { MUSIC_PRESETS } from "@/lib/music-presets"
import { buildShareUrl } from "@/lib/share-config"

const CURSOR_SIZE = 32

function resizeImageForCursor(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = CURSOR_SIZE
      canvas.height = CURSOR_SIZE
      const ctx = canvas.getContext("2d")!
      // Scale preserving aspect ratio, fitting inside 32x32
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
    img.src = URL.createObjectURL(file)
  })
}

interface ConfigPanelProps {
  onStart: (config: RuntimeConfig, cursorPreset: string, musicPreset: string) => void
}

export function ConfigPanel({ onStart }: ConfigPanelProps) {
  const [header, setHeader] = useState<string>(siteConfig.dedication.header)
  const [bodyText, setBodyText] = useState<string>(siteConfig.dedication.body.join("\n"))
  const [closing, setClosing] = useState<string>(siteConfig.dedication.closing)
  const [selectedMusic, setSelectedMusic] = useState<string>(MUSIC_PRESETS[0].id)
  const [musicPreview, setMusicPreview] = useState<string | null>(null)
  const [cursorResized, setCursorResized] = useState<string | null>(null)
  const [cursorOriginal, setCursorOriginal] = useState<string | null>(null)
  const [musicFileName, setMusicFileName] = useState<string>("")
  const [cursorFileName, setCursorFileName] = useState<string>("")
  const [selectedPreset, setSelectedPreset] = useState<string>("heart")
  const [facesUnlocked, setFacesUnlocked] = useState(false)
  const [unlockTarget, setUnlockTarget] = useState<string | null>(null)
  const [unlockCode, setUnlockCode] = useState("")
  const [unlockError, setUnlockError] = useState(false)

  const musicInputRef = useRef<HTMLInputElement>(null)
  const cursorInputRef = useRef<HTMLInputElement>(null)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)

  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause()
      previewAudioRef.current = null
    }
  }

  const playPreview = (src: string) => {
    stopPreview()
    const audio = new Audio(src)
    audio.volume = 0.35
    audio.loop = true
    audio.play().catch(() => {})
    previewAudioRef.current = audio
  }

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMusicFileName(file.name)
    setSelectedMusic("custom")
    const url = URL.createObjectURL(file)
    setMusicPreview(url)
    playPreview(url)
  }

  const handleMusicPresetSelect = (id: string) => {
    setSelectedMusic(id)
    setMusicFileName("")
    setMusicPreview(null)
    const preset = MUSIC_PRESETS.find((p) => p.id === id)
    if (preset) playPreview(preset.file)
  }

  const handleCursorUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCursorFileName(file.name)
    setSelectedPreset("custom")
    setCursorOriginal(URL.createObjectURL(file))
    const resized = await resizeImageForCursor(file)
    setCursorResized(resized)
  }

  const handlePresetSelect = (id: string) => {
    const preset = CURSOR_PRESETS.find((p) => p.id === id)
    if (preset?.locked && !facesUnlocked) {
      setUnlockTarget(id)
      setUnlockCode("")
      setUnlockError(false)
      return
    }
    setSelectedPreset(id)
    setCursorFileName("")
    setCursorResized(null)
    setCursorOriginal(null)
  }

  const handleUnlockSubmit = () => {
    if (unlockCode === CURSOR_UNLOCK_CODE) {
      setFacesUnlocked(true)
      setSelectedPreset(unlockTarget!)
      setCursorFileName("")
      setCursorResized(null)
      setCursorOriginal(null)
      setUnlockTarget(null)
      setUnlockCode("")
      setUnlockError(false)
    } else {
      setUnlockError(true)
    }
  }

  const handleStart = () => {
    let cursorImg = siteConfig.cursorImage
    let trailImg = siteConfig.cursorImage

    if (selectedPreset === "custom" && cursorResized && cursorOriginal) {
      cursorImg = cursorResized
      trailImg = cursorOriginal
    } else if (selectedPreset !== "default") {
      const preset = CURSOR_PRESETS.find((p) => p.id === selectedPreset)
      if (preset) {
        const src = presetPreviewSrc(preset)
        cursorImg = src
        trailImg = src
      }
    }

    let musicSrc = siteConfig.musicFile
    if (selectedMusic === "custom" && musicPreview) {
      musicSrc = musicPreview
    } else {
      const mp = MUSIC_PRESETS.find((p) => p.id === selectedMusic)
      if (mp) musicSrc = mp.file
    }

    const config: RuntimeConfig = {
      musicFile: musicSrc,
      cursorImage: cursorImg,
      cursorTrailImage: trailImg,
      dedication: {
        header,
        body: bodyText.split("\n").filter((l) => l.trim() !== ""),
        closing,
      },
    }
    stopPreview()
    onStart(config, selectedPreset, selectedMusic)
  }

  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    const config: RuntimeConfig = {
      musicFile: siteConfig.musicFile,
      cursorImage: siteConfig.cursorImage,
      cursorTrailImage: siteConfig.cursorImage,
      dedication: {
        header,
        body: bodyText.split("\n").filter((l) => l.trim() !== ""),
        closing,
      },
    }
    const url = buildShareUrl(config, selectedPreset, selectedMusic)
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#060e1a] via-[#0b1a30] to-[#091525] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-yellow-500/20 bg-white/5 backdrop-blur-md p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-yellow-300 text-center mb-1">
          Personaliza tu tarjeta
        </h2>
        <p className="text-yellow-200/50 text-center text-sm mb-6">
          Sube tus archivos y escribe tu dedicatoria
        </p>

        {/* Music selection */}
        <div className="mb-5">
          <label className="block text-yellow-200/80 text-sm font-medium mb-2">
            Musica de fondo
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {MUSIC_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleMusicPresetSelect(preset.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${
                  selectedMusic === preset.id
                    ? "border-yellow-400 bg-yellow-400/15"
                    : "border-yellow-500/20 bg-white/5 hover:bg-white/10"
                }`}
              >
                {selectedMusic === preset.id ? (
                  <div className="flex items-end gap-[2px] h-[14px] shrink-0">
                    <span className="w-[3px] bg-yellow-400 rounded-full animate-bounce" style={{ height: 10, animationDelay: "0ms", animationDuration: "0.6s" }} />
                    <span className="w-[3px] bg-yellow-400 rounded-full animate-bounce" style={{ height: 14, animationDelay: "150ms", animationDuration: "0.6s" }} />
                    <span className="w-[3px] bg-yellow-400 rounded-full animate-bounce" style={{ height: 8, animationDelay: "300ms", animationDuration: "0.6s" }} />
                  </div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 shrink-0">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                )}
                <span className="text-xs text-yellow-100/70">{preset.label}</span>
              </button>
            ))}
          </div>
          <input
            ref={musicInputRef}
            type="file"
            accept="audio/*"
            onChange={handleMusicUpload}
            className="hidden"
          />
          <button
            onClick={() => musicInputRef.current?.click()}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-colors text-left ${
              selectedMusic === "custom"
                ? "border-yellow-400 bg-yellow-400/15"
                : "border-yellow-500/20 bg-white/5 hover:bg-white/10"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 shrink-0">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-yellow-100/70 text-xs truncate">
              {musicFileName || "Subir audio personalizado..."}
            </span>
          </button>
          {musicPreview && selectedMusic === "custom" && (
            <audio src={musicPreview} controls className="w-full mt-2 h-8 opacity-70" />
          )}
        </div>

        {/* Cursor selection */}
        <div className="mb-5">
          <label className="block text-yellow-200/80 text-sm font-medium mb-2">
            Imagen del cursor
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {CURSOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-colors ${
                  selectedPreset === preset.id
                    ? "border-yellow-400 bg-yellow-400/15"
                    : "border-yellow-500/20 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center relative">
                  <img
                    src={preset.id === "default" ? siteConfig.cursorImage : presetPreviewSrc(preset)}
                    alt=""
                    className="w-7 h-7 object-contain"
                  />
                  {preset.locked && !facesUnlocked && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute bottom-0 right-0 text-yellow-300/90 drop-shadow-[0_0_3px_rgba(0,0,0,0.8)]">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  )}
                </div>
                <span className="text-[10px] text-yellow-200/60">{preset.label}</span>
              </button>
            ))}
          </div>
          <input
            ref={cursorInputRef}
            type="file"
            accept="image/*"
            onChange={handleCursorUpload}
            className="hidden"
          />
          <button
            onClick={() => cursorInputRef.current?.click()}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-colors text-left ${
              selectedPreset === "custom"
                ? "border-yellow-400 bg-yellow-400/15"
                : "border-yellow-500/20 bg-white/5 hover:bg-white/10"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 shrink-0">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-yellow-100/70 text-xs truncate">
              {cursorFileName || "Subir imagen personalizada..."}
            </span>
            {cursorOriginal && selectedPreset === "custom" && (
              <img src={cursorOriginal} alt="" className="w-7 h-7 object-contain ml-auto" />
            )}
          </button>
        </div>

        {/* Dedication fields */}
        <div className="mb-4">
          <label className="block text-yellow-200/80 text-sm font-medium mb-2">
            Titulo de la carta
          </label>
          <input
            type="text"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-yellow-500/20 bg-white/5 text-yellow-100 text-sm placeholder:text-yellow-100/30 focus:outline-none focus:border-yellow-500/50 transition-colors"
            placeholder="Ej: 8 de Marzo"
          />
        </div>

        <div className="mb-4">
          <label className="block text-yellow-200/80 text-sm font-medium mb-2">
            Mensaje (una linea por renglon)
          </label>
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-yellow-500/20 bg-white/5 text-yellow-100 text-sm placeholder:text-yellow-100/30 focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
            placeholder={"Feliz dia bro,\nexitos y buenas vibras!"}
          />
        </div>

        <div className="mb-6">
          <label className="block text-yellow-200/80 text-sm font-medium mb-2">
            Mensaje final
          </label>
          <input
            type="text"
            value={closing}
            onChange={(e) => setClosing(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-yellow-500/20 bg-white/5 text-yellow-100 text-sm placeholder:text-yellow-100/30 focus:outline-none focus:border-yellow-500/50 transition-colors"
            placeholder="Feliz dia de la mujer!"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleStart}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-base hover:from-yellow-400 hover:to-amber-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-[0.98]"
          >
            Comenzar
          </button>
          <button
            onClick={handleCopyLink}
            className="px-4 py-3 rounded-xl border border-yellow-500/30 bg-white/5 hover:bg-white/10 transition-colors text-yellow-300 text-sm font-medium active:scale-[0.98] flex items-center gap-2"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Copiado
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Copiar link
              </>
            )}
          </button>
        </div>

        <p className="text-yellow-200/30 text-xs text-center mt-4">
          Comparte el link para que vean tu dedicatoria personalizada
        </p>

        {/* Unlock code overlay */}
        {unlockTarget && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0d1f3c] border border-yellow-500/30 rounded-2xl p-6 w-72 shadow-2xl">
              <div className="flex justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <p className="text-yellow-200/80 text-sm text-center mb-4">
                Ingresa el codigo para desbloquear
              </p>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                value={unlockCode}
                onChange={(e) => {
                  setUnlockCode(e.target.value)
                  setUnlockError(false)
                }}
                onKeyDown={(e) => e.key === "Enter" && handleUnlockSubmit()}
                className={`w-full px-4 py-2.5 rounded-xl border bg-white/5 text-yellow-100 text-center text-lg tracking-[0.3em] placeholder:text-yellow-100/20 focus:outline-none transition-colors ${
                  unlockError
                    ? "border-red-500/60 animate-[shake_0.3s_ease-in-out]"
                    : "border-yellow-500/30 focus:border-yellow-500/60"
                }`}
                placeholder="----"
                maxLength={10}
              />
              {unlockError && (
                <p className="text-red-400/80 text-xs text-center mt-2">
                  Codigo incorrecto
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setUnlockTarget(null)
                    setUnlockCode("")
                    setUnlockError(false)
                  }}
                  className="flex-1 py-2 rounded-xl border border-yellow-500/20 text-yellow-200/60 text-sm hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUnlockSubmit}
                  className="flex-1 py-2 rounded-xl bg-yellow-500 text-black text-sm font-bold hover:bg-yellow-400 transition-colors"
                >
                  Desbloquear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
