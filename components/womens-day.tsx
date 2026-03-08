"use client"

import { useState, useEffect, useCallback } from "react"

type Stage = "initial" | "comet-impact" | "exploded"

// Animation timing constants
const TIMINGS = {
  INITIAL_MS: 3500,       // Time before comet launches
  EXPLODE_DELAY_S: 0.3,   // Delay before final text fades in
} as const

// Styling constants
const GLOW_SHADOW = "0 0 20px rgba(253, 224, 71, 0.9), 0 0 40px rgba(251, 191, 36, 0.6)"

// Particle list - precomputed once
const PARTICLE_LIST = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  angle: `${(i / 20) * 360}deg`,
  color: (["#fde047", "#facc15", "#fef08a", "#fbbf24"] as const)[i % 4],
}))

/**
 * Reusable text component for "FELIZ 8 DE MARZO" and "Feliz día de la mujer"
 */
function WomensDayText({
  text,
  opacity = 1,
  size = "lg"
}: {
  text: string
  opacity?: number
  size?: "lg" | "md"
}) {
  const sizeClass = size === "lg" ? "text-6xl md:text-7xl" : "text-5xl md:text-6xl"
  return (
    <h1
      className={`${sizeClass} font-mono font-bold text-yellow-300 text-center drop-shadow-lg`}
      style={{
        opacity,
        textShadow: GLOW_SHADOW,
        whiteSpace: "pre-line"
      }}
    >
      {text}
    </h1>
  )
}

/**
 * Comet impact animation - triggers callback when animation ends
 */
function ImpactComet({ onImpactEnd }: { onImpactEnd: () => void }) {
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2"
      style={{
        animation: "comet-impact-fall 1.5s ease-in forwards",
        zIndex: 50
      }}
      onAnimationEnd={onImpactEnd}
    >
      {/* Tail - vertical gradient fading upward */}
      <div
        style={{
          width: "12px",
          height: "200px",
          margin: "0 auto",
          background: "linear-gradient(to bottom, rgba(253, 224, 71, 0) 0%, rgba(251, 191, 36, 0.3) 30%, rgba(253, 224, 71, 1) 100%)",
          borderRadius: "999px",
          filter: "blur(3px)",
        }}
      />
      {/* Head - glowing ball at the bottom */}
      <div
        style={{
          width: "36px",
          height: "36px",
          margin: "-4px auto 0",
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 40%, rgba(253, 224, 71, 0.98), rgba(251, 191, 36, 0.8))",
          boxShadow: "0 0 20px 8px rgba(253, 224, 71, 0.9), 0 0 40px 16px rgba(251, 191, 36, 0.6)",
        }}
      />
    </div>
  )
}

export function WomensDay() {
  const [stage, setStage] = useState<Stage>("initial")

  useEffect(() => {
    // Stage 1: Show "FELIZ 8 DE MARZO" for 3.5 seconds, then trigger comet
    const timer = setTimeout(() => {
      setStage("comet-impact")
    }, TIMINGS.INITIAL_MS)

    return () => clearTimeout(timer)
  }, [])

  // Callback triggered when comet impact animation ends
  const handleImpactEnd = useCallback(() => {
    setStage("exploded")
  }, [])

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      {/* Stage 1: "FELIZ 8 DE MARZO" with pulse */}
      {stage === "initial" && (
        <div className="animate-pulse-womens-day">
          <WomensDayText text={"FELIZ 8 DE\nMARZO"} />
        </div>
      )}

      {/* Stage 2: Comet impacting the text */}
      {stage === "comet-impact" && (
        <>
          <WomensDayText text={"FELIZ 8 DE\nMARZO"} opacity={0.7} />
          <ImpactComet onImpactEnd={handleImpactEnd} />
        </>
      )}

      {/* Stage 3: Explosion + new text */}
      {stage === "exploded" && (
        <>
          {/* Explosion particles */}
          {PARTICLE_LIST.map((p) => (
            <div
              key={p.id}
              className="absolute w-3 h-3 rounded-full animate-particle-burst"
              style={{
                left: "50%",
                top: "50%",
                background: p.color,
                "--angle": p.angle,
              } as React.CSSProperties}
            />
          ))}

          {/* New text "Feliz día de la mujer" */}
          <div
            className="animate-fade-in-text"
            style={{ animationDelay: `${TIMINGS.EXPLODE_DELAY_S}s` }}
          >
            <WomensDayText text={"Feliz día\nde la mujer"} size="md" />
          </div>
        </>
      )}
    </div>
  )
}
