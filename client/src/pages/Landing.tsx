import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Lock,
  BarChart3,
  ShieldCheck,
  Coins,
  Mic,
  Target,
  Zap,
  Gem,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ArrowRight,
} from "lucide-react";
import { ShinyText } from "@/components/ShinyText";
import { useState } from "react";

// ─── Design Tokens ──────────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = "#64CEFB";

// Ice-Frost: navy-tinted translucent + heavy blur/saturate
const frost: React.CSSProperties = {
  background: "rgba(8, 8, 12, 0.6)",
  backdropFilter: "blur(48px) saturate(180%)",
  WebkitBackdropFilter: "blur(48px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.9)",
};

// ── Premium Button: thin border, clean, no glow ─────────────────────────────
const PremiumButton = ({
  onClick,
  children,
  className = "",
  variant = "default",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ghost" | "accent";
}) => {
  const [hovered, setHovered] = useState(false);

  const base: React.CSSProperties = {
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const styles: Record<string, React.CSSProperties> = {
    default: {
      ...base,
      background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${hovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}`,
      color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
    },
    ghost: {
      ...base,
      background: "transparent",
      border: "none",
      color: hovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
    },
    accent: {
      ...base,
      background: hovered ? `rgba(100,206,251,0.12)` : "rgba(100,206,251,0.06)",
      border: `1px solid ${hovered ? "rgba(100,206,251,0.35)" : "rgba(100,206,251,0.2)"}`,
      color: ACCENT,
    },
  };

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      style={styles[variant]}
      className={`inline-flex items-center justify-center gap-2.5 font-medium cursor-pointer select-none ${className}`}
    >
      {children}
    </motion.button>
  );
};

// ── BentoCard ────────────────────────────────────────────────────────────────
const BentoCard = ({
  className = "",
  title,
  desc,
  icon: Icon,
  visual,
}: {
  className?: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  visual?: React.ReactNode;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      transition={{ duration: 0.5, ease: EASE }}
      className={`group relative rounded-[32px] overflow-visible ${className}`}
      style={{
        ...frost,
        boxShadow: hovered
          ? `inset 0 1px 0 rgba(255,255,255,0.07), 0 24px 60px rgba(0,0,0,0.95), 0 0 0 1px rgba(100,206,251,0.06)`
          : `inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.9)`,
        transition: "box-shadow 0.5s ease",
      }}
    >
      {/* Subtle top-left specular */}
      <div
        className="absolute inset-0 rounded-[32px] pointer-events-none"
        style={{
          background: hovered
            ? "linear-gradient(135deg, rgba(100,206,251,0.03) 0%, transparent 50%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%)",
          transition: "background 0.5s ease",
        }}
      />

      <div className="relative z-10 p-8 sm:p-10 h-full flex flex-col justify-between">
        <div className="space-y-5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500"
            style={{
              background: hovered ? "rgba(100,206,251,0.08)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${hovered ? "rgba(100,206,251,0.25)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: hovered ? ACCENT : "rgba(255,255,255,0.5)" }} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold tracking-[-0.02em] text-white/85 uppercase">
              {title}
            </h3>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              {desc}
            </p>
          </div>
        </div>
        <div className="mt-8 flex-1 flex flex-col justify-end min-h-[130px] relative overflow-visible">
          {visual}
        </div>
      </div>
    </motion.div>
  );
};

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onLogin }: { onLogin: () => void }) {
  const navLinks = ["Features", "Pricing", "Security", "Analytics"];
  const socials = [
    { Icon: Twitter, label: "Twitter" },
    { Icon: Instagram, label: "Instagram" },
    { Icon: Linkedin, label: "LinkedIn" },
    { Icon: Github, label: "GitHub" },
  ];

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.04)" }}
    >
      {/* Ambient glow - subtle, not dominant */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "800px",
          height: "200px",
          background: `radial-gradient(ellipse, rgba(100,206,251,0.04) 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Foreground 3-column grid — sits ON TOP */}
      <div className="relative z-10 container mx-auto px-6 max-w-[1400px] pt-20 pb-10">
        <div
          className="rounded-[24px] p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-12 mb-0"
          style={frost}
        >
          {/* Col 1: Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(100,206,251,0.06)", border: "1px solid rgba(100,206,251,0.15)" }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: ACCENT }} />
              </div>
              <span className="text-xl font-bold tracking-[-0.02em] text-white/85 uppercase">
                Pocket Fund
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
              Engineering the next generation of personal finance — purposeful, private, and precise.
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em]" style={{ color: "rgba(100,206,251,0.25)" }}>
              © 2026 Pocket Fund Inc.
            </p>
          </motion.div>

          {/* Col 2: Nav */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.5em] mb-7" style={{ color: "rgba(255,255,255,0.2)" }}>
              Navigation
            </p>
            <div className="space-y-3.5">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link}
                  href="#"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                  className="flex items-center gap-3 text-sm group/link transition-all duration-300"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
                >
                  <div
                    className="w-4 h-px group-link-hover:w-6 transition-all duration-300"
                    style={{ background: "rgba(100,206,251,0.25)" }}
                  />
                  {link}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Col 3: Socials + Back to top */}
          <div className="space-y-8">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.5em] mb-7" style={{ color: "rgba(255,255,255,0.2)" }}>
                Connect
              </p>
              <div className="flex items-center gap-4">
                {socials.map(({ Icon, label }, i) => (
                  <motion.a
                    key={label}
                    href="#"
                    aria-label={label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
                    whileHover={{ y: -3 }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Clean "Back to top" — no glow, just text + arrow */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-300"
              style={{ color: "rgba(255,255,255,0.25)", background: "none", border: "none", padding: 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
            >
              Back to top
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </motion.button>
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
            <span className="text-[9px] font-bold uppercase tracking-[0.4em]" style={{ color: "rgba(255,255,255,0.15)" }}>
              All Systems Nominal
            </span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.4em]" style={{ color: "rgba(255,255,255,0.1)" }}>
            v1.0.42 · Global Edge · 14ms
          </span>
        </div>
      </div>

      {/* ── Massive Typography — UNDER the content, clipped to container ── */}
      <div
        className="w-full overflow-hidden select-none pointer-events-none"
        style={{ marginTop: "-60px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 120, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.6, ease: EASE }}
          className="text-center font-black uppercase leading-none whitespace-nowrap"
          style={{
            fontSize: "clamp(80px, 14vw, 220px)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(100,206,251,0.07)",
            letterSpacing: "-0.04em",
            paddingBottom: "2rem",
          }}
        >
          POCKET FUND
        </motion.div>
      </div>
    </footer>
  );
}

// ── Main Landing Page ────────────────────────────────────────────────────────
export default function Landing() {
  const handleLogin = () => { window.location.href = "/api/auth/google"; };
  const [activeBar, setActiveBar] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen text-white selection:bg-[#64CEFB]/20 selection:text-white relative overflow-x-hidden"
      style={{ background: "#000" }}
    >

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center">

        {/* Ambient glows — very subtle */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[25%] w-[700px] h-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(100,206,251,0.04) 0%, transparent 65%)", filter: "blur(80px)" }}
          />
          <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(100,206,251,0.025) 0%, transparent 65%)", filter: "blur(100px)" }}
          />
        </div>

        {/* Video BG */}
        <video autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ opacity: 0.12 }}
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4" type="video/mp4" />
        </video>

        {/* ── Nav ── */}
        <nav className="absolute top-0 left-0 w-full z-50">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-8 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: EASE }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(100,206,251,0.06)", border: "1px solid rgba(100,206,251,0.15)" }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
              </div>
              <span className="text-lg font-bold tracking-[-0.02em] uppercase text-white/80">Pocket Fund</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: EASE }}
            >
              <PremiumButton onClick={handleLogin} variant="default" className="px-5 py-2 rounded-full text-[9px] tracking-[0.4em] uppercase">
                Sign In
              </PremiumButton>
            </motion.div>
          </div>
        </nav>

        {/* ── Hero Content ── */}
        <div className="relative z-10 w-full flex flex-col items-center pt-28 pb-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="flex flex-col items-center text-center space-y-10 max-w-5xl mx-auto"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 px-5 py-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.6em]" style={{ color: "rgba(255,255,255,0.3)" }}>
                Personal Savings Co-Pilot
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.03em] leading-[0.92] uppercase">
              <div className="text-white/85">Master Your</div>
              <ShinyText text="Money With Ease" />
            </h1>

            {/* Sub-row */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <p className="text-sm sm:text-base max-w-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                Financial empathy meets smart technology. Track expenses, protect your stash, and grow with your AI savings buddy.
              </p>
              <div className="hidden md:block w-px h-10" style={{ background: "rgba(255,255,255,0.07)" }} />
              <div className="space-y-1 text-center md:text-left">
                <p className="text-[9px] font-bold uppercase tracking-[0.6em]" style={{ color: "rgba(100,206,251,0.3)" }}>
                  Stashed Safely
                </p>
                <p className="text-2xl sm:text-3xl font-bold tracking-[-0.02em]" style={{ color: ACCENT }}>
                  ₹1.2CR+ Secured
                </p>
              </div>
            </div>

            {/* CTA — clean pill, no glow overload */}
            <PremiumButton
              onClick={handleLogin}
              variant="default"
              className="px-10 py-4 rounded-2xl text-[10px] tracking-[0.5em] uppercase"
            >
              Start Your Journey
              <ArrowUpRight className="w-4 h-4" />
            </PremiumButton>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-48 relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        {/* Section ambient — barely visible */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(100,206,251,0.02) 0%, transparent 70%)", filter: "blur(80px)" }}
          />
        </div>

        <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="mb-16 space-y-4"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.6em]" style={{ color: "rgba(100,206,251,0.4)" }}>
              Core Capabilities
            </span>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-[-0.02em] uppercase text-white/80">
              Built for the<br />Modern Saver
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* AI Coach */}
            <BentoCard title="AI Assistant Coach"
              desc="Deep-learning advisor monitoring your patterns in real-time, optimizing your saving strategy with zero friction."
              icon={Mic}
              className="md:col-span-2"
              visual={
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 px-2">
                  <div className="flex items-end gap-1.5 h-14">
                    {[30,70,45,90,55,100,35,80,50,95,70,45,85].map((h, i) => (
                      <motion.div key={i}
                        animate={{ height: [6, h * 0.55, 6] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
                        className="w-1.5 rounded-full"
                        style={{ height: 6, background: `linear-gradient(to top, rgba(100,206,251,0.08), rgba(100,206,251,0.6))` }}
                      />
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: ACCENT }}>Neural Link Active</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-widest font-bold pl-3.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                      Analyzing Spending Habits...
                    </span>
                  </div>
                </div>
              }
            />

            {/* Vault */}
            <BentoCard title="Secure Stash Vault"
              desc="Tier-1 capital protection. Lock your wealth behind a PIN-secure encrypted storage layer."
              icon={ShieldCheck}
              visual={
                <div className="relative h-40 w-full flex items-center justify-center">
                  <div className="w-28 h-28 rounded-[2rem] flex flex-col items-center justify-center gap-3"
                    style={{ background: "rgba(100,206,251,0.03)", border: "1px solid rgba(100,206,251,0.1)" }}
                  >
                    <div className="grid grid-cols-3 gap-2.5">
                      {[1,2,3,4,5,6,7,8,9].map(i => (
                        <motion.div key={i}
                          whileHover={{ scale: 1.6 }}
                          className="w-1.5 h-1.5 rounded-full cursor-pointer"
                          style={{ background: "rgba(100,206,251,0.2)" }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3" style={{ color: ACCENT }} />
                      <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
                        Encrypted
                      </span>
                    </div>
                  </div>
                </div>
              }
            />

            {/* Rewards */}
            <BentoCard title="Growth Rewards"
              desc="Collect premium tokens and verified badges for financial discipline and consistency."
              icon={Coins}
              visual={
                <div className="flex gap-3 pt-4 px-2">
                  {[Target, Zap, Gem].map((Icon, i) => (
                    <motion.div key={i}
                      whileHover={{ y: -8 }}
                      className="w-14 h-14 rounded-[20px] flex items-center justify-center cursor-pointer transition-all duration-300"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.background = "rgba(100,206,251,0.06)";
                        el.style.borderColor = "rgba(100,206,251,0.2)";
                        el.style.color = ACCENT;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.background = "rgba(255,255,255,0.03)";
                        el.style.borderColor = "rgba(255,255,255,0.06)";
                        el.style.color = "rgba(255,255,255,0.25)";
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                  ))}
                </div>
              }
            />

            {/* Precision Data */}
            <BentoCard title="Precision Data"
              desc="Interactive capital modeling that visualizes every rupee, revealing hidden saving opportunities."
              icon={BarChart3}
              className="md:col-span-2"
              visual={
                <div className="h-36 sm:h-40 flex items-end justify-between gap-1.5 px-2 w-full relative">
                  <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
                  {[35,60,45,85,55,40,75,50,95,60].map((h, i) => (
                    <motion.div key={i}
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1.2, ease: EASE, delay: i * 0.07 }}
                      className="flex-1 relative"
                    >
                      <motion.div
                        animate={{
                          background: activeBar === i ? ACCENT : "rgba(100,206,251,0.12)",
                        }}
                        transition={{ duration: 0.25 }}
                        className="h-full w-full rounded-t-sm"
                      />
                      <AnimatePresence>
                        {activeBar === i && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.9 }}
                            animate={{ opacity: 1, y: -40, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.9 }}
                            className="absolute left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg text-[9px] font-bold whitespace-nowrap"
                            style={{
                              background: "rgba(8,8,12,0.9)",
                              border: "1px solid rgba(100,206,251,0.2)",
                              color: ACCENT,
                              backdropFilter: "blur(12px)",
                            }}
                          >
                            ₹{h * 850}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CHAT SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-48 relative z-10 overflow-hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* Left Typography Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
              className="flex-1 space-y-8"
            >
              <h2 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-[-0.03em] leading-[0.9] uppercase text-white/90">
                Your AI<br />
                <span className="relative inline-block mt-2">
                  {/* Subtle glow behind the word "Savings" */}
                  <span className="absolute inset-0 blur-2xl opacity-40 bg-[#64CEFB]" />
                  <span className="relative z-10" style={{ color: ACCENT }}>Savings</span>
                </span><br />
                Buddy.
              </h2>
              <p className="text-sm sm:text-base max-w-md leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                Friendly, judgment-free financial intelligence. It actively monitors your cash flow, identifies leaks, and helps you stash more without feeling constrained.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Neural Analysis", "Zero Judgment", "256-bit Secured"].map((tag, idx) => (
                  <span key={tag} className="px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-2"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                  >
                    {idx === 0 && <div className="w-1 h-1 rounded-full bg-[#64CEFB] animate-pulse" />}
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right Side: The Glass Terminal */}
            <div className="flex-1 w-full relative">
              {/* Massive ambient glow behind the container to show off the glass */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full blur-[100px] pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(100,206,251,0.15) 0%, transparent 70%)" }}
              />

              {/* The Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE }}
                className="relative z-10 rounded-[40px] p-2 sm:p-3 overflow-hidden"
                style={{
                  ...frost,
                  background: "rgba(8, 8, 12, 0.4)", // slightly more transparent to let the orb shine
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 30px 60px rgba(0,0,0,0.95)",
                }}
              >
                {/* Simulated Device Screen Inner */}
                <div className="rounded-[32px] overflow-hidden bg-black/40 border border-white/[0.04] p-6 sm:p-8 space-y-6 relative">
                  
                  {/* Status header inside the device */}
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-4 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center p-1"
                        style={{ border: "1px solid rgba(100,206,251,0.2)", background: "rgba(100,206,251,0.05)" }}
                      >
                         <Mic className="w-3.5 h-3.5 text-[#64CEFB]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64CEFB]">Pocket Coach</p>
                        <p className="text-[8px] font-medium tracking-widest text-white/30 uppercase">Online</p>
                      </div>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  </div>

                  {/* Chat Bubbles */}
                  <div className="space-y-6">
                    {[
                      { text: "Hey! You've stashed ₹2,000 more than usual this week. Huge win! 🏆", pos: "left", sender: "Coach" },
                      { text: "That's awesome! What's next for my savings goal?", pos: "right", sender: "You" },
                      { text: "Stash ₹500 more and you'll hit 50% of your new laptop goal.", pos: "left", sender: "Coach" },
                    ].map((chat, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: chat.pos === "left" ? -16 : 16, y: 10 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: EASE, delay: i * 0.15 + 0.3 }}
                        className={`flex flex-col ${chat.pos === "left" ? "items-start" : "items-end"}`}
                      >
                        <div
                          className={`px-5 py-3.5 text-sm leading-relaxed max-w-[88%] sm:max-w-[75%] font-medium relative ${
                            chat.pos === "left" ? "rounded-[24px] rounded-tl-sm" : "rounded-[24px] rounded-br-sm"
                          }`}
                          style={
                            chat.pos === "left"
                              ? { 
                                  background: "rgba(255,255,255,0.04)", 
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  color: "rgba(255,255,255,0.7)"
                                }
                              : {
                                  background: ACCENT,
                                  boxShadow: `0 8px 24px -6px rgba(100,206,251,0.4), inset 0 2px 0 rgba(255,255,255,0.3)`,
                                  color: "#020617",
                                  fontWeight: 700
                                }
                          }
                        >
                          {chat.text}
                          
                          {/* Elegant tiny tail indicator */}
                          {chat.pos === "left" && (
                            <svg className="absolute -top-px -left-2 w-3 h-3 text-white/[0.08] fill-current" viewBox="0 0 10 10">
                              <path d="M10 0H0v10C0 4.477 4.477 0 10 0z" />
                            </svg>
                          )}
                          {chat.pos === "right" && (
                            <svg className="absolute -bottom-px -right-2 w-3 h-3 flex-shrink-0 fill-current" style={{ color: ACCENT }} viewBox="0 0 10 10">
                              <path d="M0 10h10V0c0 5.523-4.477 10-10 10z" />
                            </svg>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Input Simulation */}
                  <div className="mt-8 pt-4">
                    <div className="w-full h-12 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center px-4 justify-between">
                       <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">Ask for advice...</span>
                       <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                         <ArrowRight className="w-3.5 h-3.5 text-white/50" />
                       </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer onLogin={handleLogin} />
    </div>
  );
}
