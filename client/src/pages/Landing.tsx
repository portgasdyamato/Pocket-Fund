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
  Coins
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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.5, ease: PREMIUM_EASE }}
      className={`group relative rounded-[32px] bg-[#0A0A0A] border border-white/10 shadow-2xl transition-colors hover:bg-[#0F0F0F] ${className}`}
      style={{ overflow: 'visible' }} // Allow shadows and glows to bleed
    >
      {/* Background Fill - Clipped inside rounded corners */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent rounded-[32px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[32px] pointer-events-none" />
      
      <div className="relative z-10 p-10 h-full flex flex-col justify-between">
        <div className="space-y-6">
          <div className="w-12 h-12 rounded-[18px] bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all group-hover:bg-[#64CEFB]/10 group-hover:border-[#64CEFB]/30">
            <Icon className="w-5 h-5 text-white/50 group-hover:text-[#64CEFB] transition-colors" />
          </div>
          <div className="space-y-2.5">
            <h3 className="text-xl font-bold tracking-tight uppercase leading-none text-white/90 group-hover:text-white transition-colors">{title}</h3>
            <p className="text-sm text-white/40 font-medium leading-relaxed max-w-[320px] group-hover:text-white/60 transition-colors">{desc}</p>
          </div>
        </div>
        
        <div className="mt-8 flex-1 flex flex-col justify-end">
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
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#64CEFB]/30 relative font-['Inter'] overflow-x-hidden">
      
      {/* 
          --- HERO SECTION (Polished for visibility) --- 
      */}
      <section className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
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

        <div className="relative z-10 w-full h-full flex flex-col items-center">
          <nav className="w-full max-w-[1600px] mx-auto px-6 py-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </div>
              <span className="text-white font-black text-xl tracking-tight">Pocket Fund</span>
            </div>
            <button onClick={handleLogin} className="text-white/60 hover:text-white text-xs font-black uppercase tracking-[0.3em] transition-all">Sign In</button>
          </nav>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-24 sm:pb-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: PREMIUM_EASE }}
              className="max-w-5xl space-y-12"
            >
              <div className="space-y-4">
                <span className="text-[#64CEFB] text-[10px] font-black uppercase tracking-[0.6em] block opacity-80">STILL UNDER CONSTRUCTION</span>
                <motion.h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                  <div className="text-white">Master Your</div>
                  <ShinyText text="Money With Ease" />
                </motion.h1>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-4">
                <p className="text-white/40 text-xs md:text-sm max-w-[300px] leading-relaxed font-medium">Simple tools to track spending, set goals, and save more every single day.</p>
                <div className="hidden md:block w-px h-10 bg-white/10" />
                <div className="space-y-1 text-left">
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Global Community</p>
                  <p className="text-[#64CEFB] text-[15px] font-black tracking-tighter uppercase whitespace-nowrap">54,000+ Active Nodes</p>
                </div>
              </div>

              <div className="pt-8">
                <Button onClick={handleLogin} className="bg-white text-black hover:bg-gray-100 rounded-full px-16 py-8 text-sm font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl">
                  Start Your Journey
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 
          --- FEATURES SECTION: AUTHENTIC & POLISHED --- 
      */}
      <section className="py-24 sm:py-48 bg-black relative z-10 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-[1600px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. AI Assistant */}
            <BentoCard
              title="Assistant Coach"
              desc="Real-time voice and text guidance to help you crush spending habits and master budgeting."
              icon={Mic}
              className="md:col-span-2"
              visual={
                <div className="flex items-center gap-8 pt-8 px-4">
                  <div className="flex items-center gap-1.5 h-12">
                     {[20, 60, 40, 80, 50, 90, 30, 70, 45, 100, 60, 40].map((h, i) => (
                       <motion.div 
                         key={i}
                         animate={{ height: [10, h, 10] }}
                         transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                         className="w-1.5 bg-[#64CEFB]/40 rounded-full"
                         style={{ height: 8 }}
                       />
                     ))}
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-black text-[#64CEFB] uppercase tracking-[0.3em]">Advisor Mode Active</span>
                     <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Awaiting Command...</span>
                  </div>
                </div>
              }
            />

            {/* 2. Locked Vault (REFINED VISUAL) */}
            <BentoCard
              title="Secure Vault"
              desc="Protect your stashed funds with PIN security. A dedicated space for disciplined growth."
              icon={ShieldCheck}
              visual={
                <div className="relative h-44 w-full flex items-center justify-center p-4">
                   {/* Centered Glow (No cutoff now) */}
                   <div className="absolute inset-x-12 inset-y-12 bg-[#64CEFB]/10 blur-[40px] rounded-full pointer-events-none" />
                   
                   <div className="relative w-24 h-24 rounded-[2rem] bg-[#0A0A0A] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(100,206,251,0.05)] overflow-hidden">
                      <div className="grid grid-cols-3 gap-2 px-6">
                         {[1,2,3,4,5,6,7,8,9].map(i => (
                           <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />
                         ))}
                      </div>
                      <div className="absolute top-2 right-2">
                        <Lock className="w-3 h-3 text-[#64CEFB]/40" />
                      </div>
                   </div>
                </div>
              }
            />

            {/* 3. Daily Milestones */}
            <BentoCard
              title="Growth Badges"
              desc="Earn tokens and achievements for every savings streak and goal you complete."
              icon={Coins}
              visual={
                <div className="flex gap-4 pt-6 px-4">
                   {[1, 2, 3].map(i => (
                     <div 
                       key={i}
                       className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${i === 3 ? 'bg-[#64CEFB]/10 border-[#64CEFB]/20 text-[#64CEFB]' : 'bg-white/5 border-white/10 text-white/10'}`}
                     >
                        {i === 1 ? <Target className="w-6 h-6" /> : i === 2 ? <Zap className="w-6 h-6" /> : <Gem className="w-6 h-6" />}
                     </div>
                   ))}
                </div>
              }
            />

            {/* 4. Smart Insights */}
            <BentoCard
              title="Capital Data"
              desc="Deep-dive into your spending patterns with interactive, real-time capital ledgers."
              icon={BarChart3}
              className="md:col-span-2"
              visual={
                <div className="h-48 flex items-end justify-between gap-4 px-10 w-full relative">
                   {[35, 60, 45, 85, 55, 40, 75, 50, 95].map((h, i) => (
                    <motion.div 
                      key={i}
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1.5, ease: PREMIUM_EASE, delay: i * 0.05 }}
                      className="flex-1 relative cursor-pointer"
                    >
                       <motion.div 
                         animate={{ 
                           backgroundColor: activeBar === i ? "#64CEFB" : "rgba(100, 206, 251, 0.2)",
                         }}
                         className="h-full w-full rounded-t-sm"
                       />
                       <AnimatePresence>
                         {activeBar === i && (
                           <motion.div 
                             initial={{ opacity: 0, scale: 0.9, y: 10 }}
                             animate={{ opacity: 1, scale: 1, y: -45 }}
                             exit={{ opacity: 0, scale: 0.9, y: 10 }}
                             className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl"
                           >
                              ₹{h * 420}
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

      {/* FRIENDLY CHAT: AS IT WAS BEFORE */}
      <section className="py-24 sm:py-48 bg-black relative z-10 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-[1600px]">
          <div className="flex flex-col lg:flex-row items-center gap-24 font-display">
             <div className="flex-1 space-y-10">
               <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-[0.9] text-white">
                 Your AI <br />
                 Savings Buddy.
               </h2>
               <p className="text-xl text-white/40 leading-relaxed font-medium max-w-lg">
                 Friendly, judgment-free advice that helps you save more without changing your lifestyle.
               </p>
               <div className="flex gap-4 pt-4">
                  <div className="px-8 py-4 bg-white/5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white/40">24/7 Advice</div>
                  <div className="px-8 py-4 bg-white/5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white/40">Privacy First</div>
               </div>
             </div>
             
             <div className="flex-1 w-full space-y-4">
                {[
                  { text: "Hey! You've stashed ₹2,000 more than usual this week. Huge win! 🏆", pos: "left", sender: "Coach" },
                  { text: "That's awesome! What's next for my savings goal?", pos: "right", sender: "You" },
                  { text: "Keep going! If you stash ₹500 more, you'll reach 50% of your new laptop goal.", pos: "left", sender: "Coach" }
                ].map((chat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: chat.pos === 'left' ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: PREMIUM_EASE, delay: i * 0.1 }}
                    className={`flex flex-col ${chat.pos === 'left' ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1.5 px-6">{chat.sender}</div>
                    <div className={`p-7 rounded-[2.5rem] max-w-sm text-base font-medium leading-relaxed border transition-all hover:scale-[1.02] cursor-default ${
                      chat.pos === 'left' ? 'bg-white/5 border-white/10 text-white/80' : 'bg-[#64CEFB] text-black border-[#64CEFB] font-black'
                    }`}>
                      {chat.text}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="container mx-auto px-6 py-24 relative z-10 text-center space-y-16">
         <div className="flex items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-white/40" />
            <span className="text-2xl font-bold tracking-tight text-white uppercase">Pocket Fund</span>
         </div>
         <div className="flex flex-wrap items-center justify-center gap-16">
            {['Privacy', 'Security', 'Contact', 'Support'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all">{item}</a>
            ))}
         </div>
         <div className="pt-16 border-t border-white/5 max-w-[1600px] mx-auto">
            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white/5">© 2026 Architectural Capital Systems. Hand-crafted Excellence.</p>
         </div>
      </footer>
    </div>
  );
}
