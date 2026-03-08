interface StarProps {
  index: number
}

// Seeded random function for deterministic values
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

// Round to fixed decimal places to prevent hydration mismatch
function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export function Star({ index }: StarProps) {
  // Use index-based seeded random for consistent SSR/client values
  // Round all values to prevent floating-point precision differences
  const x = round(seededRandom(index * 1) * 100)
  const y = round(seededRandom(index * 2) * 70)
  const size = round(1 + seededRandom(index * 3) * 2)
  const opacity = round(0.3 + seededRandom(index * 4) * 0.7)
  const duration = round(2 + seededRandom(index * 5) * 3)
  const delay = round(seededRandom(index * 6) * 5)

  return (
    <div
      className="absolute rounded-full bg-white animate-twinkle"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    />
  )
}
