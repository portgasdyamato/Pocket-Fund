import { Home, Zap, TrendingUp, BookOpen, Trophy, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "HQ",
    url: "/",
    icon: Home,
    testId: "link-hq",
  },
  {
    title: "The Fight",
    url: "/fight",
    icon: Zap,
    testId: "link-fight",
  },
  {
    title: "The Glow-Up",
    url: "/glow-up",
    icon: TrendingUp,
    testId: "link-glow-up",
  },
  {
    title: "Level Up",
    url: "/level-up",
    icon: BookOpen,
    testId: "link-level-up",
  },
  {
    title: "Trophy Case",
    url: "/trophy-case",
    icon: Trophy,
    testId: "link-trophy-case",
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    testId: "link-profile",
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          The Financial Glow-Up
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={item.testId}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
