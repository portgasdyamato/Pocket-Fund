import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Zap, 
  TrendingUp, 
  BookOpen, 
  Trophy, 
  User, 
  LogOut,
  Menu,
  X,
  Receipt,
  MessageCircle,
  ChevronRight,
  PieChart as PieChartIcon,
  ArrowUpRight,
  Wallet,
  Lock
} from "lucide-react";

import { Logo } from "@/components/Logo";

const menuItems = [
  { title: "Vault", url: "/vault", icon: TrendingUp },
  { title: "Coach", url: "/assistant", icon: MessageCircle },
  { title: "Analytics", url: "/analytics", icon: PieChartIcon },
  { title: "Learn", url: "/learn", icon: BookOpen },
  { title: "History", url: "/history", icon: Receipt },
];

export function NavigationBar() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: totalStashedData } = useQuery<{ total: number }>({
    queryKey: ["/api/stash/total"],
    enabled: isAuthenticated
  });

  const walletBalance = parseFloat(user?.walletBalance?.toString() || "0");
  const lockerBalance = parseFloat(totalStashedData?.total?.toString() || "0");

  const handleLogout = () => { window.location.href = "/api/logout"; };
  const handleLogin = () => { window.location.href = "/api/auth/google"; };

  if (!isAuthenticated) {
    return (
      <nav className="ice-frost border-b border-white/[0.05] fixed top-0 w-full z-50">
        <div className="w-full px-6 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="group cursor-pointer">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-6">
             <button onClick={handleLogin} className="text-sm font-medium text-white/60 hover:text-white transition-colors hidden sm:block">Log in</button>
             <button onClick={handleLogin} className="blue-glass-button px-6 py-2.5 rounded-full">
               Get Started
               <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <div className="sticky top-6 z-[100] w-full px-4 flex justify-center pointer-events-none">
      <nav className="relative ice-frost rounded-[40px] h-[72px] flex items-center justify-between px-3 shadow-2xl w-full max-w-[1200px] pointer-events-auto">
        <div className="flex items-center pl-4 pr-6 shrink-0">
          <Link href="/" className="group transition-opacity hover:opacity-80">
            <Logo size="sm" />
          </Link>
        </div>
        
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {menuItems.map((item) => {
            const isActive = location === item.url;
            return (
              <Link
                key={item.title}
                href={item.url}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full transition-colors duration-200 text-[10px] font-black uppercase tracking-[0.15em] ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-[#64CEFB] text-white shadow-[0_0_20px_rgba(100,206,251,0.25)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0 pr-1">
          <div className="hidden xl:flex items-center gap-2.5">
             <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 transition-colors hover:bg-white/[0.05]">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold font-display text-white tabular-nums tracking-wide">₹{walletBalance.toLocaleString('en-IN')}</span>
             </div>
             <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 transition-colors hover:bg-white/[0.05]">
                <Lock className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold font-display text-white tabular-nums tracking-wide">₹{lockerBalance.toLocaleString('en-IN')}</span>
             </div>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block mx-2" />

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative h-11 w-11 flex-shrink-0 focus:outline-none transition-opacity hover:opacity-80">
                  <Avatar className="h-11 w-11 border-2 border-white/10 p-0.5 bg-white/5">
                    <AvatarImage src={user?.profileImageUrl || undefined} className="rounded-full object-cover" />
                    <AvatarFallback className="bg-white/5 text-white text-xs font-black">
                      {user?.firstName?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 border-white/10 bg-black/95 backdrop-blur-3xl mt-6 p-2 rounded-[24px] overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[40px] rounded-full transform translate-x-1/2 -translate-y-1/2" />
                <div className="p-5 flex items-center gap-4 relative z-10">
                  <Avatar className="w-14 h-14 border-2 border-white/10 shrink-0 shadow-lg">
                    <AvatarImage src={user?.profileImageUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email}`} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 overflow-hidden">
                    <p className="font-black text-white text-lg tracking-tight truncate w-full">{user?.firstName || 'User'}</p>
                    <p className="text-[10px] font-bold uppercase text-white/50 tracking-widest truncate">{user?.email?.split('@')[0]}</p>
                  </div>
                </div>
                <div className="space-y-1 p-1">
                  {[
                    { icon: User, label: "My Profile", url: "/profile" },
                    { icon: Trophy, label: "Achievements", url: "/achievements" },
                  ].map((item, i) => (
                    <DropdownMenuItem key={i} asChild className="hover:bg-white/[0.06] focus:bg-white/[0.08] cursor-pointer rounded-[16px] p-3.5 transition-all outline-none">
                      <Link href={item.url} className="flex items-center gap-4">
                        <item.icon className="w-4 h-4 text-white/60" />
                        <span className="text-xs font-bold text-white tracking-wide">{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
                <div className="px-3 py-2">
                  <div className="h-px w-full bg-white/10" />
                </div>
                <div className="p-1">
                  <DropdownMenuItem onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 focus:bg-red-500/20 cursor-pointer rounded-[16px] p-3.5 transition-all outline-none border border-red-500/10 group">
                    <div className="flex items-center gap-4">
                      <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                      <span className="text-xs font-bold text-red-400 group-hover:text-red-300 tracking-wide">Sign Out</span>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              className={`lg:hidden w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isMobileMenuOpen ? 'bg-white text-black' : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="w-full max-w-7xl mt-4 bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] pointer-events-auto"
          >
            <div className="p-6 space-y-6 relative">
               <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 blur-[60px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
               <div className="grid grid-cols-2 gap-3 relative z-10">
                  <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/[0.05]">
                     <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.2em] mb-1.5">Wallet</p>
                     <p className="text-base font-bold font-display text-white">₹{walletBalance.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/[0.05]">
                     <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.2em] mb-1.5">Locker</p>
                     <p className="text-base font-bold font-display text-white">₹{lockerBalance.toLocaleString('en-IN')}</p>
                  </div>
               </div>

               <div className="space-y-2 relative z-10">
                  {menuItems.map((item, i) => (
                    <Link 
                      key={i} 
                      href={item.url} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                        location === item.url ? 'bg-gradient-to-r from-blue-600 to-[#64CEFB] text-white shadow-[0_0_24px_rgba(100,206,251,0.3)]' : 'bg-white/[0.03] text-white border border-white/[0.05] hover:bg-white/[0.06]'
                      }`}
                    >
                       <div className="flex items-center gap-4">
                          <item.icon className="w-5 h-5" />
                          <span className="text-sm font-bold tracking-wide">{item.title}</span>
                       </div>
                       <ChevronRight className="w-4 h-4 opacity-40" />
                    </Link>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
