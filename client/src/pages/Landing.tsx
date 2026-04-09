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
} from "lucide-react";
import { ShinyText } from "@/components/ShinyText";
import { useState } from "react";

// ─── Design System Tokens ──────────────────────────────────────────────────
const EASE_QUINTIC = [0.16, 1, 0.3, 1] as const;
const ACCENT = "#38BDF8";

// Ice-Frost glass layer styles (matching spec exactly)
const iceFrostStyle: React.CSSProperties = {
  background: "rgba(15, 23, 42, 0.35)",
  backdropFilter: "blur(50px) saturate(190%)",
  WebkitBackdropFilter: "blur(50px) saturate(190%)",
  border: "1px solid",
  borderImage: "linear-gradient(to bottom right, rgba(255,255,255,0.12), rgba(255,255,255,0)) 1",
  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.8)",
};

// Pill glass button styles
const glassButtonStyle: React.CSSProperties = {
  background: "rgba(15, 23, 42, 0.5)",
  backdropFilter: "blur(16px) saturate(190%)",
  WebkitBackdropFilter: "blur(16px) saturate(190%)",
  border: "1px solid rgba(56,189,248,0.25)",
  color: ACCENT,
  transition: "all 0.5s ease",
};

// ─── BentoCard Component ────────────────────────────────────────────────────
const BentoCard = ({
  className,
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
      whileHover={{ y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      transition={{ duration: 0.6, ease: EASE_QUINTIC }}
      className={`group relative rounded-[36px] overflow-visible ${className}`}
      style={{
        ...iceFrostStyle,
        boxShadow: hovered
          ? `0 8px 40px 0 rgba(0,0,0,0.8), 0 0 30px rgba(56,189,248,0.08)`
          : "0 8px 32px 0 rgba(0,0,0,0.8)",
        transition: "box-shadow 0.5s ease",
      }}
    >
      {/* Specular inner gradient */}
      <div className="absolute inset-0 rounded-[36px] pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(56,189,248,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 p-8 sm:p-12 h-full flex flex-col justify-between">
        <div className="space-y-6">
          <motion.div
            animate={{ scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.4, ease: EASE_QUINTIC }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: hovered ? `rgba(56,189,248,0.12)` : "rgba(255,255,255,0.04)",
              border: `1px solid ${hovered ? "rgba(56,189,248,0.35)" : "rgba(255,255,255,0.08)"}`,
              boxShadow: hovered ? `0 0 20px rgba(56,189,248,0.2)` : "none",
              transition: "all 0.5s ease",
            }}
          >
            <Icon className="w-5 h-5" style={{ color: ACCENT }} />
          </motion.div>

          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] uppercase text-white/90">
              {title}
            </h3>
            <p
              className="text-sm sm:text-base leading-relaxed max-w-xs transition-colors duration-500"
              style={{ color: hovered ? "rgba(240,249,255,0.55)" : "rgba(240,249,255,0.35)" }}
            >
              {desc}
            </p>
          </div>
        </div>

        <div className="mt-10 flex-1 flex flex-col justify-end min-h-[140px] relative overflow-visible">
          {visual}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Footer Component ───────────────────────────────────────────────────────
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
      className="relative w-full overflow-hidden border-t"
      style={{
        background: "radial-gradient(ellipse at center, #0A192F 0%, #020617 100%)",
        borderColor: "rgba(56,189,248,0.08)",
      }}
    >
      {/* Ambient blue glow at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "900px",
          height: "300px",
          background: "radial-gradient(ellipse, rgba(56,189,248,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Massive Sliding Typography (The Spec) ── */}
      <div className="relative w-full overflow-hidden py-8 select-none pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 200, filter: "blur(10px)" }}
          whileInView={{ opacity: 0.07, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.6, ease: EASE_QUINTIC }}
          className="text-center font-black uppercase whitespace-nowrap leading-none"
          style={{
            fontSize: "18vw",
            color: ACCENT,
            letterSpacing: "-0.04em",
          }}
        >
          POCKET FUND
        </motion.div>
      </div>

      {/* ── Foreground 3-Column Layout ── */}
      <div className="relative z-10 container mx-auto px-6 max-w-[1400px] pb-16">
        <div
          className="rounded-[28px] p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-12"
          style={iceFrostStyle}
        >
          {/* Col 1: Brand + Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_QUINTIC }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{
                  background: `rgba(56,189,248,0.1)`,
                  border: `1px solid rgba(56,189,248,0.25)`,
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: ACCENT }} />
              </div>
              <span className="text-2xl font-bold tracking-[-0.02em] text-white uppercase">
                Pocket Fund
              </span>
            </div>
            <p style={{ color: "rgba(240,249,255,0.35)", fontSize: "14px", lineHeight: "1.7" }}>
              Engineering the future of personal capital governance. High-performance tooling without compromise.
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em]" style={{ color: "rgba(56,189,248,0.3)" }}>
              © 2026 Pocket Fund Systems
            </p>
          </motion.div>

          {/* Col 2: Nav Links */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] mb-6" style={{ color: "rgba(56,189,248,0.4)" }}>
              Navigation
            </p>
            {navLinks.map((link, i) => (
              <motion.a
                key={link}
                href="#"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE_QUINTIC, delay: i * 0.1 }}
                whileHover={{ x: 4, color: ACCENT }}
                className="flex items-center gap-3 text-sm font-medium transition-colors duration-300"
                style={{ color: "rgba(240,249,255,0.4)" }}
              >
                <div
                  className="w-4 h-px transition-all duration-500"
                  style={{ background: "rgba(56,189,248,0.3)" }}
                />
                {link}
              </motion.a>
            ))}
          </div>

          {/* Col 3: Socials + Back to top */}
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] mb-6" style={{ color: "rgba(56,189,248,0.4)" }}>
                Connect
              </p>
              <div className="flex items-center gap-5">
                {socials.map(({ Icon, label }, i) => (
                  <motion.a
                    key={label}
                    href="#"
                    aria-label={label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: EASE_QUINTIC, delay: i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.1 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500"
                    style={{
                      background: "rgba(56,189,248,0.05)",
                      border: "1px solid rgba(56,189,248,0.12)",
                      color: "rgba(56,189,248,0.4)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = ACCENT;
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 20px rgba(56,189,248,0.25)`;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(56,189,248,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "rgba(56,189,248,0.4)";
                      (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(56,189,248,0.12)";
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-4 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.5em] transition-all duration-500"
              style={glassButtonStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px rgba(56,189,248,0.4)`;
                (e.currentTarget as HTMLButtonElement).style.backdropFilter = "blur(24px) saturate(190%)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                (e.currentTarget as HTMLButtonElement).style.backdropFilter = "blur(16px) saturate(190%)";
              }}
            >
              Back to Top
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-3">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.6)" }}
            />
            <span className="text-[9px] font-bold uppercase tracking-[0.4em]" style={{ color: "rgba(56,189,248,0.25)" }}>
              All Systems Nominal
            </span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.4em]" style={{ color: "rgba(56,189,248,0.15)" }}>
            v1.0.42 · Region: Global Edge · 14ms
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ──────────────────────────────────────────────────────
export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const [activeBar, setActiveBar] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen text-white selection:bg-[#38BDF8]/30 selection:text-white relative overflow-x-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #0A192F 0%, #020617 100%)",
      }}
    >
      {/* ════════════════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center">

        {/* Background ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)", filter: "blur(60px)" }}
          />
          <div
            className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)", filter: "blur(80px)" }}
          />
        </div>

        {/* Video background */}
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ opacity: 0.12 }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
            type="video/mp4"
          />
        </video>

        {/* ── Floating Pill Navigation ── */}
        <nav className="absolute top-0 left-0 w-full z-50">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-8 flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: EASE_QUINTIC }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500"
                style={{
                  background: "rgba(56,189,248,0.08)",
                  border: "1px solid rgba(56,189,248,0.2)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
                />
              </div>
              <span className="text-xl font-bold tracking-[-0.02em] uppercase text-white">
                Pocket Fund
              </span>
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: EASE_QUINTIC }}
              onClick={handleLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500"
              style={glassButtonStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px rgba(56,189,248,0.4)`;
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(56,189,248,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(15,23,42,0.5)";
              }}
            >
              Sign In
            </motion.button>
          </div>
        </nav>

        {/* ── Hero Content ── */}
        <div className="relative z-10 w-full flex flex-col items-center pt-28 pb-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE_QUINTIC }}
            className="flex flex-col items-center text-center space-y-10 max-w-5xl mx-auto"
          >
            {/* Eyebrow Tag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: EASE_QUINTIC, delay: 0.2 }}
              className="flex items-center gap-3 px-6 py-2.5 rounded-full"
              style={{
                background: "rgba(56,189,248,0.06)",
                border: "1px solid rgba(56,189,248,0.15)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
              />
              <span
                className="text-[9px] font-bold uppercase tracking-[0.6em]"
                style={{ color: "rgba(56,189,248,0.7)" }}
              >
                Personal Savings Co-Pilot
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-[7rem] font-bold tracking-[-0.02em] leading-[0.92] uppercase">
              <div style={{ color: "rgba(240,249,255,0.85)" }}>Master Your</div>
              <ShinyText text="Money With Ease" />
            </h1>

            {/* Sub-row */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
              <p className="text-sm sm:text-base max-w-sm leading-relaxed" style={{ color: "rgba(240,249,255,0.45)" }}>
                Financial empathy meets smart technology. Track expenses, protect your stash, and grow with your AI savings buddy.
              </p>
              <div className="hidden md:block w-px h-12" style={{ background: "rgba(56,189,248,0.12)" }} />
              <div className="space-y-1 text-center md:text-left">
                <p className="text-[9px] font-bold uppercase tracking-[0.6em]" style={{ color: "rgba(56,189,248,0.3)" }}>
                  Stashed Safely
                </p>
                <p className="text-2xl sm:text-3xl font-bold tracking-[-0.02em]" style={{ color: ACCENT }}>
                  ₹1.2CR+ Secured
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogin}
              className="group flex items-center gap-3 px-10 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.5em] transition-all duration-500"
              style={glassButtonStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(56,189,248,0.14)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 40px rgba(56,189,248,0.35)`;
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(56,189,248,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(15,23,42,0.5)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(56,189,248,0.25)";
              }}
            >
              Start Your Journey
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          BENTO FEATURES SECTION
      ════════════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 sm:py-48 relative z-10"
        style={{ borderTop: "1px solid rgba(56,189,248,0.06)" }}
      >
        {/* Section ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(ellipse, rgba(56,189,248,0.03) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE_QUINTIC }}
            className="mb-20 space-y-4"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.6em]" style={{ color: "rgba(56,189,248,0.5)" }}>
              Core Capabilities
            </span>
            <h2
              className="text-4xl sm:text-6xl font-bold tracking-[-0.02em] uppercase"
              style={{ color: "rgba(240,249,255,0.85)" }}
            >
              Built for the<br />Modern Saver
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. AI Coach — spans 2 */}
            <BentoCard
              title="AI Assistant Coach"
              desc="Deep-learning advisor monitoring your patterns in real-time, optimizing your saving strategy with zero friction."
              icon={Mic}
              className="md:col-span-2"
              visual={
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 px-4">
                  <div className="flex items-end gap-1.5 h-16">
                    {[30,70,45,90,55,100,35,80,50,95,70,45,85].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [8, h * 0.6, 8] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.12 }}
                        className="w-1.5 rounded-full"
                        style={{
                          height: 8,
                          background: `linear-gradient(to top, rgba(56,189,248,0.1), rgba(56,189,248,0.7))`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: ACCENT }}>
                        Neural Link Active
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold pl-3.5" style={{ color: "rgba(56,189,248,0.3)" }}>
                      Analyzing Spending Habits...
                    </span>
                  </div>
                </div>
              }
            />

            {/* 2. Secure Vault */}
            <BentoCard
              title="Secure Stash Vault"
              desc="Tier-1 capital protection. Lock your wealth behind a PIN-secure encrypted storage layer."
              icon={ShieldCheck}
              visual={
                <div className="relative h-44 w-full flex items-center justify-center">
                  <div
                    className="w-28 h-28 rounded-[2rem] flex flex-col items-center justify-center gap-3"
                    style={{
                      background: "rgba(56,189,248,0.04)",
                      border: "1px solid rgba(56,189,248,0.15)",
                    }}
                  >
                    <div className="grid grid-cols-3 gap-2.5">
                      {[1,2,3,4,5,6,7,8,9].map(i => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.6, backgroundColor: ACCENT }}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: "rgba(56,189,248,0.2)" }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3" style={{ color: ACCENT }} />
                      <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: "rgba(56,189,248,0.4)" }}>
                        Encrypted
                      </span>
                    </div>
                  </div>
                </div>
              }
            />

            {/* 3. Growth Rewards */}
            <BentoCard
              title="Growth Rewards"
              desc="Collect premium tokens and verified badges for financial discipline and consistency."
              icon={Coins}
              visual={
                <div className="flex gap-4 pt-6 px-4">
                  {[Target, Zap, Gem].map((Icon, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -10 }}
                      className="w-14 h-14 rounded-[20px] flex items-center justify-center cursor-pointer transition-all duration-500"
                      style={{
                        background: "rgba(56,189,248,0.05)",
                        border: "1px solid rgba(56,189,248,0.1)",
                        color: "rgba(56,189,248,0.35)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.background = "rgba(56,189,248,0.1)";
                        el.style.borderColor = "rgba(56,189,248,0.35)";
                        el.style.color = ACCENT;
                        el.style.boxShadow = "0 0 20px rgba(56,189,248,0.25)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.background = "rgba(56,189,248,0.05)";
                        el.style.borderColor = "rgba(56,189,248,0.1)";
                        el.style.color = "rgba(56,189,248,0.35)";
                        el.style.boxShadow = "none";
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                  ))}
                </div>
              }
            />

            {/* 4. Precision Data — spans 2 */}
            <BentoCard
              title="Precision Data"
              desc="Interactive capital modeling that visualizes every rupee, revealing hidden saving opportunities."
              icon={BarChart3}
              className="md:col-span-2"
              visual={
                <div className="h-36 sm:h-44 flex items-end justify-between gap-2 px-4 w-full relative">
                  <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "rgba(56,189,248,0.1)" }} />
                  {[35,60,45,85,55,40,75,50,95,60].map((h, i) => (
                    <motion.div
                      key={i}
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1.2, ease: EASE_QUINTIC, delay: i * 0.08 }}
                      className="flex-1 relative"
                    >
                      <motion.div
                        animate={{
                          background: activeBar === i
                            ? ACCENT
                            : "rgba(56,189,248,0.15)",
                          boxShadow: activeBar === i
                            ? `0 0 20px rgba(56,189,248,0.5)`
                            : "none",
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full rounded-t-md"
                      />
                      <AnimatePresence>
                        {activeBar === i && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: -44, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap"
                            style={{
                              background: "rgba(56,189,248,0.15)",
                              border: "1px solid rgba(56,189,248,0.3)",
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

      {/* ════════════════════════════════════════════════════════════════════
          AI CHAT SECTION
      ════════════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 sm:py-48 relative z-10 overflow-hidden"
        style={{ borderTop: "1px solid rgba(56,189,248,0.06)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px]"
            style={{
              background: "radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left: Header */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE_QUINTIC }}
              className="flex-1 space-y-8"
            >
              <h2
                className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.02em] leading-[0.9] uppercase"
                style={{ color: "rgba(240,249,255,0.85)" }}
              >
                Your AI<br />
                <span style={{ color: ACCENT }}>Savings</span><br />
                Buddy.
              </h2>
              <p className="text-base sm:text-lg max-w-md leading-relaxed" style={{ color: "rgba(240,249,255,0.4)" }}>
                Friendly, judgment-free financial advice that helps you save more without changing your lifestyle.
              </p>
              <div className="flex flex-wrap gap-3">
                {["24/7 Advisory", "Privacy Secured"].map((tag) => (
                  <span
                    key={tag}
                    className="px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.4em]"
                    style={{
                      background: "rgba(56,189,248,0.05)",
                      border: "1px solid rgba(56,189,248,0.12)",
                      color: "rgba(56,189,248,0.5)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right: Chat Bubbles */}
            <div className="flex-1 w-full space-y-8">
              {[
                { text: "Hey! You've stashed ₹2,000 more than usual this week. Huge win! 🏆", pos: "left", sender: "AI Coach" },
                { text: "That's awesome! What's next for my savings goal?", pos: "right", sender: "You" },
                { text: "Keep going! Stash ₹500 more and you'll hit 50% of your laptop goal.", pos: "left", sender: "AI Coach" },
              ].map((chat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: chat.pos === "left" ? -30 : 30, y: 16 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: EASE_QUINTIC, delay: i * 0.15 }}
                  className={`flex flex-col ${chat.pos === "left" ? "items-start" : "items-end"}`}
                >
                  <div className={`flex items-center gap-2 mb-2.5 ${chat.pos === "right" ? "flex-row-reverse" : ""}`}>
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: chat.pos === "left" ? ACCENT : "rgba(240,249,255,0.4)" }}
                    />
                    <span
                      className="text-[9px] font-bold uppercase tracking-[0.4em]"
                      style={{ color: chat.pos === "left" ? "rgba(56,189,248,0.7)" : "rgba(240,249,255,0.3)" }}
                    >
                      {chat.sender}
                    </span>
                  </div>

                  <div
                    className={`px-7 py-5 text-sm sm:text-base leading-relaxed max-w-[85%] sm:max-w-sm font-medium ${
                      chat.pos === "left" ? "rounded-[24px] rounded-bl-sm" : "rounded-[24px] rounded-br-sm"
                    }`}
                    style={{
                      ...(chat.pos === "left"
                        ? {
                            ...iceFrostStyle,
                            color: "rgba(240,249,255,0.5)",
                          }
                        : {
                            background: "rgba(56,189,248,0.08)",
                            backdropFilter: "blur(50px) saturate(190%)",
                            WebkitBackdropFilter: "blur(50px) saturate(190%)",
                            border: "1px solid rgba(56,189,248,0.25)",
                            boxShadow: "0 4px 24px rgba(56,189,248,0.1)",
                            color: "rgba(240,249,255,0.85)",
                          }),
                    }}
                  >
                    {chat.text}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <Footer onLogin={handleLogin} />
    </div>
  );
}
