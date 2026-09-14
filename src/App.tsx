import { useState, useRef, useEffect } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#F7F8FA",
  card: "#FFFFFF",
  navy: "#111827",
  muted: "#667085",
  blue: "#2563EB",
  bluePale: "#DBEAFE",
  blueMid: "#3B82F6",
  green: "#15803D",
  greenPale: "#DCFCE7",
  amber: "#B45309",
  amberPale: "#FEF3C7",
  red: "#B91C1C",
  redPale: "#FEE2E2",
  canvas: "#0F172A",
  border: "#E5E7EB",
  surface: "#F1F5F9",
  navBorder: "rgba(17,24,39,0.07)",
};

// ─── Shared UI Components ────────────────────────────────────────────────────
function Card({ children, className = "", style = {}, onClick }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`card-hover ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        background: C.card,
        borderRadius: 20,
        border: `1px solid ${C.border}`,
        boxShadow: "0 2px 12px rgba(17,24,39,0.05)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children, color = C.blue, bg = C.bluePale }: {
  children: React.ReactNode; color?: string; bg?: string;
}) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: bg, color, borderRadius: 999,
      fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
      padding: "3px 10px", letterSpacing: "0.02em",
    }}>
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 11, fontWeight: 700, letterSpacing: "0.09em",
      color: C.muted, textTransform: "uppercase", margin: "0 0 12px",
    }}>
      {children}
    </p>
  );
}

function EqBlock({ eq }: { eq: string }) {
  return (
    <div style={{
      background: C.canvas, borderRadius: 12, padding: "12px 16px",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 15, fontWeight: 500, color: "#93C5FD",
      letterSpacing: "0.04em",
    }}>
      {eq}
    </div>
  );
}

function MasteryRing({ pct, size = 88, stroke = 8, color = C.blue }: {
  pct: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.surface} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}

function ProgressBar({ pct, color = C.blue, height = 6 }: { pct: number; color?: string; height?: number }) {
  return (
    <div style={{ height, borderRadius: 999, background: C.surface, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 999, transition: "width 0.8s ease" }} />
    </div>
  );
}

function BackBtn({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} className="press-btn" style={{
      width: 36, height: 36, borderRadius: 12, background: C.surface,
      border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2.2" strokeLinecap="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

// ─── Scientific Decoration ────────────────────────────────────────────────────
function OrbitDecoration() {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: "absolute", top: -20, right: -30, opacity: 0.08, pointerEvents: "none" }}>
      <ellipse cx="90" cy="90" rx="70" ry="30" fill="none" stroke={C.blue} strokeWidth="1.5" transform="rotate(-20 90 90)" />
      <ellipse cx="90" cy="90" rx="70" ry="30" fill="none" stroke={C.blue} strokeWidth="1" transform="rotate(40 90 90)" />
      <circle cx="90" cy="90" r="8" fill={C.blue} opacity="0.6" />
      <circle cx="155" cy="68" r="4" fill={C.blue} />
    </svg>
  );
}

function WaveDecoration() {
  return (
    <svg width="160" height="40" viewBox="0 0 160 40" style={{ opacity: 0.15 }} preserveAspectRatio="none">
      <path d="M0 20 Q20 5 40 20 Q60 35 80 20 Q100 5 120 20 Q140 35 160 20"
        fill="none" stroke={C.blue} strokeWidth="2" />
    </svg>
  );
}

function GridDots({ cols = 6, rows = 4 }: { cols?: number; rows?: number }) {
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(<circle key={`${r}-${c}`} cx={c * 20 + 10} cy={r * 20 + 10} r="1.5" fill={C.blue} />);
    }
  }
  return (
    <svg width={cols * 20} height={rows * 20} style={{ opacity: 0.12, position: "absolute", bottom: 8, left: 8, pointerEvents: "none" }}>
      {dots}
    </svg>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = {
  home: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? C.blue : C.muted} strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  atom: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? C.blue : C.muted} strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round">
      <circle cx="12" cy="12" r="2.5" fill={active ? C.blue : "none"} stroke={active ? C.blue : C.muted} />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  ),
  rocket: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? C.blue : C.muted} strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 2 6 8 6 14a6 6 0 0012 0c0-6-6-12-6-12z" />
      <path d="M9 17.5L6 20M15 17.5L18 20M12 2v6" />
    </svg>
  ),
  lens: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? C.blue : C.muted} strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M11 8v3l2 2M20 20l-4-4" />
    </svg>
  ),
  chat: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? C.blue : C.muted} strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
    </svg>
  ),
  user: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? C.blue : C.muted} strokeWidth={active ? "2.2" : "1.8"} strokeLinecap="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  flame: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F97316" stroke="none">
      <path d="M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-6-6-8-6-14zM8 17c0-3 2-5 4-7 2 2 4 4 4 7a4 4 0 01-8 0z" />
    </svg>
  ),
  star: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  check: (color = C.green) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  play: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={C.blue} stroke="none">
      <path d="M5 3l14 9-14 9V3z" />
    </svg>
  ),
  pause: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={C.blue} stroke="none">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  ),
  scan: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round">
      <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
      <line x1="3" y1="12" x2="21" y2="12" strokeWidth="1.5" strokeDasharray="3 2" />
    </svg>
  ),
};

// ─── Screens ─────────────────────────────────────────────────────────────────

// HOME
function HomeScreen({ onNav }: { onNav: (screen: string) => void }) {
  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.muted, margin: 0 }}>Monday, September 14</p>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 700, color: C.navy, margin: "2px 0 0", lineHeight: 1.2 }}>
            Good morning, <span style={{ color: C.blue }}>Maya</span> ✦
          </h1>
        </div>
        <button onClick={() => onNav("profile")} className="press-btn" style={{
          width: 42, height: 42, borderRadius: 14, background: `linear-gradient(135deg, ${C.blue}, #1D4ED8)`,
          border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 12px ${C.blue}40`,
        }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>M</span>
        </button>
      </div>

      {/* Streak + XP Bar */}
      <div style={{ padding: "14px 20px", display: "flex", gap: 10 }}>
        <div style={{
          flex: 1, background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
          padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 2px 8px rgba(17,24,39,0.04)",
        }}>
          {Icon.flame()}
          <div>
            <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#F97316", lineHeight: 1 }}>12</p>
            <p style={{ margin: "1px 0 0", fontSize: 11, color: C.muted }}>Day streak</p>
          </div>
        </div>
        <div style={{
          flex: 1, background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
          padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 2px 8px rgba(17,24,39,0.04)",
        }}>
          {Icon.star()}
          <div>
            <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#F59E0B", lineHeight: 1 }}>2,840</p>
            <p style={{ margin: "1px 0 0", fontSize: 11, color: C.muted }}>XP · Level 6</p>
          </div>
        </div>
        <div style={{
          width: 70, background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
          padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
          boxShadow: "0 2px 8px rgba(17,24,39,0.04)", position: "relative",
        }}>
          <MasteryRing pct={64} size={48} stroke={5} />
          <div style={{ position: "absolute", textAlign: "center" }}>
            <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: C.navy }}>64%</p>
          </div>
        </div>
      </div>

      {/* Continue Adventure Hero Card */}
      <div style={{ padding: "0 20px 16px" }}>
        <div
          onClick={() => onNav("simulation-detail")}
          className="press-btn card-hover cursor-pointer"
          style={{
            background: `linear-gradient(145deg, #1E3A8A 0%, #1D4ED8 50%, #2563EB 100%)`,
            borderRadius: 24, padding: "22px 20px", position: "relative", overflow: "hidden",
            boxShadow: `0 8px 32px ${C.blue}50`,
          }}
        >
          <OrbitDecoration />
          <GridDots cols={8} rows={5} />
          <Pill bg="rgba(255,255,255,0.18)" color="#fff">Continue Adventure</Pill>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700,
            color: "#fff", margin: "10px 0 4px", lineHeight: 1.25,
          }}>
            Orbital Mechanics
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: "0 0 16px", lineHeight: 1.5 }}>
            Chapter 4 · Kepler's Laws of Planetary Motion
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1, marginRight: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Progress</span>
                <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>68%</span>
              </div>
              <div style={{ height: 5, borderRadius: 999, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "68%", background: "#fff", borderRadius: 999 }} />
              </div>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 14, background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: "0 20px 16px" }}>
        <SectionLabel>Quick Actions</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "🤖", label: "Ask Bavi", sub: "AI Physics Tutor", color: "#EEF2FF", accent: "#4F46E5", screen: "tutor" },
            { icon: "📸", label: "Scan Problem", sub: "Camera solver", color: C.bluePale, accent: C.blue, screen: "scan" },
            { icon: "🔬", label: "Physics Lens", sub: "Live experiments", color: "#F0FDF4", accent: C.green, screen: "lens" },
            { icon: "⚛️", label: "Simulations", sub: "Interactive labs", color: "#FFF7ED", accent: "#EA580C", screen: "lab" },
          ].map(({ icon, label, sub, color, accent, screen }) => (
            <button
              key={label}
              onClick={() => onNav(screen)}
              className="press-btn card-hover"
              style={{
                background: color, borderRadius: 18, padding: "16px 14px",
                border: `1px solid rgba(0,0,0,0.06)`, cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "flex-start",
                gap: 8, textAlign: "left",
                boxShadow: "0 2px 10px rgba(17,24,39,0.04)",
              }}
            >
              <span style={{ fontSize: 26 }}>{icon}</span>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: C.navy, margin: 0 }}>{label}</p>
                <p style={{ fontSize: 11, color: C.muted, margin: "2px 0 0" }}>{sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Challenge */}
      <div style={{ padding: "0 20px 16px" }}>
        <SectionLabel>Daily Challenge</SectionLabel>
        <Card style={{ padding: "18px 18px 16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, opacity: 0.06 }}>
            <WaveDecoration />
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, background: C.amberPale,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: 22 }}>⚡</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Pill bg={C.amberPale} color={C.amber}>Today · 3 min</Pill>
                <Pill bg={C.bluePale} color={C.blue}>+150 XP</Pill>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: C.navy, margin: "0 0 4px", lineHeight: 1.4 }}>
                A satellite orbits Earth at height h = 400 km. Find its orbital speed.
              </p>
              <p style={{ fontSize: 12, color: C.muted, margin: "0 0 12px" }}>Mechanics · Circular Orbits</p>
              <button
                onClick={() => onNav("practice")}
                className="press-btn"
                style={{
                  background: C.blue, color: "#fff", border: "none", borderRadius: 12,
                  padding: "9px 20px", fontSize: 13, fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  boxShadow: `0 4px 14px ${C.blue}40`,
                }}
              >
                Accept Challenge →
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div style={{ padding: "0 20px 16px" }}>
        <SectionLabel>Recent Activity</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { icon: "✓", label: "Coulomb's Law", sub: "Practice · 3 correct", color: C.green, bg: C.greenPale, time: "2h ago" },
            { icon: "~", label: "Wave Interference", sub: "Simulation · 12 min", color: C.blue, bg: C.bluePale, time: "Yesterday" },
            { icon: "📐", label: "Projectile Motion", sub: "Scanned & solved", color: "#7C3AED", bg: "#EDE9FE", time: "2 days ago" },
          ].map(({ icon, label, sub, color, bg, time }) => (
            <Card key={label} style={{ padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: C.navy, margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 12, color: C.muted, margin: "1px 0 0" }}>{sub}</p>
                </div>
                <span style={{ fontSize: 11, color: C.muted }}>{time}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// TUTOR
function TutorScreen() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm **Bavi**, your AI physics tutor. What would you like to explore today? You can ask me anything from Newtonian mechanics to quantum phenomena. ✦" },
    { role: "user", text: "How does a pendulum's period change with length?" },
    { role: "assistant", text: "Great question! A pendulum's period depends on its length and gravitational acceleration — but **not** on the bob's mass or the amplitude (for small angles). Here's the relationship:", type: "explanation" },
    { role: "equation", eq: "T = 2π √(L / g)", label: "Period of a Simple Pendulum" },
    { role: "verified", label: "Verified Calculation", vars: [{ k: "L", v: "0.5 m" }, { k: "g", v: "9.81 m/s²" }], result: "T ≈ 1.42 s" },
    { role: "assistant", text: "**Key insight:** Doubling the length increases the period by a factor of √2 ≈ 1.41, not 2. This is because the period scales with the *square root* of length, not linearly." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { role: "user", text: input }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, {
        role: "assistant",
        text: "That's a thoughtful follow-up! Let me work through this systematically for you. The key principle here involves the conservation of energy and the geometry of circular motion.",
      }]);
    }, 1800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{
        padding: "20px 20px 14px", background: C.bg,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: `linear-gradient(135deg, #4F46E5, ${C.blue})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(79,70,229,0.3)",
          }}>
            <span style={{ fontSize: 22 }}>🤖</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 700, color: C.navy, margin: 0 }}>Bavi</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: 999, background: C.green }} />
              <span style={{ fontSize: 11, color: C.muted }}>AI Physics Tutor · Online</span>
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Pill bg={C.bluePale} color={C.blue}>5 / 20 queries</Pill>
          </div>
        </div>

        {/* Quick action chips */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, overflowX: "auto", paddingBottom: 2 }}>
          {["💡 Hint", "📐 Solve step-by-step", "🔁 Explain simpler", "⚛️ Show simulation", "🔗 Similar problem"].map(chip => (
            <button key={chip} className="press-btn" style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 999, padding: "7px 14px", fontSize: 12, fontWeight: 500,
              color: C.navy, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            }}>
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        {messages.map((m, i) => {
          if (m.role === "equation") {
            return (
              <div key={i} style={{ margin: "10px 0" }}>
                <p style={{ fontSize: 11, color: C.muted, margin: "0 0 6px", textAlign: "center" }}>{m.label}</p>
                <EqBlock eq={m.eq!} />
              </div>
            );
          }
          if (m.role === "verified") {
            return (
              <div key={i} style={{
                background: C.greenPale, border: `1px solid ${C.green}30`,
                borderRadius: 16, padding: "14px 16px", margin: "10px 0",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  {Icon.check()}
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: C.green }}>VERIFIED CALCULATION</span>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                  {m.vars!.map(v => (
                    <div key={v.k} style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "6px 12px" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: C.navy }}>
                        <span style={{ color: C.muted }}>{v.k} = </span>{v.v}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ background: C.green, borderRadius: 10, padding: "8px 14px", display: "inline-block" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: "#fff" }}>{m.result}</span>
                </div>
              </div>
            );
          }
          const isUser = m.role === "user";
          return (
            <div key={i} style={{
              display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}>
              {!isUser && (
                <div style={{ width: 30, height: 30, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 14 }}>🤖</span>
                </div>
              )}
              <div style={{
                maxWidth: "78%",
                background: isUser ? C.blue : C.card,
                color: isUser ? "#fff" : C.navy,
                borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                padding: "12px 14px",
                fontSize: 14, lineHeight: 1.55,
                border: isUser ? "none" : `1px solid ${C.border}`,
                boxShadow: isUser ? `0 4px 14px ${C.blue}30` : "0 2px 8px rgba(17,24,39,0.04)",
              }}>
                {m.text!.replace(/\*\*(.*?)\*\*/g, "$1")}
              </div>
            </div>
          );
        })}

        {typing && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 14 }}>🤖</span>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "4px 18px 18px 18px", padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 0.2, 0.4].map(d => (
                  <div key={d} style={{
                    width: 6, height: 6, borderRadius: 999, background: C.muted,
                    animation: `blink 1.2s ${d}s ease infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "10px 16px 90px", background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div style={{
            flex: 1, background: C.card, border: `1.5px solid ${C.border}`,
            borderRadius: 18, padding: "11px 16px",
            boxShadow: "0 2px 8px rgba(17,24,39,0.05)",
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask Bavi anything about physics…"
              style={{
                width: "100%", border: "none", background: "transparent",
                fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.navy,
                outline: "none",
              }}
            />
          </div>
          <button
            onClick={sendMessage}
            className="press-btn"
            style={{
              width: 44, height: 44, borderRadius: 14,
              background: input.trim() ? C.blue : C.surface,
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
              boxShadow: input.trim() ? `0 4px 14px ${C.blue}40` : "none",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? "#fff" : C.muted} strokeWidth="2.2" strokeLinecap="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// SCAN PROBLEM
function ScanScreen({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<"capture" | "review" | "result">("capture");

  if (step === "result") {
    return (
      <div style={{ padding: "20px 20px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <BackBtn onBack={() => setStep("review")} />
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, color: C.navy, margin: 0 }}>Solution</h2>
          <Pill bg={C.greenPale} color={C.green}>Solved ✓</Pill>
        </div>

        <EqBlock eq="v = √(2gh)  →  v = √(2 × 9.81 × 15)" />
        <div style={{ height: 12 }} />
        <EqBlock eq="v = √(294.3)  ≈  17.15 m/s" />
        <div style={{ height: 16 }} />

        <Card style={{ padding: 18 }}>
          <SectionLabel>Step-by-Step</SectionLabel>
          {[
            { n: 1, text: "Identify energy conservation: KE_final = PE_initial", ok: true },
            { n: 2, text: "Substitute: ½mv² = mgh → v² = 2gh", ok: true },
            { n: 3, text: "Plug in h = 15 m, g = 9.81 m/s²", ok: true },
            { n: 4, text: "Calculate: v ≈ 17.15 m/s downward", ok: true },
          ].map(s => (
            <div key={s.n} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {Icon.check()}
              </div>
              <p style={{ fontSize: 14, color: C.navy, margin: 0, lineHeight: 1.5 }}>{s.text}</p>
            </div>
          ))}
        </Card>

        <div style={{ height: 14 }} />
        <button className="press-btn" style={{
          width: "100%", background: C.blue, color: "#fff", border: "none",
          borderRadius: 16, padding: "15px", fontSize: 15, fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          boxShadow: `0 6px 20px ${C.blue}40`,
        }}>
          Practice Similar Problems →
        </button>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div style={{ padding: "20px 20px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <BackBtn onBack={() => setStep("capture")} />
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, color: C.navy, margin: 0 }}>Recognition Review</h2>
        </div>

        <Card style={{ padding: 18, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Pill bg={C.greenPale} color={C.green}>✓ 94% confidence</Pill>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: C.navy, margin: "0 0 16px", lineHeight: 1.5 }}>
            A ball is dropped from rest at a height of h = 15 m. Find its speed just before hitting the ground.
          </p>

          <SectionLabel>Recognized Variables</SectionLabel>
          {[
            { sym: "h", val: "15", unit: "m", ok: true },
            { sym: "g", val: "9.81", unit: "m/s²", ok: true },
            { sym: "v₀", val: "0", unit: "m/s", ok: true },
          ].map(v => (
            <div key={v.sym} style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
              background: C.surface, borderRadius: 12, padding: "10px 12px",
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: C.blue, width: 30 }}>{v.sym}</span>
              <input defaultValue={v.val} style={{
                flex: 1, border: "none", background: "transparent", fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace", color: C.navy, outline: "none",
              }} />
              <span style={{ fontSize: 13, color: C.muted, fontFamily: "'JetBrains Mono', monospace" }}>{v.unit}</span>
              {v.ok && <div style={{ color: C.green }}>{Icon.check()}</div>}
            </div>
          ))}

          <div style={{ marginTop: 6, padding: "10px 12px", background: C.bluePale, borderRadius: 12 }}>
            <p style={{ fontSize: 12, color: C.blue, margin: 0 }}>
              ✦ Detected concept: <strong>Kinematics / Free Fall</strong> · Energy Conservation applicable
            </p>
          </div>
        </Card>

        <button onClick={() => setStep("result")} className="press-btn" style={{
          width: "100%", background: C.blue, color: "#fff", border: "none",
          borderRadius: 16, padding: "15px", fontSize: 15, fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          boxShadow: `0 6px 20px ${C.blue}40`,
        }}>
          Solve This Problem →
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 20px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <BackBtn onBack={onBack} />
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, color: C.navy, margin: 0 }}>Scan Problem</h2>
      </div>

      {/* Scan viewport */}
      <div onClick={() => setStep("review")} className="press-btn cursor-pointer" style={{
        height: 260, borderRadius: 24, overflow: "hidden", position: "relative",
        background: C.canvas, marginBottom: 16,
        border: `2px solid ${C.blue}`,
        boxShadow: `0 0 0 4px ${C.blue}20`,
      }}>
        {/* Corner markers */}
        {[
          { top: 12, left: 12, rot: 0 },
          { top: 12, right: 12, rot: 90 },
          { bottom: 12, right: 12, rot: 180 },
          { bottom: 12, left: 12, rot: 270 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos as any,
            width: 24, height: 24,
            borderTop: i < 2 ? `2.5px solid ${C.blue}` : "none",
            borderBottom: i >= 2 ? `2.5px solid ${C.blue}` : "none",
            borderLeft: i % 3 !== 1 ? `2.5px solid ${C.blue}` : "none",
            borderRight: i % 3 === 1 ? `2.5px solid ${C.blue}` : "none",
            borderRadius: 3,
          }} />
        ))}

        {/* Scan line */}
        <div style={{
          position: "absolute", left: 20, right: 20, height: 2,
          background: `linear-gradient(90deg, transparent, ${C.blue}, transparent)`,
          top: "45%",
          boxShadow: `0 0 12px ${C.blue}`,
          animation: "float 2s ease-in-out infinite",
        }} />

        <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0 }}>
            Point camera at a physics problem
          </p>
          <p style={{ color: C.blue, fontSize: 12, margin: "4px 0 0", fontWeight: 600 }}>
            Tap to simulate scan →
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span style={{ fontSize: 12, color: C.muted }}>or type manually</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>

      <textarea
        placeholder="Type or paste your physics problem here…"
        style={{
          width: "100%", minHeight: 100, background: C.card,
          border: `1.5px solid ${C.border}`, borderRadius: 16,
          padding: "14px 16px", fontFamily: "'Inter', sans-serif",
          fontSize: 14, color: C.navy, outline: "none", resize: "none",
          lineHeight: 1.6,
        }}
      />

      <div style={{ height: 12 }} />
      <button onClick={() => setStep("review")} className="press-btn" style={{
        width: "100%", background: C.blue, color: "#fff", border: "none",
        borderRadius: 16, padding: "15px", fontSize: 15, fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
        boxShadow: `0 6px 20px ${C.blue}40`,
      }}>
        {Icon.scan()} Analyse Problem
      </button>
    </div>
  );
}

// PHYSICS LENS
function LensScreen({ onBack }: { onBack: () => void }) {
  const [active, setActive] = useState("Pendulum");

  const dataPoints = [
    { x: 0.2, y: 0.90 }, { x: 0.4, y: 1.27 }, { x: 0.6, y: 1.55 },
    { x: 0.8, y: 1.79 }, { x: 1.0, y: 2.00 }, { x: 1.2, y: 2.19 },
  ];

  const W = 320, H = 160, pad = 32;
  const maxX = 1.4, maxY = 2.4;
  const toSvg = (x: number, y: number) => ({
    sx: pad + (x / maxX) * (W - pad * 2),
    sy: H - pad - (y / maxY) * (H - pad * 1.6),
  });

  const pathD = dataPoints.map(({ x, y }, i) => {
    const { sx, sy } = toSvg(x, y);
    return `${i === 0 ? "M" : "L"} ${sx} ${sy}`;
  }).join(" ");

  return (
    <div style={{ padding: "20px 20px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <BackBtn onBack={onBack} />
        <div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, color: C.navy, margin: 0 }}>Physics Lens</h2>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Pocket Laboratory</p>
        </div>
      </div>

      {/* Experiment selector */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
        {["Pendulum", "Incline", "Spring", "Capacitor"].map(exp => (
          <button key={exp} onClick={() => setActive(exp)} className="press-btn" style={{
            background: active === exp ? C.blue : C.card,
            color: active === exp ? "#fff" : C.navy,
            border: `1px solid ${active === exp ? "transparent" : C.border}`,
            borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            boxShadow: active === exp ? `0 4px 12px ${C.blue}40` : "none",
          }}>
            {exp}
          </button>
        ))}
      </div>

      {/* Live capture area */}
      <Card style={{ padding: 0, overflow: "hidden", marginBottom: 14 }}>
        <div style={{
          height: 140, background: C.canvas, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Pendulum SVG */}
          <svg width="100" height="120" viewBox="0 0 100 120">
            <line x1="50" y1="5" x2="50" y2="5" stroke="#334155" strokeWidth="60" />
            <line x1="50" y1="5" x2="68" y2="85" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="68" cy="90" r="10" fill={C.blue} />
            <line x1="50" y1="5" x2="50" y2="5" stroke="#1E3A8A" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="50" y1="5" x2="50" y2="85" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
          <div style={{ position: "absolute", top: 10, left: 14 }}>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: 999, background: "#22C55E", animation: "blink 2s infinite" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: "'JetBrains Mono', monospace" }}>LIVE</span>
            </div>
          </div>
          <div style={{ position: "absolute", right: 14, top: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#93C5FD" }}>L = 0.85 m</span>
          </div>
          <div style={{ position: "absolute", right: 14, bottom: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#93C5FD" }}>T = 1.85 s</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ padding: "12px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: C.muted }}>String Length (L)</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.navy }}>0.85 m</span>
          </div>
          <input type="range" min={10} max={200} defaultValue={85} style={{ width: "100%", accentColor: C.blue }} />
        </div>
      </Card>

      {/* Graph */}
      <Card style={{ padding: 16, marginBottom: 14 }}>
        <SectionLabel>T vs √L — Experimental Data</SectionLabel>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
          {/* Grid */}
          {[0.5, 1.0, 1.5, 2.0].map(y => {
            const { sy } = toSvg(0, y);
            return <line key={y} x1={pad} y1={sy} x2={W - pad} y2={sy} stroke={C.border} strokeWidth="0.8" strokeDasharray="3 3" />;
          })}
          {/* Curve */}
          <path d={pathD} fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Points */}
          {dataPoints.map(({ x, y }) => {
            const { sx, sy } = toSvg(x, y);
            return <circle key={x} cx={sx} cy={sy} r="4" fill={C.blue} stroke="#fff" strokeWidth="1.5" />;
          })}
          {/* Axis labels */}
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="10" fill={C.muted} fontFamily="JetBrains Mono">√L (m½)</text>
          <text x={10} y={H / 2} textAnchor="middle" fontSize="10" fill={C.muted} fontFamily="JetBrains Mono" transform={`rotate(-90, 10, ${H / 2})`}>T (s)</text>
        </svg>
        <div style={{ marginTop: 8, padding: "10px 12px", background: C.bluePale, borderRadius: 10 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.blue, margin: 0 }}>
            Slope = 2π/√g ≈ 2.006 · R² = 0.9997
          </p>
        </div>
      </Card>

      {/* Data Table */}
      <Card style={{ padding: 16 }}>
        <SectionLabel>Measurements</SectionLabel>
        <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            {["Trial", "L (m)", "T (s)"].map(h => (
              <div key={h} style={{ background: C.surface, padding: "7px 8px", fontSize: 11, color: C.muted, fontWeight: 600, borderRadius: 6 }}>{h}</div>
            ))}
            {dataPoints.map(({ x, y }, i) => (
              [i + 1, x.toFixed(1), y.toFixed(2)].map((v, j) => (
                <div key={`${i}-${j}`} style={{ padding: "7px 8px", fontSize: 12, color: C.navy, background: i % 2 === 0 ? C.bg : C.card, borderRadius: 4 }}>{v}</div>
              ))
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// BUILD — LAB
function BuildScreen({ onSimDetail }: { onSimDetail: () => void }) {
  const [category, setCategory] = useState("All");
  const cats = ["All", "Mechanics", "Waves", "Electricity", "Optics", "Quantum", "Astronomy"];

  const sims = [
    { title: "Projectile Motion", sub: "Mechanics · Kinematics", icon: "🏹", bg: "#FFF7ED", accent: "#EA580C", difficulty: "Beginner" },
    { title: "Wave Interference", sub: "Waves · Superposition", icon: "〜", bg: "#EFF6FF", accent: C.blue, difficulty: "Intermediate" },
    { title: "Electric Fields", sub: "Electricity · Coulomb", icon: "⚡", bg: "#FFFBEB", accent: "#D97706", difficulty: "Intermediate" },
    { title: "Simple Harmonic Motion", sub: "Mechanics · Oscillations", icon: "🔄", bg: "#F0FDF4", accent: C.green, difficulty: "Beginner" },
    { title: "Quantum Tunneling", sub: "Quantum · Wavefunctions", icon: "⚛️", bg: "#FAF5FF", accent: "#7C3AED", difficulty: "Advanced" },
    { title: "Orbital Mechanics", sub: "Astronomy · Gravity", icon: "🪐", bg: "#EFF6FF", accent: "#1D4ED8", difficulty: "Intermediate" },
    { title: "Lens & Optics", sub: "Optics · Refraction", icon: "🔭", bg: "#FFF1F2", accent: "#E11D48", difficulty: "Intermediate" },
    { title: "RC Circuits", sub: "Electricity · Capacitance", icon: "🔋", bg: "#ECFDF5", accent: "#059669", difficulty: "Advanced" },
  ].filter(s => category === "All" || s.sub.includes(category));

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 16px" }}>
        <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 700, color: C.navy, margin: "0 0 4px" }}>
          Physics Lab ⚗️
        </h1>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          {sims.length} interactive simulations · {category}
        </p>
      </div>

      {/* Category filter */}
      <div style={{ paddingLeft: 20, marginBottom: 16, display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCategory(c)} className="press-btn" style={{
            background: category === c ? C.navy : C.card,
            color: category === c ? "#fff" : C.navy,
            border: `1px solid ${category === c ? "transparent" : C.border}`,
            borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
          }}>
            {c}
          </button>
        ))}
      </div>

      {/* Simulation grid */}
      <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {sims.map(({ title, sub, icon, bg, accent, difficulty }) => (
          <button
            key={title}
            onClick={onSimDetail}
            className="press-btn card-hover"
            style={{
              background: bg, borderRadius: 20, padding: "18px 14px",
              border: `1px solid rgba(0,0,0,0.06)`, cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 10, textAlign: "left",
              boxShadow: "0 2px 10px rgba(17,24,39,0.05)",
            }}
          >
            <div style={{ fontSize: 32 }}>{icon}</div>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: C.navy, margin: "0 0 3px", lineHeight: 1.3 }}>{title}</p>
              <p style={{ fontSize: 11, color: C.muted, margin: "0 0 8px" }}>{sub}</p>
              <div style={{
                display: "inline-block", background: `${accent}18`, color: accent,
                borderRadius: 8, padding: "3px 8px", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.05em",
              }}>
                {difficulty}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// SIMULATION DETAIL
function SimDetailScreen({ onBack }: { onBack: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [angle, setAngle] = useState(30);
  const [speed, setSpeed] = useState(20);
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => setTime(t => t + 0.1), 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing]);

  const vx = speed * Math.cos((angle * Math.PI) / 180);
  const vy = speed * Math.sin((angle * Math.PI) / 180);
  const t = time % 4;
  const x = vx * t;
  const y = vy * t - 0.5 * 9.81 * t * t;
  const range = (2 * vx * vy) / 9.81;
  const maxH = (vy * vy) / (2 * 9.81);

  const cx = 30 + Math.max(0, Math.min(x / range, 1)) * 280;
  const cy = 200 - Math.max(0, y / maxH) * 120;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Canvas viewport */}
      <div style={{ background: C.canvas, position: "relative", height: 220, flexShrink: 0 }}>
        {/* Grid lines */}
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, opacity: 0.15 }}>
          {[1, 2, 3, 4].map(i => <line key={i} x1={i * 80} y1={0} x2={i * 80} y2={220} stroke="#94A3B8" strokeWidth="0.5" />)}
          {[1, 2].map(i => <line key={i} x1={0} y1={i * 73} x2={400} y2={i * 73} stroke="#94A3B8" strokeWidth="0.5" />)}
        </svg>

        {/* Trajectory path */}
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
          <path
            d={`M 30 200 Q ${30 + range / 2 * 280 / range} ${200 - maxH * 120 / maxH * 1.1} ${30 + 280} 200`}
            fill="none" stroke={`${C.blue}40`} strokeWidth="1.5" strokeDasharray="4 3"
          />
          {/* Projectile */}
          <circle cx={cx} cy={cy} r="8" fill={C.blue} />
          <circle cx={cx} cy={cy} r="14" fill={`${C.blue}30`} />
          {/* Ground */}
          <line x1="20" y1="200" x2="360" y2="200" stroke="#334155" strokeWidth="2" />
          {/* Velocity vector */}
          <line x1={cx} y1={cy} x2={cx + vx * 1.5} y2={cy - Math.max(0, vy - 9.81 * t) * 1.5} stroke="#F59E0B" strokeWidth="1.5" />
        </svg>

        {/* Back + Title */}
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <BackBtn onBack={onBack} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>Projectile Motion</span>
        </div>

        {/* Live readout */}
        <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.5)", borderRadius: 10, padding: "8px 12px" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#93C5FD", margin: "0 0 2px" }}>t = {t.toFixed(1)} s</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#FCD34D", margin: 0 }}>v = {Math.sqrt((vx ** 2 + Math.max(0, vy - 9.81 * t) ** 2)).toFixed(1)} m/s</p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 90px", background: C.bg }}>
        {/* Playback */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            { label: playing ? "Pause" : "Play", icon: playing ? Icon.pause() : Icon.play(), action: () => setPlaying(p => !p), primary: true },
            { label: "Reset", icon: <span style={{ fontSize: 14 }}>↺</span>, action: () => { setPlaying(false); setTime(0); }, primary: false },
            { label: "Step", icon: <span style={{ fontSize: 14 }}>⏭</span>, action: () => setTime(t => t + 0.5), primary: false },
          ].map(({ label, icon, action, primary }) => (
            <button key={label} onClick={action} className="press-btn" style={{
              flex: primary ? 1.5 : 1, background: primary ? C.blue : C.card,
              color: primary ? "#fff" : C.navy, border: `1px solid ${primary ? "transparent" : C.border}`,
              borderRadius: 14, padding: "12px 8px", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 6, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
              boxShadow: primary ? `0 4px 14px ${C.blue}40` : "none",
            }}>
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Sliders */}
        <Card style={{ padding: 16, marginBottom: 14 }}>
          <SectionLabel>Variables</SectionLabel>
          {[
            { label: "Launch Angle", sym: "θ", val: angle, set: setAngle, min: 0, max: 90, unit: "°" },
            { label: "Initial Speed", sym: "v₀", val: speed, set: setSpeed, min: 1, max: 40, unit: "m/s" },
          ].map(({ label, sym, val, set, min, max, unit }) => (
            <div key={sym} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: C.navy }}>{label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: C.blue, fontWeight: 600 }}>
                  {sym} = {val}{unit}
                </span>
              </div>
              <input
                type="range" min={min} max={max} value={val}
                onChange={e => set(Number(e.target.value))}
                style={{ width: "100%", accentColor: C.blue }}
              />
            </div>
          ))}
        </Card>

        {/* Equations */}
        <Card style={{ padding: 16, marginBottom: 14 }}>
          <SectionLabel>Equations</SectionLabel>
          <EqBlock eq={`R = v₀²sin(2θ)/g = ${range.toFixed(1)} m`} />
          <div style={{ height: 8 }} />
          <EqBlock eq={`H = v₀²sin²θ/2g = ${maxH.toFixed(1)} m`} />
        </Card>

        {/* Measurements */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Range", val: `${range.toFixed(1)} m`, color: C.blue },
            { label: "Max Height", val: `${maxH.toFixed(1)} m`, color: "#7C3AED" },
            { label: "Time of Flight", val: `${(2 * vy / 9.81).toFixed(2)} s`, color: C.green },
            { label: "Impact Speed", val: `${speed.toFixed(1)} m/s`, color: C.amber },
          ].map(({ label, val, color }) => (
            <Card key={label} style={{ padding: "14px 14px" }}>
              <p style={{ fontSize: 11, color: C.muted, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 600, color, margin: 0 }}>{val}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ADVENTURE — PRACTICE
function AdventureScreen() {
  const [answered, setAnswered] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [qIdx, setQIdx] = useState(0);

  const questions = [
    {
      topic: "Mechanics · Newton's 2nd Law",
      text: "A 5 kg box is pushed with a net force of 20 N across a frictionless surface. What is its acceleration?",
      options: ["1 m/s²", "4 m/s²", "10 m/s²", "100 m/s²"],
      correct: "4 m/s²",
      explanation: "Using F = ma: a = F/m = 20/5 = 4 m/s². Acceleration is directly proportional to force and inversely proportional to mass.",
      xp: 120,
    },
    {
      topic: "Energy · Kinetic Energy",
      text: "A 2 kg ball moving at 6 m/s. What is its kinetic energy?",
      options: ["12 J", "18 J", "36 J", "72 J"],
      correct: "36 J",
      explanation: "KE = ½mv² = ½ × 2 × 6² = ½ × 2 × 36 = 36 J. Always remember the factor of one-half!",
      xp: 100,
    },
  ];

  const q = questions[qIdx % questions.length];
  const isCorrect = answered === q.correct;

  const nextQuestion = () => {
    setAnswered(null);
    setRevealed(false);
    setQIdx(i => i + 1);
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 700, color: C.navy, margin: "0 0 2px" }}>Practice 🎯</h1>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Question {(qIdx % 2) + 1} of 10</p>
          </div>
          <Pill bg={C.bluePale} color={C.blue}>+{q.xp} XP</Pill>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 14 }}>
          <ProgressBar pct={((qIdx % 10) / 10) * 100} />
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Topic chip */}
        <Pill bg={C.surface} color={C.muted}>{q.topic}</Pill>

        {/* Question */}
        <Card style={{ padding: "20px 18px", margin: "14px 0 16px" }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 600,
            color: C.navy, margin: 0, lineHeight: 1.55,
          }}>
            {q.text}
          </p>
        </Card>

        {/* Answer options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {q.options.map(opt => {
            let bg = C.card, border = C.border, textColor = C.navy;
            if (answered) {
              if (opt === q.correct) { bg = C.greenPale; border = `${C.green}60`; textColor = C.green; }
              else if (opt === answered) { bg = C.redPale; border = `${C.red}60`; textColor = C.red; }
            }
            if (answered === opt && opt !== q.correct) {
              bg = C.redPale; border = C.red; textColor = C.red;
            }

            return (
              <button
                key={opt}
                onClick={() => !answered && setAnswered(opt)}
                className="press-btn"
                style={{
                  background: bg, border: `1.5px solid ${border}`,
                  borderRadius: 16, padding: "14px 16px", textAlign: "left",
                  cursor: answered ? "default" : "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 10,
                  background: answered && opt === q.correct ? C.green : (answered === opt ? C.red : C.surface),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {answered && opt === q.correct
                    ? Icon.check("#fff")
                    : answered === opt
                    ? <span style={{ color: "#fff", fontSize: 14 }}>✕</span>
                    : <span style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>{["A", "B", "C", "D"][q.options.indexOf(opt)]}</span>
                  }
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: textColor }}>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {answered && !revealed && (
          <div style={{
            background: isCorrect ? C.greenPale : C.redPale,
            border: `1px solid ${isCorrect ? `${C.green}40` : `${C.red}40`}`,
            borderRadius: 16, padding: "14px 16px", marginBottom: 14,
            display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 22 }}>{isCorrect ? "🎉" : "💡"}</span>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: isCorrect ? C.green : C.red, margin: "0 0 2px" }}>
                {isCorrect ? "Correct! +120 XP" : "Not quite…"}
              </p>
              <p style={{ fontSize: 13, color: C.navy, margin: 0, lineHeight: 1.5 }}>
                {isCorrect ? "Excellent work! The physics is clear." : `The correct answer is ${q.correct}.`}
              </p>
              <button onClick={() => setRevealed(true)} style={{
                background: "none", border: "none", color: C.blue, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "6px 0 0",
              }}>
                See full solution →
              </button>
            </div>
          </div>
        )}

        {/* Solution reveal */}
        {revealed && (
          <Card style={{ padding: 16, marginBottom: 14, borderColor: `${C.blue}40` }}>
            <SectionLabel>Solution</SectionLabel>
            <p style={{ fontSize: 14, color: C.navy, margin: "0 0 12px", lineHeight: 1.6 }}>{q.explanation}</p>
            <EqBlock eq={qIdx % 2 === 0 ? "a = F/m = 20/5 = 4 m/s²" : "KE = ½mv² = ½(2)(36) = 36 J"} />
          </Card>
        )}

        {/* Next */}
        {answered && (
          <button onClick={nextQuestion} className="press-btn" style={{
            width: "100%", background: C.blue, color: "#fff", border: "none",
            borderRadius: 16, padding: "15px", fontSize: 15, fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            boxShadow: `0 6px 20px ${C.blue}40`,
          }}>
            Next Question →
          </button>
        )}

        {/* Hint */}
        {!answered && (
          <button style={{
            width: "100%", background: "transparent", border: `1.5px solid ${C.border}`,
            borderRadius: 16, padding: "13px", fontSize: 14, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer", color: C.muted,
            marginTop: 2,
          }}>
            💡 Reveal Hint
          </button>
        )}
      </div>
    </div>
  );
}

// PROGRESS
function ProgressScreen() {
  const topics = [
    { name: "Mechanics", pct: 82, color: C.blue },
    { name: "Waves", pct: 67, color: "#7C3AED" },
    { name: "Electricity", pct: 45, color: "#D97706" },
    { name: "Optics", pct: 31, color: "#E11D48" },
    { name: "Quantum", pct: 18, color: "#059669" },
    { name: "Astronomy", pct: 12, color: "#0891B2" },
  ];

  const badges = [
    { icon: "🔬", name: "Experiment Builder", earned: true },
    { icon: "⚡", name: "Physics Explorer", earned: true },
    { icon: "🌊", name: "Wave Master", earned: false },
    { icon: "⚛️", name: "Quantum Navigator", earned: false },
  ];

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "20px 20px 16px" }}>
        <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 700, color: C.navy, margin: "0 0 4px" }}>Progress 📈</h1>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>Your physics journey so far</p>
      </div>

      {/* Overall stats */}
      <div style={{ padding: "0 20px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Card style={{ padding: "16px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
            <MasteryRing pct={64} size={56} stroke={5} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: C.navy }}>64%</span>
            </div>
          </div>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: C.navy, margin: 0 }}>Overall</p>
            <p style={{ fontSize: 11, color: C.muted, margin: "2px 0 0" }}>Mastery</p>
          </div>
        </Card>
        <Card style={{ padding: "16px 14px" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 700, color: "#F59E0B", margin: "0 0 2px" }}>2,840</p>
          <p style={{ fontSize: 11, color: C.muted, margin: "0 0 4px" }}>Total XP · Level 6</p>
          <ProgressBar pct={40} color="#F59E0B" />
          <p style={{ fontSize: 10, color: C.muted, margin: "4px 0 0" }}>160 XP to Level 7</p>
        </Card>
        <Card style={{ padding: "14px", display: "flex", alignItems: "center", gap: 10 }}>
          {Icon.flame()}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: "#F97316", margin: 0 }}>12</p>
            <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Day streak</p>
          </div>
        </Card>
        <Card style={{ padding: "14px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🎯</span>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: C.green, margin: 0 }}>87%</p>
            <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Accuracy</p>
          </div>
        </Card>
      </div>

      {/* Topic mastery */}
      <div style={{ padding: "0 20px 16px" }}>
        <SectionLabel>Topic Mastery</SectionLabel>
        <Card style={{ padding: 16 }}>
          {topics.map(({ name, pct, color }, i) => (
            <div key={name} style={{ marginBottom: i < topics.length - 1 ? 16 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: C.navy }}>{name}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color }}>{pct}%</span>
              </div>
              <ProgressBar pct={pct} color={color} height={7} />
            </div>
          ))}
        </Card>
      </div>

      {/* Weekly activity */}
      <div style={{ padding: "0 20px 16px" }}>
        <SectionLabel>This Week</SectionLabel>
        <Card style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
            {[
              { day: "M", h: 45 }, { day: "T", h: 60 }, { day: "W", h: 30 },
              { day: "T", h: 75 }, { day: "F", h: 55 }, { day: "S", h: 85 }, { day: "S", h: 40 },
            ].map(({ day, h }, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: "100%", height: h * 0.65, borderRadius: 6,
                  background: i === 5 ? C.blue : C.surface,
                  boxShadow: i === 5 ? `0 2px 8px ${C.blue}40` : "none",
                }} />
                <span style={{ fontSize: 10, color: i === 5 ? C.blue : C.muted, fontWeight: i === 5 ? 700 : 400 }}>{day}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: C.muted, margin: "12px 0 0", textAlign: "center" }}>
            42 problems · 7.2 hrs study time this week
          </p>
        </Card>
      </div>

      {/* Badges */}
      <div style={{ padding: "0 20px 16px" }}>
        <SectionLabel>Achievements</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {badges.map(({ icon, name, earned }) => (
            <Card key={name} style={{
              padding: "16px 14px", display: "flex", gap: 10, alignItems: "center",
              opacity: earned ? 1 : 0.5, filter: earned ? "none" : "grayscale(0.8)",
            }}>
              <span style={{ fontSize: 26 }}>{icon}</span>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: C.navy, margin: 0, lineHeight: 1.3 }}>{name}</p>
                <p style={{ fontSize: 11, color: earned ? C.green : C.muted, margin: "2px 0 0" }}>{earned ? "Earned ✓" : "Locked"}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Misconceptions */}
      <div style={{ padding: "0 20px 16px" }}>
        <SectionLabel>Review These</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { t: "Electric Potential vs Field", sub: "3 errors in past week" },
            { t: "Lens Sign Convention", sub: "2 errors" },
          ].map(({ t, sub }) => (
            <Card key={t} style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: C.amberPale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 16 }}>⚠️</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: C.navy, margin: 0 }}>{t}</p>
                  <p style={{ fontSize: 12, color: C.amber, margin: "1px 0 0" }}>{sub}</p>
                </div>
                <Pill bg={C.amberPale} color={C.amber}>Review</Pill>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// PROFILE
function ProfileScreen() {
  const [notify, setNotify] = useState(true);
  const [demo, setDemo] = useState(false);
  const [haptics, setHaptics] = useState(true);

  const Toggle = ({ val, set }: { val: boolean; set: (v: boolean) => void }) => (
    <button onClick={() => set(!val)} className="press-btn" style={{
      width: 46, height: 26, borderRadius: 999,
      background: val ? C.blue : C.border,
      border: "none", cursor: "pointer", position: "relative",
      transition: "background 0.2s",
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 999, background: "#fff",
        position: "absolute", top: 3, left: val ? 22 : 3,
        transition: "left 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }} />
    </button>
  );

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "20px 20px 0" }}>
        <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 700, color: C.navy, margin: "0 0 20px" }}>Profile & Settings</h1>
      </div>

      {/* Profile card */}
      <div style={{ padding: "0 20px 20px" }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 20,
              background: `linear-gradient(135deg, ${C.blue}, #1D4ED8)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 6px 20px ${C.blue}40`,
            }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 700, color: "#fff" }}>M</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: C.navy, margin: "0 0 2px" }}>Maya Chen</p>
              <p style={{ fontSize: 13, color: C.muted, margin: "0 0 6px" }}>maya@school.edu</p>
              <Pill bg={C.bluePale} color={C.blue}>BAV+ Member</Pill>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, color: C.navy, margin: 0 }}>Lv. 6</p>
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>2,840 XP</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Learning level */}
      <div style={{ padding: "0 20px 16px" }}>
        <SectionLabel>Learning Level</SectionLabel>
        <Card style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["Beginner", "A-Level", "University"].map(lvl => (
              <button key={lvl} className="press-btn" style={{
                flex: 1, background: lvl === "A-Level" ? C.blue : C.surface,
                color: lvl === "A-Level" ? "#fff" : C.navy,
                border: "none", borderRadius: 12, padding: "10px 6px",
                fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
              }}>
                {lvl}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Curriculum */}
      <div style={{ padding: "0 20px 16px" }}>
        <SectionLabel>Curriculum</SectionLabel>
        <Card style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["IB Physics", "A-Level", "AP Physics", "GCSE", "Custom"].map(c => (
              <button key={c} className="press-btn" style={{
                background: c === "A-Level" ? C.navy : C.surface,
                color: c === "A-Level" ? "#fff" : C.navy,
                border: "none", borderRadius: 10, padding: "8px 14px",
                fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              }}>
                {c}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Toggles */}
      <div style={{ padding: "0 20px 16px" }}>
        <SectionLabel>Preferences</SectionLabel>
        <Card style={{ padding: 4 }}>
          {[
            { label: "Daily Reminders", sub: "Push notifications at 7 PM", val: notify, set: setNotify },
            { label: "Haptic Feedback", sub: "Vibration on interactions", val: haptics, set: setHaptics },
            { label: "Demo Mode", sub: "Explore without an account", val: demo, set: setDemo },
          ].map(({ label, sub, val, set }, i, arr) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 14px",
              borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: C.navy, margin: 0 }}>{label}</p>
                <p style={{ fontSize: 12, color: C.muted, margin: "2px 0 0" }}>{sub}</p>
              </div>
              <Toggle val={val} set={set} />
            </div>
          ))}
        </Card>
      </div>

      {/* Privacy */}
      <div style={{ padding: "0 20px 16px" }}>
        <SectionLabel>Privacy & Data</SectionLabel>
        <Card style={{ padding: 4 }}>
          {[
            { label: "All data stored locally", icon: "🔒" },
            { label: "Export my learning data", icon: "📤" },
            { label: "Reset progress", icon: "↺", danger: true },
            { label: "Delete account", icon: "🗑", danger: true },
          ].map(({ label, icon, danger }, i, arr) => (
            <button key={label} className="press-btn" style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "14px", background: "transparent", border: "none",
              borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
              cursor: "pointer", textAlign: "left",
            }}>
              <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{icon}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: danger ? C.red : C.navy }}>{label}</span>
              {!danger && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" style={{ marginLeft: "auto" }}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </button>
          ))}
        </Card>
      </div>

      <div style={{ padding: "0 20px 10px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: C.muted }}>B.A.V. Physics · v2.1.0 · Built with ✦</p>
      </div>
    </div>
  );
}

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────
const TABS = [
  { id: "home", label: "Home", icon: Icon.home },
  { id: "build", label: "Build", icon: Icon.atom },
  { id: "adventure", label: "Play", icon: Icon.rocket },
  { id: "visualize", label: "Explore", icon: Icon.lens },
  { id: "tutor", label: "Tutor", icon: Icon.chat },
];

function TabBar({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(20px)",
      borderTop: `1px solid ${C.navBorder}`,
      display: "flex", alignItems: "center",
      padding: "8px 8px 16px",
      zIndex: 100,
      boxShadow: "0 -4px 20px rgba(17,24,39,0.06)",
    }}>
      {TABS.map(({ id, label, icon }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => onSelect(id)} className="tab-btn" style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, padding: "6px 4px", background: "transparent", border: "none", cursor: "pointer",
          }}>
            {icon(isActive)}
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: isActive ? 700 : 500,
              color: isActive ? C.blue : C.muted, letterSpacing: "0.02em",
              transition: "color 0.15s",
            }}>
              {label}
            </span>
            {isActive && (
              <div style={{ width: 4, height: 4, borderRadius: 999, background: C.blue, position: "absolute", bottom: 8 }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [subScreen, setSubScreen] = useState<string | null>(null);

  const handleNav = (screen: string) => {
    if (screen === "tutor") { setTab("tutor"); setSubScreen(null); }
    else if (screen === "profile") { setSubScreen("profile"); }
    else if (screen === "lab") { setTab("build"); setSubScreen(null); }
    else if (screen === "practice") { setTab("adventure"); setSubScreen(null); }
    else if (screen === "scan") { setTab("visualize"); setSubScreen("scan"); }
    else if (screen === "lens") { setTab("visualize"); setSubScreen("lens"); }
    else if (screen === "simulation-detail") { setTab("build"); setSubScreen("sim-detail"); }
    else { setSubScreen(screen); }
  };

  const handleTab = (id: string) => {
    setTab(id);
    setSubScreen(null);
  };

  const renderContent = () => {
    if (subScreen === "profile") return <ProfileScreen />;
    if (subScreen === "sim-detail") return <SimDetailScreen onBack={() => setSubScreen(null)} />;
    if (subScreen === "scan") return <ScanScreen onBack={() => setSubScreen(null)} />;
    if (subScreen === "lens") return <LensScreen onBack={() => setSubScreen(null)} />;

    switch (tab) {
      case "home": return <HomeScreen onNav={handleNav} />;
      case "tutor": return <TutorScreen />;
      case "build": return <BuildScreen onSimDetail={() => setSubScreen("sim-detail")} />;
      case "adventure": return <AdventureScreen />;
      case "visualize": return (
        <div style={{ paddingBottom: 80 }}>
          <div style={{ padding: "20px 20px 16px" }}>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 700, color: C.navy, margin: "0 0 4px" }}>Explore 🔭</h1>
            <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>Scan problems · Physics Lens lab</p>
          </div>
          <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            <Card onClick={() => setSubScreen("scan")} style={{ padding: "22px 20px", background: "#EFF6FF", cursor: "pointer" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {Icon.scan()}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 700, color: C.navy, margin: "0 0 4px" }}>Scan a Problem</h3>
                  <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.5 }}>
                    Point your camera at any physics problem for instant AI-powered solutions with step-by-step explanations.
                  </p>
                </div>
              </div>
            </Card>
            <Card onClick={() => setSubScreen("lens")} style={{ padding: "22px 20px", background: "#F0FDF4", cursor: "pointer" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 24 }}>🔬</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 700, color: C.navy, margin: "0 0 4px" }}>Physics Lens</h3>
                  <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.5 }}>
                    Your pocket lab. Conduct live experiments, collect real data, plot graphs, and discover physics laws experimentally.
                  </p>
                </div>
              </div>
            </Card>
            <Card style={{ padding: "16px 18px", background: C.surface }}>
              <SectionLabel>Recent Scans</SectionLabel>
              {[
                { t: "Free Fall · 15 m drop", time: "2h ago", ok: true },
                { t: "Refraction · Glass-Air boundary", time: "Yesterday", ok: true },
                { t: "Projectile Motion problem", time: "3 days ago", ok: false },
              ].map(({ t, time, ok }) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 999, background: ok ? C.green : C.amber, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: C.navy, flex: 1 }}>{t}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>{time}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      );
      default: return <HomeScreen onNav={handleNav} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#E8EDF2",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "0",
    }}>
      <div style={{
        width: "100%", maxWidth: 430, minHeight: "100vh",
        background: C.bg,
        position: "relative",
        boxShadow: "0 0 60px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Status bar */}
        <div style={{
          background: C.bg, padding: "12px 20px 0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: C.navy }}>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill={C.navy}>
              <rect x="0" y="6" width="3" height="6" rx="1" /><rect x="4.5" y="4" width="3" height="8" rx="1" />
              <rect x="9" y="2" width="3" height="10" rx="1" /><rect x="13.5" y="0" width="2.5" height="12" rx="1" />
            </svg>
            <svg width="14" height="12" viewBox="0 0 14 12" fill={C.navy}>
              <path d="M7 3C9.2 3 11.2 4 12.5 5.5L14 4C12.3 2.1 9.8 1 7 1S1.7 2.1 0 4l1.5 1.5C2.8 4 4.8 3 7 3z" opacity="0.3" />
              <path d="M7 6c1.4 0 2.6.5 3.5 1.3L12 5.8C10.7 4.7 9 4 7 4s-3.7.7-5 1.8l1.5 1.5C4.4 6.5 5.6 6 7 6z" opacity="0.6" />
              <circle cx="7" cy="10" r="1.5" />
            </svg>
            <div style={{ width: 22, height: 11, borderRadius: 3, border: `1.5px solid ${C.navy}`, position: "relative", display: "flex", alignItems: "center", padding: "0 1.5px" }}>
              <div style={{ width: "85%", height: 6, borderRadius: 1.5, background: C.green }} />
              <div style={{ width: 2, height: 5, borderRadius: 999, background: C.navy, position: "absolute", right: -3, top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {renderContent()}
        </div>

        {/* Tab bar */}
        <TabBar active={tab} onSelect={handleTab} />
      </div>
    </div>
  );
}
