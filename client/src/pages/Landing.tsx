import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Menu, 
  Wallet, 
  Zap, 
  Trophy, 
  MessageCircle, 
  TrendingUp, 
  Shield, 
  Heart
} from "lucide-react";
import { ShinyText } from "@/components/ShinyText";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#64CEFB]/30 relative font-['Inter'] overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full bg-black overflow-hidden group/hero">
        {/* Background Video */}
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

        {/* Content Overlay */}
        <div className="relative z-10 w-full h-full flex flex-col items-center">
          
          {/* Navigation Bar */}
          <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight font-display">Pocket Fund</span>
            </div>

            <div className="flex items-center gap-6">
              <button onClick={handleLogin} className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                Sign in
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </nav>

          {/* Main Hero Content - Scaled Down for Elegance */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl space-y-10"
            >
              <div className="space-y-4">
                <motion.span 
                  className="text-[#64CEFB] text-[10px] md:text-xs font-black uppercase tracking-[0.6em] block opacity-80"
                >
                  REIMAGINE YOUR WEALTH
                </motion.span>
                
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase"
                >
                  <div className="text-white">Take Control Of</div>
                  <ShinyText text="Your Financial Future" />
                </motion.h1>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 pt-4">
                <p className="text-white/40 text-[10px] md:text-sm max-w-[240px] leading-relaxed font-medium">
                  Your money should work as hard as you do. Build wealth without the stress.
                </p>
                <div className="hidden md:block w-px h-10 bg-white/10" />
                <div className="space-y-1">
                  <p className="text-white/80 text-[10px] md:text-xs font-black uppercase tracking-widest">
                    50,000+ Savers & Investors
                  </p>
                  <p className="text-[#64CEFB] text-[9px] font-bold uppercase tracking-widest opacity-60">Verified Community</p>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="pt-6"
              >
                <Button 
                  onClick={handleLogin}
                  className="bg-white text-black hover:bg-white/90 rounded-full px-12 py-7 text-sm font-black uppercase tracking-widest group transition-all active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.15)]"
                >
                  Initialize Journey
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- REMAINDER OF PAGE (Synced Scale) --- */}

      {/* Feature Split Section */}
      <section className="container mx-auto px-6 py-40 relative">
         <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="relative max-w-6xl mx-auto"
         >
            <div className="absolute inset-0 bg-[#64CEFB]/5 blur-[200px] -z-10" />
            <div className="rounded-[48px] border border-white/5 bg-[#080808] overflow-hidden shadow-2xl p-8 md:p-20">
               <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div className="space-y-12">
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#64CEFB]/5 border border-[#64CEFB]/10">
                        <Heart className="w-3.5 h-3.5 text-[#64CEFB]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#64CEFB]">Financial Clarity</span>
                     </div>
                     <h3 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">One Interface. <br /> Absolute Mastery.</h3>
                     <p className="text-lg text-white/30 font-medium leading-relaxed max-w-md">Ditch the legacy spreadsheets. Experience a fluid, real-time ledger that respects your time and intelligence.</p>
                     
                     <div className="space-y-8">
                        {[
                          { icon: Zap, label: "Instant Ledger Entry", desc: "Log activity in 2 seconds" },
                          { icon: Shield, label: "Vault Protection", desc: "Automated wealth isolation" },
                          { icon: Trophy, label: "Growth Milestones", desc: "Unlock tier-based rewards" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-5 group cursor-pointer transition-all">
                             <div className={`w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all group-hover:bg-[#64CEFB]/10 group-hover:border-[#64CEFB]/20`}>
                                <item.icon className="w-5 h-5 text-white/40 group-hover:text-[#64CEFB]" />
                             </div>
                             <div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-white/80">{item.label}</h4>
                                <p className="text-[10px] text-white/30 mt-1 uppercase font-bold tracking-tight">{item.desc}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="relative group/card">
                     <div className="aspect-[4/5] bg-gradient-to-br from-white/[0.02] to-transparent border border-white/10 rounded-[64px] p-12 flex flex-col justify-between shadow-2xl transition-transform group-hover/card:scale-[1.02] duration-700">
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">Global Reserve</p>
                              <p className="text-5xl font-black tracking-tighter tabular-nums drop-shadow-lg">₹4,52,000</p>
                           </div>
                           <div className="w-16 h-16 rounded-3xl bg-[#64CEFB]/10 border border-[#64CEFB]/20 flex items-center justify-center">
                              <TrendingUp className="w-8 h-8 text-[#64CEFB]" />
                           </div>
                        </div>
                        <div className="h-56 w-full bg-[#64CEFB]/[0.02] rounded-[40px] border border-white/5 flex items-end p-8 overflow-hidden relative">
                           <div className="w-full flex justify-between items-end h-full gap-2.5">
                              {[30, 45, 60, 40, 80, 55, 90, 70, 100].map((h, i) => (
                                <motion.div 
                                  key={i} 
                                  initial={{ height: 0 }}
                                  whileInView={{ height: `${h}%` }}
                                  transition={{ duration: 1, delay: i * 0.05, ease: "circOut" }}
                                  className="flex-1 bg-gradient-to-t from-[#64CEFB]/20 to-[#64CEFB]/80 rounded-t-sm" 
                                />
                              ))}
                           </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black text-white/5 uppercase tracking-[0.6em] px-4">
                           <span>Q1</span>
                           <span>Q2</span>
                           <span>Q3</span>
                           <span>Q4</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </motion.div>
      </section>

      {/* Simplified Triple Pillar */}
      <section className="py-20 sm:py-32 container mx-auto px-6 border-y border-white/5 bg-[#020202]">
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
           {[
             {
               icon: Zap,
               title: "High-Freq Entry",
               desc: "Engineered for speed. Log transactions at the speed of thought."
             },
             {
               icon: Trophy,
               title: "Loyalty Tiers",
               desc: "Earn XP for every discipline action and unlock premium badges."
             },
             {
               icon: MessageCircle,
               title: "Neural Assist",
               desc: "AI-driven heuristics to prevent spending leaks and optimize growth."
             }
           ].map((item, i) => (
             <div key={i} className="space-y-8 p-6 group">
               <div className="w-14 h-14 rounded-2xl bg-[#64CEFB]/5 border border-[#64CEFB]/10 flex items-center justify-center group-hover:scale-110 transition-all">
                  <item.icon className="w-7 h-7 text-[#64CEFB] opacity-60 group-hover:opacity-100" />
               </div>
               <h3 className="text-xl font-black tracking-tight uppercase">{item.title}</h3>
               <p className="text-white/30 leading-relaxed font-medium text-sm">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="container mx-auto px-6 py-32 relative z-10 text-center space-y-12">
         <div className="flex items-center justify-center gap-3">
            <div className="w-7 h-7 rounded-sm border-2 border-white/20 flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white uppercase font-display">Pocket Fund</span>
         </div>
         <div className="flex flex-wrap items-center justify-center gap-12">
            {['Privacy', 'Security', 'Compliance', 'Contact'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-[#64CEFB] transition-all">{item}</a>
            ))}
         </div>
         <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/5 pt-10 border-t border-white/5">© 2026 Architectural Capital. Verified Secure.</p>
      </footer>
    </div>
  );
}
