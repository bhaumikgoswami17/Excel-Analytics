import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (username: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    username: string,
    onSuccess?: () => void
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  authFetch: (url: string, options?: RequestInit) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const BASE_URL = 'http://localhost:4000/api/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load profile on refresh
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const res = await fetch(`${BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) throw new Error('Failed to fetch profile');
          const userData = await res.json();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
          console.error('Error fetching profile:', err);
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    fetchProfile();
  }, []);

  // ✅ Smart fetch with token & content-type
  const authFetch = async (url: string, options: any = {}) => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Request failed');
    }

    return await response.json();
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      toast.success(`👋 Welcome back, ${data.user.username || data.user.email}`);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast.error(`❌ ${message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    onSuccess?: () => void
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      await response.json();
      toast.success('🎉 Registration successful! Please verify OTP.');
      onSuccess?.();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast.error(`❌ ${message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('👋 Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, logout, isLoading, error, authFetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};
