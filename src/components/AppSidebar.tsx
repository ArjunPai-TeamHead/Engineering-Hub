import {
  Cpu, MessageSquare, GraduationCap, BrainCircuit, ShoppingCart,
  Wrench, Database, Home, Moon, Sun, LogIn, LogOut, User, Zap, Settings, Shield, LayoutGrid,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.jpeg";

const zones = [
  { title: "Home", url: "/", icon: Home },
  { title: "The Lab", url: "/lab", icon: Cpu },
  { title: "The Hive", url: "/hive", icon: MessageSquare },
  { title: "The Academy", url: "/academy", icon: GraduationCap },
  { title: "The Core", url: "/core", icon: BrainCircuit },
  { title: "The Depot", url: "/depot", icon: ShoppingCart },
  { title: "The Workshop", url: "/workshop", icon: Wrench },
  { title: "The Hub", url: "/hub", icon: LayoutGrid },
  { title: "Cloud Database", url: "/cloud", icon: Database },
];

export function AppSidebar() {
  const { theme, toggle } = useTheme();
  const { state } = useSidebar();
  const { user, profile, role, signOut } = useAuth();
  const isAdmin = role === "admin";
  const navigate = useNavigate();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold tracking-wider">
            {!collapsed ? (
              <img src={logoImg} alt="Logo" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <img src={logoImg} alt="Logo" className="h-6 w-6 rounded-full object-cover" />
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {zones.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink to={item.url} end={item.url === "/"} className="hover:bg-sidebar-accent rounded-2xl" activeClassName="bg-sidebar-accent text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-1 pb-3">
        {user && profile && (
          <div className={`px-2 py-1.5 rounded-2xl glass ${collapsed ? "flex justify-center" : ""}`}>
            {collapsed ? (
              <User className="h-4 w-4 text-muted-foreground" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground truncate">{profile.display_name}</p>
                  <div className="flex items-center gap-0.5 text-[10px] text-amber font-mono">
                    <Zap className="h-3 w-3" />{profile.volts}
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground capitalize">{role || "apprentice"}</p>
              </>
            )}
          </div>
        )}

        <div className="flex gap-1 justify-center">
          <Button variant="ghost" size="icon" onClick={toggle} className="rounded-2xl">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user && (
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} title="Settings" className="rounded-2xl">
              <Settings className="h-4 w-4" />
            </Button>
          )}
          {user && isAdmin && (
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} title="Admin Dashboard" className="rounded-2xl">
              <Shield className="h-4 w-4" />
            </Button>
          )}
          {user ? (
            <Button variant="ghost" size="icon" onClick={async () => { await signOut(); navigate("/signin"); }} title="Sign out" className="rounded-2xl">
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => navigate("/signin")} title="Sign in" className="rounded-2xl">
              <LogIn className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
