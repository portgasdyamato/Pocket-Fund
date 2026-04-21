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
    <div className="sticky top-0 z-[100]">
      <nav className="ice-frost border-b border-white/[0.05]">
        <div className="w-full px-6 sm:px-10 h-20 flex items-center justify-between">
          <Link href="/" className="group transition-all shrink-0">
            <Logo size="sm" />
          </Link>
          
          <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/[0.05]">
            {menuItems.map((item) => {
              const isActive = location === item.url;
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${
                    isActive
                      ? "bg-white text-black shadow-xl"
                      : "text-white/40 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-2 bg-white/[0.02] p-1 rounded-2xl border border-white/[0.05]">
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <Wallet className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold font-display tabular-nums">₹{walletBalance.toLocaleString('en-IN')}</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <Lock className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-bold font-display tabular-nums">₹{lockerBalance.toLocaleString('en-IN')}</span>
               </div>
            </div>

            <div className="h-8 w-px bg-white/[0.05] hidden sm:block" />

            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative h-10 w-10 flex-shrink-0 focus:outline-none group">
                    <Avatar className="h-10 w-10 border border-white/10 p-0.5 bg-white/[0.05]">
                      <AvatarImage src={user?.profileImageUrl || undefined} className="rounded-full object-cover" />
                      <AvatarFallback className="bg-white/5 text-white text-[10px] font-bold">
                        {user?.firstName?.[0] || user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-72 border-white/[0.05] bg-black/95 backdrop-blur-3xl mt-4 p-2 rounded-3xl overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-2xl rounded-full transform translate-x-1/2 -translate-y-1/2" />
                  <div className="p-4 flex items-center gap-4 relative z-10">
                    <Avatar className="w-12 h-12 border-2 border-white/10 shrink-0">
                      <AvatarImage src={user?.profileImageUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email}`} />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-bold text-white text-lg tracking-tight truncate w-32">{user?.firstName || 'User'}</p>
                      <p className="text-[10px] font-bold uppercase text-white/50 tracking-widest">{user?.email?.split('@')[0]}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {[
                      { icon: User, label: "My Profile", url: "/profile" },
                      { icon: Trophy, label: "Achievements", url: "/achievements" },
                    ].map((item, i) => (
                      <DropdownMenuItem key={i} asChild className="hover:bg-white/[0.08] cursor-pointer rounded-xl p-3 focus:bg-white/[0.1] transition-all">
                        <Link href={item.url} className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 text-white/60" />
                          <span className="text-xs font-bold text-white/90">{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator className="bg-white/10 mx-2 my-2" />
                  <DropdownMenuItem onClick={handleLogout} className="blue-glass-button cursor-pointer rounded-xl p-3 transition-all hover:bg-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <LogOut className="w-4 h-4 text-white/60" />
                      <span className="text-xs font-bold text-white/90">Sign Out</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isMobileMenuOpen ? 'bg-white text-black' : 'bg-white/[0.03] text-white/60 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ice-frost border-white/5 p-6 h-full relative overflow-hidden group"
            >
              <div className="p-6 space-y-6">
                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/[0.05]">
                       <p className="text-[8px] font-bold uppercase text-white/20 tracking-widest mb-1">Wallet</p>
                       <p className="text-sm font-bold text-white">₹{walletBalance.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/[0.05]">
                       <p className="text-[8px] font-bold uppercase text-white/20 tracking-widest mb-1">Locker</p>
                       <p className="text-sm font-bold text-white">₹{lockerBalance.toLocaleString('en-IN')}</p>
                    </div>
                 </div>

                 <div className="space-y-2">
                    {menuItems.map((item, i) => (
                      <Link 
                        key={i} 
                        href={item.url} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          location === item.url ? 'bg-white text-black border-white' : 'bg-white/[0.02] text-white/40 border-white/[0.05]'
                        }`}
                      >
                         <div className="flex items-center gap-4">
                            <item.icon className="w-4 h-4" />
                            <span className="text-xs font-bold">{item.title}</span>
                         </div>
                         <ChevronRight className="w-4 h-4 opacity-40" />
                      </Link>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
