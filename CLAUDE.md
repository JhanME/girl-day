# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

**Development:**
- `pnpm dev` - Start Next.js dev server (port 3000)
- `pnpm build` - Production build
- `pnpm start` - Run production server
- `pnpm lint` - Run ESLint

**Tech Stack:**
- Next.js 16.1.6 with App Router and TypeScript
- React 19.2.4
- Tailwind CSS 4.2 (new @import syntax with @theme)
- shadcn/ui components library

## Project Overview

This is a Women's Day themed animation showcase website. The main page (`app/page.tsx`) renders a complex animated scene with:
- Animated text (FELIZ 8 DE MARZO → multi-stage animation)
- Falling/flying comets with face images
- Twinkling stars
- Swaying sunflowers and floating leaves
- Animated ferns at the bottom
- Dark gradient background

## Architecture

### File Structure

**Core App:**
- `app/layout.tsx` - Root layout with metadata and Analytics
- `app/page.tsx` - Main page (client component) that orchestrates all animations
- `app/globals.css` - All styling including custom Tailwind theme, animations, and keyframes

**Components:**
- `components/womens-day.tsx` - Main Women's Day animation with multi-stage state machine (initial → comet-impact → exploded)
- `components/shooting-star.tsx` - CometField component that manages multiple animated comets
- `components/sunflower.tsx` - Animated sunflower with stem, petals, and leaves
- `components/floating-leaf.tsx` - Individual floating leaf animation
- `components/star.tsx` - Twinkling background star
- `components/moon.tsx` - Moon element
- `components/ui/*` - shadcn/ui component library (pre-built, don't edit unless necessary)

**Utilities & Hooks:**
- `components/theme-provider.tsx` - Theme provider setup
- `lib/utils.ts` - Utility functions (mainly for shadcn/ui)
- `hooks/use-mobile.ts`, `hooks/use-toast.ts` - shadcn/ui hooks

### Configuration Files

- `components.json` - shadcn/ui configuration (style: new-york, aliases defined)
- `next.config.mjs` - Disables TypeScript build errors, unoptimizes images
- `tailwind.config.ts` - Not visible but Tailwind v4 config with @theme syntax
- `tsconfig.json` - TypeScript strict mode, path aliases (`@/*` → root)
- `postcss.config.mjs` - Tailwind/autoprefixer PostCSS config

## Key Implementation Details

### Animation System

All animations are defined in `app/globals.css` using CSS `@keyframes`. Key animations include:

- **Multi-stage text animation** (`WomensDay` component):
  - Stage 1 (0-3.5s): Pulsing "FELIZ 8 DE MARZO" text
  - Stage 2 (3.5-5s): Comet impacts the text with impact animation
  - Stage 3 (5s+): Explosion particles + new "Feliz día de la mujer" text fades in

- **Comet animations**: Four directional variants (diagonal-right, diagonal-left, top-down, bottom-up) with 8s flight time
- **Flower animations**: Natural sway + bob movements for organic feel
- **Custom CSS variables** in animations: `--angle`, `--rotation`, `--tw-opacity` for dynamic parameter injection

### Component Structure

Components use `"use client"` directive for interactivity. The `WomensDay` component demonstrates the pattern:
- State-driven rendering based on animation stages
- `useEffect` with `setTimeout` for choreography
- Inline styles for dynamic animation parameters
- Heavy use of Tailwind classes with custom animation classes

### Tailwind v4 Integration

Uses new Tailwind v4 syntax:
- `@import 'tailwindcss'` at top of globals.css
- `@theme inline { ... }` block for custom CSS variables
- CSS variables (OKLch color format) for theming
- Built-in animations imported via `@import 'tw-animate-css'`

## Common Tasks

**Adding a new animation:**
1. Create a new component in `components/`
2. Add keyframes to `app/globals.css`
3. Add custom animation class in globals.css (`.animate-*`)
4. Import and render in `app/page.tsx`

**Modifying existing animations:**
- Edit keyframes in `app/globals.css` for timing/movement
- Modify component state/logic for choreography changes
- Adjust inline styles in JSX for parameter tweaking

**Working with shadcn/ui:**
- Components are in `components/ui/`
- Use path alias `@/components/ui/button` instead of relative paths
- Integrate via composition, not modifications
- Theming via CSS variables in `:root` and `.dark` in globals.css

## Important Notes

- **TypeScript errors ignored in build**: `next.config.mjs` has `ignoreBuildErrors: true` — fixes are recommended
- **No database/API**: This is a frontend-only static animation showcase
- **Vercel Analytics enabled**: See `app/layout.tsx` for tracking
- **Images unoptimized**: Images served as-is without Next.js optimization
- **Animations use CSS transforms**: All movement via transform and opacity for performance
- **Custom animations in globals.css**: Don't split animations across files; keep them centralized for easy choreography
