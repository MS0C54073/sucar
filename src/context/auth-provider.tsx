"use client";

import type { User, UserRole } from "@/lib/types";
import {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { mockUsers } from "@/lib/placeholder-data";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  login: (role: UserRole) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem("userRole") as UserRole | null;
      if (storedRole) {
        const mockUser = mockUsers.find((u) => u.role === storedRole);
        setUser(mockUser || null);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === "/login" || pathname === "/signup";
      if (!user && !isAuthPage && pathname !== "/") {
        router.push("/login");
      }
    }
  }, [user, loading, pathname, router]);

  const login = (role: UserRole) => {
    const mockUser = mockUsers.find((u) => u.role === role);
    if (mockUser) {
      setUser(mockUser);
      try {
        localStorage.setItem("userRole", role);
        router.push("/dashboard");
      } catch (error) {
        console.error("Could not access localStorage:", error);
        // Fallback for environments where localStorage is not available
        router.push("/dashboard");
      }
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("userRole");
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
    router.push("/login");
  };

  const value = { user, role: user?.role || null, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
