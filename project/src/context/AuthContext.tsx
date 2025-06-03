import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  authFetch: (url: string, options?: RequestInit) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    localStorage.removeItem('user'); // clean corrupted value
  }
  setIsLoading(false);
}, []);

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }

    return response.json();
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

const register = async (
  email: string,
  password: string,
  onSuccess?: () => void // ✅ optional callback for navigation
): Promise<boolean> => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    
    // Optionally store user/token later after OTP
    // setUser(data.user);
    // localStorage.setItem('user', JSON.stringify(data.user));
    // localStorage.setItem('token', data.token);

    if (onSuccess) onSuccess(); // ✅ trigger navigation

    return true;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An unknown error occurred');
    return false;
  } finally {
    setIsLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};
