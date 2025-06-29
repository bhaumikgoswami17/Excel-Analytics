import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BarChart2, FileSpreadsheet, User, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart2 size={18} /> },
    { name: 'Upload', path: '/upload', icon: <FileSpreadsheet size={18} /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gradient-to-r from-blue-60 via-purple-60 to-pink-300 shadow-md py-2'
          : 'bg-gradient-to-r from-indigo-200 via-sky-50 to-teal-400 py-4'
      } text-white`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <BarChart2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">DataViz</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {user &&
              navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    isActive(link.path) ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
          </nav>

          {/* Right Section (User Info) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <Link to="/profile" className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-400"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={16} className="text-blue-600" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {user &&
              navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 py-2 text-sm font-medium ${
                    isActive(link.path) ? 'text-blue-600' : 'text-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}

            {user ? (
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-400"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={16} className="text-blue-600" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{user.email}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center justify-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline" size="sm" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <Button variant="primary" size="sm" fullWidth>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
