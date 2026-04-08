import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Menu, 
  Wallet, 
  Zap, 
  Trophy, 
  MessageCircle, 
  TrendingUp, 
  Shield, 
  Heart,
  ChevronRight
} from "lucide-react";
import { ShinyText } from "@/components/ShinyText";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-primary/30 relative font-['Inter'] overflow-x-hidden">
      
      {/* --- HERO SECTION (High Fidelity Video Style) --- */}
      <section className="relative h-screen w-full bg-black overflow-hidden group/hero">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Content Overlay */}
        <div className="relative z-10 w-full h-full flex flex-col items-center">
          
          {/* Navigation Bar */}
          <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight font-display">Pocket Fund</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-gray-700/50">
              {['Features', 'Vault', 'Coach', 'Milestones', 'Community'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="text-white/60 hover:text-white text-[11px] font-black uppercase tracking-widest px-4 py-1 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center">
              <button onClick={handleLogin} className="text-white/80 hover:text-white text-sm font-bold flex items-center gap-2 group px-6 py-2 transition-all">
                Sign in
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <button className="lg:hidden text-white">
              <Menu className="w-6 h-6" />
            </button>
          </nav>

          {/* Top Info Section */}
          <div className="w-full max-w-7xl mx-auto px-6 mt-12 grid lg:grid-cols-2 gap-8 items-start">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white/70 text-sm md:text-base max-w-md leading-relaxed font-medium"
            >
              Your money should work as hard as you do. We provide the tools and intelligence to master your finances and build long-term wealth without the stress.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white/70 text-sm md:text-base lg:text-right font-black uppercase tracking-widest"
            >
              50,000+ Savers Reaching Their Goals !
            </motion.p>
          </div>

          {/* Main Hero Content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 -mt-20">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-white/60 text-xs md:text-sm uppercase tracking-[0.4em] mb-6 font-black"
            >
              Reimagine Your Wealth
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-7xl md:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85] uppercase"
            >
              <div className="text-white font-medium">Take Control Of</div>
              <ShinyText text="Your Financial Future" />
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12"
            >
              <Button 
                onClick={handleLogin}
                className="bg-white text-black hover:bg-white/90 rounded-full px-8 md:px-12 py-6 md:py-8 text-lg font-black uppercase tracking-widest group border border-white/10 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- RESTORED SECTIONS --- */}

      {/* Minimalist Dashboard Preview */}
      <section id="features" className="container mx-auto px-6 py-32 z-10 relative">
         <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="relative max-w-5xl mx-auto"
         >
            <div className="absolute inset-0 bg-primary/10 blur-[120px] -z-10" />
            <div className="rounded-[40px] border border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden shadow-2xl p-4 sm:p-12">
               <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8 p-4">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <Heart className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Your Daily Vibe</span>
                     </div>
                     <h3 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-none uppercase">Everything is better when you're in control.</h3>
                     <p className="text-lg text-white/40 font-medium leading-relaxed">No more stress at the end of the month. See exactly where your money goes and where it should stay.</p>
                     
                     <div className="flex flex-col gap-6">
                        {[
                          { icon: Zap, label: "Add spending in one tap", color: "text-yellow-400" },
                          { icon: Shield, label: "Keep your savings locked away", color: "text-blue-400" },
                          { icon: Trophy, label: "Level up your financial health", color: "text-green-400" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-4 group cursor-pointer">
                             <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-white/10 ${item.color}`}>
                                <item.icon className="w-5 h-5" />
                             </div>
                             <span className="text-sm font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{item.label}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="relative">
                     <div className="aspect-[4/5] bg-white/[0.01] border border-white/5 rounded-[40px] p-8 flex flex-col justify-between shadow-inner">
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Vault Reserve</p>
                              <p className="text-4xl font-black font-display tracking-tighter">₹4,52,000</p>
                           </div>
                           <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/50 flex items-center justify-center">
                              <TrendingUp className="w-7 h-7 text-primary" />
                           </div>
                        </div>
                        <div className="h-48 w-full bg-gradient-to-t from-primary/10 to-transparent rounded-3xl border border-white/5 flex items-end p-6 overflow-hidden relative">
                           <div className="w-full flex justify-between items-end h-full gap-3">
                              {[30, 45, 60, 40, 80, 55, 90, 70, 85].map((h, i) => (
                                <motion.div 
                                  key={i} 
                                  initial={{ height: 0 }}
                                  whileInView={{ height: `${h}%` }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex-1 bg-primary/40 rounded-t-lg border-t border-primary/60" 
                                />
                              ))}
                           </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">
                           <span>Jan</span>
                           <span>May</span>
                           <span>Dec</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </motion.div>
      </section>

      {/* Pillars Section */}
      <section id="vault" className="py-20 sm:py-32 container mx-auto px-6 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-8">
           {[
             {
               icon: Zap,
               title: "Built for Speed",
               desc: "Adding an expense takes less than 3 seconds. Track your life as it happens, without the friction of traditional apps.",
               color: "from-yellow-500/10 to-transparent"
             },
             {
               icon: Trophy,
               title: "Win at Saving",
               desc: "Reach milestones, earn technical badges, and turn your boring budget into a game you actually love winning.",
               color: "from-green-500/10 to-transparent"
             },
             {
               icon: MessageCircle,
               title: "Advice You Need",
               desc: "Our AI coach helps you avoid impulse buys and guides you to a better financial future with real-time feedback.",
               color: "from-primary/10 to-transparent"
             }
           ].map((item, i) => (
             <div key={i} className="p-12 rounded-[48px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group overflow-hidden relative">
               <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${item.color} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity`} />
               <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-white" />
               </div>
               <h3 className="text-2xl font-black mb-6 font-display tracking-tight uppercase">{item.title}</h3>
               <p className="text-white/40 leading-relaxed font-medium text-base">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* AI Coach Chat Restoration */}
      <section id="coach" className="py-20 sm:py-40 bg-white/[0.01] border-y border-white/5 relative z-10 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-24">
             <div className="flex-1 space-y-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Always Active AI</span>
               </div>
               <h2 className="text-5xl sm:text-7xl font-black tracking-tighter font-display leading-[0.85] text-white uppercase">
                 Your AI <br />
                 Financial Buddy.
               </h2>
               <p className="text-xl text-white/40 leading-relaxed font-medium max-w-lg">
                 Get 24/7 help without the judgment. From managing debt to finding better ways to save, your coach is always there to guide you toward financial freedom.
               </p>
               <div className="flex gap-6">
                  <div className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">Judgment Free Zone</div>
                  <div className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">Real-time Sync</div>
               </div>
             </div>
             
             <div className="flex-1 w-full space-y-6 relative">
                {/* Visual Glow behind chat */}
                <div className="absolute inset-0 bg-primary/20 blur-[150px] -z-10 opacity-30" />
                {[
                  { text: "Hey! You've stashed ₹2,000 more than usual this week. Huge win! 🏆", pos: "left", sender: "Coach" },
                  { text: "That's awesome! What's next for my savings goal?", pos: "right", sender: "You" },
                  { text: "Keep going! If you stash ₹500 more, you'll reach 50% of your new laptop goal.", pos: "left", sender: "Coach" }
                ].map((chat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: chat.pos === 'left' ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className={`flex flex-col ${chat.pos === 'left' ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-2 px-4">{chat.sender}</div>
                    <div className={`p-6 rounded-[32px] max-w-md text-base font-medium leading-relaxed ${
                      chat.pos === 'left' ? 'bg-white/5 border border-white/10 text-white/80' : 'bg-primary text-white shadow-2xl shadow-primary/20'
                    }`}>
                      {chat.text}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Simple Footer Restoration */}
      <footer className="container mx-auto px-6 py-32 relative z-10 text-center space-y-12">
         <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
               <Wallet className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-tight font-display text-white">Pocket Fund</span>
         </div>
         <div className="flex flex-wrap items-center justify-center gap-12">
            {['Security', 'Protocols', 'Legal', 'Privacy', 'Support'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all transform hover:scale-110">{item}</a>
            ))}
         </div>
         <div className="pt-10 border-t border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 leading-loose">© 2026 Architectural Capital Systems. All Rights Reserved.</p>
         </div>
      </footer>
    </div>
  );
}
