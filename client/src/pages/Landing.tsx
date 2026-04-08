import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
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
  PieChart as PieChartIcon,
  Heart
} from "lucide-react";
import { useRef, useState } from "react";

const PillarCard = ({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="perspective-1000"
    >
      <div className="relative p-10 rounded-[40px] glass-border-premium h-full transition-colors group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-500">
            <Icon className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-3xl font-bold mb-5 font-['Space_Grotesk'] tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-white/40 leading-relaxed font-medium text-lg">
            {desc}
          </p>
        </div>
        
        {/* Decorative corner light */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-all" />
      </div>
    </motion.div>
  );
};

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020202] text-white selection:bg-primary/30 relative font-['Inter'] overflow-x-hidden">
      
      {/* Dynamic Background Elements */}
      <motion.div 
        style={{ opacity: heroOpacity }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-blob" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[130px] animate-blob animation-delay-2000" />
      </motion.div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-20 container mx-auto px-6 z-10">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-5xl mx-auto text-center space-y-16"
        >
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Finally, a way to save that actually works</span>
            </motion.div>
            
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.85] font-['Space_Grotesk'] text-white">
              <motion.span 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="block"
              >
                Stop guessing.
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-white/40"
              >
                Start growing.
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl sm:text-3xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              Track spending. Reach goals. Talk to your AI coach. All in one beautiful place.
            </motion.p>
          </div>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.8 }}
             className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
             <button 
               onClick={handleLogin} 
               className="group relative h-20 px-16 rounded-3xl bg-white text-black font-black text-xl overflow-hidden hover:scale-105 transition-all duration-500 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
             >
               <span className="relative z-10 flex items-center gap-3">
                 Get Started
                 <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-10 transition-opacity" />
             </button>
             
             <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-12 h-12 rounded-full border-4 border-[#020202] bg-white/[0.05] overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 789}`} alt="User" />
                 </div>
               ))}
               <div className="w-12 h-12 rounded-full border-4 border-[#020202] bg-white/10 flex items-center justify-center text-xs font-black text-white/40 backdrop-blur-md">
                 +42k
               </div>
             </div>
          </motion.div>
        </motion.div>

        {/* Floating Background Hint */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">Scroll to experience</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* The Pillars Section: Redesigned with 3D Motion */}
      <section className="py-40 relative z-10 border-t border-white/[0.05] bg-black/20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-32 space-y-6">
             <div className="w-12 h-1 bg-primary rounded-full" />
             <h2 className="text-4xl sm:text-7xl font-black tracking-tight font-['Space_Grotesk'] leading-tight">
               Built for the way <br />you live now.
             </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
             <PillarCard 
               icon={Zap}
               title="Built for Speed"
               desc="Add an expense in under 3 seconds. No messy forms, just tap and go. Track your world at the speed of life."
               delay={0.1}
             />
             <PillarCard 
               icon={Trophy}
               title="Win at Saving"
               desc="Turn your budget into a game. Reach goals, earn Rare badges, and level up your financial health in real-time."
               delay={0.2}
             />
             <PillarCard 
               icon={MessageCircle}
               title="Advice You Need"
               desc="An AI coach that actually knows you. Friendly, no-judgment advice to help you avoid impulse buys and stay on track."
               delay={0.3}
             />
          </div>
        </div>
      </section>

      {/* Interactive Mockup Section */}
      <section className="py-40 container mx-auto px-6 relative z-10">
         <motion.div
           initial={{ opacity: 0, y: 100 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="relative max-w-6xl mx-auto group"
         >
            <div className="absolute inset-0 bg-primary/20 blur-[150px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
            
            <div className="relative rounded-[60px] border border-white/10 bg-[#050505] overflow-hidden shadow-2xl p-3">
               <div className="rounded-[50px] border border-white/5 overflow-hidden aspect-[16/10] bg-black flex flex-col">
                  {/* Fake UI Header */}
                  <div className="h-20 border-b border-white/[0.05] px-10 flex items-center justify-between bg-white/[0.02]">
                     <div className="flex gap-2">
                        {[1, 2, 3].map(i => <div key={i} className="w-3 h-3 rounded-full bg-white/10" />)}
                     </div>
                     <div className="w-40 h-8 bg-white/5 rounded-full" />
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/20" />
                        <div className="w-24 h-10 rounded-xl border border-white/10" />
                     </div>
                  </div>
                  
                  {/* Fake UI Body */}
                  <div className="flex-1 p-12 grid grid-cols-12 gap-10">
                     <div className="col-span-8 space-y-10">
                        <div className="h-48 rounded-[40px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] p-10 flex items-end">
                           <div className="space-y-2">
                              <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Available Balance</p>
                              <p className="text-6xl font-bold font-['Space_Grotesk'] text-white">₹4,12,042</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="h-32 rounded-3xl border border-white/[0.03] bg-white/[0.01]" />
                           ))}
                        </div>
                     </div>
                     <div className="col-span-4 rounded-[40px] bg-white/[0.02] border border-white/[0.05] p-8 flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                           <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                              <MessageCircle className="w-6 h-6 text-white" />
                           </div>
                           <span className="font-bold text-white/60">Financial Coach</span>
                        </div>
                        <div className="space-y-4 flex-1">
                           <div className="h-16 rounded-2xl bg-white/5 w-[85%]" />
                           <div className="h-16 rounded-2xl bg-primary/20 w-[70%] ml-auto" />
                           <div className="h-24 rounded-2xl bg-white/5 w-[90%]" />
                        </div>
                        <div className="mt-8 h-12 rounded-full border border-white/10 bg-white/5" />
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Floating Floating Elements around mockup */}
            <motion.div 
               animate={{ y: [0, -20, 0] }} 
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-10 -right-10 w-24 h-24 rounded-3xl bg-primary blur-2xl opacity-20"
            />
         </motion.div>
      </section>

      {/* Trust & Final CTA */}
      <section className="py-40 container mx-auto px-6 text-center z-10 relative">
         <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="space-y-16"
         >
            <h2 className="text-5xl sm:text-8xl font-black tracking-tight font-['Space_Grotesk'] max-w-4xl mx-auto leading-tight">
               Don't just spend. <br />
               <span className="text-white/20">Own your future.</span>
            </h2>
            
            <button 
               onClick={handleLogin}
               className="h-20 px-20 rounded-full bg-primary hover:bg-white hover:text-black transition-all duration-500 font-black text-xl hover:scale-110 active:scale-95 shadow-2xl"
            >
               Get Started for Free
            </button>
            
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
               No credit card required • Syncs with any device • Encrypted privacy
            </p>
         </motion.div>
      </section>

      {/* Simple Modern Footer */}
      <footer className="container mx-auto px-6 py-20 border-t border-white/[0.05] relative z-10">
         <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-black" />
               </div>
               <span className="text-xl font-bold tracking-tight font-['Space_Grotesk'] text-white">Pocket Fund</span>
            </div>
            <div className="flex gap-12">
               {['Legal', 'Privacy', 'Security', 'Twitter'].map(item => (
                 <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors">{item}</a>
               ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">© 2026 Architectural Capital Systems LP.</p>
         </div>
      </footer>
    </div>
  );
}
