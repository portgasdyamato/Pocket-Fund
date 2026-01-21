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
  MessageCircle
} from "lucide-react";

const menuItems = [
  {
    title: "HQ",
    url: "/",
    icon: Home,
    testId: "nav-link-hq",
  },
  {
    title: "The Fight",
    url: "/fight",
    icon: Zap,
    testId: "nav-link-fight",
  },
  {
    title: "The Glow-Up",
    url: "/glow-up",
    icon: TrendingUp,
    testId: "nav-link-glow-up",
  },
  {
    title: "Level Up",
    url: "/level-up",
    icon: BookOpen,
    testId: "nav-link-level-up",
  },
  {
    title: "Trophy Case",
    url: "/trophy-case",
    icon: Trophy,
    testId: "nav-link-trophy-case",
  },
  {
    title: "Log Expense",
    url: "/expenses",
    icon: Receipt,
    testId: "nav-link-expenses",
  },
  {
    title: "Ask Coach",
    url: "/coach",
    icon: MessageCircle,
    testId: "nav-link-coach",
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
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300 premium-shadow">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-300">
              Pocket Fund
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              onClick={handleLogin} 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-full px-8 click-scale"
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
    <nav className="sticky top-0 z-50 glass-morphism border-b border-white/10">
      <div className="container mx-auto px-6 py-3">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group transition-all">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300 premium-shadow">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
              Pocket Fund
            </h1>
          </Link>
          
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
            {menuItems.map((item) => {
              const isActive = location === item.url;
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                  data-testid={item.testId}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full border border-primary/30 cursor-pointer hover:bg-primary/30 transition-all click-scale group">
                    <Wallet className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-white">
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
                  <div className="flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full border border-accent/30 cursor-pointer hover:bg-accent/30 transition-all click-scale group">
                    <Lock className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-white">
                      ₹{lockerBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="glass-card">
                  <p>Locker Savings (Protected)</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="w-[1px] h-8 bg-white/10 mx-2" />
            
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-white/10 click-scale">
                  <Avatar className="h-9 w-9 border-2 border-primary/30">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
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

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Pocket Fund</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-primary/20 px-3 py-1.5 rounded-full border border-primary/30">
               <Wallet className="w-3.5 h-3.5 text-primary" />
               <span className="text-xs font-bold text-white">
                  ₹{walletBalance.toLocaleString('en-IN')}
               </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[73px] z-50 glass-morphism animate-fadeIn">
            <div className="p-6 flex flex-col gap-2">
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                      isActive
                        ? "bg-primary/20 text-white border border-primary/30"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                    data-testid={item.testId}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                    <span className="text-lg font-medium">{item.title}</span>
                  </Link>
                );
              })}
              
              <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-4">
                <div className="flex items-center gap-4 p-2">
                  <Avatar className="h-12 w-12 border-2 border-primary/30">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                      {user?.firstName?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-lg font-bold text-white">{user?.firstName || user?.email}</p>
                    <p className="text-sm text-white/50">{user?.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="border-white/10 text-white rounded-xl py-6 hover:bg-white/5"
                    onClick={() => {
                      window.location.href = "/profile";
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="rounded-xl py-6"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
