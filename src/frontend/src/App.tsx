import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import EmployeeDashboard from "@/pages/EmployeeDashboard";
import HRDashboard from "@/pages/HRDashboard";
import LoginPage from "@/pages/LoginPage";
import PublicSite from "@/pages/PublicSite";
import { type ReactNode, createContext, useContext, useState } from "react";

// ─── Simple hash router ───────────────────────────────────────────────────────

type Route =
  | "/"
  | "/login"
  | "/portal/hr"
  | "/portal/employee"
  | "/dashboard/hr"
  | "/dashboard/employee";

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
      "/portal/hr",
      "/portal/employee",
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

// ─── Routes ────────────────────────────────────────────────────────────────────

function Routes() {
  const { route } = useRouter();

  // /login still renders the login page for direct access
  if (route === "/login") return <LoginPage />;

  // /portal/hr goes directly to the HR dashboard (open access)
  if (route === "/portal/hr") return <HRDashboard />;

  // /portal/employee and /dashboard/employee both render the employee dashboard
  if (route === "/portal/employee" || route === "/dashboard/employee") {
    return <EmployeeDashboard />;
  }

  if (route === "/dashboard/hr") {
    return <HRDashboard />;
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
