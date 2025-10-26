import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  if (!isAuthenticated) {
    return (
      <nav className="sticky top-0 z-50 border-b border-primary/20 bg-background/30 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/30 shadow-[0_8px_32px_rgba(139,92,246,0.1)]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pocket Fund
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={handleLogin} data-testid="nav-button-login">
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/20 bg-background/30 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/30 shadow-[0_8px_32px_rgba(139,92,246,0.1)]">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pocket Fund
            </h1>
          </Link>
          
          <div className="flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  location === item.url
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                }`}
                data-testid={item.testId}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback>
                      {user?.firstName?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.firstName || user?.email}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              The Financial Glow-Up
            </h1>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50">
            <div className="flex flex-col space-y-2 mt-4">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    location === item.url
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  }`}
                  data-testid={item.testId}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              ))}
              
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} />
                    <AvatarFallback>
                      {user?.firstName?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user?.firstName || user?.email}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Log out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
