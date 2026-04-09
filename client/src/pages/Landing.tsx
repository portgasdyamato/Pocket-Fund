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

// Thick Glass Bevel (mirrors PremiumButton aesthetics globally)
const frost: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.25)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 12px 40px rgba(0,0,0,0.8)",
};

// ── Premium Button ────────────────────────────────────────────────────────────
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
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
  };

  const styles: Record<string, React.CSSProperties> = {
    default: {
      ...base,
      background: hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.3)",
      boxShadow: "inset 0 1px 1px rgba(255,255,255,0.5), 0 8px 20px rgba(0,0,0,0.4)",
      color: "#ffffff",
    },
    ghost: {
      ...base,
      background: "transparent",
      border: "none",
      color: hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
    },
    accent: {
      ...base,
      background: hovered ? `rgba(100,206,251,0.15)` : "rgba(100,206,251,0.1)",
      border: `1px solid rgba(100,206,251,0.3)`,
      color: ACCENT,
    },
  };

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.96 }}
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
      whileHover={{ y: -8, scale: 1.01 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative rounded-[32px] overflow-visible ${className}`}
      style={{
        ...frost,
        boxShadow: hovered
          ? `inset 0 1px 1px rgba(255,255,255,0.6), 0 30px 70px rgba(0,0,0,0.9), 0 0 0 1px rgba(100,206,251,0.25)`
          : frost.boxShadow,
      }}
    >
      {/* Dynamic Spotlight Glow */}
      <div
        className="absolute inset-0 rounded-[32px] pointer-events-none overflow-hidden"
        style={{
          background: hovered
            ? "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(100,206,251,0.08), transparent 40%)"
            : "none",
          transition: "opacity 0.5s ease",
        }}
      />
      
      {/* Subtle top-left specular */}
      <div
        className="absolute inset-0 rounded-[32px] pointer-events-none border border-white/5 group-hover:border-white/15 transition-colors duration-500"
        style={{
          background: hovered
            ? "linear-gradient(135deg, rgba(100,206,251,0.05) 0%, transparent 50%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 p-8 sm:p-10 h-full flex flex-col justify-between">
        <div className="space-y-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-inner group-hover:scale-110"
            style={{
              background: hovered ? "rgba(100,206,251,0.12)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${hovered ? "rgba(100,206,251,0.4)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            <Icon className="w-5.5 h-5.5" style={{ color: hovered ? ACCENT : "rgba(255,255,255,0.4)" }} />
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
  const navLinks = ["Features", "Pricing", "Security", "Analytics", "Team"];

  return (
    <footer
      className="relative w-full flex flex-col justify-between"
      style={{
        background: "#000",
        minHeight: "100vh",
        borderTop: "1px solid rgba(255,255,255,0.04)"
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: "800px",
          height: "600px",
          background: `radial-gradient(ellipse at top right, rgba(100,206,251,0.06) 0%, transparent 60%)`,
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 sm:px-10 max-w-[1400px] flex-1 flex flex-col pt-16 sm:pt-24 pb-8 sm:pb-12">
        
        {/* Top Section: CTA / Headline */}
        <div className="max-w-4xl space-y-6">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full ice-frost w-fit">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: "rgba(255,255,255,0.8)" }}>
              Contact Us
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] text-white/90">
            Interested in taking control, scaling your wealth <span style={{ color: "rgba(255,255,255,0.4)" }}>or simply learning more?</span>
          </h2>
        </div>

        {/* Spacer pushes the bottom row down */}
        <div className="flex-1 min-h-[40px] sm:min-h-[80px]" />

        {/* Middle Section: Contact & Horizontal Nav */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/[0.04] pb-8">
          {/* Left: Buttons replacing email per request */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Ready to Accelerate?
            </p>
            <div className="flex items-center gap-3">
              <PremiumButton onClick={onLogin} variant="default" className="px-8 py-3.5 rounded-[32px] text-[15px] font-normal">
                Start Your Journey
              </PremiumButton>
              <PremiumButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} variant="default" className="w-[52px] h-[52px] rounded-full flex items-center justify-center p-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </PremiumButton>
            </div>
          </div>

          {/* Right: Horizontal Nav */}
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {navLinks.map((link, i) => (
              <motion.a
                key={link}
                href="#"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                className="text-sm font-medium transition-colors duration-300"
                style={{ color: "rgba(255,255,255,0.5)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
              >
                {link}
              </motion.a>
            ))}
          </div>
        </div>

      </div>

      {/* ── Massive Sliding Typography (Bottom aligned) ── */}
      <div className="w-full relative select-none pointer-events-none pb-8 sm:pb-12 overflow-visible">
        <motion.div
          initial={{ opacity: 0, y: 120 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.05 }}
          transition={{ duration: 1.8, ease: EASE }}
          className="text-center font-black uppercase whitespace-nowrap block"
          style={{
            fontSize: "clamp(40px, 15vw, 280px)",
            color: "rgba(255,255,255,0.06)",
            lineHeight: "0.9",
            letterSpacing: "-0.05em",
            textShadow: "0 0 40px rgba(0,0,0,0.5)"
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
              <PremiumButton onClick={handleLogin} variant="default" className="px-6 py-2.5 rounded-[32px] text-sm sm:text-base font-normal">
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
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full ice-frost">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.6em]" style={{ color: "rgba(255,255,255,0.8)" }}>
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
            <div className="mt-6">
              <PremiumButton
                onClick={handleLogin}
                variant="default"
                className="px-8 py-3.5 rounded-[32px] text-[15px] font-normal"
              >
                Start Your Journey
              </PremiumButton>
            </div>
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
                <div className="flex flex-col sm:flex-row items-center gap-8 pt-6 px-2 relative group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="relative flex items-end gap-2 h-16">
                    {/* Animated Glow behind wave */}
                    <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    {[35, 80, 50, 100, 65, 120, 45, 95, 60, 110, 80, 55, 95, 40, 75, 50].map((h, i) => (
                      <motion.div key={i}
                        animate={{ 
                          height: [8, h * 0.6, 8],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity, 
                          delay: i * 0.08, 
                          ease: "easeInOut" 
                        }}
                        className="w-1.5 rounded-full relative z-10"
                        style={{ 
                          height: 8, 
                          background: `linear-gradient(to top, #64CEFB 0%, #3b82f6 100%)`,
                          boxShadow: `0 0 10px rgba(100, 206, 251, 0.3)`
                        }}
                      ></motion.div>
                    ))}
                  </div>
                  <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="relative w-2 h-2">
                         <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-40" />
                         <div className="relative w-2 h-2 rounded-full shadow-[0_0_10px_#64CEFB]" style={{ background: ACCENT }} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Neural Voice Core</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-white/30 pl-4">Sampling patterns...</span>
                      <motion.div 
                        animate={{ width: ["0%", "100%", "0%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="h-px bg-primary/40 ml-4 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              }
            />

            {/* Vault */}
            <BentoCard title="Secure Stash Vault"
              desc="Tier-1 capital protection. Lock your wealth behind a PIN-secure encrypted storage layer."
              icon={ShieldCheck}
              visual={
                <div className="relative h-44 w-full flex items-center justify-center overflow-hidden">
                  {/* Orbiting particles */}
                  <div className="absolute inset-0">
                    {[1, 2, 3].map((particle) => (
                      <motion.div
                        key={particle}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10 + particle * 5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                         <div className="w-[120px] h-[120px] rounded-full border border-dashed border-primary/10" />
                         <motion.div 
                           animate={{ scale: [1, 1.5, 1] }}
                           transition={{ duration: 4, repeat: Infinity }}
                           className="absolute top-0 w-1 h-1 rounded-full bg-primary/40 shadow-[0_0_8px_#64CEFB]"
                         />
                      </motion.div>
                    ))}
                  </div>

                  <div className="relative w-32 h-32 rounded-3xl flex flex-col items-center justify-center gap-4 ice-frost border-white/10 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                    
                    {/* Scanning Line */}
                    <motion.div 
                      animate={{ top: ["-10%", "110%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-sm z-10"
                    />

                    <div className="grid grid-cols-3 gap-3 relative z-20">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <motion.div key={i}
                          animate={{ 
                            background: ["rgba(100,206,251,0.1)", "rgba(100,206,251,0.4)", "rgba(100,206,251,0.1)"]
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 rounded-[2px]"
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2 relative z-20">
                      <Lock className="w-3.5 h-3.5 text-primary drop-shadow-[0_0_8px_rgba(100,206,251,0.5)]" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Secured</span>
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
                <div className="flex gap-4 pt-6 px-4 relative">
                  {[Target, Zap, Gem].map((Icon, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      whileHover={{ 
                        y: -12,
                        scale: 1.1,
                        rotate: [0, -5, 5, 0]
                      }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-500 ice-frost border-white/10 group-hover:border-primary/40 relative"
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.color = ACCENT;
                        el.style.boxShadow = "0 20px 40px rgba(100, 206, 251, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.color = "rgba(255,255,255,0.25)";
                        el.style.boxShadow = "none";
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover/card:opacity-100" />
                      <Icon className="w-7 h-7 relative z-10" />
                      
                      {/* Floating Sparkle on hover */}
                      <motion.div 
                        animate={{ 
                          opacity: [0, 1, 0],
                          scale: [0.5, 1, 0.5],
                          y: [-10, -20]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100"
                      >
                         <Sparkles className="w-4 h-4 text-primary" />
                      </motion.div>
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
                <div className="h-40 sm:h-44 flex items-end justify-between gap-1.5 px-4 w-full relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between opacity-10 pointer-events-none">
                    {[1, 2, 3, 4].map(line => (
                      <div key={line} className="w-full h-px bg-white" />
                    ))}
                  </div>
                  
                  {[45, 75, 55, 95, 65, 50, 85, 60, 100, 70].map((h, i) => (
                    <motion.div key={i}
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                      className="flex-1 relative group/bar"
                    >
                      <motion.div
                        animate={{
                          background: activeBar === i 
                            ? `linear-gradient(to top, #64CEFB 0%, #3b82f6 100%)` 
                            : "rgba(100,206,251,0.12)",
                          boxShadow: activeBar === i 
                            ? "0 0 25px rgba(100, 206, 251, 0.4)" 
                            : "none"
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full rounded-t-[4px] relative z-10"
                      >
                         {/* Reflection effect */}
                         <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                      </motion.div>
                      
                      <AnimatePresence>
                        {activeBar === i && (
                          <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.8 }}
                            animate={{ opacity: 1, y: -50, scale: 1 }}
                            exit={{ opacity: 0, y: 15, scale: 0.8 }}
                            className="absolute left-1/2 -translate-x-1/2 px-4 py-2 rounded-[12px] text-[10px] font-black whitespace-nowrap z-30"
                            style={{
                              background: "rgba(13,13,18,0.95)",
                              border: "1px solid rgba(100,206,251,0.3)",
                              color: ACCENT,
                              backdropFilter: "blur(20px)",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                            }}
                          >
                            <div className="flex flex-col items-center">
                              <span className="text-white/40 uppercase tracking-widest text-[8px] mb-1">Projected Yield</span>
                              ₹{(h * 920).toLocaleString('en-IN')}
                            </div>
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
                <span style={{ color: ACCENT }}>Savings</span><br />
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

            {/* Right Side: The Chat Interface */}
            <div className="flex-1 w-full relative">
              {/* Massive ambient glow behind the container to show off the glass */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(100,206,251,0.08) 0%, transparent 60%)" }}
              />

              {/* The Container - Simple list, no outside frame */}
              <div className="relative z-10 w-full sm:px-8 space-y-8">
                {/* Chat Bubbles */}
                <div className="space-y-6 pt-2">
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
                      <div className={`flex items-center gap-2 mb-2 ${chat.pos === "right" ? "flex-row-reverse" : ""}`}>
                        <div className="w-1.5 h-1.5 rounded-full"
                          style={{ background: chat.pos === "left" ? ACCENT : "rgba(255,255,255,0.3)" }}
                        />
                        <span className="text-[9px] font-bold uppercase tracking-[0.4em]"
                          style={{ color: chat.pos === "left" ? "rgba(100,206,251,0.6)" : "rgba(255,255,255,0.25)" }}
                        >
                          {chat.sender}
                        </span>
                      </div>

                      <div
                        className={`px-6 py-4 text-sm leading-relaxed max-w-[85%] sm:max-w-[75%] font-medium ${
                          chat.pos === "left" ? "rounded-[24px] rounded-tl-sm ice-frost" : "rounded-[24px] rounded-br-sm"
                        }`}
                        style={
                          chat.pos === "left"
                            ? { 
                                color: "rgba(255,255,255,0.7)"
                              }
                            : {
                                background: "linear-gradient(135deg, #64CEFB 0%, #3b82f6 100%)", // Brand Blue (Primary)
                                boxShadow: "0 8px 24px rgba(100, 206, 251, 0.3)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "#000000"
                              }
                        }
                      >
                        {chat.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Input Simulation */}
                <div className="mt-8 pt-6 border-t border-white/[0.04]">
                  <div className="w-full h-12 rounded-full border border-white/[0.06] flex items-center px-4 justify-between" style={{ background: "rgba(8,8,12,0.4)" }}>
                     <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">Ask for advice...</span>
                     <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all" style={{ background: "rgba(255,255,255,0.05)" }}>
                       <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer onLogin={handleLogin} />
    </div>
  );
}
