"use client"

import { useEffect, useRef, useState } from "react"
import { useConfig } from "@/lib/config-context"

const DEFAULT_VOLUME = 0.35

export function MusicPlayer() {
  const config = useConfig()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(DEFAULT_VOLUME)
  const [started, setStarted] = useState(false)
  const [showSlider, setShowSlider] = useState(false)
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = DEFAULT_VOLUME
    audio.play().then(() => setStarted(true)).catch(() => {
      const handleClick = () => {
        audio.play().then(() => setStarted(true))
        window.removeEventListener("click", handleClick)
      }
      window.addEventListener("click", handleClick)
      return () => window.removeEventListener("click", handleClick)
    })
  }, [])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    if (!started) {
      audio.play().then(() => setStarted(true))
    }
    audio.muted = !audio.muted
    setMuted(!muted)
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (audioRef.current) {
      audioRef.current.volume = val
      if (val === 0) {
        setMuted(true)
        audioRef.current.muted = true
      } else if (muted) {
        setMuted(false)
        audioRef.current.muted = false
      }
    }
  }

  const handleMouseEnter = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
    setShowSlider(true)
  }

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => setShowSlider(false), 400)
  }

  return (
    <>
      <audio ref={audioRef} src={config.musicFile} loop />
      <div
        className="fixed top-4 left-4 z-[9998] flex items-center gap-0 pointer-events-auto"
        data-no-face-cursor
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Mute/unmute button */}
        <button
          onClick={toggleMute}
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label={muted ? "Activar sonido" : "Silenciar"}
        >
          {muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>

        {/* Volume slider — horizontal, appears to the right on hover */}
        <div
          style={{
            overflow: "hidden",
            width: showSlider ? 90 : 0,
            opacity: showSlider ? 1 : 0,
            transition: "width 0.25s ease, opacity 0.25s ease",
            display: "flex",
            alignItems: "center",
            paddingLeft: showSlider ? 8 : 0,
          }}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolume}
            className="volume-slider"
            style={{
              width: 80,
              height: 4,
              appearance: "none",
              background: `linear-gradient(to right, rgba(253,224,71,0.8) ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%)`,
              borderRadius: 2,
              outline: "none",
              cursor: "pointer",
              display: "block",
            }}
          />
        </div>
      </div>
    </>
  )
}
