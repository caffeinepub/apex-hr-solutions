import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import EmployeeDashboard from "@/pages/EmployeeDashboard";
import HRDashboard from "@/pages/HRDashboard";
import LoginPage from "@/pages/LoginPage";
import PublicSite from "@/pages/PublicSite";
import { type ReactNode, createContext, useContext, useState } from "react";

// ─── Simple hash router ───────────────────────────────────────────────────────

type Route = "/" | "/login" | "/dashboard/hr" | "/dashboard/employee";

interface RouterContextValue {
  route: Route;
  navigate: (to: Route) => void;
}

const RouterContext = createContext<RouterContextValue>({
  route: "/",
  navigate: () => {},
});

export function useRouter() {
  return useContext(RouterContext);
}

function RouterProvider({ children }: { children: ReactNode }) {
  const getInitialRoute = (): Route => {
    const hash = window.location.hash.replace("#", "") as Route;
    const validRoutes: Route[] = [
      "/",
      "/login",
      "/dashboard/hr",
      "/dashboard/employee",
    ];
    return validRoutes.includes(hash) ? hash : "/";
  };

  const [route, setRoute] = useState<Route>(getInitialRoute);

  const navigate = (to: Route) => {
    window.location.hash = to;
    setRoute(to);
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

// ─── Protected route ──────────────────────────────────────────────────────────

function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) {
  const { isAuthenticated, isAdmin, isInitializing } = useAuth();
  const { navigate } = useRouter();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (requireAdmin && !isAdmin) {
    navigate("/dashboard/employee");
    return null;
  }

  return <>{children}</>;
}

// ─── Routes ────────────────────────────────────────────────────────────────────

function Routes() {
  const { route } = useRouter();

  if (route === "/login") return <LoginPage />;
  if (route === "/dashboard/hr") {
    return (
      <ProtectedRoute requireAdmin>
        <HRDashboard />
      </ProtectedRoute>
    );
  }
  if (route === "/dashboard/employee") {
    return <EmployeeDashboard />;
  }
  return <PublicSite />;
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <Routes />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </RouterProvider>
  );
}
