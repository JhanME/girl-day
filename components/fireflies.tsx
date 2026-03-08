"use client"

import { useState, useEffect } from "react"

const COUNT = 25

interface Firefly {
  id: number
  left: string
  top: string
  size: number
  delay: number
  duration: number
  driftX: number
  driftY: number
}

function generateFireflies(): Firefly[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    top: `${5 + Math.random() * 85}%`,
    size: 3 + Math.random() * 4,
    delay: Math.random() * 6,
    duration: 4 + Math.random() * 4,
    driftX: -20 + Math.random() * 40,
    driftY: -20 + Math.random() * 40,
  }))
}

export function Fireflies() {
  const [fireflies, setFireflies] = useState<Firefly[]>([])

  useEffect(() => {
    setFireflies(generateFireflies())
  }, [])

  if (fireflies.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none">
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            background: "radial-gradient(circle, rgba(253,224,71,0.9), rgba(253,224,71,0))",
            boxShadow: `0 0 ${f.size * 2}px ${f.size}px rgba(253,224,71,0.4)`,
            animation: `firefly-float ${f.duration}s ease-in-out infinite, firefly-glow ${f.duration * 0.6}s ease-in-out infinite`,
            animationDelay: `${f.delay}s`,
            "--drift-x": `${f.driftX}px`,
            "--drift-y": `${f.driftY}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
