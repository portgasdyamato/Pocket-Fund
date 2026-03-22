import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Target, 
  TrendingUp, 
  Trophy, 
  Zap, 
  Wallet, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Lock,
  PieChart,
  BarChart3,
  ChevronRight,
  ShieldCheck,
  Globe,
  Brain,
  MousePointer2,
  Activity,
  ArrowDown
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Sophisticated entrance
      gsap.from(".reveal-text", {
        y: 60,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "expo.out"
      });

      gsap.from(".reveal-card", {
        scrollTrigger: {
          trigger: ".bento-grid",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div ref={containerRef} className="bg-[#020617] text-white min-h-screen selection:bg-blue-500/30 font-sans">
      
      {/* Premium Background System */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-subtle" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-150" />
      </div>

      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/20">F</div>
          <span className="text-xl font-bold tracking-tight">PocketFund</span>
        </div>
        <Button onClick={handleLogin} variant="outline" className="rounded-full px-8 border-white/10 hover:bg-white/5 text-sm font-semibold">
          Sign In
        </Button>
      </nav>

      <main className="relative z-10 pt-32">
        
        {/* Modern Hero Section */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center mb-32">
          <motion.div style={{ opacity, scale }} className="max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider uppercase mb-8 reveal-text">
              <Sparkles className="w-4 h-4" />
              Intelligence in every transaction
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.05] reveal-text">
              Master Your Wealth <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">With Precision.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/40 mb-12 max-w-2xl mx-auto leading-relaxed reveal-text font-medium">
              The ultimate financial operating system for those who demand excellence. 
              Cinematic analytics, automated insights, and professional-grade security.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 reveal-text">
              <Button 
                onClick={handleLogin}
                size="lg"
                className="h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-2xl shadow-blue-600/30 group"
              >
                Access Terminal
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="flex items-center gap-4 text-white/30 text-sm font-bold uppercase tracking-widest pl-4">
                <Users className="w-5 h-5" />
                <span>12.4K ACTIVE OPERATORS</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-24"
          >
            <div className="flex flex-col items-center gap-4 border-t border-white/5 pt-12">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">The Core Environment</span>
               <ArrowDown className="w-5 h-5 text-blue-500/40 animate-bounce" />
            </div>
          </motion.div>
        </section>

        {/* Bento Intelligence Grid */}
        <section className="px-6 max-w-7xl mx-auto mb-48 bento-grid">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Designed for Performance.</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg">Every component is engineered to eliminate friction and elevate your financial status.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
            {/* Feature 1: Main Terminal */}
            <div className="md:col-span-6 lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-[40px] p-12 relative overflow-hidden group reveal-card hover:border-blue-500/20 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -mr-32 -mt-32" />
              <div className="flex flex-col h-full">
                <div className="w-16 h-16 rounded-22 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-10 shadow-xl shadow-black/40">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black mb-6">Precision Analytics</h3>
                <p className="text-white/40 text-lg leading-relaxed mb-12 max-w-md">Granular expense tracking with real-time categorization and trend modeling at your fingertips.</p>
                <div className="mt-auto h-64 bg-[#0A0A0F] rounded-[32px] border border-white/5 p-8 flex flex-col gap-6 shadow-inner">
                  <div className="flex gap-4">
                    <div className="h-3 w-32 bg-white/10 rounded-full" />
                    <div className="h-3 w-full bg-white/5 rounded-full" />
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-6">
                    <div className="bg-blue-600/5 border border-blue-500/10 rounded-3xl" />
                    <div className="col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Vault */}
            <div className="md:col-span-6 lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-[40px] p-12 relative overflow-hidden group reveal-card hover:border-indigo-500/20 transition-all duration-500">
               <div className="flex flex-col h-full">
                  <div className="w-16 h-16 rounded-22 bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-10 shadow-xl shadow-black/40">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-black mb-6">Security First</h3>
                  <p className="text-white/40 text-lg leading-relaxed mb-12">Encrypted stash protocols ensuring your digital assets remain under your total control.</p>
                  <div className="mt-auto flex justify-center">
                    <div className="w-48 h-48 rounded-[32px] border-2 border-white/5 bg-white/5 flex items-center justify-center relative shadow-2xl">
                      <div className="absolute inset-0 bg-indigo-500/10 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <KeyIcon className="w-20 h-20 text-white/10 group-hover:text-indigo-400 transition-all duration-700" />
                    </div>
                  </div>
               </div>
            </div>

            {/* Smaller features */}
            {[
              { icon: Target, title: "Goal Tracking", desc: "Automated progress vectors for your financial milestones.", col: "lg:col-span-4" },
              { icon: Trophy, title: "Achievements", desc: "Gamified success tiers for high-performance savers.", col: "lg:col-span-4" },
              { icon: Globe, title: "Global Access", desc: "Your financial ecosystem, synchronized across all devices.", col: "lg:col-span-4" }
            ].map((f, i) => (
              <div key={i} className={`${f.col} md:col-span-2 bg-white/[0.02] border border-white/5 rounded-[36px] p-10 reveal-card hover:border-white/20 transition-all group`}>
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-blue-400 transition-colors mb-6 border border-white/5">
                  <f.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-3">{f.title}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Global CTA */}
        <section className="py-48 px-6 text-center">
          <div className="max-w-4xl mx-auto glass-frost rounded-[64px] border-white/10 p-20 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-blue-600/5 blur-[120px] pointer-events-none" />
            <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tight leading-none relative z-10">
              Ready to <br />
              <span className="text-gradient-blue">Level Up?</span>
            </h2>
            <p className="text-xl text-white/40 mb-16 max-w-xl mx-auto relative z-10">
              Join the elite circle of operators who have automated their financial future.
            </p>
            <Button 
              onClick={handleLogin}
              size="lg"
              className="h-20 px-16 rounded-2xl bg-white text-black hover:bg-white/90 font-black text-xl shadow-2xl relative z-10 click-scale"
            >
              Start Free Sync
            </Button>
          </div>
        </section>

        {/* Minimalist Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-white/20 text-xs font-bold tracking-widest leading-none">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40">F</div>
            <span className="uppercase">POCKETFUND OS v4.2.0</span>
          </div>
          <div className="flex gap-12 underline-offset-4 decoration-white/10">
            <a href="#" className="hover:text-white transition-colors">SECURITY</a>
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-white transition-colors">PROTOCOL</a>
          </div>
          <p>© 2026 QUANTUM WEALTH DEPOT</p>
        </footer>
      </main>
    </div>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M15 6a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5-5 0 0 0-5-5Z"/>
      <path d="M10 11H3"/>
      <path d="v2"/>
      <path d="M3 13h2"/>
      <path d="M7 11v2"/>
    </svg>
  );
}
