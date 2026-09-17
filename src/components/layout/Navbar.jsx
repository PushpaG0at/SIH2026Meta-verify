import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Search, ArrowRight, Menu, X, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [verifyQuery, setVerifyQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, isAuthenticated, logout } = useAuth();

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (verifyQuery.trim()) {
      navigate(`/verify/${verifyQuery.trim()}`);
      setVerifyQuery('');
    }
  };

  const navLinks = [
    { label: 'Problem', path: '#problem' },
    { label: 'How It Works', path: '#how-it-works' },
    { label: 'Trust Chain', path: '#trust-chain' },
    { label: 'AI Assistance', path: '#ai-assistance' },
    { label: 'User Roles', path: '#user-roles' },
    { label: 'Benefits', path: '#benefits' },
  ];

  const handleNavClick = (e, path) => {
    if (path.startsWith('#')) {
      e.preventDefault();
      if (location.pathname !== '/' && location.pathname !== '/landing') {
        navigate(`/landing${path}`);
      } else {
        const element = document.getElementById(path.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro bar for statutory compliance notice */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Smart India Hackathon 2026 • Legal Metrology Digital Verification System</span>
        </div>
        <div className="flex items-center gap-3 mt-0.5 sm:mt-0 text-slate-400">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span>Signed in as:</span>
              <span className="text-white font-semibold">{user?.name}</span>
              <span className="bg-slate-800 text-blue-400 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold border border-slate-700">
                {role}
              </span>
            </div>
          ) : (
            <Link to="/" className="text-slate-300 hover:text-white transition-colors">
              Dedicated Portal Gateway →
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight font-heading">
                  METRA-VERIFY
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded font-mono">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 tracking-wider uppercase">
                Verify Once. Trust Everywhere.
              </p>
            </div>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Quick Certificate Search Bar (Desktop) */}
          <form onSubmit={handleQuickVerify} className="hidden lg:flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Verify Certificate ID..."
              value={verifyQuery}
              onChange={(e) => setVerifyQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg w-48 focus:w-60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-400 text-slate-800"
            />
          </form>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to={`/${role}/dashboard`}>
                  <Button variant="primary" size="sm" rightIcon={ArrowRight}>
                    Open {role.charAt(0).toUpperCase() + role.slice(1)} Portal
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/verify/MV-2026-000123">
                  <Button variant="primary" size="sm">
                    Verify Certificate
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <form onSubmit={handleQuickVerify} className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Verify Certificate ID (e.g. MV-2026-000123)"
              value={verifyQuery}
              onChange={(e) => setVerifyQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg"
            />
          </form>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link to={`/${role}/dashboard`} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Launch Portal ({role})
              </Button>
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="md" className="w-full">
                Switch Account / Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
