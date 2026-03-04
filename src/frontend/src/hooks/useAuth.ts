import {
  type ReactNode,
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

interface AuthContextValue {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitializing: boolean;
  login: () => void;
  logout: () => void;
  userProfile: { name?: string; employeeId?: string } | null;
  refetchRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    identity,
    login,
    clear,
    isInitializing: iiInitializing,
    isLoginSuccess,
  } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    employeeId?: string;
  } | null>(null);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const refetchRole = useCallback(async () => {
    if (!actor || !isAuthenticated) {
      setIsAdmin(false);
      setUserProfile(null);
      return;
    }
    try {
      const [adminResult, profileResult] = await Promise.all([
        actor.isCallerAdmin(),
        actor.getCallerUserProfile(),
      ]);
      setIsAdmin(adminResult);
      setUserProfile(profileResult);
    } catch {
      setIsAdmin(false);
      setUserProfile(null);
    }
  }, [actor, isAuthenticated]);

  useEffect(() => {
    if (iiInitializing || actorFetching) {
      setIsInitializing(true);
      return;
    }
    setIsInitializing(false);
    void refetchRole();
  }, [iiInitializing, actorFetching, refetchRole]);

  // Re-check role after successful login
  useEffect(() => {
    if (isLoginSuccess && actor && !actorFetching) {
      void refetchRole();
    }
  }, [isLoginSuccess, actor, actorFetching, refetchRole]);

  const logout = useCallback(() => {
    setIsAdmin(false);
    setUserProfile(null);
    clear();
  }, [clear]);

  const value: AuthContextValue = {
    isAuthenticated,
    isAdmin,
    isInitializing,
    login,
    logout,
    userProfile,
    refetchRole,
  };

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
