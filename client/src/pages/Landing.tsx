import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
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
  Target,
  ArrowUpRight,
  Lock,
  ArrowDownRight,
  Fingerprint,
  BarChart3,
  Star,
  ShieldCheck,
  Layout,
  Clock,
  Gem,
  Mic,
  BrainCircuit,
  Settings,
  ShieldAlert,
  Coins,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  ArrowRightCircle
} from "lucide-react";
import { ShinyText } from "@/components/ShinyText";
import { useState, useRef } from "react";

const PREMIUM_EASE = [0.16, 1, 0.3, 1];

const BentoCard = ({ 
  children, 
  className, 
  title, 
  desc, 
  icon: Icon, 
  visual 
}: { 
  children?: React.ReactNode, 
  className?: string, 
  title: string, 
  desc: string, 
  icon: any,
  visual?: React.ReactNode
}) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.6, ease: PREMIUM_EASE }}
      className={`group relative rounded-[40px] bg-[#0A0A0A] border border-white/10 shadow-2xl transition-all duration-500 hover:bg-[#0F0F0F] hover:border-white/20 ${className}`}
      style={{ overflow: 'visible' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent rounded-[40px] pointer-events-none" />
      
      <div className="relative z-10 p-8 sm:p-12 h-full flex flex-col justify-between" style={{ overflow: 'visible' }}>
        <div className="space-y-6 sm:space-y-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-[#64CEFB]/10 group-hover:border-[#64CEFB]/40">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#64CEFB]" />
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight uppercase leading-none text-white font-display">{title}</h3>
            <p className="text-sm sm:text-base text-white/40 font-medium leading-relaxed max-w-[340px] group-hover:text-white/60 transition-colors">{desc}</p>
          </div>
        </div>
        
        <div className="mt-8 sm:mt-12 flex-1 flex flex-col justify-end min-h-[140px] sm:min-h-[180px] relative" style={{ overflow: 'visible' }}>
          {visual}
        </div>
      </div>
    </motion.div>
  );
};

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const [activeBar, setActiveBar] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#64CEFB]/30 relative overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative h-screen w-full bg-black overflow-hidden flex flex-col justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40"
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4" 
            type="video/mp4" 
          />
        </video>

        <div className="relative z-10 w-full flex flex-col items-center h-full">
          <nav className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 pt-6 sm:pt-10 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#64CEFB]/40 transition-all duration-500">
                <div className="w-2 h-2 bg-white rounded-full group-hover:bg-[#64CEFB] transition-colors" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight uppercase transition-opacity font-display">Pocket Fund</span>
            </div>
            <button onClick={handleLogin} className="text-white/30 hover:text-white text-[9px] font-bold uppercase tracking-[0.5em] transition-all px-4 py-2 rounded-full border border-transparent hover:border-white/5 hover:bg-white/[0.02]">SIGN IN</button>
          </nav>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 max-h-[85vh]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: PREMIUM_EASE }}
              className="max-w-6xl space-y-12"
            >
              <div className="space-y-6 sm:space-y-10">
                <span className="text-[#64CEFB] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.5em] px-5 py-2 rounded-full bg-[#64CEFB]/5 border border-[#64CEFB]/20 inline-block">
                  PERSONAL SAVINGS CO-PILOT
                </span>
                <motion.h1 className="text-4xl sm:text-7xl lg:text-[8.5rem] font-bold tracking-[-0.04em] leading-[0.9] uppercase font-display text-balance">
                  <div className="text-white/90">Master Your</div>
                  <ShinyText text="Money With Ease" />
                </motion.h1>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pt-6 px-6 sm:px-0">
                <p className="text-white/25 text-sm sm:text-base max-w-[440px] leading-relaxed font-medium text-balance">
                  Financial empathy meets smart technology. Track your expenses effortlessly, protect your stash in the vault, and grow with your AI savings buddy.
                </p>
                <div className="hidden md:block w-px h-14 bg-white/10" />
                <div className="space-y-2 text-center md:text-left">
                  <p className="text-white/10 text-[9px] font-bold uppercase tracking-[0.6em] whitespace-nowrap">STASHED SAFELY</p>
                  <p className="text-[#64CEFB] text-[18px] sm:text-[22px] font-bold tracking-tight uppercase tabular-nums">₹1.2CR+ SECURED</p>
                </div>
              </div>

              <div className="pt-12 sm:pt-16">
                <Button onClick={handleLogin} className="group relative bg-[#64CEFB] text-black hover:bg-[#4FB7E5] rounded-full px-10 sm:px-14 py-6 sm:py-8 text-xs sm:text-sm font-bold uppercase tracking-[0.4em] transition-all active:scale-95 shadow-[0_20px_40px_rgba(100,206,251,0.2)]">
                  Start Your Journey
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 sm:py-56 bg-black relative z-10 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-[1600px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* 1. Assistant Coach */}
            <BentoCard
              title="AI Assistant Coach"
              desc="Deep-learning advisor that monitors your patterns and provides real-time voice feedback to optimize your saving strategy."
              icon={Mic}
              className="md:col-span-2"
              visual={
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 pt-6 sm:pt-10 px-4 sm:px-6">
                  <div className="flex items-end gap-2 h-16">
                     {[30, 70, 45, 90, 55, 100, 35, 80, 50, 100, 70, 45, 85].map((h, i) => (
                       <motion.div 
                         key={i}
                         animate={{ height: [12, h, 12] }}
                         transition={{ duration: 2, repeat: Infinity, delay: i * 0.12 }}
                         className="w-2 bg-gradient-to-t from-[#64CEFB]/10 to-[#64CEFB]/60 rounded-full"
                         style={{ height: 12 }}
                       />
                     ))}
                  </div>
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#64CEFB] rounded-full animate-pulse" />
                        <span className="text-[11px] font-bold text-[#64CEFB] uppercase tracking-[0.4em]">NEURAL LINK ACTIVE</span>
                     </div>
                     <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest pl-4">Analyzing Spending Habits...</span>
                  </div>
                </div>
              }
            />

            {/* 2. Secure Vault */}
            <BentoCard
              title="Secure Stash Vault"
              desc="Tier-1 capital protection. Lock your long-term wealth behind a customized PIN-secure storage layer."
              icon={ShieldCheck}
              visual={
                <div className="relative h-48 w-full flex items-center justify-center overflow-visible">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,206,251,0.12)_0%,transparent_70%)] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="relative w-32 h-32 rounded-[2.5rem] bg-[#111111] border border-white/10 shadow-[0_0_60px_rgba(100,206,251,0.05)] flex flex-col items-center justify-center gap-4 group-hover:border-[#64CEFB]/50 transition-all duration-700 z-10">
                      <div className="grid grid-cols-3 gap-3">
                         {[1,2,3,4,5,6,7,8,9].map(i => (
                           <motion.div 
                             key={i} 
                             whileHover={{ scale: 1.5, backgroundColor: "#64CEFB" }}
                             className="w-1.5 h-1.5 rounded-full bg-white/10 transition-colors"
                           />
                         ))}
                      </div>
                      <div className="flex items-center gap-1.5">
                         <Lock className="w-3.5 h-3.5 text-[#64CEFB]" />
                         <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none">ENCRYPTED</span>
                      </div>
                   </div>
                </div>
              }
            />

            {/* 3. Daily Milestones */}
            <BentoCard
              title="Growth Rewards"
              desc="Collect premium tokens and verified badges for your financial discipline and consistency."
              icon={Coins}
              visual={
                <div className="flex gap-3 sm:gap-5 pt-6 sm:pt-8 px-4 sm:px-6 overflow-visible">
                   {[1, 2, 3].map(i => (
                     <motion.div 
                       key={i}
                       whileHover={{ y: -10, rotate: i === 3 ? 15 : -15 }}
                       className="w-16 h-16 rounded-[24px] flex items-center justify-center border border-white/10 bg-white/5 text-white/20 transition-all cursor-pointer relative hover:bg-[#64CEFB]/10 hover:border-[#64CEFB]/40 hover:text-[#64CEFB] hover:shadow-[0_0_30px_rgba(100,206,251,0.3)]"
                     >
                        <div className="absolute inset-0 rounded-[24px] blur-md bg-[#64CEFB]/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10">
                          {i === 1 ? <Target className="w-7 h-7" /> : i === 2 ? <Zap className="w-7 h-7" /> : <Gem className="w-7 h-7" />}
                        </div>
                     </motion.div>
                   ))}
                </div>
              }
            />

            {/* 4. Smart Insights */}
            <BentoCard
              title="Precision Data"
              desc="Interactive capital modeling that visualizes every rupee, revealing hidden saving opportunities automatically."
              icon={BarChart3}
              className="md:col-span-2"
              visual={
                <div className="h-40 sm:h-52 flex items-end justify-between gap-2 sm:gap-5 px-6 sm:px-12 w-full relative">
                   <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
                   {[35, 60, 45, 85, 55, 40, 75, 50, 95, 60].map((h, i) => (
                    <motion.div 
                      key={i}
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1.2, ease: PREMIUM_EASE, delay: i * 0.08 }}
                      className="flex-1 relative group/bar"
                    >
                       <motion.div 
                         animate={{ 
                           backgroundColor: activeBar === i ? "#64CEFB" : "rgba(100, 206, 251, 0.15)",
                           boxShadow: activeBar === i ? "0 0 30px rgba(100, 206, 251, 0.4)" : "none"
                         }}
                         className="h-full w-full rounded-t-md transition-all duration-300"
                       />
                       <AnimatePresence>
                         {activeBar === i && (
                           <motion.div 
                             initial={{ opacity: 0, y: 15, scale: 0.8 }}
                             animate={{ opacity: 1, y: -45, scale: 1 }}
                             exit={{ opacity: 0, y: 15, scale: 0.8 }}
                             className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-2xl text-[11px] font-bold uppercase tracking-tighter shadow-2xl whitespace-nowrap"
                           >
                              VALUE: ₹{h * 850}
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

      {/* FRIENDLY CHAT SECTION */}
      <section className="py-24 sm:py-56 bg-black relative z-10 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[#64CEFB]/[0.01] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-[1600px]">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
             <div className="flex-1 space-y-10 relative z-10">
               <h2 className="text-4xl sm:text-7xl lg:text-9xl font-bold tracking-[-0.04em] leading-[0.85] text-white uppercase font-display text-balance">
                 Your AI <br />
                 Savings Buddy.
               </h2>
               <p className="text-lg sm:text-2xl text-white/20 leading-relaxed font-medium max-w-xl text-balance">
                 Friendly, judgment-free advice that helps you save more without changing your lifestyle.
               </p>
               <div className="flex flex-wrap gap-3 sm:gap-4 pt-4">
                  <div className="px-6 py-2 bg-white/5 rounded-full border border-white/5 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">24/7 ADVISORY</div>
                  <div className="px-6 py-2 bg-white/5 rounded-full border border-white/5 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">PRIVACY SECURED</div>
               </div>
             </div>
             
             <div className="flex-1 w-full space-y-8 relative z-10">
                {[
                  { text: "Hey! You've stashed ₹2,000 more than usual this week. Huge win! 🏆", pos: "left", sender: "AI Coach" },
                  { text: "That's awesome! What's next for my savings goal?", pos: "right", sender: "You" },
                  { text: "Keep going! If you stash ₹500 more, you'll reach 50% of your new laptop goal.", pos: "left", sender: "AI Coach" }
                ].map((chat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: PREMIUM_EASE, delay: i * 0.15 }}
                    className={`flex flex-col ${chat.pos === 'left' ? 'items-start' : 'items-end'}`}
                  >
                    <div className={`flex items-center gap-2 mb-4 ${chat.pos === 'right' ? 'flex-row-reverse' : ''}`}>
                        {chat.pos === 'left' && <div className="w-1 h-1 rounded-full bg-[#64CEFB]/50" />}
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] font-display">{chat.sender}</span>
                     </div>
                     
                     <div className={`group relative px-6 sm:px-10 py-5 sm:py-8 rounded-[28px] max-w-[90%] sm:max-w-md text-sm sm:text-base leading-relaxed border transition-all duration-500 cursor-default
                        ${chat.pos === 'left' 
                          ? 'bg-white/[0.015] border-white/5 text-white/40 backdrop-blur-3xl hover:bg-white/[0.03] hover:border-white/10' 
                          : 'bg-white/[0.04] border-[#64CEFB]/20 text-white/80 backdrop-blur-3xl hover:border-[#64CEFB]/40 hover:bg-white/[0.06]'
                        }`}
                      >
                        {/* Subtle accent line for User bubbles */}
                        {chat.pos === 'right' && (
                          <div className="absolute top-0 right-0 w-10 h-px bg-gradient-to-l from-[#64CEFB]/40 to-transparent" />
                        )}
                        
                        <p className="font-medium tracking-tight">
                          {chat.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
            </div>
          </div>
        </section>
            {/* FOOTER */}
      <footer className="bg-[#050505] relative z-10 border-t border-white/5 overflow-hidden font-sans">
        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
        
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-[#64CEFB]/[0.015] blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-[1600px] pt-24 pb-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-16 mb-32">
               <div className="space-y-10">
                  <div className="flex items-center gap-4 group cursor-pointer">
                     <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#64CEFB]/40 transition-all duration-700 bg-black shadow-inner">
                        <div className="w-2.5 h-2.5 bg-white rounded-full group-hover:bg-[#64CEFB] transition-all duration-500 scale-100 group-hover:scale-125 shadow-[0_0_15px_#64CEFB]/0 group-hover:shadow-[0_0_15px_#64CEFB]/50" />
                     </div>
                     <span className="text-3xl font-bold tracking-tighter text-white uppercase font-display leading-none">Pocket Fund</span>
                  </div>
                  
                  <div className="max-w-md space-y-6">
                    <p className="text-white/20 text-sm sm:text-base leading-relaxed font-medium tracking-wide">
                       We are engineering the future of capital governance. High-performance tooling for the modern individual, without compromise.
                    </p>
                    <div className="flex items-center gap-8">
                       {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                         <motion.a 
                           key={i}
                           whileHover={{ y: -4, color: "#64CEFB" }}
                           href="#" 
                           className="text-white/10 transition-all duration-300"
                         >
                            <Icon className="w-4 h-4" />
                         </motion.a>
                       ))}
                    </div>
                  </div>
               </div>

               <div className="flex flex-col items-start lg:items-end gap-10">
                  <div className="flex flex-col lg:items-end">
                    <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/10 mb-4 italic">Operational Protocol</span>
                    <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="group relative flex items-center gap-10 px-0 sm:px-4 py-2 transition-all active:scale-95"
                    >
                       <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 group-hover:text-white transition-all duration-500">Return Top</span>
                       <div className="w-12 h-px bg-white/10 group-hover:bg-[#64CEFB]/40 group-hover:w-20 transition-all duration-700" />
                    </button>
                  </div>
               </div>
            </div>

            {/* BIG BRAND MARK */}
            <div className="relative overflow-visible flex justify-center py-16">
                <motion.h2 
                  initial={{ y: "100%", opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[14vw] font-bold tracking-[-0.04em] leading-[0.65] text-transparent bg-clip-text bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent uppercase pointer-events-none select-none italic"
                >
                   Pocket Fund
                </motion.h2>
            </div>

            {/* SYSTEM STATUS BAR */}
            <div className="mt-16 pt-8 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-6 opacity-30 group/status hover:opacity-100 transition-opacity duration-700">
               <div className="flex items-center gap-8 text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span>System Nominal</span>
                  </div>
                  <span className="hidden sm:block text-white/10">|</span>
                  <p>v1.0.42_ARCHITECT</p>
               </div>
               
               <p className="text-[9px] font-bold uppercase tracking-[0.8em] text-white/20">© 2026 ARCHITECTURAL CAPITAL SYSTEMS</p>
               
               <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">
                  <span className="hidden md:block">Region: Global_Edge</span>
                  <span className="hidden md:block text-white/10">|</span>
                  <span>Latency: 14ms</span>
               </div>
            </div>
        </div>
      </footer>
    </div>
   );
}
