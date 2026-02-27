import { Outlet, Navigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const PUBLIC_ROUTES = ["/"];

export function AppLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isPublic = PUBLIC_ROUTES.includes(location.pathname);

  if (loading && !isPublic) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!loading && !user && !isPublic) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="flex h-12 items-center border-b border-border px-4">
            <SidebarTrigger />
          </header>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
