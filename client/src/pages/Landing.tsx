import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { 
  ArrowRight, 
  TrendingUp, 
  Wallet, 
  Shield, 
  Sparkles, 
  Zap,
  MessageCircle,
  Trophy,
  CheckCircle2,
  Heart,
  ChevronRight,
  Plus
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";

const FloatingCard = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
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
      className="relative w-full max-w-sm aspect-[1.6/1] rounded-[32px] bg-gradient-to-br from-white/10 to-transparent border border-white/20 backdrop-blur-xl p-8 shadow-2xl group cursor-none sm:cursor-default"
    >
      <div className="absolute inset-0 bg-primary/10 rounded-[32px] blur-3xl group-hover:bg-primary/20 transition-colors" />
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">
            <Wallet className="w-6 h-6 text-black" />
          </div>
          <div className="flex -space-x-3">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-white/10 overflow-hidden">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 99}`} alt="User" />
               </div>
             ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Total Stashed</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white/20">₹</span>
            <span className="text-4xl font-black font-['Space_Grotesk'] tracking-tighter">84,200</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span>+12.5% vs Last Month</span>
        </div>
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

  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020202] text-white selection:bg-primary/30 relative font-['Inter'] overflow-x-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[100px]" 
        />
      </div>

      {/* Navigation: World Class Interaction */}
      <nav className="fixed top-0 left-0 w-full z-[100] nav-blur border-b border-white/[0.05]">
        <div className="container mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-2xl">
               <Wallet className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-tight font-display text-white italic">POCKET FUND</span>
          </motion.div>

          <div className="flex items-center gap-8">
             <div className="hidden md:flex items-center gap-8">
                {['Security', 'Process', 'Pricing'].map((item) => (
                  <button key={item} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors relative group">
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full" />
                  </button>
                ))}
             </div>
             <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                <button onClick={handleLogin} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors hidden sm:block">Sign In</button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  className="bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-8 h-10 rounded-full shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all flex items-center gap-2"
                >
                  Join Now
                </motion.button>
             </div>
          </div>
        </div>
      </nav>

      {/* Hero: The Motion Experience */}
      <section className="relative pt-40 pb-20 sm:pt-60 sm:pb-40 container mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Version 2.0 Alpha Live</span>
              </motion.div>
              
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.85] font-display">
                <motion.span 
                  initial={{ opacity: 0, rotateX: 45 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="block"
                >
                  Build Your
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, rotateX: 45 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="block animate-gradient-text"
                >
                  Future Self.
                </motion.span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-lg sm:text-xl text-white/40 max-w-lg font-medium leading-relaxed uppercase tracking-tight"
              >
                A high-fidelity financial ecosystem designed for those who value precision over guesswork.
              </motion.p>
            </div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, delay: 1 }}
               className="flex flex-col sm:flex-row items-center gap-6"
            >
               <Button onClick={handleLogin} size="xl" className="h-20 px-12 rounded-[24px] bg-primary hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-[0.3em] transition-all group relative overflow-hidden">
                 <span className="relative z-10">Initialize Interface</span>
                 <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               </Button>
               
               <div className="flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                 <div className="w-10 h-px bg-white/10" />
                 <span>Trusted by 42k+ users</span>
               </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, rotate: 5, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "backOut" }}
            className="hidden lg:flex justify-center perspective-[2000px]"
          >
             <FloatingCard />
             
             {/* Abstract Motion Shapes */}
             <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-12 -right-12 w-24 h-24 rounded-full border border-white/10 blur-xl bg-white/5" 
             />
             <motion.div 
               animate={{ y: [0, 20, 0] }}
               transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute -bottom-16 -left-16 w-32 h-32 rounded-3xl border border-primary/20 blur-2xl bg-primary/10" 
             />
          </motion.div>
        </div>
      </section>

      {/* Feature Grid: Refined Motion Reveal */}
      <section className="py-20 sm:py-40 border-t border-white/[0.05] relative z-10 bg-black/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-[40px] overflow-hidden">
            {[
              {
                icon: Zap,
                title: "Built for Speed",
                desc: "Every transaction recorded in under 3 seconds. Precision tracking as life happens.",
                tag: "HIGH-FIDELITY"
              },
              {
                icon: Trophy,
                title: "Win at Saving",
                desc: "Interactive milestones and badges designed to turn discipline into an addiction.",
                tag: "GAMIFIED"
              },
              {
                icon: MessageCircle,
                title: "Advice You Need",
                desc: "An AI coach that monitors your habits and intercepts bad decisions in real-time.",
                tag: "INTELLIGENT"
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-[#020202] p-12 hover:bg-white/[0.02] transition-all group"
              >
                <div className="mb-10 flex justify-between items-start">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                      <item.icon className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">{item.tag}</span>
                </div>
                <h3 className="text-2xl font-black mb-4 font-display uppercase tracking-tight">{item.title}</h3>
                <p className="text-white/40 leading-relaxed font-medium text-sm uppercase tracking-tight">{item.desc}</p>
                
                <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary">Learn Protocol</span>
                   <ChevronRight className="w-3 h-3 text-primary" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Buddy: The Interactive Chat */}
      <section className="py-40 container mx-auto px-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-32">
           <div className="flex-1 space-y-12">
             <div className="space-y-6">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Behavioral Science</span>
               <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] font-display uppercase">
                 Your AI <br />
                 Financial Buddy.
               </h2>
               <p className="text-xl text-white/40 leading-relaxed font-medium uppercase tracking-tight">
                 Real-world advice without the lecture. From managing debt to finding better ways to save, your coach is always active.
               </p>
             </div>
             <motion.button 
               whileHover={{ x: 10 }}
               className="flex items-center gap-4 group"
             >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
                   <Plus className="w-5 h-5 text-white group-hover:text-black transition-colors" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 group-hover:text-white transition-colors">Request Early Access</span>
             </motion.button>
           </div>
           
           <div className="flex-1 w-full space-y-4 relative">
              <div className="absolute inset-0 bg-primary/10 blur-[150px] -z-10" />
              {[
                { text: "Hey! You've stashed ₹2,000 more than usual this week. Huge win! 🏆", pos: "left", sender: "Coach" },
                { text: "That's awesome! What's next for my savings goal?", pos: "right", sender: "You" },
                { text: "Keep going! If you stash ₹500 more, you'll reach 50% of your new laptop goal.", pos: "left", sender: "Coach" }
              ].map((chat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: chat.pos === 'left' ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`flex flex-col ${chat.pos === 'left' ? 'items-start' : 'items-end'}`}
                >
                  <div className={`px-6 py-4 rounded-[24px] max-w-sm text-sm font-medium ${
                    chat.pos === 'left' ? 'bg-white/5 border border-white/10 text-white/80' : 'bg-white text-black shadow-2xl'
                  }`}>
                    {chat.text}
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* High-End Footer */}
      <footer className="container mx-auto px-6 py-20 border-t border-white/[0.05] flex flex-col items-center gap-12 text-center">
         <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
               <Wallet className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-black tracking-tight font-display italic">POCKET FUND</span>
         </div>
         <div className="flex gap-10">
            {['Protocol', 'Intelligence', 'Auth', 'Privacy'].map(item => (
              <a key={item} href="#" className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors">{item}</a>
            ))}
         </div>
         <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 leading-loose max-w-xs">
           The next standard in personal capital management. Built for your future.
         </p>
      </footer>
    </div>
  );
}
