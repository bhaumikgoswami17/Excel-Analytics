import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart2, Mail, Lock, EyeOff, Eye, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

interface AuthFormProps {
  isLogin?: boolean;
}

const AuthPages: React.FC<AuthFormProps> = ({ isLogin = true }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, error, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const success = await login(username, password); // Login uses username
      if (success) navigate('/dashboard');
    } else {
      const success = await register(email, password, username); // Register uses all three
      if (success) {
        navigate('/verify-otp', { state: { email } });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <BarChart2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 ml-2">DataViz</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? 'Sign In to Your Account' : 'Create an Account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Username is always needed */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your username"
                    required
                  />
                </div>
              </div>

              {/* Email only for registration */}
              {!isLogin && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Username or Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button type="submit" fullWidth isLoading={isLoading}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <Link
                  to={isLogin ? '/register' : '/login'}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  {isLogin ? 'Sign up now' : 'Sign in'}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => <AuthPages isLogin={true} />;
export const RegisterPage: React.FC = () => <AuthPages isLogin={false} />;

export default AuthPages;
