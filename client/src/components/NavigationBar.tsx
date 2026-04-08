import { useState, useEffect } from "react";
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
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
  const { scrollY } = useScroll();
  
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(2, 2, 2, 0)", "rgba(2, 2, 2, 0.8)"]
  );
  
  const navBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.05)"]
  );

  const navPadding = useTransform(
    scrollY,
    [0, 100],
    ["1.5rem", "1rem"]
  );

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
      <motion.nav 
        style={{ 
          backgroundColor: navBackground, 
          borderBottomColor: navBorder,
          paddingTop: navPadding,
          paddingBottom: navPadding
        }}
        className="fixed top-0 left-0 w-full z-[100] border-b backdrop-blur-xl transition-all duration-300"
      >
        <div className="container mx-auto px-6 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer transition-all">
            <motion.div 
               whileHover={{ rotate: 15, scale: 1.1 }}
               className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
               <Wallet className="w-6 h-6 text-black" />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter font-['Space_Grotesk'] text-white">Pocket Fund</span>
          </Link>

          <div className="flex items-center gap-8">
             <button onClick={handleLogin} className="text-sm font-bold text-white/40 hover:text-white transition-colors hidden sm:block uppercase tracking-widest">Log in</button>
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={handleLogin}
               className="relative overflow-hidden bg-white text-black text-sm font-black px-8 py-3 rounded-full hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2 group"
             >
               <span className="relative z-10 transition-transform group-hover:-translate-x-1">Start Saving</span>
               <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
               <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-10 transition-opacity" />
             </motion.button>
          </div>
        </div>
      </motion.nav>
    );
  }

  return (
    <div className="sticky top-0 z-[100]">
      <nav className="bg-[#020202]/80 backdrop-blur-3xl border-b border-white/[0.05]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group transition-all shrink-0">
            <motion.div 
               whileHover={{ rotate: -10, scale: 1.1 }}
               className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Wallet className="w-6 h-6 text-black" />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter uppercase font-['Space_Grotesk'] hidden sm:block">Pocket Fund</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05]">
            {menuItems.map((item) => {
              const isActive = location === item.url;
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest relative z-10 ${
                      isActive
                        ? "text-black"
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-bg"
                        className="absolute inset-0 bg-white rounded-xl -z-10 shadow-xl"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-2 bg-white/[0.02] p-1 rounded-2xl border border-white/[0.05]">
               <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.08] transition-all">
                       <Wallet className="w-4 h-4 text-primary" />
                       <span className="text-[11px] font-black font-['Space_Grotesk'] tabular-nums tracking-tighter">₹{walletBalance.toLocaleString('en-IN')}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Available Wallet Balance</TooltipContent>
               </Tooltip>
               <Tooltip>
                  <TooltipTrigger asChild>
                     <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.08] transition-all">
                        <Lock className="w-4 h-4 text-accent" />
                        <span className="text-[11px] font-black font-['Space_Grotesk'] tabular-nums tracking-tighter">₹{lockerBalance.toLocaleString('en-IN')}</span>
                     </div>
                  </TooltipTrigger>
                  <TooltipContent>Locker Savings Balance</TooltipContent>
               </Tooltip>
            </div>

            <div className="h-10 w-px bg-white/[0.1] hidden sm:block" />

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative h-12 w-12 flex-shrink-0 focus:outline-none group">
                     <motion.div 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="h-12 w-12 rounded-2xl border border-white/10 p-0.5 bg-white/[0.05] overflow-hidden"
                     >
                       <Avatar className="h-full w-full border-none">
                         <AvatarImage src={user?.profileImageUrl || undefined} className="object-cover" />
                         <AvatarFallback className="bg-white/5 text-white text-xs font-black">
                           {user?.firstName?.[0] || user?.email?.[0] || "U"}
                         </AvatarFallback>
                       </Avatar>
                     </motion.div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-80 border-white/[0.08] bg-black/95 backdrop-blur-3xl mt-5 p-3 rounded-[32px] overflow-hidden shadow-2xl" 
                  align="end"
                >
                  <div className="p-6 flex items-center gap-5 bg-white/[0.02] rounded-3xl border border-white/[0.05] mb-2">
                    <Avatar className="h-16 w-16 border border-white/10">
                      <AvatarImage src={user?.profileImageUrl || undefined} className="object-cover" />
                      <AvatarFallback className="bg-white/5 text-white font-black text-2xl">
                        {user?.firstName?.[0] || user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-black font-display text-white text-xl tracking-tighter truncate w-40">{user?.firstName || 'User'}</p>
                      <p className="text-[11px] font-black uppercase text-white/30 tracking-widest">{user?.email?.split('@')[0]}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {[
                      { icon: User, label: "Profile", url: "/profile" },
                      { icon: Trophy, label: "Achievements", url: "/achievements" },
                      { icon: Settings, label: "Settings", url: "/settings" }
                    ].map((item, i) => (
                      <DropdownMenuItem key={i} asChild className="hover:bg-white/[0.05] cursor-pointer rounded-2xl p-4 focus:bg-white/[0.1] transition-all">
                        <Link href={item.url} className="flex items-center gap-4">
                          <item.icon className="w-5 h-5 text-white/40" />
                          <span className="text-xs font-black uppercase tracking-widest text-white/80">{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator className="bg-white/5 mx-3 my-3" />
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-500/10 cursor-pointer rounded-2xl p-4 focus:bg-red-500/20 text-red-500 transition-all">
                    <div className="flex items-center gap-4">
                      <LogOut className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                className={`lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isMobileMenuOpen ? 'bg-white text-black' : 'bg-white/[0.05] text-white/60 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              <div className="p-8 space-y-8">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.03] p-5 rounded-3xl border border-white/[0.05]">
                       <div className="flex items-center gap-2 mb-2">
                          <Wallet className="w-3.5 h-3.5 text-primary" />
                          <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Wallet</p>
                       </div>
                       <p className="text-xl font-black font-display text-white">₹{walletBalance.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white/[0.03] p-5 rounded-3xl border border-white/[0.05]">
                       <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-3.5 h-3.5 text-accent" />
                          <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Locker</p>
                       </div>
                       <p className="text-xl font-black font-display text-white">₹{lockerBalance.toLocaleString('en-IN')}</p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    {menuItems.map((item, i) => (
                      <Link 
                        key={i} 
                        href={item.url} 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${
                            location === item.url ? 'bg-white text-black border-white' : 'bg-white/[0.03] text-white/40 border-white/[0.05]'
                          }`}
                        >
                           <div className="flex items-center gap-5">
                              <item.icon className="w-5 h-5" />
                              <span className="text-xs font-black uppercase tracking-widest">{item.title}</span>
                           </div>
                           <ChevronRight className="w-5 h-5 opacity-40" />
                        </motion.div>
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
