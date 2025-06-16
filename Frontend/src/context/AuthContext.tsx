import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  username?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string, onSuccess?: () => void) => Promise<boolean>;
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

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      localStorage.removeItem('user');
    }
    setIsLoading(false);
  }, []);

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const text = await response.text(); // log raw response
      console.error('Raw error response:', text);
      throw new Error('Request failed');
    }

    return response.json();
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
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};
