"use client"

import { useEffect, useRef, useState } from "react"

const IMG_SIZE = 32
const TRAIL_LENGTH = 4
const STAMP_DURATION_MS = 3000
const STAMP_FADE_MS = 1000
const MIN_DISTANCE_SQ = 400

interface Point {
  x: number
  y: number
  id: number
  fading?: boolean
}

export function FaceCursorTrail() {
  const [trail, setTrail] = useState<Point[]>([])
  const [stamps, setStamps] = useState<Point[]>([])
  const counter = useRef(0)
  const lastPos = useRef({ x: 0, y: 0 })
  const drawing = useRef(false)

  useEffect(() => {
    const isOverNoFace = (e: MouseEvent) =>
      (e.target as HTMLElement)?.closest?.("[data-no-face-cursor]") !== null

    const addPoint = (x: number, y: number) => {
      counter.current += 1
      return { x, y, id: counter.current }
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (isOverNoFace(e)) return
      drawing.current = true
      lastPos.current = { x: e.clientX, y: e.clientY }
      const point = addPoint(e.clientX, e.clientY)
      setStamps((prev) => [...prev, point])
    }

    const handleMouseUp = () => {
      if (!drawing.current) return
      drawing.current = false
      // Start fade on stamps after visible duration, then remove
      const snapshot = counter.current
      setTimeout(() => {
        setStamps((prev) =>
          prev.map((p) => (p.id <= snapshot ? { ...p, fading: true } : p))
        )
        setTimeout(() => {
          setStamps((prev) => prev.filter((p) => p.id > snapshot))
        }, STAMP_FADE_MS)
      }, STAMP_DURATION_MS)
    }

    const handleMove = (e: MouseEvent) => {
      if (isOverNoFace(e)) {
        setTrail([])
        return
      }
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y

      // Drawing mode: stamp on every small movement
      if (drawing.current) {
        if (dx * dx + dy * dy < 500) return
        lastPos.current = { x: e.clientX, y: e.clientY }
        const point = addPoint(e.clientX, e.clientY)
        setStamps((prev) => [...prev, point])
        return
      }

      // Normal hover trail
      if (dx * dx + dy * dy < MIN_DISTANCE_SQ) return
      lastPos.current = { x: e.clientX, y: e.clientY }
      counter.current += 1
      setTrail((prev) => [
        ...prev.slice(-(TRAIL_LENGTH - 1)),
        { x: e.clientX, y: e.clientY, id: counter.current },
      ])
    }

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Stamped drawings (persist 3s after releasing click) */}
      {stamps.map((point) => (
        <img
          key={`stamp-${point.id}`}
          src="/cabeza2-cursor.png"
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            left: point.x - IMG_SIZE / 2,
            top: point.y - IMG_SIZE / 2,
            width: IMG_SIZE,
            height: IMG_SIZE,
            opacity: point.fading ? 0 : 0.7,
            transition: `opacity ${STAMP_FADE_MS}ms ease-out`,
          }}
        />
      ))}

      {/* Hover trail */}
      {trail.map((point, i) => {
        const age = trail.length - i
        const opacity = 0.15 + (1 - age / TRAIL_LENGTH) * 0.5
        const scale = 0.4 + (1 - age / TRAIL_LENGTH) * 0.5
        return (
          <img
            key={point.id}
            src="/cabeza2-cursor.png"
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              left: point.x - IMG_SIZE / 2,
              top: point.y - IMG_SIZE / 2,
              width: IMG_SIZE,
              height: IMG_SIZE,
              opacity,
              transform: `scale(${scale})`,
              transition: "opacity 0.3s ease-out",
            }}
          />
        )
      })}
    </div>
  )
}
