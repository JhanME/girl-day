"use client"

export function Aurora() {
  return (
    <div className="absolute inset-x-0 top-0 h-[50%] pointer-events-none overflow-hidden">
      {/* Layer 1 — green/teal */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(34,197,94,0.25) 0%, rgba(16,185,129,0.1) 40%, transparent 100%)",
          animation: "aurora-wave 8s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />
      {/* Layer 2 — purple/pink */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(168,85,247,0.2) 0%, rgba(236,72,153,0.08) 35%, transparent 100%)",
          animation: "aurora-wave 10s ease-in-out 2s infinite",
          filter: "blur(50px)",
        }}
      />
      {/* Layer 3 — cyan */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(34,211,238,0.18) 0%, rgba(56,189,248,0.06) 30%, transparent 100%)",
          animation: "aurora-wave 12s ease-in-out 4s infinite",
          filter: "blur(45px)",
        }}
      />
    </div>
  )
}
