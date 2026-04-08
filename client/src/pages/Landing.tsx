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
  Heart
} from "lucide-react";
import { ShinyText } from "@/components/ShinyText";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#64CEFB]/30 relative font-['Inter'] overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full bg-black overflow-hidden group/hero">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 scale-110"
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Content Overlay */}
        <div className="relative z-10 w-full h-full flex flex-col items-center">
          
          {/* Minimalist Navigation Bar */}
          <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">Pocket Fund</span>
            </div>

            <div className="flex items-center gap-6">
              <button onClick={handleLogin} className="text-white/60 hover:text-white text-sm font-bold flex items-center gap-2 group transition-all">
                Sign in
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </nav>

          {/* Main Hero Content - Centered & Clean */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl space-y-8"
            >
              <motion.span 
                className="text-[#64CEFB] text-[10px] md:text-xs uppercase tracking-[0.5em] font-black block"
              >
                REIMAGINE YOUR WEALTH
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl md:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85] uppercase"
              >
                <div className="text-white">Take Control Of</div>
                <ShinyText text="Your Financial Future" />
              </motion.h1>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-4">
                <p className="text-white/60 text-xs md:text-sm max-w-[280px] leading-relaxed font-medium">
                  Your money should work as hard as you do. Build wealth without the stress.
                </p>
                <div className="hidden md:block w-px h-8 bg-white/20" />
                <p className="text-white/80 text-xs md:text-sm font-black uppercase tracking-widest">
                  50,000+ Savers Reaching Their Goals
                </p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="pt-8"
              >
                <Button 
                  onClick={handleLogin}
                  className="bg-white text-black hover:bg-white/90 rounded-full px-10 md:px-14 py-7 md:py-8 text-base md:text-lg font-black uppercase tracking-widest group transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.25)]"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- UNIFIED COLOR SCHEME SECTIONS --- */}

      {/* Features Preview */}
      <section className="container mx-auto px-6 py-32 relative">
         <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="relative max-w-5xl mx-auto"
         >
            <div className="absolute inset-0 bg-[#64CEFB]/10 blur-[150px] -z-10" />
            <div className="rounded-[40px] border border-white/5 bg-[#0A0A0A] overflow-hidden shadow-2xl p-8 sm:p-16">
               <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-10">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#64CEFB]/10 border border-[#64CEFB]/20">
                        <Heart className="w-3.5 h-3.5 text-[#64CEFB]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#64CEFB]">Clarity is Key</span>
                     </div>
                     <h3 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none uppercase">One App. <br /> Total Control.</h3>
                     <p className="text-lg text-white/40 font-medium leading-relaxed">No more spreadsheets. See exactly where your money goes and where it should stay with one simple, beautiful interface.</p>
                     
                     <div className="space-y-6">
                        {[
                          { icon: Zap, label: "Add spending in one tap", color: "text-[#64CEFB]" },
                          { icon: Shield, label: "Automatic savings protection", color: "text-[#64CEFB]" },
                          { icon: Trophy, label: "Earn rewards for hitting goals", color: "text-[#64CEFB]" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-4 group cursor-pointer transition-all">
                             <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-[#64CEFB]/20 ${item.color}`}>
                                <item.icon className="w-5 h-5" />
                             </div>
                             <span className="text-xs font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-white">{item.label}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="relative">
                     <div className="aspect-[4/5] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-[48px] p-10 flex flex-col justify-between shadow-2xl">
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Vault Portfolio</p>
                              <p className="text-5xl font-black tracking-tighter tabular-nums">₹4,52,000</p>
                           </div>
                           <div className="w-16 h-16 rounded-3xl bg-[#64CEFB]/20 border border-[#64CEFB]/40 flex items-center justify-center shadow-[0_0_20px_rgba(100,206,251,0.2)]">
                              <TrendingUp className="w-8 h-8 text-[#64CEFB]" />
                           </div>
                        </div>
                        <div className="h-48 w-full bg-[#64CEFB]/5 rounded-3xl border border-white/5 flex items-end p-6 overflow-hidden relative">
                           <div className="w-full flex justify-between items-end h-full gap-2 px-2">
                              {[30, 45, 60, 40, 80, 55, 90, 70, 100].map((h, i) => (
                                <motion.div 
                                  key={i} 
                                  initial={{ height: 0 }}
                                  whileInView={{ height: `${h}%` }}
                                  transition={{ duration: 1, delay: i * 0.05 }}
                                  className="flex-1 bg-gradient-to-t from-[#64CEFB]/40 to-[#64CEFB] rounded-t-sm" 
                                />
                              ))}
                           </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">
                           <span>Q1</span>
                           <span>Q2</span>
                           <span>Q3</span>
                           <span>Q4</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </motion.div>
      </section>

      {/* Triple Pillar Grid */}
      <section className="py-20 sm:py-32 container mx-auto px-6 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-8">
           {[
             {
               icon: Zap,
               title: "Built for Speed",
               desc: "Adding an expense takes less than 3 seconds. Track your life as it happens, without any friction."
             },
             {
               icon: Trophy,
               title: "Gamified Savings",
               desc: "Reach milestones, earn technical badges, and turn your budget into a game you actually love winning."
             },
             {
               icon: MessageCircle,
               title: "AI Guidance",
               desc: "Our AI coach helps you avoid impulse buys and guides you to a better financial future with real-time feedback."
             }
           ].map((item, i) => (
             <div key={i} className="p-12 rounded-[56px] bg-[#0A0A0A] border border-white/5 hover:border-[#64CEFB]/30 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-48 h-48 bg-[#64CEFB]/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-[#64CEFB]/10 transition-all">
                  <item.icon className="w-8 h-8 text-white group-hover:text-[#64CEFB] transition-colors" />
               </div>
               <h3 className="text-2xl font-black mb-6 tracking-tight uppercase">{item.title}</h3>
               <p className="text-white/40 leading-relaxed font-regular text-base">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* AI Coach Chat Restoration */}
      <section className="py-20 sm:py-40 bg-black relative z-10 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-24">
             <div className="flex-1 space-y-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#64CEFB]/10 border border-[#64CEFB]/20">
                  <Zap className="w-3.5 h-3.5 text-[#64CEFB]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#64CEFB]">Proprietary AI Engine</span>
               </div>
               <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.85] text-white uppercase">
                 Meet Your <br />
                 New Advisor.
               </h2>
               <p className="text-xl text-white/40 leading-relaxed font-medium max-w-lg">
                 Smart,judgment-free financial guidance that learns from your behavior to keep you on the path to freedom.
               </p>
               <div className="flex gap-4">
                  <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors cursor-default">24/7 Availability</div>
                  <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors cursor-default">Privacy Centric</div>
               </div>
             </div>
             
             <div className="flex-1 w-full space-y-6">
                {[
                  { text: "Huge win! You've stashed ₹2,000 more than usual this week. 🏆", pos: "left", sender: "AI Coach" },
                  { text: "Nice! Where should that extra cash go?", pos: "right", sender: "You" },
                  { text: "Move it to your 'Laptop' goal. You're now 55% of the way there!", pos: "left", sender: "AI Coach" }
                ].map((chat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: chat.pos === 'left' ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`flex flex-col ${chat.pos === 'left' ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2 px-4">{chat.sender}</div>
                    <div className={`p-7 rounded-[32px] max-w-md text-base font-medium leading-relaxed ${
                      chat.pos === 'left' ? 'bg-[#0A0A0A] border border-white/10 text-white/80' : 'bg-[#64CEFB] text-black font-bold shadow-[0_10px_30px_rgba(100,206,251,0.3)]'
                    }`}>
                      {chat.text}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="container mx-auto px-6 py-32 relative z-10 text-center space-y-12">
         <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
               <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Pocket Fund</span>
         </div>
         <div className="flex flex-wrap items-center justify-center gap-12">
            {['Security', 'Legal', 'Privacy', 'Contact'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-[#64CEFB] transition-all transform hover:scale-110">{item}</a>
            ))}
         </div>
         <div className="pt-10 border-t border-white/5">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/10 leading-loose">© 2026 Architectural Capital Systems. High-Performance Finance.</p>
         </div>
      </footer>
    </div>
  );
}
