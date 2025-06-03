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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, register, error, isLoading } = useAuth();
    const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (isLogin) {
    const success = await login(email, password);
    if (success) navigate('/dashboard');
  } else {
    const success = await register(email, password);
    if (success) {
      // Redirect to OTP page and optionally pass email as state
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
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
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
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
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
                
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.0003 2C6.4773 2 2.0003 6.477 2.0003 12C2.0003 16.418 4.8653 20.1673 8.8383 21.4893C9.3383 21.5813 9.5003 21.2733 9.5003 21.0073C9.5003 20.7663 9.4923 20.0793 9.4883 19.2583C6.8283 19.8583 6.2463 17.9693 6.2463 17.9693C5.7973 16.9113 5.1463 16.6043 5.1463 16.6043C4.2683 16.0013 5.2063 16.0133 5.2063 16.0133C6.1633 16.0813 6.6783 17.0233 6.6783 17.0233C7.5223 18.4273 8.9693 18.0153 9.5173 17.7623C9.6053 17.1093 9.8893 16.6703 10.1753 16.4193C8.0443 16.1653 5.8193 15.3063 5.8193 11.4773C5.8193 10.3873 6.2003 9.4933 6.6963 8.7893C6.5943 8.5403 6.2613 7.5693 6.7883 6.1803C6.7883 6.1803 7.5803 5.9123 9.4703 7.2173C10.2863 7.0003 11.1493 6.8913 12.0003 6.8873C12.8533 6.8913 13.7133 7.0003 14.5303 7.2173C16.4183 5.9123 17.2083 6.1803 17.2083 6.1803C17.7373 7.5693 17.4053 8.5403 17.3033 8.7893C17.8003 9.4933 18.1783 10.3873 18.1783 11.4773C18.1783 15.3153 15.9493 16.1613 13.8133 16.4113C14.1713 16.7193 14.5023 17.3453 14.5023 18.2953C14.5023 19.6543 14.4933 20.6803 14.4933 21.0073C14.4933 21.2753 14.6543 21.5863 15.1623 21.4873C19.1373 20.1673 22.0003 16.4173 22.0003 12.0003C22.0003 6.4773 17.5223 2 12.0003 2Z" />
                    </svg>
                  </button>
                  
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M21.3533 10.018H12.2433V13.976H17.5633C17.154 15.532 15.738 17.118 13.8007 17.826C12.466 18.282 10.9353 18.354 9.80333 18.066C7.92467 17.622 6.48067 16.548 5.618 15.012C5.01733 13.934 4.72867 12.722 4.83333 11.394C4.97067 10.104 5.54 8.876 6.33867 7.954C7.46 6.646 9.12533 5.752 11.04 5.602C12.6427 5.486 14.204 5.988 15.432 6.868C15.7187 7.086 16.0687 7.06 16.3233 6.81L19.3067 3.924C19.6033 3.638 19.5947 3.168 19.286 2.894C17.244 1.086 14.5573 -0.0220008 11.6267 0.000332437C9.23467 0.0180001 6.99733 0.764002 5.138 2.048C2.76867 3.694 1.094 6.048 0.326 8.784C-0.212667 10.728 -0.0880003 12.97 0.692 15.136C1.466 17.326 3.04067 19.276 5.04133 20.572C7.016 21.866 9.46133 22.548 11.948 22.512C14.128 22.482 16.2887 21.85 18.0287 20.596C20.366 18.94 21.93 16.43 22.554 13.626C22.9093 11.92 22.844 9.99 22.844 8.88933C22.844 8.35067 22.3913 7.938 21.852 7.938L21.3533 10.018Z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  {' '}
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