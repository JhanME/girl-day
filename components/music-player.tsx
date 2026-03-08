"use client"

import { useEffect, useRef, useState } from "react"

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Try autoplay; browsers may block it until user interacts
    audio.volume = 0.5
    audio.play().then(() => setStarted(true)).catch(() => {
      // Autoplay blocked — start on first click anywhere
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

  return (
    <>
      <audio ref={audioRef} src="/katt_chata.mp3" loop />
      <button
        onClick={toggleMute}
        className="fixed top-4 left-4 z-[9998] p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors pointer-events-auto"
        data-no-face-cursor
        aria-label={muted ? "Activar sonido" : "Silenciar"}
      >
        {muted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>
    </>
  )
}
