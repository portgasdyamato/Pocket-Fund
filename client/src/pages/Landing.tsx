import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { 
  ArrowRight, 
  TrendingUp, 
  Wallet, 
  Shield, 
  Sparkles, 
  Zap,
  Lock,
  MessageCircle,
  Trophy,
  Star,
  CheckCircle2,
  Heart,
  Cpu,
  Activity
} from "lucide-react";
import { useRef, useEffect } from "react";

// Word-by-word reveal for "High Class" motion
const SplitText = ({ text, className }: { text: string; className?: string }) => {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            ease: [0.21, 0.47, 0.32, 0.98]
          }}
          className="inline-block mr-[0.2em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const MouseGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 opacity-40 mix-blend-soft-light"
      style={{
        background: useTransform(
          [mouseX, mouseY],
          ([x, y]: any) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(139, 92, 246, 0.15), transparent 80%)`
        )
      }}
    />
  );
};

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-primary/30 relative font-['Inter'] overflow-hidden">
      <MouseGlow />
      
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] bg-primary/20 rounded-full blur-[150px]" 
        />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 sm:pt-60 sm:pb-40 container mx-auto px-6 z-10 flex flex-col items-center">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl mb-12"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Redefining Wealth Intelligence</span>
        </motion.div>

        <h1 className="text-center mb-10 max-w-5xl">
          <SplitText 
            text="Stop guessing. Start growing." 
            className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.85] font-['Space_Grotesk'] text-white"
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg sm:text-2xl text-white/40 max-w-2xl mx-auto text-center font-medium leading-relaxed mb-16"
        >
          The architectural standard for personal finance.
          Precision-engineered to bridge the gap between intent and capital.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1, type: "spring", stiffness: 100 }}
          className="relative group"
        >
          <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Button 
             onClick={handleLogin} 
             className="h-20 px-16 rounded-[28px] bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-white/90 transition-all premium-shadow-white relative z-10 overflow-hidden"
          >
            <motion.span 
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-3"
            >
              Start Your Evolution
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </Button>
        </motion.div>

        {/* Floating Glass Assets */}
        <div className="absolute inset-0 pointer-events-none -z-10">
           <motion.div 
             animate={{ 
               y: [0, -20, 0],
               rotate: [0, 5, 0]
             }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-[20%] left-[5%] w-64 h-80 rounded-[40px] border border-white/10 bg-white/[0.02] backdrop-blur-3xl hidden xl:block"
             style={{ transform: "perspective(1000px) rotateY(15deg)" }}
           >
              <div className="absolute top-8 left-8 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                 <Shield className="w-6 h-6 text-white/20" />
              </div>
              <div className="absolute bottom-8 left-8 right-8 h-2 bg-white/5 rounded-full overflow-hidden">
                 <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-1/2 h-full bg-primary" />
              </div>
           </motion.div>
           <motion.div 
             animate={{ 
               y: [0, 20, 0],
               rotate: [0, -5, 0]
             }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-[10%] right-[5%] w-72 h-48 rounded-[32px] border border-white/10 bg-white/[0.02] backdrop-blur-2xl hidden xl:flex items-center justify-center"
             style={{ transform: "perspective(1000px) rotateY(-20deg)" }}
           >
              <div className="flex gap-4">
                 {[1,2,3].map(i => <div key={i} className="w-12 h-12 rounded-full border border-white/10 bg-white/5" />)}
              </div>
           </motion.div>
        </div>
      </section>

      {/* Grid: Precision Units */}
      <section className="py-20 sm:py-40 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-[32px] overflow-hidden">
            {[
              {
                icon: Zap,
                title: "Active Staging",
                desc: "Real-time ledger processing with multi-category intelligence.",
                delay: 0
              },
              {
                icon: Shield,
                title: "Vault Consensus",
                desc: "Secure fund isolation in high-yield liquid mutual fund reserves.",
                delay: 0.1
              },
              {
                icon: Cpu,
                title: "Gemini Protocol",
                desc: "24/7 AI-driven behavioral analysis and financial coaching.",
                delay: 0.2
              }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: f.delay }}
                viewport={{ once: true }}
                className="bg-[#050505] p-12 sm:p-16 hover:bg-white/[0.03] transition-all duration-500 group relative"
              >
                 <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-8 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-500">
                   <f.icon className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
                 </div>
                 <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 font-['Space_Grotesk']">{f.title}</h3>
                 <p className="text-white/40 leading-relaxed font-medium transition-colors group-hover:text-white/60">
                   {f.desc}
                 </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive CTA */}
      <section className="py-40 sm:py-60 relative z-10 overflow-hidden">
         <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-16"
            >
               <h2 className="text-7xl sm:text-9xl font-black tracking-tighter uppercase font-['Space_Grotesk'] leading-[0.8] text-center">
                 Enter The <br />
                 <span className="text-transparent bg-clip-text bg-[linear-gradient(to_bottom,#fff,#6366f1)]">High Tier.</span>
               </h2>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Button onClick={handleLogin} size="lg" className="h-20 px-16 rounded-[24px] bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-white/90 transition-all premium-shadow-white click-scale">
                    Initialize
                  </Button>
                  <Button onClick={handleLogin} variant="outline" size="lg" className="h-20 px-16 rounded-[24px] border-white/10 bg-transparent text-white font-black uppercase tracking-widest text-sm hover:bg-white/[0.03] transition-all">
                    Inquire
                  </Button>
               </div>
            </motion.div>
         </div>
      </section>

      {/* Minimal Footer */}
      <footer className="container mx-auto px-6 py-20 border-t border-white/5 relative z-10 text-center">
         <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="w-6 h-6 rounded bg-white overflow-hidden flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-black" />
               </div>
               <span className="text-sm font-black tracking-tight uppercase font-['Space_Grotesk']">Pocket Fund</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">© 2026 Architectural Capital Systems LP.</p>
         </div>
      </footer>
    </div>
  );
}
