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
  Mic,
  PieChart,
  BarChart3,
  CreditCard,
  ChevronRight
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
    <div ref={containerRef} className="min-h-screen bg-[#020205] text-white selection:bg-blue-500/30 relative overflow-hidden font-[Inter,sans-serif]">
      {/* Mesh Background */}
      <div className="fixed inset-0 z-0 bg-mesh opacity-40 pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(37,99,235,0.15),transparent_50%)] pointer-events-none" />
      
      {/* Interactive Glow */}
      <div className="mouse-glow fixed w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-0 lg:opacity-100" />

      {/* Noise Texture */}
      <div className="fixed inset-0 z-[1] opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Auth Error Banner */}
      {authError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6">
          <div className="glass-card bg-rose-500/10 border-rose-500/30 p-6 rounded-[24px] backdrop-blur-3xl flex flex-col gap-2 shadow-2xl animate-slideUp">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center">
                   <Lock className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-black text-rose-400 text-sm tracking-widest uppercase">Encryption Error</h4>
             </div>
             <p className="text-white/60 text-sm font-medium">{errorMessages[authError] || authError}</p>
          </div>
        </div>
      )}

      {/* Elite Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.03] bg-[#020205]/40 backdrop-blur-2xl">
        <nav className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-700">
               <Wallet className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">FINANCE<span className="text-blue-500">GLOW</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={handleLogin} className="text-xs font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors py-4">Intelligence login</button>
            <Button 
              onClick={handleLogin}
              className="bg-white text-black hover:bg-white/90 rounded-2xl h-14 px-8 font-black text-[10px] tracking-[0.2em] uppercase click-scale shadow-2xl shadow-white/5"
            >
              Access Engine
            </Button>
          </div>
        </nav>
      </header>

      <main className="relative z-10 pt-48">
        {/* Dynamic Hero */}
        <section className="container mx-auto px-6 text-center mb-60">
          <div className="max-w-6xl mx-auto" ref={heroRef}>
             <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-md mb-12 animate-pulse-subtle">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Next-Gen Wealth Management Architecture</span>
             </div>

             <h1 className="hero-title text-7xl sm:text-8xl md:text-[160px] font-black tracking-[-0.05em] leading-[0.8] mb-12 flex flex-col items-center">
                <span className="hero-title-text inline-block">BEYOND</span>
                <span className="hero-title-text text-gradient inline-block">TRADITION.</span>
             </h1>

             <p className="hero-sub text-xl md:text-2xl text-white/40 mb-16 max-w-3xl mx-auto leading-relaxed font-medium tracking-tight">
                The world's most sophisticated financial OS. 
                Experience cinematic analytics and AI-driven growth vectors.
             </p>

             <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-8">
                <Button 
                  size="lg"
                  onClick={handleLogin}
                  className="h-24 rounded-3xl px-16 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl tracking-tighter click-scale shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)]"
                >
                  Initiate System
                  <ArrowRight className="w-6 h-6 ml-4" />
                </Button>
                <div className="flex items-center gap-8">
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020205] bg-white/10" />)}
                   </div>
                   <div className="text-left">
                      <p className="text-xl font-black tracking-tighter">12,403</p>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Active Units</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Cinematic Dashboard Preview */}
          <div className="mt-40 relative max-w-7xl mx-auto">
             <div className="absolute inset-0 bg-blue-600/10 blur-[160px] rounded-full scale-110 opacity-50" />
             <div className="relative rounded-[48px] border border-white/5 bg-[#050508] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden group">
                <div className="rounded-[36px] bg-[#0A0A0F] border border-white/5 aspect-[21/9] overflow-hidden flex flex-col p-12">
                   <div className="flex justify-between items-center mb-12">
                      <div className="space-y-4">
                         <div className="w-48 h-3 bg-white/10 rounded-full" />
                         <div className="w-72 h-12 bg-white/20 rounded-2xl" />
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10" />
                   </div>
                   <div className="grid grid-cols-4 gap-8 flex-1">
                      <div className="col-span-2 bg-gradient-to-br from-white/[0.03] to-transparent rounded-[32px] border border-white/5 p-8">
                         <div className="w-full h-full bg-blue-600/5 rounded-2xl border border-blue-500/10 animate-pulse-subtle" />
                      </div>
                      <div className="bg-white/[0.02] rounded-[32px] border border-white/5" />
                      <div className="bg-white/[0.02] rounded-[32px] border border-white/5" />
                   </div>
                </div>
                
                {/* Floating Micro-UI Cards */}
                <div className="absolute top-20 -right-12 w-80 glass-card p-8 rounded-[32px] float-card hidden xl:block border-white/10">
                   <div className="flex items-center gap-5 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                         <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black tracking-widest text-white/20 uppercase">Network Flow</p>
                         <p className="text-2xl font-black text-emerald-400">+128.4%</p>
                      </div>
                   </div>
                   <div className="space-y-2">
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ width: ['20%', '90%', '20%'] }} transition={{ duration: 10, repeat: Infinity }} className="h-full bg-emerald-400" />
                       </div>
                   </div>
                </div>

                <div className="absolute bottom-20 -left-12 w-80 glass-card p-8 rounded-[32px] float-card hidden xl:block border-white/10">
                   <div className="flex items-center gap-5 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                         <Target className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] font-black tracking-widest text-white/20 uppercase">Mission Status</p>
                         <p className="text-lg font-black text-white uppercase tracking-tighter">Elite Stabilized</p>
                      </div>
                   </div>
                   <div className="flex gap-1.5">
                      {[1,1,1,1,1,0,0].map((v, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${v ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/5'}`} />
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Intelligence Grid */}
        <section className="py-60 bg-white/[0.01] border-y border-white/[0.02]">
           <div className="container mx-auto px-6">
              <div className="text-center mb-32 reveal-grid">
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 reveal-item">WORLD-CLASS UTILITIES.</h2>
                 <p className="text-xl text-white/30 max-w-2xl mx-auto font-medium tracking-tight reveal-item">
                    Architected for high-performance capital preservation and optimized growth.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {[
                   { icon: Target, title: "PRECISION ANALYTICS", desc: "Granular expense decomposition with millisecond categorization latency.", color: "text-blue-500" },
                   { icon: PieChart, title: "GENESIS INSIGHTS", desc: "Machine learning vectors that identify spending inefficiencies automatically.", color: "text-cyan-500" },
                   { icon: Lock, title: "CRYPTOGRAPHIC VAULT", desc: "Bank-grade isolation for your most sensitive financial declarations.", color: "text-indigo-500" },
                   { icon: Users, title: "SYNDICATE NETWORK", desc: "Benchmark your velocity against the top 1% of financial operators.", color: "text-emerald-500" },
                   { icon: Trophy, title: "STRATEGIC ACHIEVEMENTS", desc: "Gamified progression tiers that reward disciplined capital management.", color: "text-amber-500" },
                   { icon: BarChart3, title: "TRAJECTORY MAPPING", desc: "High-fidelity foresight models to visualize your wealth evolution.", color: "text-rose-500" }
                 ].map((item, i) => (
                    <div key={i} className="reveal-item">
                       <div className="glass-card p-12 h-full hover-lift group border-white/5 bg-white/[0.02] rounded-[40px]">
                          <div className={`w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700`}>
                             <item.icon className={`w-8 h-8 ${item.color}`} />
                          </div>
                          <h3 className="text-2xl font-black tracking-tight text-white mb-6 uppercase">{item.title}</h3>
                          <p className="text-white/40 leading-relaxed font-medium tracking-tight">{item.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Pro Showcase Tier */}
        <section className="py-60 relative">
           <div className="container mx-auto px-6">
              <div className="glass-card rounded-[64px] border-white/5 p-12 md:p-32 overflow-hidden relative group">
                 <div className="absolute inset-0 bg-blue-600/[0.02] pointer-events-none" />
                 <div className="grid lg:grid-cols-2 gap-32 items-center relative z-10">
                    <div>
                       <div className="inline-flex items-center gap-3 px-5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-10">
                          <Zap className="w-5 h-5 text-blue-500" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">OPERATIONAL EXCELLENCE</span>
                       </div>
                       <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[1]">
                          Engineered for <br /><span className="text-blue-500">Velocity.</span>
                       </h2>
                       <p className="text-xl text-white/40 mb-16 font-medium tracking-tight leading-relaxed">
                          We've removed the friction between your intent and your financial outcomes. 
                          The result is pure, unadulterated performance.
                       </p>
                       <div className="flex gap-16">
                          <div>
                             <p className="text-5xl font-black tracking-tighter mb-2">0.02s</p>
                             <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Latency Core</p>
                          </div>
                          <div>
                             <p className="text-5xl font-black tracking-tighter mb-2">100%</p>
                             <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Self-Custody</p>
                          </div>
                       </div>
                    </div>
                    <div className="relative">
                       <div className="aspect-square bg-white/[0.03] rounded-[48px] p-2 backdrop-blur-3xl border border-white/5 hover:scale-[1.05] transition-transform duration-1000">
                          <div className="w-full h-full border border-white/5 rounded-[40px] bg-[#020205] relative overflow-hidden flex items-center justify-center p-12">
                             <div className="relative text-center">
                                <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-blue-500/20 animate-pulse">
                                   <Trophy className="w-10 h-10 text-blue-500" />
                                </div>
                                <div className="space-y-4">
                                   <div className="w-64 h-2.5 bg-white/10 rounded-full" />
                                   <div className="w-40 h-2 bg-white/5 rounded-full mx-auto" />
                                </div>
                             </div>
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/5 blur-[100px] -z-10" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Exponential Call to Action */}
        <section className="py-80 relative overflow-hidden">
           <div className="container mx-auto px-6 text-center">
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                 <p className="text-blue-500 font-black tracking-[0.4em] uppercase mb-12 text-sm">Deployment Ready</p>
                 <h2 className="text-8xl md:text-[200px] font-black tracking-[-0.08em] leading-none mb-20 text-white group cursor-default">
                    MASTER THE <br />
                    <span className="text-gradient hover:blur-[2px] transition-all duration-700">GLOW UP.</span>
                 </h2>
                 <Button 
                   size="lg"
                   onClick={handleLogin}
                   className="h-28 rounded-[32px] px-20 bg-white text-black hover:bg-white/90 text-2xl font-black uppercase tracking-tighter click-scale shadow-[0_40px_80px_-10px_rgba(255,255,255,0.1)] group"
                 >
                   Launch Interface
                   <ChevronRight className="w-8 h-8 ml-6 group-hover:translate-x-2 transition-transform" />
                 </Button>
              </motion.div>
           </div>
           
           {/* Visual Flourish */}
           <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
           <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />
        </section>

        {/* Global Footer */}
        <footer className="container mx-auto px-6 py-24 border-t border-white/[0.03]">
           <div className="flex flex-col md:flex-row items-center justify-between gap-16">
              <div className="flex items-center gap-5">
                 <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-black">F</div>
                 <span className="text-lg font-black tracking-tighter uppercase">FINANCE GLOW <span className="text-white/20">v2.0</span></span>
              </div>
              
              <div className="flex gap-12">
                 {['SYNDICATE', 'PROTOCOLS', 'OPERATIONS', 'SECURE'].map(link => (
                    <a key={link} href="#" className="text-[10px] font-black tracking-[0.3em] text-white/20 hover:text-white transition-colors">{link}</a>
                 ))}
              </div>
              
              <p className="text-white/10 text-[10px] font-bold tracking-widest uppercase italic">© 2026 GLOBAL WEALTH INFRASTRUCTURE. ALL RIGHTS RESERVED.</p>
           </div>
        </footer>
      </main>
    </div>
  );
}


