"use client"

import { createContext, useContext } from "react"
import { siteConfig } from "./site-config"

export interface RuntimeConfig {
  musicFile: string
  cursorImage: string
  cursorTrailImage: string
  dedication: {
    header: string
    body: string[]
    closing: string
  }
}

const ConfigContext = createContext<RuntimeConfig>(siteConfig as RuntimeConfig)

export function useConfig() {
  return useContext(ConfigContext)
}

export function ConfigProvider({
  config,
  children,
}: {
  config: RuntimeConfig
  children: React.ReactNode
}) {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}

export function useDefaultConfig(): RuntimeConfig {
  return {
    musicFile: siteConfig.musicFile,
    cursorImage: siteConfig.cursorImage,
    cursorTrailImage: siteConfig.cursorImage,
    dedication: {
      header: siteConfig.dedication.header,
      body: [...siteConfig.dedication.body],
      closing: siteConfig.dedication.closing,
    },
  }
}
