import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Lock,
  Target,
  Zap,
  Gem,
  BarChart3,
  Mic,
  ShieldCheck,
  Coins,
  Twitter,
  Instagram,
  Linkedin,
  Github,
} from "lucide-react";
import { ShinyText } from "@/components/ShinyText";
import { useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Bento Card ─────────────────────────────────────── */
function BentoCard({
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
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={`group relative rounded-[32px] overflow-hidden border border-white/[0.06] ${className}`}
      style={{
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(40px) saturate(160%)",
        WebkitBackdropFilter: "blur(40px) saturate(160%)",
        boxShadow: "inset 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -16px rgba(0,0,0,0.7)",
      }}
    >
      {/* subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      {/* blue glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_top_left,rgba(100,206,251,0.07),transparent_60%)] pointer-events-none" />

      <div className="relative z-10 p-8 sm:p-12 flex flex-col h-full">
        {/* header */}
        <div className="space-y-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 bg-white/[0.04] group-hover:border-[#64CEFB]/40 group-hover:bg-[#64CEFB]/10 transition-all duration-500">
            <Icon className="w-5 h-5 text-[#64CEFB]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase font-display">{title}</h3>
            <p className="text-sm text-white/35 leading-relaxed max-w-[320px] group-hover:text-white/55 transition-colors duration-300">{desc}</p>
          </div>
        </div>
        {/* visual area */}
        <div className="mt-10 flex-1 flex items-end">{visual}</div>
      </div>
    </motion.div>
  );
}

/* ─── Main ─────────────────────────────────────────────── */
export default function Landing() {
  const handleLogin = () => { window.location.href = "/api/auth/google"; };
  const [activeBar, setActiveBar] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-[#64CEFB]/20 overflow-x-hidden">

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* video bg */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-[0.18] z-0 pointer-events-none">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4" type="video/mp4" />
        </video>
        {/* dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060608]/60 via-transparent to-[#060608] z-0 pointer-events-none" />

        {/* NAV */}
        <nav className="relative z-10 w-full">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-7 flex items-center justify-between">
            {/* logo */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center backdrop-blur-xl group-hover:border-[#64CEFB]/40 transition-all duration-500">
                <div className="w-2 h-2 rounded-full bg-white group-hover:bg-[#64CEFB] transition-colors" />
              </div>
              <span className="text-lg font-bold tracking-tight uppercase font-display">Pocket Fund</span>
            </div>
            {/* sign-in pill */}
            <button
              onClick={handleLogin}
              className="px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.45em] transition-all duration-500"
              style={{
                background: "rgba(100,206,251,0.08)",
                border: "1px solid rgba(100,206,251,0.2)",
                color: "#64CEFB",
                backdropFilter: "blur(12px)",
              }}
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* HERO COPY */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="flex flex-col items-center gap-10 max-w-5xl mx-auto"
          >
            {/* tag */}
            <div className="flex items-center gap-3 px-5 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#64CEFB] shadow-[0_0_8px_#64CEFB]" />
              <span className="text-white/30 text-[9px] font-bold uppercase tracking-[0.65em]">Personal Savings Co-Pilot</span>
            </div>

            {/* headline */}
            <h1 className="text-[clamp(2.8rem,8vw,7rem)] font-bold tracking-[-0.04em] leading-[0.92] uppercase font-display">
              <div className="text-white/90">Master Your</div>
              <ShinyText text="Money With Ease" />
            </h1>

            {/* sub row */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
              <p className="text-white/25 text-sm sm:text-base max-w-[380px] leading-relaxed font-medium">
                Financial empathy meets smart tech. Track expenses, protect your stash, and grow with your AI buddy.
              </p>
              <div className="hidden md:block w-px h-12 bg-white/8" />
              <div className="text-center md:text-left">
                <p className="text-white/15 text-[8px] font-bold uppercase tracking-[0.6em] mb-1">Stashed Safely</p>
                <p className="text-[#64CEFB] text-2xl sm:text-3xl font-bold uppercase tracking-tight">₹1.2CR+ Secured</p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleLogin}
              className="group flex items-center gap-3 px-12 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.55em] transition-all duration-500 active:scale-[0.97]"
              style={{
                background: "rgba(100,206,251,0.12)",
                border: "1px solid rgba(100,206,251,0.28)",
                color: "#64CEFB",
                backdropFilter: "blur(16px)",
                boxShadow: "0 8px 32px rgba(100,206,251,0.15)",
              }}
            >
              Start Your Journey
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <section className="py-28 sm:py-48 border-t border-white/[0.05]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">

          {/* section label */}
          <div className="flex items-center gap-4 mb-16">
            <span className="w-5 h-px bg-[#64CEFB]/40" />
            <span className="text-[#64CEFB] text-[9px] font-bold uppercase tracking-[0.6em]">Platform Features</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* AI Coach — wide */}
            <BentoCard
              title="AI Assistant Coach"
              desc="Deep-learning advisor that monitors your patterns and gives real-time feedback to refine your saving strategy."
              icon={Mic}
              className="md:col-span-2 min-h-[380px]"
              visual={
                <div className="flex flex-col sm:flex-row items-center gap-8 w-full">
                  <div className="flex items-end gap-1.5 h-16">
                    {[30, 70, 45, 90, 55, 100, 35, 80, 50, 100, 70, 45, 85].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [10, h * 0.6, 10] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1.5 bg-gradient-to-t from-[#64CEFB]/15 to-[#64CEFB]/70 rounded-full"
                        style={{ height: 10 }}
                      />
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#64CEFB] animate-pulse" />
                      <span className="text-[10px] font-bold text-[#64CEFB] uppercase tracking-[0.45em]">Neural Link Active</span>
                    </div>
                    <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest pl-3.5">Analyzing spending habits…</p>
                  </div>
                </div>
              }
            />

            {/* Secure Vault */}
            <BentoCard
              title="Secure Stash Vault"
              desc="Tier-1 protection. Lock long-term wealth behind a PIN-secured storage layer."
              icon={ShieldCheck}
              className="min-h-[380px]"
              visual={
                <div className="flex items-center justify-center w-full h-36 relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,206,251,0.1)_0%,transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative w-28 h-28 rounded-[2rem] flex flex-col items-center justify-center gap-3 border border-white/10 group-hover:border-[#64CEFB]/40 transition-all duration-700" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="grid grid-cols-3 gap-2.5">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.6, backgroundColor: "#64CEFB" }} className="w-1.5 h-1.5 rounded-full bg-white/15 transition-colors cursor-pointer" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-[#64CEFB]" />
                      <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Encrypted</span>
                    </div>
                  </div>
                </div>
              }
            />

            {/* Growth Rewards */}
            <BentoCard
              title="Growth Rewards"
              desc="Collect premium tokens and badges for your financial discipline and consistency."
              icon={Coins}
              className="min-h-[340px]"
              visual={
                <div className="flex gap-4 w-full">
                  {[Target, Zap, Gem].map((Icon, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -8, rotate: i % 2 === 0 ? -12 : 12 }}
                      className="flex-1 aspect-square rounded-[20px] flex items-center justify-center border border-white/10 bg-white/[0.03] text-white/20 cursor-pointer hover:border-[#64CEFB]/40 hover:bg-[#64CEFB]/10 hover:text-[#64CEFB] hover:shadow-[0_0_24px_rgba(100,206,251,0.2)] transition-all duration-500"
                    >
                      <Icon className="w-7 h-7" />
                    </motion.div>
                  ))}
                </div>
              }
            />

            {/* Precision Data — wide */}
            <BentoCard
              title="Precision Data"
              desc="Interactive capital modeling that visualizes every rupee, revealing hidden saving opportunities."
              icon={BarChart3}
              className="md:col-span-2 min-h-[340px]"
              visual={
                <div className="h-36 sm:h-44 flex items-end justify-between gap-1.5 sm:gap-3 w-full relative">
                  <div className="absolute inset-x-0 bottom-0 h-px bg-white/8" />
                  {[35, 60, 45, 85, 55, 40, 75, 50, 95, 60].map((h, i) => (
                    <motion.div
                      key={i}
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1.1, ease: EASE, delay: i * 0.07 }}
                      className="flex-1 relative"
                    >
                      <motion.div
                        animate={{
                          backgroundColor: activeBar === i ? "#64CEFB" : "rgba(100,206,251,0.15)",
                          boxShadow: activeBar === i ? "0 0 20px rgba(100,206,251,0.4)" : "none",
                        }}
                        className="h-full w-full rounded-t-lg"
                      />
                      <AnimatePresence>
                        {activeBar === i && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.85 }}
                            animate={{ opacity: 1, y: -44, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.85 }}
                            className="absolute left-1/2 -translate-x-1/2 -top-2 bg-white text-black px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase whitespace-nowrap shadow-xl"
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

      {/* ══════════════════ CHAT ══════════════════ */}
      <section className="py-28 sm:py-48 border-t border-white/[0.05] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
          <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">

            {/* left copy */}
            <div className="flex-1 space-y-8 lg:sticky lg:top-32">
              <div className="flex items-center gap-3">
                <span className="w-5 h-px bg-[#64CEFB]/40" />
                <span className="text-[#64CEFB] text-[9px] font-bold uppercase tracking-[0.6em]">AI Coach</span>
              </div>
              <h2 className="text-5xl sm:text-7xl font-bold tracking-[-0.04em] leading-[0.88] uppercase font-display">
                Your AI<br />Savings<br />Buddy.
              </h2>
              <p className="text-white/25 text-base sm:text-lg leading-relaxed max-w-sm">
                Friendly, judgment-free advice that helps you save more without changing your lifestyle.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {["24/7 Advisory", "Privacy Secured", "Goal Tracking"].map((t) => (
                  <span key={t} className="px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.4em] text-white/20 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.025)" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* right bubbles */}
            <div className="flex-1 flex flex-col gap-6 w-full">
              {[
                { text: "Hey! You've stashed ₹2,000 more than usual this week. Huge win! 🏆", pos: "left", sender: "AI Coach" },
                { text: "That's awesome! What's next for my savings goal?", pos: "right", sender: "You" },
                { text: "Keep going! If you stash ₹500 more, you'll reach 50% of your laptop goal.", pos: "left", sender: "AI Coach" },
              ].map((chat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: chat.pos === "left" ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
                  className={`flex flex-col ${chat.pos === "left" ? "items-start pr-8 sm:pr-16" : "items-end pl-8 sm:pl-16"}`}
                >
                  <div className={`flex items-center gap-2 mb-2 ${chat.pos === "right" ? "flex-row-reverse" : ""}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${chat.pos === "left" ? "bg-[#64CEFB]" : "bg-white/30"}`} />
                    <span className={`text-[8px] font-bold uppercase tracking-[0.45em] ${chat.pos === "left" ? "text-[#64CEFB]" : "text-white/30"}`}>{chat.sender}</span>
                  </div>
                  <div
                    className={`px-6 py-5 text-sm leading-relaxed font-medium ${chat.pos === "left" ? "rounded-2xl rounded-tl-sm text-white/60" : "rounded-2xl rounded-tr-sm text-white/85"}`}
                    style={
                      chat.pos === "left"
                        ? { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(32px)" }
                        : { background: "rgba(100,206,251,0.08)", border: "1px solid rgba(100,206,251,0.2)", backdropFilter: "blur(32px)" }
                    }
                  >
                    {chat.text}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="relative border-t border-white/[0.05] overflow-hidden" style={{ background: "#060608" }}>
        {/* ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#64CEFB]/[0.018] blur-[120px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-20 pb-0 relative z-10">

          {/* ── top row ── */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 pb-20">

            {/* brand block */}
            <div className="flex flex-col gap-8 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#64CEFB]" />
                </div>
                <span className="text-xl font-bold tracking-tight uppercase font-display">Pocket Fund</span>
              </div>
              <p className="text-sm text-white/20 leading-relaxed">
                Engineering the future of personal capital governance. Built for the modern individual, without compromise.
              </p>
              <div className="flex items-center gap-6">
                {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ y: -3, color: "#64CEFB" }}
                    className="text-white/15 transition-colors duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* right block */}
            <div className="flex flex-col items-start lg:items-end gap-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.6em] text-white/10">Operational Protocol</p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex items-center gap-6 transition-all active:scale-95"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/25 group-hover:text-white/80 transition-colors duration-500">Return Top</span>
                <span className="block w-10 h-px bg-white/10 group-hover:bg-[#64CEFB]/50 group-hover:w-16 transition-all duration-700" />
              </button>
              <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">All Systems Nominal</span>
              </div>
            </div>
          </div>

          {/* ── architectural text animation ── */}
          <div className="w-full overflow-hidden border-t border-white/[0.04]">
            <motion.p
              initial={{ y: "105%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[13vw] font-bold tracking-[-0.04em] leading-[0.75] uppercase font-display select-none pointer-events-none text-center italic"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Pocket Fund
            </motion.p>
          </div>

          {/* ── bottom status bar ── */}
          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.03]">
            <p className="text-[8px] font-bold uppercase tracking-[0.7em] text-white/10">© 2026 Pocket Fund · All rights reserved</p>
            <div className="flex items-center gap-6 text-[8px] font-bold uppercase tracking-[0.4em] text-white/10">
              <span>Privacy</span>
              <span className="text-white/5">·</span>
              <span>Terms</span>
              <span className="text-white/5">·</span>
              <span>v1.0</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
