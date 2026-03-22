import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Target, 
  Trophy, 
  Zap, 
  Lock,
  ArrowRight, 
  Users, 
  Sparkles, 
  Globe,
  Activity,
  ArrowDown,
  Shield,
  MousePointer2,
  TrendingUp,
  Fingerprint
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Magnetic Hover Component
const MagneticButton = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Tilt Card Component
const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set((px - 0.5) * 200);
    y.set((py - 0.5) * 200);
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
      <div style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    
    const ctx = gsap.context(() => {
      gsap.from(".hero-reveal", {
        y: 100,
        opacity: 0,
        duration: 2,
        stagger: 0.3,
        ease: "power4.out"
      });

      gsap.from(".bento-item", {
        scrollTrigger: {
          trigger: ".bento-grid",
          start: "top 70%",
        },
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: "elastic.out(1, 0.5)"
      });
    }, containerRef);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      ctx.revert();
    };
  }, []);

  const handleLogin = () => window.location.href = '/api/auth/google';

  return (
    <div ref={containerRef} className="bg-[#010103] text-white min-h-screen selection:bg-blue-500/30 overflow-x-hidden font-sans pt-20">
      
      {/* Dynamic Background Interface */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Animated Mesh */}
        <div 
          className="absolute inset-0 opacity-20 transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${(mousePosition.x - window.innerWidth/2) * 0.02}px, ${(mousePosition.y - window.innerHeight/2) * 0.02}px)` }}
        >
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/40 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-blue-500/[0.03] animate-spin-slow rounded-[120px] blur-[100px]" />
        </div>
        
        {/* Kinetic Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(1,1,3,0.8)_100%)]" />
      </div>

      <nav className="fixed top-0 w-full z-[100] px-10 py-8 flex justify-between items-center bg-transparent backdrop-blur-xl border-b border-white/[0.03]">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all group-hover:scale-110 group-hover:rotate-12">F</div>
          <span className="text-2xl font-black tracking-tighter uppercase italic leading-none">PocketFund <span className="text-blue-500 opacity-30 tracking-[0.3em] font-medium ml-2">OS-4</span></span>
        </motion.div>
        
        <div className="hidden md:flex items-center gap-12 text-[10px] font-black tracking-[0.5em] text-white/30 uppercase">
          {['Terminals', 'Protocols', 'Sync'].map(link => (
            <a key={link} href="#" className="hover:text-blue-500 transition-colors">{link}</a>
          ))}
        </div>

        <MagneticButton>
          <Button onClick={handleLogin} className="rounded-[20px] h-14 px-10 bg-white text-black hover:bg-white/90 font-black text-xs uppercase tracking-widest shadow-2xl">
            Authorize Sync
          </Button>
        </MagneticButton>
      </nav>

      <main className="relative z-10 px-8">
        
        {/* High-Impact Hero Section */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center relative max-w-7xl mx-auto pt-20">
          <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-2xl backdrop-blur-3xl"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              Intelligence Vector v4.2 Deployment
            </motion.div>
            
            <h1 className="text-7xl md:text-[120px] font-black tracking-[-0.07em] mb-6 leading-[0.85] flex flex-col items-center uppercase italic select-none">
              <span className="hero-reveal inline-block text-white">ORCHESTRATE</span>
              <span className="hero-reveal text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-blue-600 italic">ASCENSION.</span>
            </h1>
            
            <p className="hero-reveal text-xl md:text-2xl text-white/40 mb-16 max-w-3xl mx-auto leading-relaxed font-medium tracking-tight italic">
              Architecting the future of capital autonomy. Cinematic analytics 
              meets professional-grade wealth preservation in a high-fidelity interface.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-12 hero-reveal">
              <MagneticButton>
                <Button 
                  onClick={handleLogin}
                  size="lg"
                  className="h-24 px-16 rounded-[32px] bg-blue-600 hover:bg-blue-500 text-white font-black text-2xl tracking-tighter click-scale shadow-[0_40px_80px_-20px_rgba(37,99,235,0.6)] border-none group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Launch OS
                    <ArrowRight className="w-8 h-8 ml-6 group-hover:translate-x-3 transition-transform duration-500" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
              </MagneticButton>
              <div className="flex items-center gap-10 border-l border-white/5 pl-12">
                 <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl animate-pulse" />
                    <Activity className="w-8 h-8 text-emerald-500 relative z-10" />
                 </div>
                 <div className="text-left">
                    <p className="text-3xl font-black tracking-tight text-white italic">12.4K+</p>
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Operators Online</p>
                 </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-10 flex flex-col items-center gap-6"
          >
             <span className="text-[9px] font-black tracking-[1em] uppercase ml-4">Sync to Descend</span>
             <div className="w-6 h-12 rounded-full border border-white/20 flex items-start justify-center p-2">
                <motion.div 
                  animate={{ y: [0, 15, 0] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
                />
             </div>
          </motion.div>
        </section>

        {/* Cinematic Bento Intelligence */}
        <section className="py-48 max-w-[1400px] mx-auto bento-grid">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Feature 1: Core Terminal */}
            <TiltCard className="md:col-span-8 bento-item group bg-white/[0.02] border border-white/5 rounded-[64px] p-16 relative overflow-hidden hover:bg-white/[0.04] transition-all duration-1000 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/[0.05] blur-[120px] -mr-[200px] -mt-[200px] group-hover:scale-125 transition-transform duration-[2s]" />
              <div className="flex flex-col h-full relative z-10">
                <div className="w-20 h-20 rounded-[32px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-12 shadow-2xl transition-all group-hover:rotate-12 group-hover:scale-110">
                  <TrendingUp className="w-10 h-10" />
                </div>
                <h3 className="text-5xl font-black mb-8 italic tracking-tight">PRECISION ANALYTICS.</h3>
                <p className="text-white/30 text-2xl leading-relaxed mb-16 max-w-xl font-medium italic">High-velocity capital tracking with real-time categorization and sub-millisecond data visualization.</p>
                <div className="mt-auto h-72 bg-black/40 rounded-[48px] border border-white/5 p-12 overflow-hidden relative shadow-inner">
                   <div className="flex justify-between items-center mb-10">
                      <div className="w-48 h-6 bg-white/10 rounded-full animate-pulse" />
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                         <Zap className="w-6 h-6 text-blue-500/40" />
                      </div>
                   </div>
                   <div className="flex gap-8 h-full">
                      <div className="w-full bg-gradient-to-t from-blue-600/20 via-blue-600/5 to-transparent rounded-3xl border border-blue-500/10" />
                      <div className="w-1/2 bg-white/[0.02] border border-white/5 rounded-3xl" />
                   </div>
                </div>
              </div>
            </TiltCard>

            {/* Feature 2: Security Vault */}
            <TiltCard className="md:col-span-4 bento-item group bg-white/[0.02] border border-white/5 rounded-[64px] p-16 relative overflow-hidden hover:bg-indigo-900/[0.05] transition-all duration-1000 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
               <div className="flex flex-col h-full relative z-10 items-center text-center">
                  <div className="w-20 h-20 rounded-[32px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-12 shadow-2xl group-hover:scale-110 transition-all">
                    <Fingerprint className="w-10 h-10" />
                  </div>
                  <h3 className="text-4xl font-black mb-8 italic tracking-tight uppercase leading-none">FROST <br /> PROTOCOLS.</h3>
                  <p className="text-white/30 text-lg leading-relaxed mb-16 font-medium italic">End-to-end encrypted vault layers built for the sovereign operator.</p>
                  <div className="mt-auto relative w-full aspect-square flex items-center justify-center">
                    <div className="absolute inset-0 bg-indigo-600/10 blur-[60px] rounded-full animate-pulse" />
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-[3px] border-dashed border-white/5 rounded-full" 
                    />
                    <Lock className="w-24 h-24 text-white/5 group-hover:text-indigo-400 transition-all duration-1000 relative z-10" />
                  </div>
               </div>
            </TiltCard>

            {/* High-Performance Metrics */}
            {[
              { icon: Target, title: "MISSION GOALS", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              { icon: Trophy, title: "ACHIEVEMENT VECTORS", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
              { icon: Shield, title: "ARMOR ENCRYPTION", color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" }
            ].map((f, i) => (
              <div key={i} className="md:col-span-4 bento-item group p-12 bg-white/[0.02] border border-white/5 rounded-[48px] hover:border-white/20 transition-all duration-700 relative overflow-hidden">
                <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.border} border flex items-center justify-center ${f.color} mb-8 shadow-2xl group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black italic tracking-tight text-white/80 group-hover:text-white transition-colors uppercase mb-4">{f.title}</h4>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '65%' }} transition={{ duration: 1.5, delay: i * 0.2 }} className={`h-full bg-gradient-to-r from-transparent to-current ${f.color}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Terminal CTA */}
        <section className="py-64 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/[0.03] blur-[200px] animate-pulse" />
          <div className="max-w-5xl mx-auto glass-frost rounded-[80px] border-white/10 p-24 md:p-32 relative text-center shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] overflow-hidden">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}>
              <h2 className="text-6xl md:text-9xl font-black mb-12 tracking-[-0.05em] leading-none uppercase italic relative z-10">
                READY FOR <br />
                <span className="text-gradient-blue italic">IMPACT?</span>
              </h2>
              <p className="text-2xl text-white/30 mb-20 max-w-2xl mx-auto italic font-medium leading-relaxed tracking-tight relative z-10">
                Join the sovereign network of operators who have redefined capital velocity.
              </p>
              <MagneticButton>
                <Button 
                  onClick={handleLogin}
                  size="lg"
                  className="h-28 px-20 rounded-[32px] bg-white text-black hover:bg-white/90 font-black text-3xl italic tracking-tighter click-scale shadow-[0_60px_120px_-30px_rgba(255,255,255,0.4)] relative z-10"
                >
                  START SYNC
                </Button>
              </MagneticButton>
            </motion.div>
          </div>
        </section>

        {/* Cinematic Architectural Footer */}
        <footer className="max-w-7xl mx-auto px-10 py-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="space-y-10 max-w-md">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-3xl bg-white text-black flex items-center justify-center font-black text-3xl shadow-2xl">F</div>
              <span className="text-3xl font-black tracking-tighter uppercase italic text-white leading-none">PocketFund <span className="opacity-10">GLOBAL</span></span>
            </div>
            <p className="text-white/20 text-xl font-medium italic leading-relaxed tracking-tight">The definitive interface for multi-generational wealth architecture and capital autonomy.</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-24">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-10">Protocols</h4>
              {['Encryption', 'Terminals', 'Sync Network'].map(l => (
                <a key={l} href="#" className="block text-lg font-black italic text-white/10 hover:text-white transition-colors">{l}</a>
              ))}
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-10">Network</h4>
              {['Status: Active', 'Latency: 0.2ms', 'Global Core'].map(l => (
                <p key={l} className="text-lg font-black italic text-white/40">{l}</p>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
