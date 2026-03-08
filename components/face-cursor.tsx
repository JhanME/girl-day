"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useConfig } from "@/lib/config-context"

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
  const config = useConfig()
  const [trail, setTrail] = useState<Point[]>([])
  const [stamps, setStamps] = useState<Point[]>([])
  const counter = useRef(0)
  const lastPos = useRef({ x: 0, y: 0 })
  const drawing = useRef(false)
  const isTouchDevice = useRef(false)

  const addPoint = useCallback((x: number, y: number) => {
    counter.current += 1
    return { x, y, id: counter.current }
  }, [])

  const fadeStamp = useCallback((snapshotId: number) => {
    setTimeout(() => {
      setStamps((prev) =>
        prev.map((p) => (p.id <= snapshotId ? { ...p, fading: true } : p))
      )
      setTimeout(() => {
        setStamps((prev) => prev.filter((p) => p.id > snapshotId))
      }, STAMP_FADE_MS)
    }, STAMP_DURATION_MS)
  }, [])

  useEffect(() => {
    const isOverNoFace = (target: EventTarget | null) =>
      (target as HTMLElement)?.closest?.("[data-no-face-cursor]") !== null

    // --- Touch: single face per tap, no trail ---
    const handleTouchStart = (e: TouchEvent) => {
      isTouchDevice.current = true
      if (isOverNoFace(e.target)) return
      const touch = e.touches[0]
      if (!touch) return
      const point = addPoint(touch.clientX, touch.clientY)
      setStamps((prev) => [...prev, point])
      fadeStamp(point.id)
    }

    // --- Mouse: full trail + drawing (desktop only) ---
    const handleMouseDown = (e: MouseEvent) => {
      if (isTouchDevice.current) return
      if (isOverNoFace(e.target)) return
      drawing.current = true
      lastPos.current = { x: e.clientX, y: e.clientY }
      const point = addPoint(e.clientX, e.clientY)
      setStamps((prev) => [...prev, point])
    }

    const handleMouseUp = () => {
      if (isTouchDevice.current) return
      if (!drawing.current) return
      drawing.current = false
      fadeStamp(counter.current)
    }

    const handleMove = (e: MouseEvent) => {
      if (isTouchDevice.current) return
      if (isOverNoFace(e.target)) {
        setTrail([])
        return
      }
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y

      if (drawing.current) {
        if (dx * dx + dy * dy < 500) return
        lastPos.current = { x: e.clientX, y: e.clientY }
        const point = addPoint(e.clientX, e.clientY)
        setStamps((prev) => [...prev, point])
        return
      }

      if (dx * dx + dy * dy < MIN_DISTANCE_SQ) return
      lastPos.current = { x: e.clientX, y: e.clientY }
      counter.current += 1
      setTrail((prev) => [
        ...prev.slice(-(TRAIL_LENGTH - 1)),
        { x: e.clientX, y: e.clientY, id: counter.current },
      ])
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [addPoint, fadeStamp])

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Stamped faces */}
      {stamps.map((point) => (
        <img
          key={`stamp-${point.id}`}
          src={config.cursorTrailImage}
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

      {/* Hover trail (desktop only — touch devices never populate this) */}
      {trail.map((point, i) => {
        const age = trail.length - i
        const opacity = 0.15 + (1 - age / TRAIL_LENGTH) * 0.5
        const scale = 0.4 + (1 - age / TRAIL_LENGTH) * 0.5
        return (
          <img
            key={point.id}
            src={config.cursorTrailImage}
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
