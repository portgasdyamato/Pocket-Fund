import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  ArrowUpRight,
  TrendingUp, 
  Wallet, 
  Shield, 
  Sparkles, 
  Globe,
  Zap,
  Cpu,
  Lock,
  MessageCircle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Trophy,
  Star
} from "lucide-react";
import { useRef } from "react";

const ArchitecturalLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
    <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-primary/50 via-transparent to-transparent" />
    <div className="absolute top-0 left-2/4 w-px h-full bg-white/5" />
    <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-white/10 via-transparent to-transparent" />
    <div className="absolute left-0 top-1/4 h-px w-full bg-white/5" />
    <div className="absolute left-0 top-2/4 h-px w-full bg-white/5" />
    <div className="absolute left-0 top-3/4 h-px w-full bg-white/5" />
  </div>
);

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative font-['Inter']">
      <ArchitecturalLines />
      
      {/* Precision Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.03] backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-white overflow-hidden flex items-center justify-center">
                 <Wallet className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-black tracking-tight uppercase font-['Space_Grotesk']">Pocket Fund</span>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-6">
              {['Vault', 'Coach', 'Network', 'Library'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={handleLogin}
               className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
             >
               Sign In
             </button>
             <button 
               onClick={handleLogin}
               className="bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-6 h-10 rounded-full hover:bg-white/90 transition-all active:scale-95 flex items-center gap-2"
             >
               Join The Ecosystem
               <ArrowUpRight className="w-3 h-3" />
             </button>
          </div>
        </div>
      </nav>

      {/* Hero: The Statement */}
      <section className="relative pt-40 pb-20 sm:pt-60 sm:pb-40 container mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Intelligence Protocols Active</span>
              </div>
              <h1 className="text-[ clamp(3rem,10vw,6rem)] font-black uppercase tracking-tighter leading-[0.9] font-['Space_Grotesk']">
                Redefining The <br />
                <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#fff,#fff,rgba(255,255,255,0.2))]">
                  Sovereign Budget
                </span>
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-2xl text-white/40 max-w-2xl font-medium leading-relaxed"
            >
              The world's first architectural financial ecosystem. 
              Precision-engineered to bridge the gap between intent and capital.
            </motion.p>
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.3 }}
               className="flex flex-col sm:flex-row items-center gap-4"
            >
               <Button onClick={handleLogin} size="lg" className="h-16 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs group">
                 Initialize Interface
                 <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
               </Button>
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-white/[0.05] flex items-center justify-center overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                   </div>
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-black bg-white/10 flex items-center justify-center text-[10px] font-black text-white/40">
                   +42k
                 </div>
               </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="space-y-8 text-right">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Ecosystem XP</p>
                <p className="text-3xl font-black font-['Space_Grotesk'] text-primary tabular-nums">1,240,492</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Network Uptime</p>
                <p className="text-3xl font-black font-['Space_Grotesk'] text-white tabular-nums">99.99%</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Capital Managed</p>
                <p className="text-3xl font-black font-['Space_Grotesk'] text-white tabular-nums">₹4.5Cr+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Grid: Features */}
      <section className="py-20 sm:py-40 border-t border-white/[0.03] relative z-10 bg-black/40">
        <div className="container mx-auto px-6">
          <div className="mb-20 space-y-4">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Core Infrastructure</p>
             <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase font-['Space_Grotesk']">
               Engineered <br />For Performance.
             </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05] border border-white/[0.05] rounded-[32px] overflow-hidden">
            {[
              {
                icon: Zap,
                title: "Active Staging",
                desc: "Real-time ledger processing with multi-category intelligence.",
                tag: "HIGH-FIDELITY"
              },
              {
                icon: Shield,
                title: "Vault Consensus",
                desc: "Secure fund isolation in high-yield liquid mutual fund reserves.",
                tag: "PROTECTED"
              },
              {
                icon: Cpu,
                title: "Gemini Protocol",
                desc: "24/7 AI-driven behavioral analysis and financial coaching.",
                tag: "INTELLIGENT"
              },
              {
                icon: Globe,
                title: "Global Ledger",
                desc: "Cross-platform transaction synchronization and insights.",
                tag: "CORE"
              },
              {
                icon: Trophy,
                title: "Legacy Ranking",
                desc: "Gamified achievement systems designed for wealth discipline.",
                tag: "SOCIAL"
              },
              {
                icon: Lock,
                title: "Biometric Auth",
                desc: "Tier-1 security protocols for all vault-access requests.",
                tag: "SECURE"
              }
            ].map((f, i) => (
              <div key={i} className="bg-[#050505] p-8 sm:p-12 hover:bg-white/[0.02] transition-colors group">
                 <div className="mb-6 flex justify-between items-start">
                   <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/20 transition-all">
                     <f.icon className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{f.tag}</span>
                 </div>
                 <h3 className="text-xl font-black uppercase tracking-tight mb-4 font-['Space_Grotesk']">{f.title}</h3>
                 <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors uppercase tracking-tight line-clamp-2">
                   {f.desc}
                 </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive Visual: The UI Mockup */}
      <section className="py-20 sm:py-40 relative z-10 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="relative group">
            {/* Architectural Frame */}
            <div className="absolute inset-0 bg-primary/20 blur-[200px] opacity-20 pointer-events-none" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[40px] border border-white/10 bg-black overflow-hidden shadow-2xl p-2"
            >
               <div className="rounded-[38px] border border-white/5 overflow-hidden aspect-[16/9] bg-[#0A0A0B] flex items-center justify-center">
                  {/* Dynamic Mockup Content */}
                  <div className="w-full h-full p-8 sm:p-16 flex flex-col gap-8">
                     <div className="flex justify-between items-start">
                        <div className="space-y-4">
                           <div className="w-40 h-8 bg-white/5 rounded-full animate-pulse" />
                           <div className="flex gap-4">
                              <div className="w-24 h-4 bg-white/5 rounded-full" />
                              <div className="w-24 h-4 bg-white/5 rounded-full" />
                           </div>
                        </div>
                        <div className="flex gap-3">
                           <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/20" />
                           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5" />
                        </div>
                     </div>
                     <div className="mt-auto grid grid-cols-3 gap-6">
                        <div className="h-32 rounded-3xl bg-white/[0.02] border border-white/5" />
                        <div className="col-span-2 h-32 rounded-3xl bg-primary/10 border border-primary/20 p-8 flex items-center justify-between">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                                 <Cpu className="w-8 h-8 text-white" />
                              </div>
                              <div className="space-y-2">
                                 <div className="w-32 h-3 bg-white/40 rounded-full" />
                                 <div className="w-24 h-3 bg-white/20 rounded-full" />
                              </div>
                           </div>
                           <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                              <ArrowRight className="w-5 h-5" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gamification: The Arena */}
      <section id="network" className="py-20 sm:py-40 bg-white/[0.02] border-y border-white/[0.03] relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
             <div className="flex-1 space-y-10">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Competitive Capital</span>
               <h2 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase font-['Space_Grotesk'] leading-[0.9]">
                 The Arena <br />
                 Of Wealth.
               </h2>
               <p className="text-xl text-white/40 leading-relaxed font-medium">
                 Your finances are no longer static. Every transaction is a move. 
                 Every saving is an upgrade. Win the game of personal capital with 
                 our verified milestone protocol.
               </p>
               <div className="space-y-4">
                 {[
                   'Earn XP for disciplinary spending habits',
                   'Unlock Tier-1 badges for vault consistency',
                   'Global leaderboard for ecosystem optimization',
                   'Real-time challenge triggers based on behavior'
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 group">
                      <div className="w-5 h-5 rounded-full border border-primary/40 flex items-center justify-center group-hover:bg-primary transition-all">
                        <CheckCircle2 className="w-3 h-3 text-primary group-hover:text-white" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{item}</span>
                   </div>
                 ))}
               </div>
             </div>
             
             <div className="flex-1 w-full grid grid-cols-2 gap-4">
                <motion.div initial={{ y: 20 }} whileInView={{ y: 0 }} className="space-y-4">
                   <div className="h-64 rounded-[32px] bg-primary p-8 flex flex-col justify-between">
                      <Trophy className="w-10 h-10 text-white" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Top Performer</p>
                        <p className="text-2xl font-black font-['Space_Grotesk'] tracking-tighter">GOLD TIER</p>
                      </div>
                   </div>
                   <div className="h-40 rounded-[32px] bg-white/[0.05] border border-white/5 p-8 flex items-center justify-center">
                      <Star className="w-10 h-10 text-white/20" />
                   </div>
                </motion.div>
                <motion.div initial={{ y: -20 }} whileInView={{ y: 0 }} className="space-y-4 pt-12">
                   <div className="h-40 rounded-[32px] bg-white/[0.05] border border-white/5 p-8 flex items-center justify-center">
                      <Zap className="w-10 h-10 text-white/20" />
                   </div>
                   <div className="h-64 rounded-[32px] bg-accent p-8 flex flex-col justify-between">
                      <Cpu className="w-10 h-10 text-white" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/60">AI Sync Status</p>
                        <p className="text-2xl font-black font-['Space_Grotesk'] tracking-tighter text-white">OPTIMIZED</p>
                      </div>
                   </div>
                </motion.div>
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA: Initialize */}
      <section className="py-40 sm:py-60 relative z-10">
         <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
               <h2 className="text-6xl sm:text-9xl font-black tracking-tighter uppercase font-['Space_Grotesk'] leading-[0.8] text-center">
                 Join The <br />
                 <span className="text-transparent border-b-4 border-primary pb-4 bg-clip-text bg-[linear-gradient(to_bottom,#fff,#6366f1)]">Standard.</span>
               </h2>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-20">
                  <Button onClick={handleLogin} size="lg" className="h-20 px-16 rounded-[24px] bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-white/90 transition-all premium-shadow-white click-scale">
                    Initialize Your Account
                  </Button>
                  <Button onClick={handleLogin} variant="outline" size="lg" className="h-20 px-16 rounded-[24px] border-white/10 bg-transparent text-white font-black uppercase tracking-widest text-sm hover:bg-white/[0.05] transition-all">
                    Request Integration
                  </Button>
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-12">
                 Powered by Gemini AI Engine • ISO 27001 Compliant • Ver. 2.0.4 - Release Alpha
               </p>
            </motion.div>
         </div>
      </section>

      {/* Minimal Footer */}
      <footer className="container mx-auto px-6 py-20 border-t border-white/5 relative z-10">
         <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="w-6 h-6 rounded bg-white overflow-hidden flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-black" />
               </div>
               <span className="text-sm font-black tracking-tight uppercase font-['Space_Grotesk']">Pocket Fund</span>
            </div>
            
            <div className="flex gap-8">
               {['Security', 'Protocols', 'Legal', 'Privacy'].map(item => (
                 <a key={item} href="#" className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">{item}</a>
               ))}
            </div>
            
            <p className="text-[9px] font-black uppercase tracking-widest text-white/10">© 2026 Architectural Capital Systems LP.</p>
         </div>
      </footer>
    </div>
  );
}
