import { readdir } from "fs/promises"
import { join } from "path"
import { NextResponse } from "next/server"

const AUDIO_EXTENSIONS = new Set([".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac", ".webm"])

function fileToPreset(filename: string) {
  const dot = filename.lastIndexOf(".")
  const name = dot > 0 ? filename.slice(0, dot) : filename
  const id = name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
  const label = name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  return { id, label, file: `/music/${filename}` }
}

export async function GET() {
  const musicDir = join(process.cwd(), "public", "music")
  try {
    const entries = await readdir(musicDir)
    const tracks = entries
      .filter((f) => AUDIO_EXTENSIONS.has(f.slice(f.lastIndexOf(".")).toLowerCase()))
      .map(fileToPreset)
      .sort((a, b) => a.label.localeCompare(b.label))
    return NextResponse.json(tracks)
  } catch {
    return NextResponse.json([])
  }
}
