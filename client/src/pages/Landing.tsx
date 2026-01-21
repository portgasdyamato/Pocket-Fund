import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Target, 
  TrendingUp, 
  Trophy, 
  Zap, 
  Wallet, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Star, 
  CheckCircle, 
  Receipt, 
  MessageCircle, 
  Lock,
  Mic
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-accent/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* Hero Section */}
      <div className="relative z-10">
        <header className="container mx-auto px-6 py-8 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center premium-shadow">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Pocket Fund</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button 
              onClick={handleLogin}
              variant="ghost"
              className="text-white hover:bg-white/5 rounded-full px-6 mr-4"
            >
              Log In
            </Button>
            <Button 
              onClick={handleLogin}
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 font-semibold click-scale"
            >
              Get Started
            </Button>
          </motion.div>
        </header>

        <main className="container mx-auto px-6 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white/80">Reimagining Personal Finance</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]"
            >
              Level Up Your 
              <br />
              <span className="text-gradient">Financial Game</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              The first gamified financial ecosystem designed to help you track spending, build savings, and master money management with AI-powered coaching.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button 
                size="lg"
                onClick={handleLogin}
                className="bg-gradient-to-r from-primary to-accent text-white rounded-full px-10 py-7 text-lg hover:scale-105 transition-transform duration-300 premium-shadow group"
              >
                Join the Mission
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full px-10 py-7 text-lg backdrop-blur-md"
              >
                Learn More
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-16 flex items-center justify-center gap-8 text-sm text-white/40"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Zero Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>AI Insights</span>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Master Your Money</h2>
            <p className="text-white/40 text-lg">Sophisticated tools for the modern saver</p>
          </div>

          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Target,
                title: "Track & Control",
                desc: "Real-time expense tracking with automated categorization and smart budgets.",
                color: "primary"
              },
              {
                icon: Zap,
                title: "The Fighting Spirit",
                desc: "Identify 'Needs', 'Wants', and eliminate 'Icks' with active spending battles.",
                color: "accent"
              },
              {
                icon: Lock,
                title: "Digital Locker",
                desc: "Secure your savings in a digital vault. Watch your future grow one tap at a time.",
                color: "secondary"
              },
              {
                icon: MessageCircle,
                title: "AI Glow-Up Coach",
                desc: "Get 24/7 personalized guidance from our advanced Gemini 2.5 Flash engine.",
                color: "primary"
              },
              {
                icon: Trophy,
                title: "Mission Matrix",
                desc: "Detailed breakdowns of your challenges, streaks, and gamified progress.",
                color: "accent"
              },
              {
                icon: TrendingUp,
                title: "Smart Analytics",
                desc: "High-fidelity visualizations of your financial trajectory and spending patterns.",
                color: "secondary"
              },
              {
                icon: Shield,
                title: "Neural Literacy Links",
                desc: "Master financial concepts through immersive, interactive quests designed to level up your wealth IQ.",
                color: "primary"
              },
              {
                icon: Mic,
                title: "Vocal Command Sync",
                desc: "Interact with your AI strategist using natural voice commands for hands-free financial management.",
                color: "accent"
              },
              {
                icon: Star,
                title: "Commendation Hall",
                desc: "Earn permanent badges and rewards for every strategic victory in your financial saving journey.",
                color: "secondary"
              }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn}>
                <Card className="glass-morphism border-white/5 p-10 h-full hover-lift group relative overflow-hidden rounded-[32px]">
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-${feature.color}/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  <div className={`w-16 h-16 rounded-2xl bg-${feature.color}/10 border border-${feature.color}/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-white/50 leading-relaxed font-medium">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Gamification Section */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="glass-morphism border-white/5 rounded-[40px] p-12 md:p-24 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="grid md:grid-cols-2 items-center gap-16 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-primary">GAMIFIED EXPERIENCE</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Finance has never been this fun.
                  </h2>
                  <p className="text-xl text-white/50 mb-12 leading-relaxed">
                    Earn XP, unlock achievements, and level up your financial status. Turn the tedious chore of budgeting into an epic adventure.
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-primary p-0 text-lg hover:gap-3 transition-all font-semibold hover:bg-transparent"
                  >
                    Explore Gamification <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="aspect-square rounded-[32px] bg-gradient-to-br from-primary to-accent p-1">
                    <div className="w-full h-full bg-black/90 rounded-[31px] flex items-center justify-center relative overflow-hidden">
                      {/* AI Coach Preview Mockup */}
                      <div className="absolute inset-0 p-8 flex flex-col gap-4">
                        {[1, 2, 3].map((_, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md self-end"
                          >
                            <div className="w-32 h-2 bg-white/20 rounded-full mb-2" />
                            <div className="w-48 h-2 bg-white/10 rounded-full" />
                          </motion.div>
                        ))}
                        <motion.div 
                          className="mt-auto self-start bg-primary/20 border border-primary/30 p-6 rounded-2xl backdrop-blur-md"
                        >
                          <Sparkles className="w-6 h-6 text-primary mb-4" />
                          <div className="w-48 h-3 bg-white/30 rounded-full mb-2" />
                          <div className="w-64 h-3 bg-white/20 rounded-full" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse delay-700" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Section */}
        <section className="container mx-auto px-6 py-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Personal AI Coach</h2>
            <p className="text-xl text-white/40 max-w-2xl mx-auto mb-16">
              Get 24/7 financial guidance. From debt management to investment strategies, your AI coach is always here to help you scale your wealth.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { label: "XP EARNED", value: "1.2M+" },
                { label: "TOTAL SAVED", value: "₹4.5Cr" },
                { label: "HAPPY USERS", value: "50K+" },
                { label: "AI SESSIONS", value: "200K+" }
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-xs font-bold text-white/30 tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="py-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 blur-[150px]" />
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-bold mb-12 tracking-tight">
                Ready to take 
                <br />
                the <span className="text-gradient">Throne?</span>
              </h2>
              <Button 
                size="lg"
                onClick={handleLogin}
                className="bg-white text-black hover:bg-white/90 rounded-full px-12 py-8 text-xl font-bold click-scale premium-shadow"
              >
                Launch Your Dashboard
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-20 border-t border-white/5 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Pocket Fund</span>
          </div>
          <p className="text-white/20 text-sm">© 2026 Pocket Fund Ecosystem. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
