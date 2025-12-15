
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
import { getFirestore, doc, setDoc, getDoc }from "firebase/firestore";
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
          // Handle case where user exists in Auth but not Firestore
          // For the temp admin, we create the profile if it doesn't exist.
          if (fbUser.email === 'admin@sucar.com') {
             const adminProfile: Omit<User, "userId"> = {
                name: "Admin",
                email: "admin@sucar.com",
                phone: "111-222-3333",
                role: "admin",
                avatarUrl: `https://drive.google.com/uc?export=view&id=1qjEvNJV9aSSL7uZp4pZXq5UTw3f7CLbA`,
                createdAt: new Date(),
             };
             await setDoc(doc(firestore, "users", fbUser.uid), adminProfile);
             setUser({ userId: fbUser.uid, ...adminProfile });
          } else {
             console.log("No user profile found in Firestore for UID:", fbUser.uid);
             setUser(null);
          }
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
      // Special handling for temporary admin credentials
      if (email === 'admin@sucar.com' && password === 'admin2025') {
        try {
          // Try to sign in first, in case the user already exists
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
          // If the user does not exist, create it
          if (error.code === 'auth/user-not-found') {
            await createUserWithEmailAndPassword(auth, email, password);
          } else {
            throw error; // Re-throw other errors
          }
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
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

      const userProfile: Omit<User, "userId" | "createdAt"> = {
        name,
        email,
        phone: "",
        role,
        avatarUrl: `https://drive.google.com/uc?export=view&id=1qjEvNJV9aSSL7uZp4pZXq5UTw3f7CLbA`,
      };

      await setDoc(doc(firestore, "users", fbUser.uid), {
        ...userProfile,
        createdAt: new Date(),
      });
      
      setUser({ userId: fbUser.uid, ...userProfile, createdAt: new Date() });

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
