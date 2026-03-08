export function Moon() {
  return (
    <div className="absolute top-8 right-8 z-10">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-yellow-100 blur-2xl opacity-40 w-24 h-24 -inset-4" />

      {/* Moon body */}
      <div className="relative w-20 h-20 rounded-full bg-yellow-50 shadow-lg animate-pulse-glow" />
    </div>
  )
}
