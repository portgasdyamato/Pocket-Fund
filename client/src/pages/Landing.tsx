import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Wallet, 
  Zap, 
  Trophy, 
  MessageCircle, 
  TrendingUp, 
  Shield, 
  Heart,
  ChevronRight,
  Sparkles,
  PieChart as PieChartIcon,
  Activity,
  Target
} from "lucide-react";
import { ShinyText } from "@/components/ShinyText";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#64CEFB]/30 relative font-['Inter'] overflow-x-hidden">
      
      {/* --- HERO SECTION (High-Fidelity) --- */}
      <section className="relative h-screen w-full bg-black overflow-hidden group/hero">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 scale-105"
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4" 
            type="video/mp4" 
          />
        </video>

        <div className="relative z-10 w-full h-full flex flex-col items-center">
          <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight font-display">Pocket Fund</span>
            </div>
            <button onClick={handleLogin} className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all group">
              Sign in
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </nav>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl space-y-10"
            >
              <div className="space-y-4">
                <span className="text-[#64CEFB] text-[10px] md:text-xs font-black uppercase tracking-[0.6em] block opacity-80">REIMAGINE YOUR WEALTH</span>
                <motion.h1 
                   className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase"
                >
                  <div className="text-white">Take Control Of</div>
                  <ShinyText text="Your Financial Future" />
                </motion.h1>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 pt-4">
                <p className="text-white/40 text-[10px] md:text-sm max-w-[240px] leading-relaxed font-medium">Your money should work as hard as you do. Build wealth without the stress.</p>
                <div className="hidden md:block w-px h-10 bg-white/10" />
                <div className="space-y-1">
                  <p className="text-white/80 text-[10px] md:text-xs font-black uppercase tracking-widest">50,000+ Savers & Investors</p>
                  <p className="text-[#64CEFB] text-[9px] font-bold uppercase tracking-widest opacity-60">Verified Community</p>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                   onClick={handleLogin}
                   className="bg-white text-black hover:bg-white/90 rounded-full px-12 py-7 text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.15)]"
                >
                  Start Now
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- REIMAGINED EXHIBIT: CORE FEATURES --- */}
      <section className="py-20 sm:py-40 relative z-10 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="mb-24 space-y-4 max-w-2xl">
             <span className="text-[#64CEFB] text-[10px] font-black uppercase tracking-[0.4em]">Protocol 01: Core Systems</span>
             <h2 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase font-display leading-[0.85]">
               Engineered <br />For Mastery.
             </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-[2rem]">
            <div className="lg:col-span-7 bg-[#050505] p-12 sm:p-20 flex flex-col justify-between group">
               <div className="space-y-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#64CEFB]/10 group-hover:border-[#64CEFB]/20 transition-all">
                     <Activity className="w-6 h-6 text-[#64CEFB]" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight">Active Ledger Intelligence</h3>
                  <p className="text-lg text-white/40 font-medium leading-relaxed max-w-md">No more delayed syncing. Your finances update in real-time with automatic category resolution and behavioral insights.</p>
               </div>
               <div className="mt-12 pt-12 border-t border-white/5 flex gap-8">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-2">Process Speed</h4>
                    <p className="text-xl font-black">2.4s Average</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-2">Sync Accuracy</h4>
                    <p className="text-xl font-black">99.9%</p>
                  </div>
               </div>
            </div>
            
            <div className="lg:col-span-5 grid grid-rows-2">
               <div className="bg-[#080808] p-12 border-b border-white/5 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all">
                     <Target className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-xl font-black uppercase mb-4">Goal Architect</h4>
                  <p className="text-sm text-white/30 font-medium tracking-tight uppercase leading-relaxed">Precision goal tracking with automated vault allocation based on your spending patterns.</p>
               </div>
               <div className="bg-[#0A0A0A] p-12 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all">
                     <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <h4 className="text-xl font-black uppercase mb-4">Vault CONSENSUS</h4>
                  <p className="text-sm text-white/30 font-medium tracking-tight uppercase leading-relaxed">Tier-1 security encryption for all movement between your active ledger and protected vault.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- REIMAGINED EXHIBIT: THE VAULT --- */}
      <section className="py-40 relative bg-white/[0.01] border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
                <div className="absolute inset-0 bg-[#64CEFB]/10 blur-[150px] -z-10" />
                <div className="aspect-square bg-white/[0.02] border border-white/5 rounded-[4rem] p-4 group">
                    <div className="w-full h-full rounded-[3.5rem] bg-[#050505] border border-white/5 p-12 flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#64CEFB]/5 blur-3xl" />
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Vault Portfolio</p>
                              <p className="text-6xl font-black tracking-tighter">₹4,52,000</p>
                           </div>
                           <TrendingUp className="w-10 h-10 text-[#64CEFB]" />
                        </div>
                        <div className="h-40 w-full flex items-end gap-2.5">
                           {[20, 35, 25, 50, 45, 75, 60, 90, 80, 100].map((h, i) => (
                              <motion.div 
                                key={i} 
                                initial={{ height: 0 }}
                                whileInView={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.05 }}
                                className="flex-1 bg-gradient-to-t from-white/5 to-[#64CEFB]/40 rounded-t-sm" 
                              />
                           ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-12">
               <div className="space-y-4">
                  <span className="text-[#64CEFB] text-[10px] font-black uppercase tracking-[0.4em]">Protocol 02: Liquidity Protection</span>
                  <h3 className="text-5xl font-black tracking-tighter leading-none uppercase">The Vault <br /> Reserves.</h3>
               </div>
               <p className="text-xl text-white/40 leading-relaxed font-medium">Automatically isolate your savings into high-performance reserves. Out of sight, but constantly growing with behavioral triggers that save while you spend.</p>
               <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="space-y-2">
                     <p className="text-3xl font-black text-white">12.5%</p>
                     <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Avg. Monthly Yield</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-3xl font-black text-white">Secure</p>
                     <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Isolation Layer</p>
                  </div>
               </div>
            </div>
        </div>
      </section>

      {/* --- REIMAGINED CHAT: THE AI ADVISOR --- */}
      <section className="py-40 relative z-10 overflow-hidden">
        <div className="container mx-auto px-6 text-center mb-24 space-y-4">
           <span className="text-[#64CEFB] text-[10px] font-black uppercase tracking-[0.4em]">Protocol 03: Decision Intelligence</span>
           <h2 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase font-display leading-[0.85]">
             Your Personal <br /> Neural Coach.
           </h2>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="absolute inset-0 bg-[#64CEFB]/10 blur-[200px] -z-10" />
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-[#64CEFB]" />
              </div>
              <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[2rem] rounded-tl-none max-w-md shadow-xl">
                 <p className="text-base font-medium text-white/80 leading-relaxed">
                    Analyzing your weekend behavior... I noticed ₹3,400 in impulse spending at Global Mall. If we cut this by 20% next month, you'll hit your "MacBook" goal 3 weeks early. Shall we set a trigger?
                 </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-start gap-4 flex-row-reverse"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#64CEFB] flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-black" />
              </div>
              <div className="bg-[#64CEFB] p-6 rounded-[2rem] rounded-tr-none max-w-md shadow-2xl shadow-[#64CEFB]/20">
                 <p className="text-base font-black text-black leading-relaxed">
                    Yes, definitely! Let's set a ₹1,500 limit for shopping next weekend.
                 </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                 <Sparkles className="w-6 h-6 text-[#64CEFB]" />
              </div>
              <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[2rem] rounded-tl-none max-w-md shadow-xl">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#64CEFB]">Limit Optimized</span>
                 </div>
                 <p className="text-base font-medium text-white/80 leading-relaxed">
                    Trigger set. I'll alert you if you approach ₹1,200 on Saturday. Efficiency increased by 14%. Great move!
                 </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- MINIMAL FOOTER --- */}
      <footer className="container mx-auto px-6 py-32 mt-20 border-t border-white/5 text-center space-y-12 relative overflow-hidden">
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#64CEFB]/5 blur-[120px] -z-10" />
         <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-sm border-2 border-white/20 flex items-center justify-center">
               <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase font-display">Pocket Fund</span>
         </div>
         <div className="flex flex-wrap items-center justify-center gap-12">
            {['Privacy Protocol', 'Encryption Standard', 'Contact Authority', 'Legal Ledger'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-[#64CEFB] transition-all transform hover:scale-110">{item}</a>
            ))}
         </div>
         <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/5 pt-10">© 2026 Architectural Capital Systems. High-Performance Finance.</p>
      </footer>
    </div>
  );
}

function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
