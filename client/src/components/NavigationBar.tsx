import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wallet, Lock, Home, PieChart as PieChartIcon, TrendingUp, BookOpen, Trophy, Receipt, MessageCircle, User, LogOut, Settings, Menu, X, ChevronRight, Zap } from "lucide-react";
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

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[var(--nav-height)] transition-all">
      <nav className="h-full border-b border-white/10 glass-frost flex items-center">
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          
          {/* Elite Brand Signature */}
          <Link href="/" className="flex items-center gap-4 group cursor-pointer shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-700 shadow-xl shadow-blue-500/10">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase hidden sm:block">FINANCE<span className="text-blue-500">GLOW</span></span>
          </Link>
          
          {/* Dynamic Core Terminals */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-3xl border border-white/5 mx-4">
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className={`w-3.5 h-3.5`} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Action Interface */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="hidden xl:flex items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-3 bg-blue-600/10 px-5 py-3 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all click-scale cursor-pointer group">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-black text-white tabular-nums">₹{walletBalance.toLocaleString('en-IN')}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="glass-frost mt-2 text-[10px] font-black uppercase tracking-widest p-4">Available Capital</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-3 bg-blue-600/5 px-5 py-3 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all click-scale cursor-pointer group">
                        <Lock className="w-4 h-4 text-white/40" />
                        <span className="text-xs font-black text-white/60 tabular-nums">₹{lockerBalance.toLocaleString('en-IN')}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="glass-frost mt-2 text-[10px] font-black uppercase tracking-widest p-4">Secured Reserves</TooltipContent>
                  </Tooltip>
                </div>

                <div className="h-10 w-[1px] bg-white/5 hidden lg:block" />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-2xl p-0 hover:bg-white/5 click-scale border border-white/5">
                      <Avatar className="h-11 w-11 rounded-[20px]">
                        <AvatarImage src={user?.profileImageUrl || undefined} />
                        <AvatarFallback className="bg-blue-600 text-white text-sm font-black uppercase">
                          {user?.firstName?.[0] || user?.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72 glass-frost border-white/10 mt-4 p-2 rounded-[32px] overflow-hidden" align="end">
                    <div className="p-6 flex items-center gap-4">
                      <Avatar className="h-12 w-12 rounded-2xl shadow-xl">
                        <AvatarImage src={user?.profileImageUrl || undefined} />
                        <AvatarFallback className="bg-blue-600 text-white font-black">{user?.firstName?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="truncate min-w-0">
                        <p className="font-black text-sm text-white truncate uppercase tracking-tight">{user?.firstName || "Member"}</p>
                        <p className="text-[10px] text-white/40 truncate tracking-widest font-bold uppercase mt-1">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer rounded-2xl m-1 py-4 focus:bg-white/5 group">
                      <Link href="/profile" className="flex items-center gap-4 px-4 w-full">
                         <User className="w-4 h-4 text-blue-500" /> 
                         <span className="text-xs font-black uppercase tracking-widest text-white mt-0.5">Profile Terminal</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer rounded-2xl m-1 py-4 focus:bg-white/5 group">
                      <Link href="/profile" className="flex items-center gap-4 px-4 w-full">
                         <Settings className="w-4 h-4 text-white/40" /> 
                         <span className="text-xs font-black uppercase tracking-widest text-white mt-0.5">Preferences</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem onClick={handleLogout} className="text-rose-400 hover:bg-rose-400/10 cursor-pointer rounded-2xl m-1 py-4 focus:bg-rose-400/10">
                      <div className="flex items-center gap-4 px-4">
                         <LogOut className="w-4 h-4" /> 
                         <span className="text-xs font-black uppercase tracking-widest mt-0.5">Terminate Session</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={handleLogin} className="bg-white text-black hover:bg-white/90 rounded-2xl h-14 px-10 font-black text-[10px] tracking-[0.2em] uppercase click-scale shadow-2xl shadow-white/5 border-none">
                Access Core
              </Button>
            )}

            <button className="lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-all text-white/60 hover:text-white border border-white/5" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Interaction System */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#020205]/95 backdrop-blur-xl z-[90] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="absolute top-24 inset-x-4 z-[100] lg:hidden">
              <div className="glass-frost rounded-[40px] overflow-hidden border border-white/10 p-4 space-y-2">
                 {menuItems.map((item, i) => (
                    <motion.div key={item.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                       <Link href={item.url} className={`flex items-center gap-5 p-5 rounded-3xl transition-all ${location === item.url ? 'bg-blue-600 text-white font-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`} onClick={() => setIsMobileMenuOpen(false)}>
                          <item.icon className="w-5 h-5" />
                          <span className="text-xs font-black uppercase tracking-widest">{item.title}</span>
                       </Link>
                    </motion.div>
                 ))}
                 <div className="h-[1px] bg-white/5 mx-4 my-6" />
                 <div className="grid grid-cols-2 gap-4 p-2">
                    <div className="p-6 rounded-[32px] bg-blue-600/10 border border-blue-500/20">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Available</p>
                        <p className="text-xl font-black text-white tabular-nums">₹{walletBalance.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-6 rounded-[32px] bg-white/[0.03] border border-white/10">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Reserves</p>
                        <p className="text-xl font-black text-white/60 tabular-nums">₹{lockerBalance.toLocaleString('en-IN')}</p>
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
