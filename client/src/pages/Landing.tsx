import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
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

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-primary/30 relative font-['Inter'] overflow-x-hidden">
      
      {/* Soft Glow Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      {/* Human-Centric Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.05] backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
               <Wallet className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight font-['Space_Grotesk'] text-white">Pocket Fund</span>
          </div>

          <div className="flex items-center gap-6">
             <button onClick={handleLogin} className="text-sm font-medium text-white/60 hover:text-white transition-colors hidden sm:block">Log in</button>
             <button 
               onClick={handleLogin}
               className="bg-white text-black text-sm font-bold px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95"
             >
               Start Saving
             </button>
          </div>
        </div>
      </nav>

      {/* Hero: The Human Experience */}
      <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 container mx-auto px-6 z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Finally, a way to save that doesn't suck</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.95] font-['Space_Grotesk'] text-white">
              Stop guessing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">
                Start growing.
              </span>
            </h1>
            
            <p className="text-lg sm:text-2xl text-white/50 max-w-2xl mx-auto font-medium leading-relaxed">
              Track your spending, reach your goals, and get advice from an AI coach that actually understands your life.
            </p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
          >
             <Button onClick={handleLogin} className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all click-scale">
               Get Your Free Account
               <ArrowRight className="w-5 h-5 ml-2" />
             </Button>
          </motion.div>

          {/* Social Proof / Simplicity */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 pt-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Easy Setup</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Safe & Secure</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Available 24/7</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Minimalist Dashboard Preview */}
      <section className="container mx-auto px-6 pb-32 z-10">
         <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="relative max-w-5xl mx-auto"
         >
            <div className="absolute inset-0 bg-primary/10 blur-[120px] -z-10" />
            <div className="rounded-[40px] border border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden shadow-2xl p-4 sm:p-8">
               <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-8 p-4">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <Heart className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Your Daily Vibe</span>
                     </div>
                     <h3 className="text-4xl font-bold font-['Space_Grotesk'] tracking-tight">Everything is better when you're in control.</h3>
                     <p className="text-lg text-white/40 font-medium">No more stress at the end of the month. See exactly where your money goes and where it should stay.</p>
                     
                     <div className="flex flex-col gap-4">
                        {[
                          { icon: Zap, label: "Add spending in one tap", color: "text-yellow-400" },
                          { icon: Shield, label: "Keep your savings locked away", color: "text-blue-400" },
                          { icon: Trophy, label: "Level up your financial health", color: "text-green-400" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-4">
                             <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${item.color}`}>
                                <item.icon className="w-4 h-4" />
                             </div>
                             <span className="text-sm font-bold text-white/60 tracking-tight">{item.label}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="relative">
                     <div className="aspect-square bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                           <div className="space-y-1">
                              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Total Savings</p>
                              <p className="text-3xl font-bold font-['Space_Grotesk']">₹4,52,000</p>
                           </div>
                           <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                              <TrendingUp className="w-6 h-6 text-primary" />
                           </div>
                        </div>
                        <div className="h-32 w-full bg-gradient-to-t from-primary/10 to-transparent rounded-2xl border-b-2 border-primary/40 flex items-end p-4">
                           <div className="w-full flex justify-between items-end h-full gap-2">
                              {[30, 45, 60, 40, 80, 55, 90].map((h, i) => (
                                <div key={i} className="flex-1 bg-primary/30 rounded-t-sm" style={{ height: `${h}%` }} />
                              ))}
                           </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-white/20 uppercase tracking-widest">
                           <span>Jan</span>
                           <span>Mar</span>
                           <span>May</span>
                           <span>Jul</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </motion.div>
      </section>

      {/* Three Pillars: Easy, Fun, Smart */}
      <section className="py-20 sm:py-32 container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
           {[
             {
               icon: Zap,
               title: "Built for Speed",
               desc: "Adding an expense takes less than 3 seconds. Track your life as it happens.",
               color: "from-yellow-500/20 to-transparent"
             },
             {
               icon: Trophy,
               title: "Win at Saving",
               desc: "Reach milestones, earn badges, and turn your boring budget into a game you love winning.",
               color: "from-green-500/20 to-transparent"
             },
             {
               icon: MessageCircle,
               title: "Advice You Need",
               desc: "Our AI coach helps you avoid impulse buys and guides you to a better financial future.",
               color: "from-primary/20 to-transparent"
             }
           ].map((item, i) => (
             <div key={i} className="p-10 rounded-[40px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group overflow-hidden relative">
               <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                  <item.icon className="w-6 h-6 text-white" />
               </div>
               <h3 className="text-2xl font-bold mb-4 font-['Space_Grotesk'] tracking-tight">{item.title}</h3>
               <p className="text-white/40 leading-relaxed font-medium">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* AI Coach: The Difference */}
      <section className="py-20 sm:py-40 bg-white/[0.02] border-y border-white/[0.05] relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
             <div className="flex-1 space-y-8">
               <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter font-['Space_Grotesk'] leading-[0.9] text-white">
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
                      chat.pos === 'left' ? 'bg-white/5 border border-white/10 text-white/80' : 'bg-primary text-white shadow-lg'
                    }`}>
                      {chat.text}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="container mx-auto px-6 py-20 relative z-10 text-center space-y-8">
         <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
               <Wallet className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight font-['Space_Grotesk'] text-white">Pocket Fund</span>
         </div>
         <div className="flex flex-wrap items-center justify-center gap-10">
            {['Privacy', 'Terms', 'Support', 'Contact'].map(item => (
              <a key={item} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">{item}</a>
            ))}
         </div>
         <p className="text-[10px] font-bold uppercase tracking-widest text-white/10 leading-loose">© 2026 Pocket Fund. Built for your future.</p>
      </footer>
    </div>
  );
}
