"use client"

interface SunflowerProps {
  size: "small" | "medium" | "large"
  stemHeight: number
  offsetX: number
  delay: number
  rotation: number
}

export function Sunflower({ size, stemHeight, offsetX, delay }: SunflowerProps) {
  const flowerSize = size === "large" ? 92 : size === "medium" ? 72 : 56
  const centerSize = flowerSize * 0.38
  const petalCount = 14
  const stemW = 14
  // Shorter stem height
  const shorterStemHeight = Math.max(stemHeight * 0.6, 60)

  return (
    <div
      className="absolute bottom-0 flex flex-col items-center"
      style={{
        left: `calc(50% + ${offsetX}px)`,
        transform: "translateX(-50%)",
        transformOrigin: "center bottom",
        animation: `flower-sway ${3.4 + delay * 0.3}s ease-in-out ${-delay}s infinite, flower-breathe ${2.8 + delay * 0.2}s ease-in-out ${-delay}s infinite`,
      }}
    >
      {/* Flower head */}
      <div
        style={{
          width: flowerSize,
          height: flowerSize,
          position: "relative",
          filter: "drop-shadow(0 0 18px rgba(255, 200, 50, 0.65))",
          animation: `flower-bob ${3.4 + delay * 0.3}s ease-in-out ${-(delay + 0.1)}s infinite`,
        }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id={`petalGrad-${offsetX}`} cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFF176" />
              <stop offset="40%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FF8F00" />
            </radialGradient>
            <radialGradient id={`centerGrad-${offsetX}`} cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#6d4c41" />
              <stop offset="50%" stopColor="#3e2723" />
              <stop offset="100%" stopColor="#1a0f0a" />
            </radialGradient>
          </defs>

          {/* Outer petals */}
          {Array.from({ length: petalCount }).map((_, i) => {
            const angle = (i * 360) / petalCount
            return (
              <ellipse
                key={i}
                cx="50"
                cy="18"
                rx="9"
                ry="20"
                fill={`url(#petalGrad-${offsetX})`}
                stroke="rgba(255,160,0,0.3)"
                strokeWidth="0.5"
                transform={`rotate(${angle} 50 50)`}
              />
            )
          })}

          {/* Inner shorter petals */}
          {Array.from({ length: petalCount }).map((_, i) => {
            const angle = (i * 360) / petalCount + 360 / petalCount / 2
            return (
              <ellipse
                key={`inner-${i}`}
                cx="50"
                cy="26"
                rx="6"
                ry="14"
                fill="#FFB300"
                opacity="0.6"
                transform={`rotate(${angle} 50 50)`}
              />
            )
          })}

          {/* Center circle */}
          <circle cx="50" cy="50" r={centerSize / 2} fill={`url(#centerGrad-${offsetX})`} />

          {/* Seed spiral dots */}
          {Array.from({ length: 30 }).map((_, i) => {
            const angle = i * 137.5
            const r = Math.sqrt(i) * 2.6
            const x = 50 + r * Math.cos((angle * Math.PI) / 180)
            const y = 50 + r * Math.sin((angle * Math.PI) / 180)
            return <circle key={i} cx={x} cy={y} r="1.4" fill="#1a0f0a" opacity="0.7" />
          })}

          <ellipse cx="44" cy="44" rx="5" ry="3.5" fill="rgba(255,255,255,0.08)" />
        </svg>
      </div>

      {/* Stem + multiple leaves */}
      <svg
        width={stemW * 4}
        height={shorterStemHeight}
        viewBox={`0 0 ${stemW * 4} ${shorterStemHeight}`}
        className="overflow-visible"
        style={{ marginTop: -2 }}
      >
        <defs>
          <linearGradient id={`stemGrad-${offsetX}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2d5a27" />
            <stop offset="50%" stopColor="#4a8540" />
            <stop offset="100%" stopColor="#2d5a27" />
          </linearGradient>
        </defs>

        {/* Main stem */}
        <path
          d={`M${stemW * 2} 0 C${stemW * 1.6} ${shorterStemHeight * 0.25} ${stemW * 2.4} ${shorterStemHeight * 0.55} ${stemW * 2} ${shorterStemHeight}`}
          stroke={`url(#stemGrad-${offsetX})`}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Highlight stripe */}
        <path
          d={`M${stemW * 2} 0 C${stemW * 1.6} ${shorterStemHeight * 0.25} ${stemW * 2.4} ${shorterStemHeight * 0.55} ${stemW * 2} ${shorterStemHeight}`}
          stroke="#5ca050"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* Leaf 1 - left, upper */}
        <g
          style={{
            transformOrigin: `${stemW * 2}px ${shorterStemHeight * 0.2}px`,
            animation: `leaf-wave ${3.8 + delay * 0.4}s ease-in-out ${-(delay + 0.2)}s infinite`,
          }}
        >
          <path
            d={`M${stemW * 2} ${shorterStemHeight * 0.2} Q${stemW * -0.5} ${shorterStemHeight * 0.15} ${stemW * -1.8} ${shorterStemHeight * 0.28} Q${stemW * 0.5} ${shorterStemHeight * 0.23} ${stemW * 2} ${shorterStemHeight * 0.2}`}
            fill="#2d7a2f"
          />
          <path
            d={`M${stemW * 2} ${shorterStemHeight * 0.2} Q${stemW * 0.5} ${shorterStemHeight * 0.19} ${stemW * -0.5} ${shorterStemHeight * 0.25}`}
            stroke="#1a5c1c"
            strokeWidth="0.7"
            fill="none"
          />
        </g>

        {/* Leaf 2 - right, upper */}
        <g
          style={{
            transformOrigin: `${stemW * 2}px ${shorterStemHeight * 0.25}px`,
            animation: `leaf-wave ${3.4 + delay * 0.3}s ease-in-out ${-(delay + 0.35)}s infinite`,
          }}
        >
          <path
            d={`M${stemW * 2} ${shorterStemHeight * 0.25} Q${stemW * 4.5} ${shorterStemHeight * 0.18} ${stemW * 6} ${shorterStemHeight * 0.32} Q${stemW * 3.5} ${shorterStemHeight * 0.27} ${stemW * 2} ${shorterStemHeight * 0.25}`}
            fill="#2d7a2f"
          />
          <path
            d={`M${stemW * 2} ${shorterStemHeight * 0.25} Q${stemW * 3.5} ${shorterStemHeight * 0.25} ${stemW * 4.5} ${shorterStemHeight * 0.29}`}
            stroke="#1a5c1c"
            strokeWidth="0.7"
            fill="none"
          />
        </g>

        {/* Leaf 3 - left, middle */}
        <g
          style={{
            transformOrigin: `${stemW * 2}px ${shorterStemHeight * 0.42}px`,
            animation: `leaf-wave ${3.6 + delay * 0.35}s ease-in-out ${-(delay + 0.15)}s infinite`,
          }}
        >
          <path
            d={`M${stemW * 2} ${shorterStemHeight * 0.42} Q${stemW * -0.8} ${shorterStemHeight * 0.35} ${stemW * -2.2} ${shorterStemHeight * 0.5} Q${stemW * 0.3} ${shorterStemHeight * 0.45} ${stemW * 2} ${shorterStemHeight * 0.42}`}
            fill="#3d8a3f"
          />
          <path
            d={`M${stemW * 2} ${shorterStemHeight * 0.42} Q${stemW * 0.3} ${shorterStemHeight * 0.41} ${stemW * -0.8} ${shorterStemHeight * 0.48}`}
            stroke="#1a5c1c"
            strokeWidth="0.7"
            fill="none"
          />
        </g>

        {/* Leaf 4 - right, middle */}
        <g
          style={{
            transformOrigin: `${stemW * 2}px ${shorterStemHeight * 0.48}px`,
            animation: `leaf-wave ${3.2 + delay * 0.3}s ease-in-out ${-(delay + 0.5)}s infinite`,
          }}
        >
          <path
            d={`M${stemW * 2} ${shorterStemHeight * 0.48} Q${stemW * 4.8} ${shorterStemHeight * 0.4} ${stemW * 6.2} ${shorterStemHeight * 0.56} Q${stemW * 3.8} ${shorterStemHeight * 0.51} ${stemW * 2} ${shorterStemHeight * 0.48}`}
            fill="#3d8a3f"
          />
          <path
            d={`M${stemW * 2} ${shorterStemHeight * 0.48} Q${stemW * 3.8} ${shorterStemHeight * 0.48} ${stemW * 4.8} ${shorterStemHeight * 0.53}`}
            stroke="#1a5c1c"
            strokeWidth="0.7"
            fill="none"
          />
        </g>

        {/* Leaf 5 - left, lower */}
        <g
          style={{
            transformOrigin: `${stemW * 2}px ${shorterStemHeight * 0.65}px`,
            animation: `leaf-wave ${3.9 + delay * 0.4}s ease-in-out ${-(delay + 0.25)}s infinite`,
          }}
        >
          <path
            d={`M${stemW * 2} ${shorterStemHeight * 0.65} Q${stemW * -1} ${shorterStemHeight * 0.58} ${stemW * -2.4} ${shorterStemHeight * 0.73} Q${stemW * 0.2} ${shorterStemHeight * 0.68} ${stemW * 2} ${shorterStemHeight * 0.65}`}
            fill="#2d7a2f"
          />
          <path
            d={`M${stemW * 2} ${shorterStemHeight * 0.65} Q${stemW * 0.2} ${shorterStemHeight * 0.64} ${stemW * -1} ${shorterStemHeight * 0.7}`}
            stroke="#1a5c1c"
            strokeWidth="0.7"
            fill="none"
          />
        </g>

        {/* Leaf 6 - right, lower */}
        <g
          style={{
            transformOrigin: `${stemW * 2}px ${shorterStemHeight * 0.72}px`,
            animation: `leaf-wave ${3.3 + delay * 0.32}s ease-in-out ${-(delay + 0.4)}s infinite`,
          }}
        >
          <path
            d={`M${stemW * 2} ${shorterStemHeight * 0.72} Q${stemW * 5} ${shorterStemHeight * 0.64} ${stemW * 6.4} ${shorterStemHeight * 0.8} Q${stemW * 3.9} ${shorterStemHeight * 0.75} ${stemW * 2} ${shorterStemHeight * 0.72}`}
            fill="#2d7a2f"
          />
          <path
            d={`M${stemW * 2} ${shorterStemHeight * 0.72} Q${stemW * 3.9} ${shorterStemHeight * 0.72} ${stemW * 5} ${shorterStemHeight * 0.77}`}
            stroke="#1a5c1c"
            strokeWidth="0.7"
            fill="none"
          />
        </g>
      </svg>
    </div>
  )
}
