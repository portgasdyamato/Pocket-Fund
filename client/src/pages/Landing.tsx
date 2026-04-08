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
  Cpu,
  Globe
} from "lucide-react";
import { ShinyText } from "@/components/ShinyText";
import { useState, useRef } from "react";

// Ultra-Smooth Cubic for high-end feel
const BOUTIQUE_EASE = [0.16, 1, 0.3, 1];

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
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`group relative rounded-[40px] bg-[#050505] border border-white/5 overflow-hidden transition-all duration-700 hover:border-[#64CEFB]/30 ${className}`}
    >
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-100" />
      <div className="absolute inset-0 bg-[#64CEFB]/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {/* Subtle Glow Trail */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(100,206,251,0.05)_0%,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity"
      />

      <div className="relative z-10 p-12 h-full flex flex-col justify-between" style={{ transform: "translateZ(30px)" }}>
        <div className="space-y-8">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all duration-700 group-hover:bg-white/[0.05] group-hover:border-[#64CEFB]/20">
            <Icon className="w-6 h-6 text-white/20 group-hover:text-[#64CEFB] transition-colors duration-700" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-tighter uppercase leading-none text-white/50 group-hover:text-white transition-colors duration-700">{title}</h3>
            <p className="text-base text-white/20 font-medium leading-relaxed max-w-[300px] group-hover:text-white/40 transition-colors duration-700">{desc}</p>
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

  const [activeBar, setActiveBar] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#64CEFB]/30 relative font-['Inter'] overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative h-screen w-full bg-black overflow-hidden">
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
          <nav className="w-full max-w-7xl mx-auto px-12 py-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full border-2 border-white/20" />
              <span className="text-white font-bold text-xl tracking-tight font-display">Pocket Fund</span>
            </div>
            <button onClick={handleLogin} className="text-white/40 hover:text-white text-xs font-black uppercase tracking-[0.3em] transition-all">Sign in</button>
          </nav>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: BOUTIQUE_EASE }}
              className="max-w-5xl space-y-12"
            >
              <div className="space-y-6">
                <span className="text-[#64CEFB] text-[10px] font-black uppercase tracking-[0.8em] block opacity-60">Architectural Ledger</span>
                <motion.h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                  <div className="text-white/90">Take Control Of</div>
                  <ShinyText text="Your Financial Future" />
                </motion.h1>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-6">
                <p className="text-white/20 text-xs md:text-sm max-w-[280px] leading-relaxed font-medium">Engineered for high-performance savings and absolute capital clarity.</p>
                <div className="hidden md:block w-px h-12 bg-white/5" />
                <div className="space-y-1 text-left">
                  <p className="text-white/60 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Global Network</p>
                  <p className="text-[#64CEFB] text-[14px] font-black tracking-tighter">54,209 Active Ledgers</p>
                </div>
              </div>

              <div className="pt-10">
                <Button onClick={handleLogin} className="bg-white text-black hover:bg-[#F2F2F2] rounded-full px-16 py-8 text-sm font-black uppercase tracking-[0.3em] transition-all active:scale-95">
                  INITIALIZE
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REFINED BENTO GRID: HIGH-CLASS EXHIBIT */}
      <section className="py-24 sm:py-48 bg-black relative z-10 border-t border-white/5">
        <div className="container mx-auto px-12 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Speed (High-Performance UI) */}
            <BentoCard
              title="Real-Time Ledger."
              desc="Absolute zero latency transaction processing. Track your movement in real-time."
              icon={Zap}
              className="md:col-span-2"
              visual={
                <div className="flex items-center gap-6 pt-4">
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#64CEFB] to-transparent"
                    />
                  </div>
                  <span className="text-[10px] font-black text-[#64CEFB] uppercase tracking-widest shrink-0">0.02ms Response</span>
                </div>
              }
            />

            {/* Card 2: The Vault (Sophisticated Security) */}
            <BentoCard
              title="Cold Storage."
              desc="Deeply isolated wealth reserves protected by tier-1 security protocols."
              icon={ShieldCheck}
              visual={
                <div className="relative h-40 w-full flex items-center justify-center pt-8">
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
                   <motion.div 
                     initial={{ opacity: 0.5, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     className="w-20 h-28 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent flex flex-col items-center justify-center relative overflow-hidden group-hover:border-[#64CEFB]/40 transition-colors duration-700"
                   >
                     <div className="absolute top-0 left-0 w-full h-1 bg-[#64CEFB] opacity-50 shadow-[0_0_15px_#64CEFB]" />
                     <Cpu className="w-8 h-8 text-white/20 group-hover:text-white/60 transition-colors" />
                     <div className="mt-4 flex gap-1">
                        {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-[#64CEFB]/40" />)}
                     </div>
                   </motion.div>
                </div>
              }
            />

            {/* Card 3: Milestones (Premium Tiering) */}
            <BentoCard
              title="Capital Tiers."
              desc="Unlock high-performance financial achievements and verified accolades."
              icon={Globe}
              visual={
                <div className="flex items-center gap-3 pt-6">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-12 h-1 bg-white/[0.05] rounded-full relative overflow-hidden">
                        {i < 3 && <div className="absolute inset-0 bg-[#64CEFB] opacity-60" />}
                     </div>
                   ))}
                   <span className="text-[9px] font-black text-white/20 uppercase tracking-widest pl-2">Tier 02</span>
                </div>
              }
            />

            {/* Card 4: Analytics (Sophisticated Data Model) */}
            <BentoCard
              title="Neural Insights."
              desc="Proprietary data models that isolate and analyze capital leaks with surgical precision."
              icon={Activity}
              className="md:col-span-2"
              visual={
                <div className="h-48 flex items-end justify-between gap-4 px-8 w-full">
                  {[40, 65, 50, 90, 60, 45, 80, 55, 100].map((h, i) => (
                    <motion.div 
                      key={i}
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1.5, ease: BOUTIQUE_EASE, delay: i * 0.04 }}
                      className="flex-1 relative cursor-crosshair group/item"
                    >
                       <motion.div 
                         animate={{ 
                           backgroundColor: activeBar === i ? "#64CEFB" : "rgba(255, 255, 255, 0.03)",
                           boxShadow: activeBar === i ? "0 0 20px rgba(100, 206, 251, 0.3)" : "none"
                         }}
                         className="h-full w-full rounded-sm transition-all duration-500"
                       />
                       <AnimatePresence>
                         {activeBar === i && (
                           <motion.div 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: -45 }}
                             exit={{ opacity: 0, y: 10 }}
                             className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#0A0A0A] border border-white/10 px-4 py-2 rounded-lg text-[10px] font-black tracking-[0.2em] whitespace-nowrap shadow-2xl"
                           >
                             <span className="text-[#64CEFB]">CAPITAL FLOW:</span> ₹{h * 1500}
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

      {/* FRIENDLY CHAT SECTION: AS IT WAS BEFORE */}
      <section className="py-24 sm:py-48 bg-black relative z-10 border-t border-white/5">
        <div className="container mx-auto px-12 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-24">
             <div className="flex-1 space-y-10 relative z-10">
               <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter font-display leading-[0.9] text-white">
                 Your AI <br />
                 Financial Buddy.
               </h2>
               <p className="text-xl text-white/30 leading-relaxed font-medium">
                 High-performance financial guidance that learns from your behavior to keep you on the path to capital mastery.
               </p>
               <div className="flex gap-4">
                  <div className="px-8 py-4 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Tier-1 Security</div>
                  <div className="px-8 py-4 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Zero Judgment</div>
               </div>
             </div>
             
             <div className="flex-1 w-full space-y-6 relative z-10">
                {[
                  { text: "Hey! You've stashed ₹2,000 more than usual this week. Huge win! 🏆", pos: "left", sender: "AI Advisor" },
                  { text: "That's awesome! What's next for my savings goal?", pos: "right", sender: "Client" },
                  { text: "Keep going! If you stash ₹500 more, you'll reach 50% of your new laptop goal.", pos: "left", sender: "AI Advisor" }
                ].map((chat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: chat.pos === 'left' ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: BOUTIQUE_EASE, delay: i * 0.1 }}
                    className={`flex flex-col ${chat.pos === 'left' ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[10px] font-bold text-white/10 uppercase tracking-[0.4em] mb-2 px-6">{chat.sender}</div>
                    <div className={`p-8 rounded-3xl max-w-md text-base font-medium leading-relaxed shadow-2xl transition-all cursor-default ${
                      chat.pos === 'left' ? 'bg-[#0A0A0A] border border-white/5 text-white/60' : 'bg-[#64CEFB] text-black font-black'
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
         <div className="flex items-center justify-center gap-4 opacity-30 hover:opacity-100 transition-opacity duration-1000">
            <div className="w-10 h-10 rounded-full border-2 border-white/40" />
            <span className="text-2xl font-bold tracking-tight text-white uppercase font-display">Pocket Fund</span>
         </div>
         <div className="flex flex-wrap items-center justify-center gap-16">
            {['Privacy', 'Security', 'Compliance', 'Authority'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10 hover:text-white transition-all">{item}</a>
            ))}
         </div>
         <div className="pt-16 border-t border-white/5 max-w-4xl mx-auto">
            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white/5">© 2026 Architectural Capital. High-Performance Portfolio Management.</p>
         </div>
      </footer>
    </div>
  );
}
