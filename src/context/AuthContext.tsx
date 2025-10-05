'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch session:', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);
  const login = (userData: User) => {
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      // Call the logout API to clear server-side cookies
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      // Also clear client-side cookie as backup
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear client state
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};