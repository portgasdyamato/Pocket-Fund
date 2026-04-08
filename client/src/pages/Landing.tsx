import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
  ArrowDownRight
} from "lucide-react";
import { ShinyText } from "@/components/ShinyText";
import { useState } from "react";

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

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
              transition={{ duration: 0.8 }}
              className="max-w-5xl space-y-10"
            >
              <div className="space-y-4">
                <span className="text-[#64CEFB] text-[10px] md:text-xs font-black uppercase tracking-[0.6em] block opacity-80">REIMAGINE YOUR WEALTH</span>
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
          BENTO GRID: High-Performance Interactions
      */}
      <section id="features" className="py-24 sm:py-32 container mx-auto px-6 border-t border-white/5 bg-[#020202]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Main Focus (Full-Fill Gradient) */}
          <TiltCard className="md:col-span-2 p-10 sm:p-14 rounded-[40px] bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent border border-white/10 flex flex-col justify-between group overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-full bg-[#64CEFB]/[0.02] group-hover:bg-[#64CEFB]/[0.05] transition-colors duration-700" />
            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#64CEFB]/10 border border-[#64CEFB]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-[#64CEFB]" />
              </div>
              <h3 className="text-4xl font-black tracking-tight uppercase leading-none">High-Speed Tracking.</h3>
              <p className="text-lg text-white/40 font-medium max-w-sm">Ditch the spreadsheets. Add expenses in seconds and see your net worth update as you live.</p>
            </div>
            <div className="mt-12 flex gap-4 relative z-10">
              <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:border-[#64CEFB]/30 group-hover:text-white transition-all">Instant Sync</div>
              <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:border-[#64CEFB]/30 group-hover:text-white transition-all">Zero Friction</div>
            </div>
          </TiltCard>

          {/* Card 2: Interactive Vault (Dynamic Visualization) */}
          <TiltCard className="p-10 rounded-[40px] bg-gradient-to-br from-[#0A0A0A] to-[#010101] border border-white/10 flex flex-col justify-between group overflow-hidden relative shadow-2xl">
             <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(white,transparent)]" />
             <div className="space-y-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#64CEFB]/20 group-hover:rotate-12 transition-all">
                  <Lock className="w-6 h-6 text-white group-hover:text-[#64CEFB]" />
                </div>
                <h3 className="text-2xl font-black tracking-tight uppercase leading-none">The Vault.</h3>
                <p className="text-white/40 font-medium text-sm">Safe-guard your long-term wealth in an isolated, protected layer.</p>
             </div>
             
             <div className="mt-10 relative h-32 w-full flex items-center justify-center z-10">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-24 h-24 rounded-full bg-[#64CEFB]/10 border-4 border-dashed border-[#64CEFB]/30 flex items-center justify-center blur-sm group-hover:blur-none transition-all duration-700"
                >
                   <Shield className="w-10 h-10 text-[#64CEFB]/60" />
                </motion.div>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#64CEFB]/40 to-transparent" />
             </div>
          </TiltCard>

          {/* Card 3: Interactive Milestones (Dynamic Badge Reveal) */}
          <TiltCard className="p-10 rounded-[40px] bg-gradient-to-br from-[#0C0C0C] to-black border border-white/10 flex flex-col justify-between group overflow-hidden relative shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#64CEFB]/5 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
             <div className="space-y-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#64CEFB]/10 transition-all">
                  <Trophy className="w-6 h-6 text-white group-hover:text-[#64CEFB]" />
                </div>
                <h3 className="text-2xl font-black tracking-tight uppercase leading-none">Milestones.</h3>
                <p className="text-white/40 font-medium text-sm">Earn badges and level up your financial status as you hit your savings goals.</p>
             </div>
             
             <div className="mt-8 flex flex-wrap gap-3 relative z-10">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.2, rotate: 15, y: -5 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 flex items-center justify-center cursor-pointer hover:border-[#64CEFB]/50 transition-all shadow-inner"
                  >
                    <Star variant={i === 5 ? "gold" : "silver"} />
                  </motion.div>
                ))}
             </div>
          </TiltCard>

          {/* Card 4: Interactive Analysis (Animatable Bars) */}
          <TiltCard className="md:col-span-2 p-10 sm:p-14 rounded-[40px] bg-gradient-to-tr from-[#080808] to-[#020202] border border-white/10 flex flex-col sm:flex-row items-center gap-12 group shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[#64CEFB]/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-6 flex-1 relative z-10">
                 <h3 className="text-3xl font-black tracking-tight uppercase leading-[0.85]">Analyze <br /> Everything.</h3>
                 <p className="text-base text-white/40 font-medium leading-relaxed">Deep dive into your spending habits with granular analytics that reveal exactly where your leaks are.</p>
              </div>
              
              <div className="flex-1 w-full h-48 flex items-end justify-between gap-2.5 px-6 relative z-10">
                 {[40, 70, 50, 95, 60, 45, 80, 55, 90].map((h, i) => (
                    <motion.div 
                      key={i}
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      animate={{ 
                        opacity: hoveredBar !== null && hoveredBar !== i ? 0.3 : 1,
                        scaleX: hoveredBar === i ? 1.1 : 1,
                        backgroundColor: hoveredBar === i ? "#64CEFB" : "rgba(100, 206, 251, 0.2)"
                      }}
                      className="flex-1 rounded-t-lg transition-all border-t-2 border-[#64CEFB]/40 cursor-crosshair relative group/bar"
                    >
                       {hoveredBar === i && (
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: -30 }}
                           className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter"
                         >
                           ₹{h*120}
                         </motion.div>
                       )}
                    </motion.div>
                 ))}
              </div>
          </TiltCard>
        </div>
      </section>

      {/* 
          FRIENDLY CHAT SECTION: RESTORED & POLISHED
      */}
      <section className="py-32 sm:py-48 bg-black relative z-10 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-24">
             <div className="flex-1 space-y-10">
               <div className="space-y-4">
                  <span className="text-[#64CEFB] text-[10px] font-black uppercase tracking-[0.5em] block">PROTOCOL 03</span>
                  <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter font-display leading-[0.9] text-white uppercase">
                    Your AI <br />
                    Financial Buddy.
                  </h2>
               </div>
               <p className="text-xl text-white/40 leading-relaxed font-medium max-w-lg">
                 Get 24/7 help without the judgment. From managing debt to finding better ways to save, your coach is always there to guide you toward financial freedom.
               </p>
               <div className="flex flex-wrap gap-4">
                  <div className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 transition-colors">Judgment Free</div>
                  <div className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 transition-colors">Neural Sync</div>
               </div>
             </div>
             
             <div className="flex-1 w-full space-y-6 relative">
                <div className="absolute inset-0 bg-[#64CEFB]/10 blur-[200px] -z-10 opacity-40 animate-pulse" />
                {[
                  { text: "Hey! You've stashed ₹2,000 more than usual this week. Huge win! 🏆", pos: "left", sender: "Coach" },
                  { text: "That's awesome! What's next for my savings goal?", pos: "right", sender: "You" },
                  { text: "Keep going! If you stash ₹500 more, you'll reach 50% of your new laptop goal.", pos: "left", sender: "Coach" }
                ].map((chat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: chat.pos === 'left' ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    className={`flex flex-col ${chat.pos === 'left' ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2 px-5">{chat.sender}</div>
                    <div className={`p-7 rounded-[2.5rem] max-w-md text-base font-medium leading-relaxed transition-transform hover:scale-[1.02] cursor-default ${
                      chat.pos === 'left' ? 'bg-white/5 border border-white/10 text-white/80' : 'bg-[#64CEFB] text-black shadow-2xl shadow-[#64CEFB]/20 font-bold'
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
         <div className="flex items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center">
               <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase font-display">Pocket Fund</span>
         </div>
         <div className="flex flex-wrap items-center justify-center gap-12">
            {['Privacy', 'Security', 'Protocols', 'Support'].map(item => (
              <a key={item} href="#" className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-[#64CEFB] transition-all transform hover:scale-110">{item}</a>
            ))}
         </div>
         <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/5 pt-10 border-t border-white/5">© 2026 Architectural Capital Systems. High-Performance Finance.</p>
      </footer>
    </div>
  );
}

function Star({ variant = "silver" }: { variant?: "gold" | "silver" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={variant === "gold" ? "#FFD700" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={variant === "gold" ? "#FFD700" : "rgba(255,255,255,0.1)"} />
    </svg>
  );
}
