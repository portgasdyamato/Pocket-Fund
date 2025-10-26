import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, TrendingUp, Trophy, Zap, Wallet, Shield, Sparkles, ArrowRight, Users, Star, CheckCircle, Receipt, MessageCircle, FileText } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/30 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500/30 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse-slow" />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-primary/10">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container mx-auto px-6 pt-6 pb-20 relative">
          {/* Header */}
          <header className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12  rounded-xl flex items-center justify-center  shadow-primary/20">
                <img src="/favicon.png" alt="Pocket Fund" className="w-10 h-10 object-contain"  />
              </div>
              <h1 className="text-2xl pt-2 font-bold bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                Pocket Fund
          </h1>
            </div>
          <Button 
              onClick={() => window.location.href = '/api/auth/google'}
              className="rounded-full px-6 h-11 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-shadow"
            data-testid="button-login"
          >
              Get Started
          </Button>
        </header>

          {/* Hero Content */}
          <div className="max-w-5xl mx-auto text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your Smart Money Companion</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                Financial Future
              </span>
          </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              The gamified financial app designed for young adults. Track, fight, stash, and grow your money with engaging challenges and real-time insights.
          </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
                className="rounded-full px-8 py-4 text-lg h-auto bg-gradient-to-r from-primary to-accent hover:shadow-xl transition-all hover:scale-105"
                onClick={() => window.location.href = '/api/auth/google'}
            data-testid="button-get-started"
          >
                Start Free Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-7 text-lg h-auto transition-all"
                onClick={() => window.location.href = '#features'}
              >
                Learn More
          </Button>
        </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-3">
            Key Features
          </h3>
          <p className="text-base text-muted-foreground">
            Everything you need to manage your finances
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          <Card data-testid="card-feature-track" className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border border-primary/30 hover:border-primary/80 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors">TRACK</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Monitor your spending in real-time. See where every rupee goes with our smart transaction tracker.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-feature-fight" className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border border-accent/30 hover:border-accent/80 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-accent/30 to-accent/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-accent/20">
                <Zap className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-base font-bold mb-2 group-hover:text-accent transition-colors">FIGHT</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Categorize expenses as Needs, Wants, or Icks. Challenge yourself to reduce wasteful spending.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-feature-stash" className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border border-secondary/30 hover:border-secondary/80 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-secondary/20">
                <TrendingUp className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-base font-bold mb-2 group-hover:text-secondary transition-colors">STASH</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Move money to your digital locker with one tap. Watch your savings grow over time.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-feature-grow" className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border border-purple-500/30 hover:border-purple-500/80 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/30 to-purple-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                <Trophy className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-base font-bold mb-2 group-hover:text-purple-500 transition-colors">GROW</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Build streaks, unlock achievements, and level up. Make saving money exciting and rewarding.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-feature-expense-log" className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border border-green-500/30 hover:border-green-500/80 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                <Receipt className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-base font-bold mb-2 group-hover:text-green-500 transition-colors">EXPENSE LOG TRACKER</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Log every expense instantly. Get detailed insights and trends to understand your spending patterns better.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-feature-ai-coach" className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border border-blue-500/30 hover:border-blue-500/80 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                <MessageCircle className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-base font-bold mb-2 group-hover:text-blue-500 transition-colors">AI FINANCIAL COACH</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get personalized financial advice 24/7. Ask questions and receive instant guidance on saving, budgeting, and investing.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold mb-3">
            Benefits
          </h3>
          <p className="text-base text-muted-foreground">
            Why thousands choose Pocket Fund
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <Card className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border border-primary/30 hover:border-primary/80 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-7 relative z-10">
              <Shield className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">Bank-Level Security</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your financial data is protected with encryption and secure authentication protocols.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border border-accent/30 hover:border-accent/80 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-7 relative z-10">
              <Users className="w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg font-bold mb-3 group-hover:text-accent transition-colors">AI-Powered Insights</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get personalized financial advice from our AI coach 24/7. Learn as you save.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border border-yellow-500/30 hover:border-yellow-500/80 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-7 relative z-10">
              <Star className="w-12 h-12 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg font-bold mb-3 group-hover:text-yellow-500 transition-colors">Gamification</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Turn saving into a game with challenges, badges, and rewards that keep you motivated.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-primary/10 via-card/80 to-accent/10 border border-primary/40 p-12 hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="relative z-10">
              <Trophy className="w-20 h-20 text-primary mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-4xl font-bold mb-4 group-hover:text-primary transition-colors">Ready to Transform Your Finances?</h3>
              <p className="text-base text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of users who are already taking control of their financial future with Pocket Fund
              </p>
              <Button 
                size="lg"
                className="rounded-full px-10 py-7 text-lg h-auto bg-gradient-to-r from-primary to-accent hover:shadow-xl transition-all hover:scale-110"
                onClick={() => window.location.href = '/api/auth/google'}
                data-testid="button-start-journey"
              >
                Start Your Journey Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Pocket Fund</span>
          </div>
          <p className="text-muted-foreground text-xs">
            © 2025 Pocket Fund. All rights reserved.
          </p>
      </div>
      </footer>
    </div>
  );
}
