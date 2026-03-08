"use client"

import { useEffect, useState, useCallback } from "react"

interface Comet {
  id: number
  top: number
  left: number
  delay: number
  scale: number
  duration: number
  direction: "diagonal-right" | "diagonal-left" | "top-down" | "bottom-up"
  angle: number
}

export function ShootingStar({ index }: { index: number }) {
  // Not used directly — see CometField below
  return null
}

export function CometField() {
  const [comets, setComets] = useState<Comet[]>([])

  const spawnComet = useCallback(() => {
    const directions = ["diagonal-right", "diagonal-left", "top-down", "bottom-up"] as const
    const direction = directions[Math.floor(Math.random() * directions.length)]
    
    let top = 0
    let left = 0
    let angle = 0
    
    // Set starting position and angle based on direction (all vertical)
    if (direction === "diagonal-right") {
      top = -80
      left = 10 + Math.random() * 80
      angle = 90
    } else if (direction === "diagonal-left") {
      top = -80
      left = 10 + Math.random() * 80
      angle = 90
    } else if (direction === "top-down") {
      top = -80
      left = 10 + Math.random() * 80
      angle = 90
    } else if (direction === "bottom-up") {
      top = 100
      left = 10 + Math.random() * 80
      angle = -90
    }

    const comet: Comet = {
      id: Date.now() + Math.random(),
      top,
      left,
      delay: 0,
      scale: 0.6 + Math.random() * 0.6,
      duration: 3.5 + Math.random() * 2,
      direction,
      angle,
    }
    setComets((prev) => [...prev.slice(-4), comet])
  }, [])

  useEffect(() => {
    spawnComet()
    const interval = setInterval(spawnComet, 2200)
    return () => clearInterval(interval)
  }, [spawnComet])

  return (
    <>
      {comets.map((comet) => (
        <div
          key={comet.id}
          className="absolute pointer-events-none"
          style={{
            top: `${comet.top}%`,
            left: `${comet.left}%`,
            animation: `comet-fly-${comet.direction} ${comet.duration}s linear forwards`,
            transform: `rotate(${comet.angle}deg)`,
          }}
          onAnimationEnd={() =>
            setComets((prev) => prev.filter((c) => c.id !== comet.id))
          }
        >
          {/* Tail — gradient line with glow */}
          <div
            style={{
              position: "absolute",
              right: "0%",
              top: "50%",
              transform: "translateY(-50%)",
              width: `${140 * comet.scale}px`,
              height: `${5 * comet.scale}px`,
              background:
                "linear-gradient(to right, rgba(255,255,255,0.0) 0%, rgba(200,230,255,0.2) 30%, rgba(255,255,255,0.8) 100%)",
              borderRadius: "999px",
              filter: "blur(2px)",
            }}
          />
          {/* Head — small glowing point at the front */}
          <div
            style={{
              position: "absolute",
              right: "-8px",
              top: "50%",
              transform: "translateY(-50%)",
              width: `${16 * comet.scale}px`,
              height: `${16 * comet.scale}px`,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.95), rgba(200,230,255,0.7))",
              boxShadow: `0 0 ${10 * comet.scale}px ${4 * comet.scale}px rgba(200,230,255,0.8), 0 0 ${20 * comet.scale}px ${8 * comet.scale}px rgba(150,200,255,0.5)`,
            }}
          />
        </div>
      ))}
    </>
  )
}
