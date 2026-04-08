import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
  ArrowUpRight
} from "lucide-react";
import { ShinyText } from "@/components/ShinyText";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#64CEFB]/30 relative font-['Inter'] overflow-x-hidden">
      
      {/* 
          HERO SECTION (Kept as requested since user liked it)
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
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl space-y-10"
            >
              <div className="space-y-4">
                <span className="text-[#64CEFB] text-[10px] md:text-xs font-black uppercase tracking-[0.6em] block opacity-80">REIMAGINE YOUR WEALTH</span>
                <motion.h1 
                   className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase"
                >
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
                <Button 
                   onClick={handleLogin}
                   className="bg-white text-black hover:bg-white/90 rounded-full px-12 py-7 text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.15)]"
                >
                  Start Now
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 
          NEW BENTO GRID STYLE: CORE BENEFITS
      */}
      <section className="py-24 sm:py-32 container mx-auto px-6 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Main Focus */}
          <div className="md:col-span-2 p-10 sm:p-14 rounded-[40px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#64CEFB]/5 blur-[100px] group-hover:bg-[#64CEFB]/10 transition-all" />
            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#64CEFB]/10 border border-[#64CEFB]/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#64CEFB]" />
              </div>
              <h3 className="text-4xl font-black tracking-tight uppercase leading-none">High-Speed Tracking.</h3>
              <p className="text-lg text-white/40 font-medium max-w-sm">Ditch the spreadsheets. Add expenses in seconds and see your net worth update as you live.</p>
            </div>
            <div className="mt-12 flex gap-4">
              <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">Instant Sync</div>
              <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50">Zero Friction</div>
            </div>
          </div>

          {/* Card 2: Vault */}
          <div className="p-10 rounded-[40px] bg-[#0A0A0A] border border-white/5 flex flex-col justify-between group overflow-hidden relative">
             <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#64CEFB]/10 transition-all">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black tracking-tight uppercase leading-none">The Vault.</h3>
                <p className="text-white/40 font-medium">Safe-guard your long-term wealth in an isolated, protected layer.</p>
             </div>
             <motion.div 
               whileHover={{ scale: 1.05 }}
               className="mt-10 aspect-video bg-[#64CEFB]/5 border border-[#64CEFB]/20 rounded-2xl flex items-center justify-center"
             >
                <TrendingUp className="w-10 h-10 text-[#64CEFB] opacity-40" />
             </motion.div>
          </div>

          {/* Card 3: Gamification */}
          <div className="p-10 rounded-[40px] bg-[#0A0A0A] border border-white/5 flex flex-col justify-between group overflow-hidden relative">
             <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#64CEFB]/10 transition-all">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black tracking-tight uppercase leading-none">Milestones.</h3>
                <p className="text-white/40 font-medium">Earn badges and level up your financial status as you hit your savings goals.</p>
             </div>
             <div className="mt-8 flex flex-wrap gap-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white/20" />
                  </div>
                ))}
             </div>
          </div>

          {/* Card 4: Detailed Insight */}
          <div className="md:col-span-2 p-10 sm:p-14 rounded-[40px] bg-gradient-to-tr from-[#050505] to-transparent border border-white/5 flex flex-col sm:flex-row items-center gap-12 group">
              <div className="space-y-6 flex-1">
                 <h3 className="text-3xl font-black tracking-tight uppercase">Analyze Everything.</h3>
                 <p className="text-lg text-white/40 font-medium">Deep dive into your spending habits with granular analytics that reveal exactly where your leaks are.</p>
              </div>
              <div className="flex-1 w-full flex items-end justify-between h-32 gap-3 px-4">
                 {[40, 70, 50, 90, 60, 45, 80].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      className="flex-1 bg-[#64CEFB]/20 border-t-2 border-[#64CEFB] rounded-t-sm"
                    />
                 ))}
              </div>
          </div>
        </div>
      </section>

      {/* 
          RESTORED CHAT SECTION: AS IT WAS BEFORE (Friendlier Bubble Style)
      */}
      <section className="py-24 sm:py-40 bg-black relative z-10 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
             <div className="flex-1 space-y-8">
               <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter font-display leading-[0.9] text-white">
                 Your AI <br />
                 Financial Buddy.
               </h2>
               <p className="text-xl text-white/40 leading-relaxed font-medium">
                 Get 24/7 help without the judgment. From managing debt to finding better ways to save, your coach is always there to guide you toward financial freedom.
               </p>
               <div className="flex gap-4">
                  <div className="px-6 py-3 bg-white/5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white/60">No judgment</div>
                  <div className="px-6 py-3 bg-white/5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white/60">Always active</div>
               </div>
             </div>
             
             <div className="flex-1 w-full space-y-4">
                {[
                  { text: "Hey! You've stashed ₹2,000 more than usual this week. Huge win! 🏆", pos: "left", sender: "Coach" },
                  { text: "That's awesome! What's next for my savings goal?", pos: "right", sender: "You" },
                  { text: "Keep going! If you stash ₹500 more, you'll reach 50% of your new laptop goal.", pos: "left", sender: "Coach" }
                ].map((chat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: chat.pos === 'left' ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className={`flex flex-col ${chat.pos === 'left' ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1 px-4">{chat.sender}</div>
                    <div className={`p-5 rounded-2xl max-w-sm text-sm font-medium ${
                      chat.pos === 'left' ? 'bg-white/5 border border-white/10 text-white/80' : 'bg-[#64CEFB] text-black shadow-lg font-bold'
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
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
               <Wallet className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase">Pocket Fund</span>
         </div>
         <div className="flex flex-wrap items-center justify-center gap-10">
            {['Privacy', 'Security', 'Compliance', 'Contact'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-[#64CEFB] transition-all">{item}</a>
            ))}
         </div>
         <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/5 pt-10 border-t border-white/5">© 2026 Pocket Fund. Smart Capital Systems.</p>
      </footer>
    </div>
  );
}
