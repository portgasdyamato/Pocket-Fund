import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight,
  Lock,
  BarChart3,
  Mic,
  ShieldCheck,
  Coins,
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

const EASE = [0.16, 1, 0.3, 1];

// ─── Bento Card ──────────────────────────────────────────────────────────────
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
  icon: any;
  visual?: React.ReactNode;
}) => (
  <motion.div
    whileHover={{ y: -6 }}
    transition={{ duration: 0.5, ease: EASE }}
    className={`group relative rounded-3xl bg-white/[0.02] border border-white/[0.06] overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04] ${className}`}
  >
    {/* Subtle top-edge glow on hover */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#64CEFB]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

    <div className="p-8 lg:p-10 h-full flex flex-col">
      {/* Icon */}
      <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-7 transition-all group-hover:border-[#64CEFB]/30 group-hover:bg-[#64CEFB]/[0.08]">
        <Icon className="w-5 h-5 text-[#64CEFB]" />
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed mb-8 max-w-xs">{desc}</p>

      {/* Visual */}
      <div className="mt-auto">{visual}</div>
    </div>
  </motion.div>
);

// ─── Chat Bubble ─────────────────────────────────────────────────────────────
const ChatBubble = ({
  text,
  isAI,
  label,
}: {
  text: string;
  isAI: boolean;
  label: string;
}) => (
  <div className={`flex flex-col gap-1.5 ${isAI ? "items-start" : "items-end"}`}>
    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25 px-1">
      {label}
    </span>
    <div
      className={`max-w-[85%] sm:max-w-sm px-5 py-3.5 rounded-2xl text-sm leading-relaxed font-medium transition-all duration-300 ${
        isAI
          ? "bg-white/[0.04] border border-white/[0.08] text-white/70 rounded-tl-sm"
          : "bg-[#64CEFB]/[0.12] border border-[#64CEFB]/[0.25] text-white/90 rounded-tr-sm"
      }`}
    >
      {text}
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const [activeBar, setActiveBar] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        {/* BG video */}
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-[0.18] z-0"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
            type="video/mp4"
          />
        </video>

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_40%,#030303_100%)] z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#030303_0%,transparent_60%)] z-[1]" />

        {/* NAV */}
        <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-7 max-w-[1400px] mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#64CEFB]/10 border border-[#64CEFB]/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#64CEFB]" />
            </div>
            <span className="text-white font-semibold text-base tracking-tight">Pocket Fund</span>
          </div>
          <button
            onClick={handleLogin}
            className="text-white/50 hover:text-white text-xs font-medium tracking-wide transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08]"
          >
            Sign in
          </button>
        </nav>

        {/* HERO CONTENT */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#64CEFB] shadow-[0_0_8px_#64CEFB]" />
              <span className="text-white/40 text-[10px] font-semibold uppercase tracking-[0.2em]">
                Personal Savings Co-Pilot
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.03em] leading-[1] text-white">
              Master Your<br />
              <ShinyText text="Money With Ease" />
            </h1>

            {/* Subheadline */}
            <p className="text-white/40 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              Financial empathy meets smart technology. Track expenses, lock savings in the vault, and grow with your AI buddy.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={handleLogin}
                className="group flex items-center gap-2 bg-[#64CEFB] hover:bg-[#57BDED] text-black text-sm font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(100,206,251,0.25)] hover:shadow-[0_0_40px_rgba(100,206,251,0.4)]"
              >
                Start Your Journey
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={handleLogin}
                className="text-white/40 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                Sign in →
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-white/30 text-xs">₹1.2Cr+ secured</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <span className="text-white/30 text-xs">Trusted by thousands</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-36 border-t border-white/[0.05]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">

          {/* Section header */}
          <div className="mb-16">
            <p className="text-[#64CEFB] text-xs font-semibold uppercase tracking-[0.2em] mb-3">Platform</p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-xl">
              Everything you need to save smarter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* AI Coach — wide */}
            <BentoCard
              title="AI Savings Coach"
              desc="Deep-learning advisor that monitors your patterns and provides real-time voice guidance to optimize your strategy."
              icon={Mic}
              className="md:col-span-2"
              visual={
                <div className="flex items-center gap-6 py-4">
                  <div className="flex items-end gap-1.5 h-12">
                    {[30, 70, 45, 90, 55, 100, 35, 80, 50, 100, 70, 45].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [8, h * 0.45, 8] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.12 }}
                        className="w-1.5 bg-[#64CEFB]/40 rounded-full"
                        style={{ height: 8 }}
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-[#64CEFB] rounded-full animate-pulse" />
                      <span className="text-[10px] font-semibold text-[#64CEFB] uppercase tracking-widest">Active</span>
                    </div>
                    <p className="text-xs text-white/30">Analyzing spending habits…</p>
                  </div>
                </div>
              }
            />

            {/* Vault */}
            <BentoCard
              title="Secure Stash Vault"
              desc="PIN-locked storage for your long-term savings. Your money, your rules."
              icon={ShieldCheck}
              visual={
                <div className="flex items-center justify-center py-4">
                  <div className="w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex flex-col items-center justify-center gap-3 group-hover:border-[#64CEFB]/30 transition-all duration-500">
                    <div className="grid grid-cols-3 gap-2">
                      {[1,2,3,4,5,6,7,8,9].map(i => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.6, backgroundColor: "#64CEFB" }}
                          className="w-1.5 h-1.5 rounded-full bg-white/15"
                        />
                      ))}
                    </div>
                    <Lock className="w-3.5 h-3.5 text-[#64CEFB]/60" />
                  </div>
                </div>
              }
            />

            {/* Rewards */}
            <BentoCard
              title="Growth Rewards"
              desc="Earn tokens and badges for consistent saving discipline."
              icon={Coins}
              visual={
                <div className="flex gap-3 py-4">
                  {[Target, Zap, Gem].map((Icon, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -6 }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/[0.08] bg-white/[0.03] text-white/30 cursor-pointer hover:border-[#64CEFB]/30 hover:text-[#64CEFB] hover:bg-[#64CEFB]/[0.06] transition-all duration-300"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                  ))}
                </div>
              }
            />

            {/* Analytics — wide */}
            <BentoCard
              title="Precision Analytics"
              desc="Interactive capital modeling that reveals hidden saving opportunities automatically."
              icon={BarChart3}
              className="md:col-span-2"
              visual={
                <div className="h-28 flex items-end gap-1.5 w-full relative">
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" />
                  {[35, 60, 45, 85, 55, 40, 75, 50, 95, 60, 70, 80].map((h, i) => (
                    <motion.div
                      key={i}
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1, ease: EASE, delay: i * 0.06 }}
                      className="flex-1 relative"
                    >
                      <div
                        className={`h-full w-full rounded-t transition-all duration-200 ${
                          activeBar === i
                            ? "bg-[#64CEFB]"
                            : "bg-[#64CEFB]/20"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* ── CHAT SECTION ──────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-36 border-t border-white/[0.05]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left: copy */}
            <div className="space-y-6">
              <p className="text-[#64CEFB] text-xs font-semibold uppercase tracking-[0.2em]">AI Coach</p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                Your savings buddy,<br />always in your corner.
              </h2>
              <p className="text-white/40 text-base leading-relaxed max-w-sm">
                Judgment-free advice that helps you save more — without upending your lifestyle.
              </p>
              <div className="flex gap-3 flex-wrap">
                {["24/7 Advisory", "Privacy Secured", "Goal Tracking"].map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-white/40 text-xs font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: chat UI */}
            <div className="space-y-4 w-full">
              {/* Chat window chrome */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.07] overflow-hidden">

                {/* Window toolbar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  </div>
                  <span className="text-white/20 text-[10px] font-medium mx-auto">AI Savings Coach</span>
                </div>

                {/* Messages */}
                <div className="p-6 space-y-5">
                  {[
                    { text: "Hey! You've stashed ₹2,000 more than last week. Keep it up! 🏆", isAI: true, label: "Coach" },
                    { text: "That's great! What should I focus on next?", isAI: false, label: "You" },
                    { text: "₹500 more and you'll hit 50% of your laptop goal. You're on track.", isAI: true, label: "Coach" },
                  ].map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
                    >
                      <ChatBubble {...msg} />
                    </motion.div>
                  ))}
                </div>

                {/* Input bar */}
                <div className="px-6 pb-5">
                  <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3">
                    <span className="text-white/20 text-sm flex-1">Ask your coach…</span>
                    <div className="w-6 h-6 rounded-lg bg-[#64CEFB]/10 border border-[#64CEFB]/20 flex items-center justify-center">
                      <ArrowUpRight className="w-3 h-3 text-[#64CEFB]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] bg-[#030303]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-16">

          {/* Top row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10 mb-12">

            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#64CEFB]/10 border border-[#64CEFB]/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#64CEFB]" />
                </div>
                <span className="text-white font-semibold text-base tracking-tight">Pocket Fund</span>
              </div>
              <p className="text-white/30 text-sm max-w-[260px] leading-relaxed">
                The smarter way to save, track, and grow your money.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 text-sm text-white/40">
              <div className="space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/20 mb-4">Product</p>
                {["Dashboard", "Vault", "Analytics", "AI Coach"].map(link => (
                  <a key={link} href="#" onClick={handleLogin} className="block hover:text-white transition-colors duration-200">{link}</a>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/20 mb-4">Company</p>
                {["About", "Privacy", "Terms"].map(link => (
                  <a key={link} href="#" className="block hover:text-white transition-colors duration-200">{link}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] mb-8" />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/25 text-xs">© 2026 Pocket Fund. All rights reserved.</p>

            <div className="flex items-center gap-5">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -2 }}
                  className="text-white/20 hover:text-white/60 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-white/25 hover:text-white text-xs font-medium transition-colors duration-200 flex items-center gap-1.5"
            >
              Back to top
              <span className="rotate-[-90deg] inline-block">→</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
