import {
  Cpu,
  MessageSquare,
  GraduationCap,
  BrainCircuit,
  Wrench,
  Home,
  Moon,
  Sun,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useTheme } from "@/components/ThemeProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const zones = [
  { title: "Home", url: "/", icon: Home },
  { title: "The Lab", url: "/lab", icon: Cpu },
  { title: "The Hive", url: "/hive", icon: MessageSquare },
  { title: "The Academy", url: "/academy", icon: GraduationCap },
  { title: "The Core", url: "/core", icon: BrainCircuit },
  { title: "The Toolbox", url: "/toolbox", icon: Wrench },
];

export function AppSidebar() {
  const { theme, toggle } = useTheme();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold tracking-wider">
            {!collapsed && "ENGINEXUS"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {zones.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
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
      <SidebarFooter>
        <Button variant="ghost" size="icon" onClick={toggle} className="mx-auto">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
