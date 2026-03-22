import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
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
  Activity
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      const tl = gsap.timeline();
      tl.from(".hero-title-text", {
        y: 120,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out"
      })
      .from(".hero-sub", {
        opacity: 0,
        y: 20,
        duration: 0.8
      }, "-=0.8")
      .from(".hero-cta", {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.6");

      // Floating Graphics
      gsap.to(".float-card", {
        y: -30,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3
      });

      // Feature Reveal
      gsap.from(".reveal-item", {
        scrollTrigger: {
          trigger: ".reveal-grid",
          start: "top 85%",
        },
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out"
      });

      // Mouse Follow Glow
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        gsap.to(".mouse-glow", {
          x: clientX,
          y: clientY,
          duration: 1.2,
          ease: "power2.out"
        });
      };
      
      // Scroll Hint Animation
      gsap.to(".scroll-hint", {
        y: 15,
        opacity: 0.4,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const params = new URLSearchParams(window.location.search);
  const authError = params.get('auth_error');

  const errorMessages: Record<string, string> = {
    token_failed: 'Google sign-in failed. Please verify your account.',
    userinfo_failed: 'Profile access denied. Please try again.',
    no_code: 'Authentication cancelled.',
    server_error: 'Server is currently undergoing maintenance.',
    access_denied: 'Identity verification failed.',
  };

  return (
    <div ref={containerRef} className="bg-stellar min-h-screen overflow-x-hidden">
      
      {/* Interactive Global Glows */}
      <div className="mouse-glow fixed w-[1000px] h-[1000px] bg-blue-600/[0.07] blur-[180px] rounded-full pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-0 lg:opacity-100" />
      <div className="fixed top-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-600/[0.04] rounded-full blur-[180px] pointer-events-none" />

      {/* Auth Error Banner */}
      {authError && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6">
          <div className="glass-frost bg-rose-500/10 border-rose-500/30 p-8 rounded-[32px] flex flex-col gap-3 shadow-2xl animate-shake">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shadow-2xl">
                   <Lock className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-black text-rose-400 text-sm tracking-[0.3em] uppercase">Identity Verification Failed</h4>
             </div>
             <p className="text-white/60 text-sm font-medium leading-relaxed ml-16">{errorMessages[authError] || authError}</p>
          </div>
        </div>
      )}

      <main className="page-main relative z-10 w-full">
        {/* Dynamic Hero Interface */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center relative px-8 py-20">
          {/* Hero Kinetic Backdrop */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <div className="absolute top-1/4 left-1/4 w-[120%] h-[120%] bg-blue-600/[0.03] rounded-full blur-[200px] animate-spin-slow -translate-x-1/2 -translate-y-1/2" />
             <div className="absolute top-1/2 right-1/4 w-[100%] h-[100%] bg-blue-500/[0.04] rounded-full blur-[180px] -translate-y-1/2" />
          </div>

          <div className="max-w-[1400px] w-full mx-auto relative z-10" ref={heroRef}>
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-flex items-center gap-4 px-8 py-3.5 rounded-full border border-blue-500/20 bg-blue-600/10 backdrop-blur-3xl mb-8 shadow-2xl"
             >
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-400">Elite Financial Operating System 4.0</span>
             </motion.div>

             <h1 className="hero-title text-4xl sm:text-6xl md:text-[clamp(1.5rem,10vw,11rem)] font-black tracking-[-0.06em] leading-[0.85] mb-12 flex flex-col items-center select-none text-white uppercase mt-4">
                <span className="hero-title-text inline-block">ORCHESTRATE</span>
                <span className="hero-title-text text-gradient-blue inline-block italic">ASCENSION.</span>
             </h1>

             <p className="hero-sub text-lg sm:text-2xl md:text-3xl text-white/40 mb-16 max-w-4xl mx-auto leading-relaxed font-medium tracking-tight italic px-4">
                Architected for the top 1%. Cinematic analytics meets 
                autonomous wealth preservation in a high-fidelity frost interface.
             </p>

             <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-20">
                <Button 
                   size="lg"
                   onClick={handleLogin}
                   className="h-28 rounded-[40px] px-20 bg-blue-600 hover:bg-blue-500 text-white font-black text-2xl tracking-tighter click-scale shadow-[0_40px_80px_-20px_rgba(37,99,235,0.6)] border-none group relative overflow-hidden"
                >
                   <span className="relative z-10 flex items-center">
                      Launch Interface
                      <ArrowRight className="w-8 h-8 ml-6 group-hover:translate-x-3 transition-transform duration-500" />
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
                <div className="flex items-center gap-10">
                   <div className="flex -space-x-5">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-16 h-16 rounded-full border-4 border-[#020205] bg-white/5 glass-frost shadow-2xl relative overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} className="w-full h-full object-cover p-1.5" alt="Operator" />
                        </div>
                      ))}
                   </div>
                   <div className="text-left border-l border-white/10 pl-10">
                      <p className="text-3xl font-black tracking-tighter text-white tabular-nums">12,403</p>
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Operators Online</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Cinematic Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-12 flex flex-col items-center gap-4 cursor-pointer group"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
             <p className="text-[9px] font-black uppercase tracking-[1em] text-white/20 group-hover:text-blue-500/60 transition-colors ml-[1em]">Scroll to Descend</p>
             <div className="scroll-hint w-6 h-10 rounded-full border-2 border-white/10 flex items-start justify-center p-2">
                <div className="w-1 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
             </div>
          </motion.div>
        </section>

        {/* High-Fidelity Terminal Preview */}
        <section className="section-container py-40">
          <div className="relative max-w-[1400px] mx-auto group">
             <div className="absolute inset-0 bg-blue-600/5 blur-[200px] rounded-full scale-125 opacity-40 animate-pulse pointer-events-none" />
             <div className="relative rounded-[72px] border border-white/10 bg-[#050508]/60 p-6 md:p-8 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.95)] glass-frost hover:border-blue-500/20 transition-all duration-1000">
                <div className="rounded-[52px] bg-[#0A0A0F] border border-white/5 aspect-[16/9] overflow-hidden flex flex-col p-10 md:p-16 shadow-inner relative">
                   {/* Terminal UI Mockup - Refined */}
                   <div className="flex justify-between items-center mb-16">
                      <div className="flex gap-4">
                         <div className="w-4 h-4 rounded-full bg-rose-500/20 border border-rose-500/40" />
                         <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/40" />
                         <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                      </div>
                      <div className="w-24 h-24 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shadow-2xl ring-4 ring-blue-500/5">
                         <Zap className="w-10 h-10 text-blue-500/40" />
                      </div>
                   </div>
                   <div className="flex-1 border-t border-white/5 pt-12">
                      <div className="grid grid-cols-3 gap-10 h-full">
                         <div className="col-span-2 space-y-8">
                            <div className="h-40 bg-white/[0.02] border border-white/5 rounded-[40px] p-8">
                               <div className="w-40 h-3 bg-white/10 rounded-full mb-6" />
                               <div className="w-full h-12 bg-blue-600/10 rounded-2xl flex items-center px-6">
                                  <div className="w-1/2 h-2 bg-blue-500/40 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                               <div className="h-32 bg-white/[0.01] border border-white/5 rounded-[32px]" />
                               <div className="h-32 bg-blue-500/5 border border-blue-500/10 rounded-[32px]" />
                            </div>
                         </div>
                         <div className="bg-white/[0.01] border border-white/5 rounded-[48px]" />
                      </div>
                   </div>
                
                {/* Tactical Micro-Metrics */}
                <div className="absolute top-32 -right-24 w-[450px] glass-frost p-12 rounded-[56px] float-card hidden xl:block shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] border-white/10 z-20">
                   <div className="flex items-center gap-8 mb-10">
                      <div className="w-20 h-20 rounded-[32px] bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-2xl">
                         <TrendingUp className="w-10 h-10" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[11px] font-black tracking-[0.4em] text-white/30 uppercase mb-2">Network Yield</p>
                         <p className="text-4xl font-black text-emerald-400 tabular-nums italic">+128.42%</p>
                      </div>
                   </div>
                   <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px]">
                      <motion.div animate={{ width: ['20%', '92%', '20%'] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="h-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)] rounded-full" />
                   </div>
                </div>

                <div className="absolute bottom-32 -left-24 w-[450px] glass-frost p-12 rounded-[56px] float-card hidden xl:block shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] border-white/10 z-20" style={{ animationDelay: '1s' }}>
                   <div className="flex items-center gap-8 mb-10">
                      <div className="w-20 h-20 rounded-[32px] bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-2xl">
                         <Target className="w-10 h-10" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[11px] font-black tracking-[0.4em] text-white/30 uppercase mb-2">Goal Trajectory</p>
                         <p className="text-2xl font-black text-white uppercase tracking-tight italic">Mission Stabilized</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      {[1,1,1,1,1,1,0,0].map((v, i) => (
                        <div key={i} className={`h-3 flex-1 rounded-full ${v ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]' : 'bg-white/5'}`} />
                      ))}
                   </div>
                </div>
                </div>
             </div>
          </div>
        </section>

        {/* Intelligence Architecture Grid */}
        <section className="py-40 relative">
           <div className="absolute inset-0 spectral-glow opacity-30 pointer-events-none" />
           <div className="section-container relative z-10">
              <div className="text-center mb-40 reveal-grid">
                 <div className="inline-flex flex-col items-center gap-6 mb-12">
                    <div className="w-1.5 h-12 bg-blue-600/40 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                    <h2 className="text-4xl sm:text-6xl md:text-[clamp(2.5rem,8vw,9rem)] font-black tracking-[-0.05em] reveal-item uppercase italic text-white leading-none">
                       PRO-GRADE <span className="text-gradient-blue italic">SYSTEM.</span>
                    </h2>
                 </div>
                 <p className="text-2xl md:text-3xl text-white/30 max-w-4xl mx-auto font-medium tracking-tight reveal-item italic">
                    Architected for high-velocity capital management and sub-millisecond data visualization of your financial future.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                 {[
                   { icon: Target, title: "PRECISION ANALYTICS", desc: "Granular expense decomposition with near-zero latency categorization and audit trails.", color: "text-blue-500" },
                   { icon: Activity, title: "DYNAMIC ASSETS", desc: "Interactive portfolio modeling with real-time risk parity assessment and adaptive rebalancing.", color: "text-blue-400" },
                   { icon: Lock, title: "FROST VAULT", desc: "Sub-zero storage protocols for your most sensitive financial secrets and capital reserves.", color: "text-blue-300" },
                   { icon: Users, title: "SYNDICATE BENCHMARK", desc: "Compare your performance metrics against the world-class ecosystem's elite 1%.", color: "text-emerald-400" },
                   { icon: Trophy, title: "ACHIEVEMENT VECTORS", desc: "Gamified progression tiers rewarding disciplined tactical saving and milestone realization.", color: "text-blue-500" },
                   { icon: BarChart3, title: "QUANTUM FORECAST", desc: "High-fidelity projection models for lifetime wealth evolution and capital impact analysis.", color: "text-blue-600" }
                 ].map((item, i) => (
                    <motion.div key={i} whileHover={{ y: -10 }} className="reveal-item">
                       <div className="glass-frost p-16 h-full rounded-[64px] group border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none" />
                          <div className={`w-24 h-24 rounded-[36px] bg-white/[0.03] border border-white/10 flex items-center justify-center mb-12 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group-hover:bg-blue-600 group-hover:text-white`}>
                             <item.icon className="w-12 h-12" />
                          </div>
                          <h3 className="text-3xl font-black tracking-tight text-white mb-8 uppercase italic leading-none">{item.title}</h3>
                          <p className="text-white/30 leading-relaxed font-medium tracking-tight text-xl italic">{item.desc}</p>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Tactical Performance Callout */}
        <section className="py-40">
           <div className="section-container">
              <div className="glass-frost rounded-[100px] border-white/10 p-20 md:p-40 relative overflow-hidden group shadow-[0_80px_160px_-40px_rgba(0,0,0,1)]">
                 <div className="absolute -top-60 -right-60 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                 <div className="grid lg:grid-cols-2 gap-40 items-center relative z-10">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                       <div className="inline-flex items-center gap-5 px-8 py-3 rounded-full bg-blue-600/10 border border-blue-500/30 mb-16 shadow-2xl">
                          <Zap className="w-7 h-7 text-blue-500 animate-pulse" />
                          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500">OPERATIONAL SUPERIORITY</span>
                       </div>
                       <h2 className="text-5xl sm:text-7xl md:text-[clamp(3.5rem,9vw,10rem)] font-black tracking-tighter mb-12 leading-[0.8] text-white uppercase italic">
                          Designed for <br /><span className="text-gradient-blue italic">Impact.</span>
                       </h2>
                       <p className="text-3xl text-white/30 mb-24 font-medium tracking-tight leading-relaxed max-w-2xl italic">
                          We've eliminated the cognitive load of wealth management. 
                          The result is pure, unadulterated financial performance for the high-tier operator.
                       </p>
                       <div className="flex gap-24">
                          <div>
                             <p className="text-7xl font-black tracking-tighter text-white mb-4 italic">0.02s</p>
                             <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.6em]">Sync Latency</p>
                          </div>
                          <div>
                             <p className="text-7xl font-black tracking-tighter text-emerald-500 mb-4 italic">100%</p>
                             <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.6em]">Encrypted</p>
                          </div>
                       </div>
                    </motion.div>
                    <div className="relative group">
                       <div className="aspect-square bg-white/[0.03] rounded-[80px] p-3 backdrop-blur-3xl border border-white/10 hover:scale-[1.02] transition-transform duration-1000 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.9)] relative overflow-hidden">
                          <div className="w-full h-full border border-white/5 rounded-[72px] bg-[#020205]/80 relative overflow-hidden flex items-center justify-center p-32">
                             <div className="relative text-center z-10">
                                <motion.div 
                                  animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
                                  transition={{ duration: 8, repeat: Infinity }}
                                  className="w-40 h-40 bg-blue-600/10 rounded-[48px] flex items-center justify-center mx-auto mb-20 border border-blue-500/20 shadow-[0_40px_80px_-15px_rgba(37,99,235,0.4)] ring-8 ring-blue-500/5"
                                >
                                   <Trophy className="w-20 h-20 text-blue-500" />
                                </motion.div>
                                <div className="space-y-10">
                                   <div className="w-96 h-4 bg-white/10 rounded-full mx-auto" />
                                   <div className="w-64 h-3.5 bg-white/5 rounded-full mx-auto opacity-50" />
                                </div>
                             </div>
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] bg-blue-600/[0.03] blur-[150px] -z-10 animate-pulse" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Global Terminal Activation */}
        <section className="py-40 relative">
           <div className="section-container text-center">
              <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
                 <p className="text-blue-500 font-black tracking-[1.5em] uppercase mb-20 text-sm italic">Terminal Deployment Phase 04</p>
                  <h2 className="text-[clamp(2.5rem,12vw,12rem)] font-black tracking-[-0.1em] leading-[0.75] mb-24 text-white hover:tracking-[-0.08em] transition-all duration-1000 cursor-default uppercase italic select-none">
                     EXPERIENCE <br />
                     <span className="text-gradient-blue italic">ASCENSION.</span>
                  </h2>
                 <Button 
                   size="lg"
                   onClick={handleLogin}
                   className="h-40 rounded-[64px] px-32 bg-white text-black hover:bg-white/90 text-4xl font-black uppercase tracking-tighter click-scale shadow-[0_80px_160px_-20px_rgba(255,255,255,0.3)] border-none group relative overflow-hidden"
                 >
                   <span className="relative z-10 flex items-center">
                     Launch Interface
                     <ChevronRight className="w-14 h-14 ml-10 group-hover:translate-x-6 transition-transform duration-500" />
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                 </Button>
              </motion.div>
           </div>
        </section>

        {/* Architectural Footer */}
        <footer className="section-container border-t border-white/5 py-40 mt-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-32 items-start mb-40">
              <div className="col-span-1 md:col-span-2">
                 <div className="flex items-center gap-8 mb-12">
                    <div className="w-20 h-20 rounded-[32px] bg-white text-black flex items-center justify-center font-black text-4xl shadow-2xl">F</div>
                    <span className="text-5xl font-black tracking-tighter uppercase text-white italic">FINANCE GLOW <span className="text-white/10">OS 2.0</span></span>
                 </div>
                 <p className="text-white/20 text-2xl font-medium max-w-md leading-relaxed mb-12 italic tracking-tight">
                    The defining interface for multi-generational capital autonomy and autonomous wealth architecture.
                 </p>
                 <div className="flex gap-10">
                    {['X', 'TG', 'DC'].map(s => (
                       <div key={s} className="w-16 h-16 rounded-[24px] border border-white/5 bg-white/[0.01] flex items-center justify-center text-xs font-black text-white/20 hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-600/10 cursor-pointer transition-all duration-500 shadow-xl">{s}</div>
                    ))}
                 </div>
              </div>
              
              <div className="space-y-8">
                 <h4 className="text-[11px] font-black text-white/60 uppercase tracking-[0.5em] mb-12 italic">Infrastructure</h4>
                 {['Syndicate', 'Protocols', 'Security', 'Uptime'].map(link => (
                    <a key={link} href="#" className="block text-2xl font-black text-white/10 hover:text-white transition-all uppercase tracking-tighter italic">{link}</a>
                 ))}
              </div>

              <div className="space-y-10 text-right">
                 <h4 className="text-[11px] font-black text-white/60 uppercase tracking-[0.5em] mb-12 italic">Operational Status</h4>
                 <div className="inline-flex items-center gap-5 px-8 py-3 rounded-full bg-emerald-500/5 border border-emerald-500/30 shadow-2xl">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                    <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.5em]">Global Core Active</span>
                 </div>
              </div>
           </div>
           
           <div className="flex flex-col md:flex-row justify-between items-center gap-12 border-t border-white/5 pt-20">
              <p className="text-white/5 text-[11px] font-black tracking-[0.5em] uppercase italic">© 2026 GLOBAL WEALTH ARCHITECTURE. NO RIGHTS RESERVED.</p>
              <div className="flex gap-20">
                 {['Privacy', 'Legal', 'Ethos'].map(l => (
                    <a key={l} href="#" className="text-[11px] font-black text-white/10 hover:text-blue-500 uppercase tracking-[0.5em] transition-colors italic">{l}</a>
                 ))}
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
}
