'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
}

interface AuthContextType {
  session: { user: User } | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated session storage
let currentSession: { user: User } | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setSession(currentSession);
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      currentSession = { user: { username: 'admin' } };
      setSession(currentSession);
      router.push('/admin');
      return;
    }
    throw new Error('Invalid credentials');
  };

  const signOut = async () => {
    currentSession = null;
    setSession(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRequireAuth() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push('/admin/login');
    }
  }, [session, loading, router]);

  return { session, loading };
}
