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
  Settings,
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
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.05] backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer transition-all">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
               <Wallet className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight font-['Space_Grotesk'] text-white">Pocket Fund</span>
          </Link>
          <div className="flex items-center gap-6">
             <button onClick={handleLogin} className="text-sm font-medium text-white/60 hover:text-white transition-colors hidden sm:block">Log in</button>
             <button onClick={handleLogin} className="bg-white text-black text-sm font-bold px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2">
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
      <nav className="bg-[#020202]/80 backdrop-blur-2xl border-b border-white/[0.05]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group transition-all shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Wallet className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tighter uppercase font-['Space_Grotesk'] hidden sm:block">Pocket Fund</span>
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
                  <span className="text-xs font-bold font-['Space_Grotesk'] tabular-nums">₹{walletBalance.toLocaleString('en-IN')}</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <Lock className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-bold font-['Space_Grotesk'] tabular-nums">₹{lockerBalance.toLocaleString('en-IN')}</span>
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
                  className="w-72 border-white/[0.05] bg-black/95 backdrop-blur-3xl mt-4 p-2 rounded-3xl overflow-hidden shadow-2xl" 
                  align="end"
                >
                  <div className="p-6 flex items-center gap-4 bg-white/[0.02] rounded-2xl border border-white/[0.05] mb-2">
                    <Avatar className="h-14 w-14 border border-white/10">
                      <AvatarImage src={user?.profileImageUrl || undefined} className="object-cover" />
                      <AvatarFallback className="bg-white/5 text-white font-bold text-xl">
                        {user?.firstName?.[0] || user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-bold text-white text-lg tracking-tight truncate w-32">{user?.firstName || 'User'}</p>
                      <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest">{user?.email?.split('@')[0]}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {[
                      { icon: User, label: "My Profile", url: "/profile" },
                      { icon: Trophy, label: "Achievements", url: "/achievements" },
                      { icon: Settings, label: "Settings", url: "/settings" }
                    ].map((item, i) => (
                      <DropdownMenuItem key={i} asChild className="hover:bg-white/[0.05] cursor-pointer rounded-xl p-3 focus:bg-white/[0.1] transition-all">
                        <Link href={item.url} className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 text-white/40" />
                          <span className="text-xs font-bold text-white/70">{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator className="bg-white/5 mx-2 my-2" />
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-500/10 cursor-pointer rounded-xl p-3 focus:bg-red-500/20 text-red-500 transition-all">
                    <div className="flex items-center gap-3">
                      <LogOut className="w-4 h-4" />
                      <span className="text-xs font-bold">Sign Out</span>
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
              className="lg:hidden border-t border-white/[0.05] bg-[#020202] overflow-hidden"
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
