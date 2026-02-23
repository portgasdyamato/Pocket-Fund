import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wallet, Lock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ThemeToggle from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Zap, 
  TrendingUp, 
  BookOpen, 
  Trophy, 
  User, 
  LogOut,
  Settings,
  Menu,
  X,
  Receipt,
  MessageCircle,
  ChevronRight
} from "lucide-react";

const menuItems = [
  {
    title: "HQ",
    url: "/",
    icon: Home,
    testId: "nav-link-hq",
    color: "text-[#6366f1]",
    bg: "bg-[#6366f1]/10",
    border: "border-[#6366f1]/20",
  },
  {
    title: "The Fight",
    url: "/fight",
    icon: Zap,
    testId: "nav-link-fight",
    color: "text-[#f59e0b]",
    bg: "bg-[#f59e0b]/10",
    border: "border-[#f59e0b]/20",
  },
  {
    title: "The Glow-Up",
    url: "/glow-up",
    icon: TrendingUp,
    testId: "nav-link-glow-up",
    color: "text-[#8b5cf6]",
    bg: "bg-[#8b5cf6]/10",
    border: "border-[#8b5cf6]/20",
  },
  {
    title: "Level Up",
    url: "/level-up",
    icon: BookOpen,
    testId: "nav-link-level-up",
    color: "text-[#0ea5e9]",
    bg: "bg-[#0ea5e9]/10",
    border: "border-[#0ea5e9]/20",
  },
  {
    title: "Trophy Case",
    url: "/trophy-case",
    icon: Trophy,
    testId: "nav-link-trophy-case",
    color: "text-[#f59e0b]",
    bg: "bg-[#f59e0b]/10",
    border: "border-[#f59e0b]/20",
  },
  {
    title: "Log Expense",
    url: "/expenses",
    icon: Receipt,
    testId: "nav-link-expenses",
    color: "text-[#10b981]",
    bg: "bg-[#10b981]/10",
    border: "border-[#10b981]/20",
  },
  {
    title: "Ask Coach",
    url: "/coach",
    icon: MessageCircle,
    testId: "nav-link-coach",
    color: "text-[#ec4899]",
    bg: "bg-[#ec4899]/10",
    border: "border-[#ec4899]/20",
  },
];

export function NavigationBar() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch balances for navbar
  const { data: totalStashedData } = useQuery<{ total: number }>({
    queryKey: ["/api/stash/total"],
    enabled: isAuthenticated
  });

  const walletBalance = parseFloat(user?.walletBalance?.toString() || "0");
  const lockerBalance = parseFloat(totalStashedData?.total?.toString() || "0");

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  if (!isAuthenticated) {
    return (
      <nav className="sticky top-0 z-50 glass-morphism border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300 premium-shadow">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-300">
              Pocket Fund
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button 
              onClick={handleLogin} 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-full px-6 sm:px-8 click-scale text-sm"
              data-testid="nav-button-login"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    // The nav itself is sticky and sits at the top.
    // The mobile drawer is rendered INSIDE the nav but uses position relative/absolute within the nav stack
    <div className="sticky top-0 z-50">
      <nav className="glass-morphism border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group transition-all flex-shrink-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300 premium-shadow">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                Pocket Fund
              </h1>
            </Link>
            
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 overflow-x-auto mx-4">
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 text-xs font-semibold whitespace-nowrap ${
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    data-testid={item.testId}
                  >
                    <item.icon className={`w-3.5 h-3.5 flex-shrink-0`} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="hidden lg:flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 bg-primary/20 px-3 py-1.5 rounded-full border border-primary/30 cursor-pointer hover:bg-primary/30 transition-all click-scale group">
                      <Wallet className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-white">
                        ₹{walletBalance.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="glass-card">
                    <p>Wallet Balance (Available)</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 bg-accent/20 px-3 py-1.5 rounded-full border border-accent/30 cursor-pointer hover:bg-accent/30 transition-all click-scale group">
                      <Lock className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-white">
                        ₹{lockerBalance.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="glass-card">
                    <p>Locker Savings (Protected)</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="w-[1px] h-8 bg-white/10" />
              
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-white/10 click-scale">
                    <Avatar className="h-9 w-9 border-2 border-primary/30">
                      <AvatarImage src={user?.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm">
                        {user?.firstName?.[0] || user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 glass-morphism border-white/10 mt-2" align="end">
                  <div className="p-4 flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/30">
                      <AvatarImage src={user?.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                        {user?.firstName?.[0] || user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5 leading-none">
                      <p className="font-bold text-white">{user?.firstName || user?.email}</p>
                      <p className="text-xs text-white/50 truncate max-w-[140px]">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer rounded-lg mx-1 my-1">
                    <Link href="/profile" className="flex items-center gap-3 py-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer rounded-lg mx-1 my-1">
                    <Link href="/profile" className="flex items-center gap-3 py-2">
                      <Settings className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium">Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-destructive/10 cursor-pointer rounded-lg mx-1 my-1 text-destructive">
                    <div className="flex items-center gap-3 py-2">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Top Bar */}
          <div className="md:hidden flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-white text-base tracking-tight">Pocket Fund</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-primary/15 px-2.5 py-1.5 rounded-full border border-primary/25">
                <Wallet className="w-3 h-3 text-primary" />
                <span className="text-xs font-bold text-white">
                  ₹{walletBalance.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isMobileMenuOpen 
                    ? 'bg-white/10 text-white rotate-90' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer — Slides in below the navbar, no overlap */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[73px] bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Drawer Panel */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -16, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -16, scaleY: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top" }}
              className="absolute top-full left-0 right-0 z-50 md:hidden"
            >
              <div
                className="mx-3 mb-3 rounded-3xl overflow-hidden border border-white/10"
                style={{
                  background: "rgba(10, 10, 15, 0.97)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)"
                }}
              >
                {/* Menu Items */}
                <div className="p-3 space-y-1">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-3 py-2">Navigation</p>
                  {menuItems.map((item, i) => {
                    const isActive = location === item.url;
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          href={item.url}
                          className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                            isActive
                              ? `${item.bg} border ${item.border}`
                              : "hover:bg-white/[0.06]"
                          }`}
                          data-testid={item.testId}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            isActive ? `${item.bg} border ${item.border}` : "bg-white/5 group-hover:bg-white/10"
                          }`}>
                            <item.icon className={`w-4 h-4 ${isActive ? item.color : "text-white/50 group-hover:text-white"}`} />
                          </div>
                          <span className={`text-sm font-bold flex-1 ${
                            isActive ? "text-white" : "text-white/60 group-hover:text-white"
                          }`}>{item.title}</span>
                          {isActive && (
                            <ChevronRight className={`w-4 h-4 ${item.color}`} />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-white/[0.06] mx-4" />

                {/* User Section */}
                <div className="p-3">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 mb-3">
                    <Avatar className="h-11 w-11 border-2 border-primary/30 flex-shrink-0">
                      <AvatarImage src={user?.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-black">
                        {user?.firstName?.[0] || user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-white truncate">{user?.firstName || "User"}</p>
                      <p className="text-xs text-white/40 truncate">{user?.email}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20 flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-black text-green-400">LIVE</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-95"
                      onClick={() => {
                        window.location.href = "/profile";
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-white">Profile</span>
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-all active:scale-95"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-bold text-red-400">Sign Out</span>
                    </button>
                  </div>

                  {/* Balance chips */}
                  <div className="flex gap-2 mt-2">
                    <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-primary/10 border border-primary/20">
                      <Wallet className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-wider">Wallet</p>
                        <p className="text-xs font-black text-white truncate">₹{walletBalance.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-accent/10 border border-accent/20">
                      <Lock className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-wider">Locker</p>
                        <p className="text-xs font-black text-white truncate">₹{lockerBalance.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
