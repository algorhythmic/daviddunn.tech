'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize session from cookie
  useEffect(() => {
    const sessionCookie = Cookies.get('session');
    if (sessionCookie) {
      try {
        const parsedSession = JSON.parse(sessionCookie);
        setSession(parsedSession);
      } catch (error) {
        Cookies.remove('session');
        setSession(null);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      if (username === 'admin' && password === 'admin') {
        const newSession = { user: { username: 'admin' } };

        // Set cookie with strict settings
        Cookies.set('session', JSON.stringify(newSession), {
          expires: 7, // 7 days
          path: '/',
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });

        setSession(newSession);
        router.push('/admin');
        return;
      }
      throw new Error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      Cookies.remove('session', { path: '/' });
      setSession(null);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(AuthContext.Provider, {
    value: { session, loading, signIn, signOut }
  }, children);
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
