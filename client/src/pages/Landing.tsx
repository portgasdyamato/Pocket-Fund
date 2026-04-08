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
  Flame,
  Layout,
  Clock,
  Gem,
  CheckCircle2
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
      className={`group relative rounded-[40px] bg-[#0A0A0A] border border-white/5 overflow-hidden shadow-2xl transition-all duration-500 hover:border-[#64CEFB]/30 ${className}`}
    >
      {/* Premium Texture & Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#64CEFB]/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10 p-12 h-full flex flex-col justify-between">
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-[20px] bg-white/[0.04] border border-white/10 flex items-center justify-center transition-all group-hover:bg-[#64CEFB]/10 group-hover:border-[#64CEFB]/20">
            <Icon className="w-7 h-7 text-[#64CEFB] group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-tighter uppercase leading-none text-white/90 group-hover:text-white transition-colors">{title}</h3>
            <p className="text-base text-white/40 font-medium leading-relaxed max-w-[320px] group-hover:text-white/60 transition-colors">{desc}</p>
          </div>
        </div>
        
        <div className="mt-12 flex-1 flex flex-col justify-end">
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

  const [activeStreak, setActiveStreak] = useState(7);

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#64CEFB]/30 relative font-['Inter'] overflow-x-hidden">
      
      {/* 
          HERO SECTION
      */}
      <section className="relative h-screen w-full bg-black overflow-hidden">
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
          <nav className="w-full max-w-[1600px] mx-auto px-12 py-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Pocket Fund</span>
            </div>
            <button onClick={handleLogin} className="text-white/40 hover:text-white text-xs font-black uppercase tracking-[0.4em] transition-all pt-1">Get Started</button>
          </nav>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: PREMIUM_EASE }}
              className="max-w-6xl space-y-12"
            >
              <div className="space-y-6">
                <span className="text-[#64CEFB] text-[10px] font-black uppercase tracking-[0.8em] block opacity-60">Verified Financial Ecosystem</span>
                <motion.h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                  <div className="text-white/90">Master Your</div>
                  <ShinyText text="Money With Ease" />
                </motion.h1>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-6">
                <p className="text-white/30 text-xs md:text-sm max-w-[280px] leading-relaxed font-medium">Simple tools to track spending, set goals, and save more every single day.</p>
                <div className="hidden md:block w-px h-12 bg-white/5" />
                <div className="space-y-1 text-left">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Active Users</p>
                  <p className="text-[#64CEFB] text-[18px] font-black tracking-tighter tabular-nums">54,082 Savers</p>
                </div>
              </div>

              <div className="pt-10">
                <Button onClick={handleLogin} className="bg-white text-black hover:bg-white/90 rounded-full px-16 py-8 text-sm font-black uppercase tracking-[0.4em] transition-all active:scale-95 shadow-2xl">
                  INITIALIZE
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 
          OFFICIAL POCKET FUND FEATURES: WIDE LAYOUT
      */}
      <section id="features" className="py-24 sm:py-48 bg-black relative z-10">
        <div className="container mx-auto px-12 max-w-[1700px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. REAL TRANSACTION LOGGING */}
            <BentoCard
              title="Ledger Tracking"
              desc="Log every rupee instantly. Categorize your spending with one tap for absolute financial clarity."
              icon={Wallet}
              className="md:col-span-2"
              visual={
                <div className="space-y-4 pt-10">
                   {[
                     { desc: "Grocery Shopping", amt: "₹1,250", cat: "Food" },
                     { desc: "Netflix Subscription", amt: "₹499", cat: "Entertainment" }
                   ].map((item, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, x: -20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.2 }}
                       className="flex items-center justify-between p-7 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group/item"
                     >
                        <div className="flex items-center gap-5">
                           <div className="w-10 h-10 rounded-xl bg-[#64CEFB]/10 flex items-center justify-center">
                              <ArrowDownRight className="w-5 h-5 text-[#64CEFB]" />
                           </div>
                           <div>
                              <p className="text-sm font-black uppercase tracking-widest text-white/90">{item.desc}</p>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{item.cat}</p>
                           </div>
                        </div>
                        <p className="text-lg font-black text-white">{item.amt}</p>
                     </motion.div>
                   ))}
                </div>
              }
            />

            {/* 2. PIN-PROTECTED VAULT */}
            <BentoCard
              title="Secure Vault"
              desc="Protect your sensitive savings and data with a military-grade 4-digit PIN system."
              icon={ShieldCheck}
              visual={
                <div className="relative h-64 w-full flex items-center justify-center pt-10">
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#64CEFB]/10 to-transparent blur-3xl opacity-30" />
                  <div className="grid grid-cols-3 gap-3">
                     {[1,2,3,4,5,6,7,8,9].map(i => (
                       <div key={i} className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                       </div>
                     ))}
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                     <div className="w-24 h-24 rounded-full bg-[#64CEFB]/20 border border-[#64CEFB]/40 flex items-center justify-center shadow-[0_0_50px_rgba(100,206,251,0.2)]">
                        <Lock className="w-10 h-10 text-[#64CEFB]" />
                     </div>
                  </motion.div>
                </div>
              }
            />

            {/* 3. STREAKS & QUESTS */}
            <BentoCard
              title="Growth Streaks"
              desc="Build high-performance habits. Maintain save streaks and complete daily financial quests."
              icon={Flame}
              visual={
                <div className="flex flex-col items-center gap-8 pt-10 text-center">
                   <div className="flex gap-4">
                      {[1,2,3,4,5,6,7].map(i => (
                        <div key={i} className={`w-10 h-1.5 rounded-full ${i <= activeStreak ? 'bg-[#64CEFB]' : 'bg-white/5'}`} />
                      ))}
                   </div>
                   <div className="relative group/flame">
                      <Flame className="w-20 h-20 text-[#64CEFB] fill-[#64CEFB]/20 animate-pulse" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-2">
                        <span className="text-2xl font-black">{activeStreak}</span>
                        <p className="text-[8px] font-black uppercase tracking-widest text-[#64CEFB]">Days</p>
                      </div>
                   </div>
                </div>
              }
            />

            {/* 4. GOAL PROGRESS */}
            <BentoCard
              title="Target Quests"
              desc="Track your progress toward dream goals with real-time percentage visualizers."
              icon={Target}
              className="md:col-span-2"
              visual={
                <div className="grid md:grid-cols-2 gap-10 pt-10 h-44 items-end">
                   {[
                     { name: "New Laptop", pct: 75, color: "#64CEFB" },
                     { name: "Annual Trip", pct: 40, color: "#ffffff" }
                   ].map((goal, i) => (
                      <div key={i} className="space-y-4">
                         <div className="flex justify-between items-end">
                            <span className="text-xl font-black uppercase tracking-tight text-white/90">{goal.name}</span>
                            <span className="text-sm font-black text-white/40">{goal.pct}%</span>
                         </div>
                         <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${goal.pct}%` }}
                              transition={{ duration: 1.5, ease: PREMIUM_EASE }}
                              className="h-full bg-white relative"
                              style={{ backgroundColor: goal.color }}
                            >
                               <div className="absolute inset-0 bg-white/20 blur-sm" />
                            </motion.div>
                         </div>
                      </div>
                   ))}
                </div>
              }
            />

          </div>
        </div>
      </section>

      {/* 
          THE OFFICIAL AI ASSISTANT: POCKET FUND COACH
      */}
      <section className="py-24 sm:py-48 bg-black relative z-10 border-t border-white/5">
        <div className="container mx-auto px-12 max-w-[1600px]">
          <div className="flex flex-col lg:flex-row items-center gap-24">
             <div className="flex-1 space-y-12">
               <div className="space-y-4">
                  <span className="text-[#64CEFB] text-[10px] font-black uppercase tracking-[0.5em] block">PROTOCOL 05: ASSISTANT</span>
                  <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter font-display leading-[0.85] text-white uppercase">
                    Your AI <br />
                    Financial Buddy.
                  </h2>
               </div>
               <p className="text-xl text-white/30 leading-relaxed font-medium max-w-lg">
                 Friendly, judgment-free advice powered by the Pocket Fund assistant. Real conversations about your real goals.
               </p>
               <div className="flex gap-4">
                  <div className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all">Behavioral Insights</div>
                  <div className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all">24/7 Availability</div>
               </div>
             </div>
             
             <div className="flex-1 w-full space-y-6 relative">
                <div className="absolute inset-0 bg-[#64CEFB]/10 blur-[200px] -z-10" />
                {[
                  { text: "Hey! You've stashed ₹2,000 more than usual this week. Huge win! 🏆", pos: "left", sender: "Coach" },
                  { text: "That's awesome! What's next for my savings goal?", pos: "right", sender: "You" },
                  { text: "Keep going! If you stash ₹500 more, you'll reach 50% of your new laptop goal.", pos: "left", sender: "Coach" }
                ].map((chat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: chat.pos === 'left' ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: PREMIUM_EASE, delay: i * 0.1 }}
                    className={`flex flex-col ${chat.pos === 'left' ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] mb-3 px-6">{chat.sender}</div>
                    <div className={`p-8 rounded-[40px] max-w-md text-base font-medium leading-relaxed shadow-2xl transition-all cursor-default ${
                      chat.pos === 'left' ? 'bg-[#0A0A0A] border border-white/10 text-white/80' : 'bg-[#64CEFB] text-black font-black'
                    }`}>
                      {chat.text}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="container mx-auto px-12 py-32 relative z-10 text-center space-y-16">
         <div className="flex items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center opacity-50">
               <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase font-display">Pocket Fund</span>
         </div>
         <div className="flex flex-wrap items-center justify-center gap-16">
            {['Privacy Protocol', 'Security Standard', 'Contact Authority'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10 hover:text-white transition-all transform hover:scale-110">{item}</a>
            ))}
         </div>
         <div className="pt-16 border-t border-white/5 max-w-4xl mx-auto">
            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white/5">© 2026 Architectural Capital Systems. Hand-crafted Excellence.</p>
         </div>
      </footer>
    </div>
  );
}
