"use client"

import { useState, useEffect } from "react"
import { ConfigPanel } from "@/components/config-panel"
import { ConfigProvider } from "@/lib/config-context"
import type { RuntimeConfig } from "@/lib/config-context"
import { decodeConfigFromUrl } from "@/lib/share-config"
import { resolvePresetCursor } from "@/lib/cursor-presets"
import { Sunflower } from "@/components/sunflower"
import { CometField } from "@/components/shooting-star"
import { FloatingLeaf } from "@/components/floating-leaf"
import { Star } from "@/components/star"
import { Moon } from "@/components/moon"
import { Envelope } from "@/components/envelope"
import { FaceCursorTrail } from "@/components/face-cursor"
import { Fireflies } from "@/components/fireflies"
import { MusicPlayer } from "@/components/music-player"

function Scene() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#060e1a] via-[#0b1a30] to-[#091525]">
      {/* Music */}
      <MusicPlayer />

      {/* Cursor trail */}
      <FaceCursorTrail />

      {/* Envelope */}
      <Envelope />

      {/* Moon */}
      <Moon />

      {/* Background stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 60 }).map((_, i) => (
          <Star key={i} index={i} />
        ))}
      </div>

      {/* Fireflies */}
      <Fireflies />

      {/* Comets flying left to right with face */}
      <CometField />

      {/* Floating leaves */}
      <FloatingLeaf delay={0} startX={85} startY={22} />
      <FloatingLeaf delay={2.5} startX={92} startY={52} />
      <FloatingLeaf delay={5} startX={8} startY={42} />
      <FloatingLeaf delay={7.5} startX={78} startY={32} />

      {/* Sunflowers — core trio (all screens) */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-40">
        <Sunflower size="medium" stemHeight={120} offsetX={-48} delay={0.2} rotation={-8} />
        <Sunflower size="large"  stemHeight={150} offsetX={0}   delay={0}   rotation={0}  />
        <Sunflower size="medium" stemHeight={110} offsetX={48}  delay={0.5} rotation={8}  />
      </div>

      {/* Extra flowers — large screens only */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0">
        <Sunflower size="small"  stemHeight={90}  offsetX={-260} delay={0.8} rotation={-12} />
        <Sunflower size="medium" stemHeight={130} offsetX={-180} delay={0.4} rotation={-5}  />
        <Sunflower size="medium" stemHeight={125} offsetX={180}  delay={0.6} rotation={5}   />
        <Sunflower size="small"  stemHeight={85}  offsetX={260}  delay={1.0} rotation={12}  />
      </div>

      {/* Extra flowers — extra-large screens */}
      <div className="hidden xl:block absolute bottom-0 left-0 right-0">
        <Sunflower size="small"  stemHeight={80}  offsetX={-380} delay={1.2} rotation={-15} />
        <Sunflower size="medium" stemHeight={105} offsetX={-320} delay={0.7} rotation={-10} />
        <Sunflower size="medium" stemHeight={100} offsetX={320}  delay={0.9} rotation={10}  />
        <Sunflower size="small"  stemHeight={75}  offsetX={380}  delay={1.4} rotation={15}  />
      </div>

      {/* Bottom fern decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none">
        <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
          <g style={{ transformOrigin: "160px 100px", animation: "fern-sway 4s ease-in-out infinite" }}>
            <path
              d="M150 100 Q140 70 120 50 Q130 65 140 80 Q130 55 110 35 Q125 55 135 75 Q120 45 95 25 Q115 50 130 70 L150 100"
              fill="#1a5c30"
            />
            <path
              d="M165 100 Q175 70 195 50 Q185 65 175 80 Q185 55 205 35 Q190 55 180 75 Q195 45 220 25 Q200 50 185 70 L165 100"
              fill="#1a5c30"
            />
          </g>
          <g style={{ transformOrigin: "70px 100px", animation: "fern-sway 5s ease-in-out 0.5s infinite" }}>
            <path
              d="M70 100 Q60 78 48 65 Q55 74 65 87 Q52 65 40 52 Q50 65 60 82 L70 100"
              fill="#22703d"
            />
          </g>
          <g style={{ transformOrigin: "290px 100px", animation: "fern-sway 4.5s ease-in-out 1s infinite" }}>
            <path
              d="M290 100 Q300 78 312 65 Q305 74 295 87 Q308 65 320 52 Q310 65 300 82 L290 100"
              fill="#22703d"
            />
          </g>
        </svg>
      </div>
    </main>
  )
}

/** Apply cursor preset overrides to a config */
async function applyPreset(config: RuntimeConfig, presetId: string): Promise<RuntimeConfig> {
  const resolved = await resolvePresetCursor(presetId)
  if (!resolved) return config
  return { ...config, cursorImage: resolved.cursorImage, cursorTrailImage: resolved.cursorTrailImage }
}

export default function Home() {
  const [config, setConfig] = useState<RuntimeConfig | null>(null)
  const [checked, setChecked] = useState(false)

  // Check URL for shared config on mount
  useEffect(() => {
    const shared = decodeConfigFromUrl()
    if (shared) {
      applyPreset(shared.config, shared.cursorPreset).then((cfg) => {
        setConfig(cfg)
        setChecked(true)
      })
    } else {
      setChecked(true)
    }
  }, [])

  // Don't render anything until we've checked the URL
  if (!checked) return null

  if (!config) {
    return (
      <ConfigPanel
        onStart={(cfg, cursorPreset, _musicPreset) => {
          applyPreset(cfg, cursorPreset).then(setConfig)
        }}
      />
    )
  }

  return (
    <ConfigProvider config={config}>
      <div style={{ cursor: `url('${config.cursorImage}') 16 16, auto` }}>
        <Scene />
      </div>
    </ConfigProvider>
  )
}
