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
      
      <div className="relative z-10 p-12 h-full flex flex-col justify-between" style={{ overflow: 'visible' }}>
        <div className="space-y-8">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-[#64CEFB]/10 group-hover:border-[#64CEFB]/40">
            <Icon className="w-6 h-6 text-[#64CEFB]" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-black tracking-tight uppercase leading-none text-white">{title}</h3>
            <p className="text-base text-white/40 font-medium leading-relaxed max-w-[340px] group-hover:text-white/60 transition-colors">{desc}</p>
          </div>
        </div>
        
        <div className="mt-12 flex-1 flex flex-col justify-end min-h-[180px] relative" style={{ overflow: 'visible' }}>
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
          --- HERO SECTION (WITH PLATFORM-SPECIFIC CONTENT) --- 
      */}
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
          <nav className="w-full max-w-[1600px] mx-auto px-10 pt-10 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </div>
              <span className="text-white font-black text-xl tracking-tighter uppercase transition-opacity hover:opacity-80 font-display">Pocket Fund</span>
            </div>
            <button onClick={handleLogin} className="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] transition-all">SIGN IN</button>
          </nav>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 max-h-[85vh]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: PREMIUM_EASE }}
              className="max-w-6xl space-y-12"
            >
              <div className="space-y-4">
                <span className="text-[#64CEFB] text-[10px] font-black uppercase tracking-[1em] block opacity-60">PERSONAL SAVINGS CO-PILOT</span>
                <motion.h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.85] uppercase font-display">
                  <div className="text-white/95">Master Your</div>
                  <ShinyText text="Money With Ease" />
                </motion.h1>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-4">
                <p className="text-white/30 text-xs md:text-sm max-w-[400px] leading-relaxed font-medium">
                  Financial empathy meets smart technology. Track your expenses effortlessly, protect your stash in the vault, and grow with your AI savings buddy.
                </p>
                <div className="hidden md:block w-px h-12 bg-white/10" />
                <div className="space-y-1 text-left">
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">STASHED SAFELY</p>
                  <p className="text-[#64CEFB] text-[16px] font-black tracking-tighter uppercase">₹1.2Cr+ SECURED</p>
                </div>
              </div>

              <div className="pt-10">
                <Button onClick={handleLogin} className="bg-white text-black hover:bg-gray-100 rounded-full px-16 py-8 text-sm font-black uppercase tracking-[0.3em] transition-all active:scale-95 shadow-2xl">
                  Start Your Journey
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
                <div className="flex items-center gap-10 pt-10 px-6">
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
                        <span className="text-[11px] font-black text-[#64CEFB] uppercase tracking-[0.4em]">NEURAL LINK ACTIVE</span>
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
                         <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">ENCRYPTED</span>
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
                <div className="flex gap-5 pt-8 px-6 overflow-visible">
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
                <div className="h-52 flex items-end justify-between gap-5 px-12 w-full relative">
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
                             className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-tighter shadow-2xl whitespace-nowrap"
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
          <div className="flex flex-col lg:flex-row items-center gap-24">
             <div className="flex-1 space-y-10 relative z-10">
               <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.8] text-white uppercase font-display">
                 Your AI <br />
                 Savings Buddy.
               </h2>
               <p className="text-xl text-white/30 leading-relaxed font-medium max-w-lg">
                 Friendly, judgment-free advice that helps you save more without changing your lifestyle.
               </p>
               <div className="flex gap-4 pt-4">
                  <div className="px-8 py-3 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">24/7 ADVISORY</div>
                  <div className="px-8 py-3 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">PRIVACY SECURED</div>
               </div>
             </div>
             
             <div className="flex-1 w-full space-y-4 relative z-10">
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
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 px-6">{chat.sender}</div>
                    <div className={`px-8 py-6 rounded-[2.5rem] max-w-md text-base leading-relaxed border transition-all hover:scale-[1.02] cursor-default font-sans ${
                      chat.pos === 'left' ? 'bg-white/5 border-white/10 text-white/80' : 'bg-[#64CEFB] text-black border-[#64CEFB] font-black shadow-[0_15px_40px_rgba(100,206,251,0.2)]'
                    }`}>
                      {chat.text}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* REfINED FOOTER */}
      <footer className="bg-black relative z-10 border-t border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-[#64CEFB]/[0.02] blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-[1600px] pt-24 pb-12">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-20">
              
              {/* Brand Section */}
              <div className="lg:col-span-1 space-y-8">
                 <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#64CEFB]/50 transition-all duration-500">
                       <div className="w-3 h-3 bg-white rounded-full group-hover:bg-[#64CEFB] transition-colors" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white uppercase group-hover:opacity-80 transition-opacity font-display">Pocket Fund</span>
                 </div>
                 <p className="text-white/20 text-sm leading-relaxed font-medium max-w-[240px]">
                    High-performance financial governance for the modern capital architect.
                 </p>
                 <div className="flex items-center gap-5">
                    {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                      <motion.a 
                        key={i}
                        whileHover={{ y: -3, scale: 1.1 }}
                        href="#" 
                        className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10 hover:text-[#64CEFB] hover:border-[#64CEFB]/30 transition-all"
                      >
                         <Icon className="w-3.5 h-3.5" />
                      </motion.a>
                    ))}
                 </div>
              </div>

              {/* Navigation Links */}
              <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
                 {[
                   { title: 'Platform', links: ['Dashboard', 'Savings Vault', 'Coach AI', 'Analytics'] },
                   { title: 'Governance', links: ['Privacy Protocol', 'Security Layer', 'Terms of Service'] },
                   { title: 'Collective', links: ['Advisory Hub', 'Status Network', 'Support'] }
                 ].map((col, i) => (
                   <div key={i} className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#64CEFB]/40">{col.title}</h4>
                      <ul className="space-y-3">
                        {col.links.map(link => (
                          <li key={link}>
                            <motion.a 
                              whileHover={{ x: 3 }}
                              href="#" 
                              className="text-white/10 hover:text-white text-[12px] font-bold transition-all flex items-center gap-2 group whitespace-nowrap"
                            >
                               {link}
                               <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-y-0.5 transition-all" />
                            </motion.a>
                          </li>
                        ))}
                      </ul>
                   </div>
                 ))}
              </div>
           </div>

           {/* Grand Typography Footer Mark */}
           <div className="relative border-t border-white/5 pt-12 overflow-hidden">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                 <div className="w-full relative overflow-visible flex justify-center">
                    <motion.h2 
                      initial={{ y: "120%", opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1.2, ease: PREMIUM_EASE }}
                      className="text-[13vw] font-black tracking-[-0.05em] leading-[0.75] text-white/[0.08] uppercase pointer-events-none select-none font-display pb-4"
                    >
                       Pocket Fund
                    </motion.h2>
                 </div>
                 
                 <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
                    <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white/5">© 2026 ARCHITECTURAL CAPITAL SYSTEMS</p>
                    <div className="h-px w-24 bg-white/[0.03] hidden md:block" />
                    <button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="group flex items-center gap-4 px-8 py-3 rounded-full bg-white/[0.02] border border-white/5 hover:border-[#64CEFB]/30 transition-all active:scale-95"
                    >
                       <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white transition-colors">Return Top</span>
                       <ArrowRightCircle className="w-4 h-4 text-white/20 group-hover:text-[#64CEFB] -rotate-90 transition-all" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
