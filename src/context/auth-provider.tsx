
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
import type { User, UserRole, Provider } from "@/lib/types";

// Initialize Firebase
const { auth, firestore } = initializeFirebase();

// Define the shape of the values passed to the signup function
interface SignUpValues {
    nickname: string;
    password: string;
    role: UserRole;
    businessName?: string;
    location?: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  role: UserRole | null;
  login: (email: string, password: string, name?: string) => Promise<void>;
  signup: (values: SignUpValues) => Promise<void>;
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

  const login = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      // Special handling for temporary admin credentials
      const syntheticEmail = `${name?.toLowerCase()}@sucar.app`;
      const loginEmail = name ? syntheticEmail : email;

      if (loginEmail === 'admin@sucar.app' && password === 'admin2025') {
        try {
          // Try to sign in first, in case the user already exists
          await signInWithEmailAndPassword(auth, loginEmail, password);
        } catch (error: any) {
          // If the user does not exist, create it
          if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, password);
            const fbUser = userCredential.user;
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
            throw error; // Re-throw other errors
          }
        }
      } else {
        await signInWithEmailAndPassword(auth, loginEmail, password);
      }
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (values: SignUpValues) => {
    setLoading(true);
    const { nickname, password, role, businessName, location } = values;
    const email = `${nickname.toLowerCase()}@sucar.app`;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const fbUser = userCredential.user;

      // Create base user profile
      const userProfile: Omit<User, "userId" | "createdAt"> = {
        name: role === 'provider' ? businessName! : nickname,
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

      // Create role-specific profiles
      if (role === 'provider' && businessName && location) {
         const providerProfile: Omit<Provider, 'providerId' | 'userId'> = {
            name: businessName,
            location: location,
            baysCount: 0, // Default value
            services: [], // Default value
            approved: false, // Providers start as unapproved
         };
         await setDoc(doc(firestore, "providers", fbUser.uid), {
            ...providerProfile,
            userId: fbUser.uid,
         });
      }
      // Add logic for 'client' and 'driver' profiles here later

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
