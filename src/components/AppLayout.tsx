import { Outlet, Navigate, useLocation, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.jpeg";

// Routes guests can browse without signing in. Everything else requires auth.
const PUBLIC_ROUTES = ["/"];

export function AppLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isPublic = PUBLIC_ROUTES.some(
    (r) => location.pathname === r || (r !== "/" && location.pathname.startsWith(r + "/"))
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !isPublic) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Guest landing — no sidebar, just a top bar with Sign In / Sign Up
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-background">
        <header className="flex h-14 items-center justify-between border-b border-border/50 px-6 glass">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImg} alt="EngiNexus" className="h-7 w-7 rounded-full object-cover" />
            <span className="font-bold tracking-tight">EngiNexus</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="rounded-full">
              <Link to="/signin">Sign in</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    );
  }

  // Authenticated — full sidebar layout
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="flex h-12 items-center border-b border-border/50 px-4 glass">
            <SidebarTrigger />
          </header>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
