"use client"

import { useState, useCallback, useRef } from "react"

const ESCAPE_CLICKS = 4
const W = 200
const BODY_H = 130
const FLAP_H = 65

// Precomputed sunflower petals to avoid hydration mismatch
const PETALS = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * 360
  const rad = (angle * Math.PI) / 180
  const cx = Math.round((18 + Math.cos(rad) * 10) * 100) / 100
  const cy = Math.round((18 + Math.sin(rad) * 10) * 100) / 100
  return { angle, cx, cy }
})

type Stage = "closed" | "escaping" | "returning" | "opening" | "open"

function randomEscapePos() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const margin = 120
  return {
    x: margin + Math.random() * (vw - margin * 2) - vw / 2,
    y: margin + Math.random() * (vh - margin * 2) - vh / 2,
  }
}

export function Envelope() {
  const [clicks, setClicks] = useState(0)
  const [stage, setStage] = useState<Stage>("closed")
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const isEscaping = useRef(false)

  const handleClick = useCallback(() => {
    if (stage === "open" || stage === "opening" || stage === "returning") return
    if (isEscaping.current) return
    isEscaping.current = true

    const next = clicks + 1
    setClicks(next)

    if (next >= ESCAPE_CLICKS) {
      // Return to center then open
      setStage("returning")
      setOffset({ x: 0, y: 0 })
      setTimeout(() => {
        setStage("opening")
        setTimeout(() => {
          setStage("open")
          isEscaping.current = false
        }, 600)
      }, 500)
    } else {
      // Escape to random position
      setStage("escaping")
      setOffset(randomEscapePos())
      setTimeout(() => {
        isEscaping.current = false
      }, 400)
    }
  }, [clicks, stage])

  const isOpen = stage === "opening" || stage === "open"

  const hintText =
    clicks === 0
      ? "Toca el sobre..."
      : clicks === 1
        ? "Jaja, otra vez..."
        : clicks === 2
          ? "No me atrapas!"
          : "Una mas!"

  return (
    <div
      className="fixed top-1/2 left-1/2 z-50 flex flex-col items-center"
      data-no-face-cursor
      style={{
        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
        transition:
          stage === "escaping"
            ? "transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)"
            : stage === "returning"
              ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              : undefined,
      }}
    >
      {/* Hint text */}
      {stage !== "opening" && stage !== "open" && (
        <p
          className="text-yellow-200/70 text-sm font-mono animate-pulse"
          style={{ marginBottom: 12 }}
        >
          {hintText}
        </p>
      )}

      {/* Envelope container */}
      <div
        onClick={handleClick}
        style={{
          position: "relative",
          width: W,
          height: BODY_H + FLAP_H,
          cursor: stage === "open" ? "default" : "pointer",
          animation:
            stage === "closed" || stage === "escaping"
              ? "envelope-float 3s ease-in-out infinite"
              : stage === "opening"
                ? "envelope-shake 0.5s ease-in-out"
                : undefined,
        }}
      >
        {/* Letter that slides up */}
        <div
          style={{
            position: "absolute",
            left: 15,
            top: FLAP_H + 15,
            width: W - 30,
            height: BODY_H - 30,
            background: "white",
            borderRadius: 3,
            zIndex: 1,
            transition: "transform 0.6s ease-out, opacity 0.4s ease-out",
            transform: isOpen ? "translateY(-90px)" : "translateY(0)",
            opacity: isOpen ? 1 : 0,
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <div
            style={{
              opacity: stage === "open" ? 1 : 0,
              transition: "opacity 0.5s ease-in 0.3s",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 11, color: "#b8860b", fontFamily: "serif", marginBottom: 5 }}>
              8 de Marzo
            </p>
            <p style={{ fontSize: 10, color: "#555", fontFamily: "serif", lineHeight: 1.5 }}>
              Feliz dia bro,
              <br />
              exitos y buenas vibras!
            </p>
            <p style={{ fontSize: 12, marginTop: 5, color: "#ffffff" }}>
              &hearts;
            </p>
          </div>
        </div>

        {/* Flap — triangle that rotates open */}
        <div
          style={{
            position: "absolute",
            top: FLAP_H,
            left: 0,
            width: W,
            height: FLAP_H,
            transformOrigin: "top center",
            transition: "transform 0.6s ease-in-out",
            transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
            zIndex: isOpen ? 0 : 4,
          }}
        >
          <svg viewBox={`0 0 ${W} ${FLAP_H}`} width={W} height={FLAP_H}>
            <polygon
              points={`0,0 ${W},0 ${W / 2},${FLAP_H}`}
              fill="#d4b882"
              stroke="#c4a872"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Envelope body */}
        <div
          style={{
            position: "absolute",
            top: FLAP_H,
            left: 0,
            width: W,
            height: BODY_H,
            borderRadius: "0 0 6px 6px",
            background: "#e8d5a8",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            zIndex: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 20,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.06), transparent)",
            }}
          />
          <svg
            viewBox={`0 0 ${W} ${BODY_H}`}
            width={W}
            height={BODY_H}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <polygon
              points={`0,${BODY_H} ${W / 2},${BODY_H * 0.35} ${W},${BODY_H}`}
              fill="#dcc89a"
              stroke="#cdb888"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Sunflower seal */}
        {!isOpen && (
          <div
            style={{
              position: "absolute",
              top: FLAP_H + FLAP_H - 18,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 5,
              animation: "envelope-heart-pulse 1.5s ease-in-out infinite",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36">
              {PETALS.map((p, i) => (
                <ellipse
                  key={i}
                  cx={p.cx}
                  cy={p.cy}
                  rx="5"
                  ry="8"
                  fill="#fbbf24"
                  transform={`rotate(${p.angle}, ${p.cx}, ${p.cy})`}
                />
              ))}
              <circle cx="18" cy="18" r="7" fill="#92400e" />
              <circle cx="18" cy="18" r="5" fill="#78350f" />
            </svg>
          </div>
        )}
      </div>

      {/* Message below after opening */}
      {stage === "open" && (
        <p
          className="text-yellow-300 font-mono text-center text-lg"
          style={{
            textShadow: "0 0 15px rgba(253,224,71,0.7)",
            animation: "fade-in-text 1s ease-out forwards",
            marginTop: 16,
          }}
        >
          Feliz dia de la mujer!
        </p>
      )}
    </div>
  )
}
