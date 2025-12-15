
"use client";

import {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import type { User, UserRole } from "@/lib/types";

// Initialize Firebase
const { auth, firestore } = initializeFirebase();

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // User is signed in, get their profile from Firestore
        const userDocRef = doc(firestore, "users", fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUser({ userId: fbUser.uid, ...userDocSnap.data() } as User);
        } else {
          // This case might happen if the Firestore doc wasn't created
          // Or if you want to handle profile creation post-social login etc.
          console.log("No user profile found in Firestore for UID:", fbUser.uid);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting user and redirecting
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const fbUser = userCredential.user;

      // Create user profile in Firestore
      const userProfile: Omit<User, "userId" | "createdAt"> = {
        name,
        email,
        phone: "", // Add phone if you collect it, otherwise leave empty
        role,
        avatarUrl: `https://picsum.photos/seed/${fbUser.uid}/100/100`,
      };

      await setDoc(doc(firestore, "users", fbUser.uid), {
        ...userProfile,
        createdAt: new Date(),
      });
      
      setUser({ userId: fbUser.uid, ...userProfile, createdAt: new Date() });

      // onAuthStateChanged will handle the rest
      router.push("/dashboard");

    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/login");
  };

  const value = {
    user,
    firebaseUser,
    role: user?.role || null,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
