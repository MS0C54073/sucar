
"use client";

import type { User, UserRole } from "@/lib/types";
import {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { MOCK_USERS, MOCK_CLIENTS, MOCK_DRIVERS, MOCK_PROVIDERS } from "@/lib/mock-data";

// This interface is simplified for the mock provider
interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  login: (role: UserRole, email?: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Mock login function
  const login = async (role: UserRole, email?: string, password?: string) => {
    setLoading(true);
    // Find a mock user with the specified role
    const mockUser = MOCK_USERS.find((u) => u.role === role);
    if (mockUser) {
      setUser(mockUser);
      router.push("/dashboard");
    } else {
      setLoading(false);
      throw new Error(`No mock user found for role: ${role}`);
    }
    setLoading(false);
  };

  // Mock signup function
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    console.log("Signing up user:", { name, email, role });
    // In a real app, you'd create a user. Here we just log in as the chosen role.
    const mockUser = MOCK_USERS.find((u) => u.role === role);
     if (mockUser) {
      setUser(mockUser);
      router.push("/dashboard");
    } else {
      setLoading(false);
      throw new Error(`No mock user found for role: ${role}`);
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    router.push("/login");
  };

  const value = { user, role: user?.role || null, login, signup, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
