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
import { useFirebase } from "@/firebase";
import {
  doc,
  setDoc,
  getDoc,
  DocumentReference,
  serverTimestamp,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  sendEmailVerification,
} from "firebase/auth";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  role: UserRole | null;
  login: (role: UserRole, email?: string, password?: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DUMMY_USER_DATA: Omit<User, "userId" | "email" | "role" | "createdAt"> = {
  name: "Dummy User",
  phone: "000-000-0000",
  avatarUrl: "https://picsum.photos/seed/avatar-dummy/100/100",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { auth, firestore } = useFirebase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userDocRef = doc(
          firestore,
          "users",
          fbUser.uid
        ) as DocumentReference<User>;
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
        } else {
          // If user exists in auth but not in firestore, maybe it's a new user
          // Or this is a state that needs handling, for now, we logout
           setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);
  
  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === "/login" || pathname === "/signup";
      if (!user && !isAuthPage && pathname !== "/") {
        router.push("/login");
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (role: UserRole, email?: string, password?: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email || `${role}@sucar.com`,
        password || "password"
      );
      const fbUser = userCredential.user;

      const userDocRef = doc(firestore, "users", fbUser.uid) as DocumentReference<User>;
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().role === role) {
        setUser(userDoc.data());
        router.push("/dashboard");
      } else {
        await signOut(auth);
        throw new Error("Role mismatch or user document not found.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "client"
  ) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const fbUser = userCredential.user;

      await sendEmailVerification(fbUser);

      const newUser: User = {
        userId: fbUser.uid,
        name,
        email,
        phone: DUMMY_USER_DATA.phone,
        role,
        avatarUrl: `https://picsum.photos/seed/${fbUser.uid}/100/100`,
        createdAt: new Date(),
      };

      await setDoc(doc(firestore, "users", fbUser.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
      });
      
      setUser(newUser);
      router.push("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = { user, firebaseUser, role: user?.role || null, login, signup, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
