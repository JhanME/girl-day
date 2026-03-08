"use client"

interface FloatingLeafProps {
  delay: number
  startX: number
  startY: number
}

export function FloatingLeaf({ delay, startX, startY }: FloatingLeafProps) {
  return (
    <div
      className="absolute animate-float-leaf pointer-events-none"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        animationDelay: `${delay}s`,
      }}
    >
      <svg
        width="24"
        height="32"
        viewBox="0 0 24 32"
        className="animate-spin-slow"
        style={{ animationDelay: `${delay * 0.5}s` }}
      >
        <path
          d="M12 0 Q20 8 20 16 Q20 28 12 32 Q4 28 4 16 Q4 8 12 0"
          fill="#3a8f45"
        />
        <path
          d="M12 4 Q12 16 12 28"
          stroke="#2d6a2f"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M12 10 Q8 12 6 14 M12 14 Q16 16 18 18 M12 18 Q8 20 6 22 M12 22 Q16 24 18 26"
          stroke="#2d6a2f"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}
