import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wallet, Lock, Home, PieChart as PieChartIcon, TrendingUp, BookOpen, Trophy, Receipt, MessageCircle, User, LogOut, Settings, Menu, X, ChevronRight } from "lucide-react";
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

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Analytics", url: "/analytics", icon: PieChartIcon },
  { title: "Vault", url: "/vault", icon: TrendingUp },
  { title: "Learn", url: "/learn", icon: BookOpen },
  { title: "Achievements", url: "/achievements", icon: Trophy },
  { title: "History", url: "/history", icon: Receipt },
  { title: "Coach", url: "/assistant", icon: MessageCircle },
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
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#020205]/40 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 premium-shadow">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Pocket Fund</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button onClick={handleLogin} className="bg-white text-black hover:bg-white/90 rounded-full px-8 font-medium click-scale shadow-lg shadow-white/5">
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <nav className="border-b border-white/5 bg-[#020205]/60 backdrop-blur-2xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group transition-all shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 premium-shadow">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight hidden sm:block">Pocket Fund</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/5">
            {menuItems.map((item) => {
              const isActive = location === item.url;
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-xs font-semibold whitespace-nowrap ${
                    isActive
                      ? "bg-white text-black shadow-xl"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className={`w-3.5 h-3.5`} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 bg-indigo-600/10 px-4 py-2 rounded-full border border-indigo-500/10 hover:border-indigo-500/30 transition-all click-scale cursor-pointer group">
                    <Wallet className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs font-bold text-white">₹{walletBalance.toLocaleString('en-IN')}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="glass-card mt-2">Available Balance</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 bg-cyan-600/10 px-4 py-2 rounded-full border border-cyan-500/10 hover:border-cyan-500/30 transition-all click-scale cursor-pointer group">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-bold text-white">₹{lockerBalance.toLocaleString('en-IN')}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="glass-card mt-2">Locker Protected</TooltipContent>
              </Tooltip>
            </div>

            <div className="h-8 w-[1px] bg-white/5 hidden sm:block" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-white/5 click-scale">
                  <Avatar className="h-9 w-9 border border-white/10">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-bold">
                      {user?.firstName?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 glass-morphism border-white/10 mt-2 p-1 group overflow-hidden" align="end">
                <div className="p-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-blue-600 text-white font-bold">{user?.firstName?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="truncate min-w-0">
                    <p className="font-bold text-sm text-white truncate">{user?.firstName || "Member"}</p>
                    <p className="text-[10px] text-white/40 truncate tracking-tight">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer rounded-lg m-1 py-2">
                  <Link href="/profile" className="flex items-center gap-3"><User className="w-4 h-4 text-white/40" /> <span className="text-sm font-medium">My Account</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer rounded-lg m-1 py-2">
                  <Link href="/profile" className="flex items-center gap-3"><Settings className="w-4 h-4 text-white/40" /> <span className="text-sm font-medium">Preferences</span></Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-red-400/10 cursor-pointer rounded-lg m-1 py-2">
                  <div className="flex items-center gap-3"><LogOut className="w-4 h-4" /> <span className="text-sm font-bold">Sign Out</span></div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-all text-white/60 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#020205]/80 backdrop-blur-md z-[90] md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.98 }} className="absolute top-24 inset-x-4 z-[100] md:hidden">
              <div className="glass-morphism rounded-[32px] overflow-hidden border border-white/10 p-4 space-y-2">
                 {menuItems.map((item, i) => (
                    <motion.div key={item.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                       <Link href={item.url} className={`flex items-center gap-4 p-4 rounded-3xl transition-all ${location === item.url ? 'bg-white text-black font-bold' : 'text-white/40 hover:text-white hover:bg-white/5'}`} onClick={() => setIsMobileMenuOpen(false)}>
                          <item.icon className="w-5 h-5" />
                          <span className="text-sm">{item.title}</span>
                       </Link>
                    </motion.div>
                 ))}
                 <div className="h-[1px] bg-white/5 mx-2 my-4" />
                 <div className="flex gap-4 p-2">
                    <div className="flex-1 p-4 rounded-3xl bg-indigo-600/10 border border-indigo-500/10">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Wallet</p>
                        <p className="text-lg font-black text-white">₹{walletBalance.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex-1 p-4 rounded-3xl bg-cyan-600/10 border border-cyan-500/10">
                        <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Vault</p>
                        <p className="text-lg font-black text-white">₹{lockerBalance.toLocaleString('en-IN')}</p>
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

