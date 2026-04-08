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
  Star
} from "lucide-react";
import { ShinyText } from "@/components/ShinyText";
import { useState, useRef } from "react";

// Premium Bezier for "Hand-crafted" feel
const PREMIUM_EASE = [0.23, 1, 0.32, 1];

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

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

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
      className={`group relative rounded-[40px] bg-[#0A0A0A] border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 hover:border-[#64CEFB]/40 ${className}`}
    >
      {/* Universal Background Fill */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-[#64CEFB]/[0.02] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(100,206,251,0.08)_0%,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 p-10 h-full flex flex-col justify-between" style={{ transform: "translateZ(50px)" }}>
        <div className="space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#64CEFB]/10 group-hover:border-[#64CEFB]/30 transition-all duration-500">
            <Icon className="w-6 h-6 text-white/40 group-hover:text-[#64CEFB] group-hover:scale-110 transition-all duration-500" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-black tracking-tight uppercase leading-none text-white/90 group-hover:text-white transition-colors">{title}</h3>
            <p className="text-sm text-white/40 font-medium leading-relaxed max-w-[280px] group-hover:text-white/60 transition-colors">{desc}</p>
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
          HERO SECTION (High-Fidelity)
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
              transition={{ duration: 1, ease: PREMIUM_EASE }}
              className="max-w-5xl space-y-10"
            >
              <div className="space-y-4">
                <span className="text-[#64CEFB] text-[10px] md:text-xs font-black uppercase tracking-[0.6em] block opacity-80">STILL UNDER CONSTRUCTION</span>
                <motion.h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
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
                <Button onClick={handleLogin} className="bg-white text-black hover:bg-white/90 rounded-full px-12 py-7 text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.15)]">
                  Start Now
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 
          UNIFIED BENTO GRID: REFINED & CONSISTENT
      */}
      <section id="features" className="py-24 sm:py-40 bg-black relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: High-Speed Tracking */}
            <BentoCard
              title="Hyper-Speed Tracking."
              desc="Experience the world's fastest ledger. Log transactions at the speed of thought."
              icon={Zap}
              className="md:col-span-2"
              visual={
                <div className="flex gap-4">
                  <div className="px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#64CEFB]">0.8s Latency</div>
                  <div className="px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">Auto-Categorize</div>
                </div>
              }
            />

            {/* Card 2: The Vault */}
            <BentoCard
              title="The Vault."
              desc="Isolated security reserves with deep-cold storage architecture."
              icon={Fingerprint}
              visual={
                <div className="relative h-32 w-full flex items-center justify-center">
                   <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(circle,white,transparent)]" />
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                     className="relative w-24 h-24 rounded-full border border-dashed border-[#64CEFB]/40 flex items-center justify-center"
                   >
                     <div className="w-16 h-16 rounded-full bg-[#64CEFB]/5 border border-[#64CEFB]/20 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-[#64CEFB]/80" />
                     </div>
                   </motion.div>
                </div>
              }
            />

            {/* Card 3: Milestones */}
            <BentoCard
              title="Milestones."
              desc="Gamified wealth markers that reward discipline and consistency."
              icon={Trophy}
              visual={
                <div className="flex gap-2.5">
                   {[1,2,3,4,5].map(i => (
                     <motion.div 
                       key={i}
                       whileHover={{ y: -5, scale: 1.1 }}
                       className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 ${i === 5 ? 'bg-[#64CEFB]/10 border-[#64CEFB]/40 text-[#64CEFB]' : 'bg-white/5 border-white/10 text-white/20'}`}
                     >
                        <Star className={`w-5 h-5 ${i === 5 ? 'fill-[#64CEFB]' : ''}`} />
                     </motion.div>
                   ))}
                </div>
              }
            />

            {/* Card 4: Analyze Everything */}
            <BentoCard
              title="Deep Analytics."
              desc="Neural-driven heuristics that reveal exactly where your capital is leaking."
              icon={BarChart3}
              className="md:col-span-2"
              visual={
                <div className="h-44 flex items-end justify-between gap-3 px-4 w-full">
                  {[35, 60, 45, 85, 55, 40, 75, 50, 95].map((h, i) => (
                    <motion.div 
                      key={i}
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1, ease: PREMIUM_EASE, delay: i * 0.05 }}
                      className="flex-1 relative cursor-pointer"
                    >
                       <motion.div 
                         animate={{ 
                           backgroundColor: activeBar === i ? "#64CEFB" : "rgba(100, 206, 251, 0.15)",
                           scaleX: activeBar === i ? 1.1 : 1
                         }}
                         className="h-full w-full rounded-t-lg border-t-2 border-[#64CEFB]/40 transition-colors"
                       />
                       <AnimatePresence>
                         {activeBar === i && (
                           <motion.div 
                             initial={{ opacity: 0, y: 10, scale: 0.9 }}
                             animate={{ opacity: 1, y: -40, scale: 1 }}
                             exit={{ opacity: 0, y: 10, scale: 0.9 }}
                             className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5 shadow-2xl"
                           >
                             <TrendingUp className="w-3 h-3 text-green-500" />
                             ₹{h * 150}
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

      {/* 
          FRIENDLY CHAT SECTION: AS IT WAS BEFORE
      */}
      <section className="py-24 sm:py-40 bg-black relative z-10 border-t border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#64CEFB]/[0.02] blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-20">
             <div className="flex-1 space-y-8 relative z-10">
               <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter font-display leading-[0.9] text-white">
                 Your AI <br />
                 Financial Buddy.
               </h2>
               <p className="text-xl text-white/40 leading-relaxed font-medium">
                 Get 24/7 help without the judgment. From managing debt to finding better ways to save, your coach is always there.
               </p>
               <div className="flex gap-4 pt-4">
                  <div className="px-6 py-3 bg-white/5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white/40">Zero Judgment</div>
                  <div className="px-6 py-3 bg-white/5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white/40">Neural Sync</div>
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
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1.5 px-4">{chat.sender}</div>
                    <div className={`p-6 rounded-3xl max-w-sm text-base font-medium leading-relaxed shadow-xl transform active:scale-[0.98] transition-all cursor-default ${
                      chat.pos === 'left' ? 'bg-white/5 border border-white/10 text-white/80' : 'bg-[#64CEFB] text-black font-black'
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
      <footer className="container mx-auto px-6 py-24 relative z-10 text-center space-y-12">
         <div className="flex items-center justify-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-sm border-2 border-white/20 flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase font-display">Pocket Fund</span>
         </div>
         <div className="flex flex-wrap items-center justify-center gap-10">
            {['Privacy Protocol', 'Encryption Standard', 'Contact Authority'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-[#64CEFB] transition-all">{item}</a>
            ))}
         </div>
         <div className="pt-10 border-t border-white/5 max-w-2xl mx-auto">
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/5">© 2026 Architectural Capital Systems. Hand-crafted Excellence.</p>
         </div>
      </footer>
    </div>
  );
}
