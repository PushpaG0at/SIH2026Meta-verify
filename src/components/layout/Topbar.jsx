import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  Building2,
  CheckCheck,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../common/LanguageSelector';
import EmblemIndia from '../common/EmblemIndia';

export const Topbar = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const { role, user, logout } = useAuth();
  const { t, isHindi } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      type: 'AI_DISCREPANCY',
      title: 'AI Pre-check Discrepancy Flagged',
      titleHi: 'एआई प्री-चेक विसंगति चिह्नित',
      message: 'Statutory scrutiny detected non-conforming or mismatched document data for instrument MT-108484.',
      messageHi: 'उपकरण MT-108484 के लिए वैधानिक जांच में गैर-अनुरूप या बेमेल दस्तावेज़ डेटा पाया गया।',
      time: 'Just now',
      timeHi: 'अभी-अभी',
      unread: true,
      link: '/business/applications'
    },
    {
      id: 'notif-2',
      type: 'INSPECTION_ASSIGNED',
      title: 'Field Verification Scheduled',
      titleHi: 'फ़ील्ड सत्यापन निर्धारित',
      message: 'Legal Metrology Inspector Vikram Sharma has been scheduled for standard weight test audit.',
      messageHi: 'विधिक मापविज्ञान निरीक्षक विक्रम शर्मा को मानक वजन परीक्षण के लिए नियुक्त किया गया है।',
      time: '45m ago',
      timeHi: '45 मिनट पहले',
      unread: true,
      link: '/business/applications'
    },
    {
      id: 'notif-3',
      type: 'CERT_ISSUED',
      title: 'Digital Certificate Active',
      titleHi: 'डिजिटल प्रमाणपत्र सक्रिय',
      message: 'Verification Certificate #METRA-CERT-2026-595654 published with SHA-256 seal.',
      messageHi: 'सत्यापन प्रमाणपत्र #METRA-CERT-2026-595654 SHA-256 सील के साथ प्रकाशित किया गया।',
      time: '3h ago',
      timeHi: '3 घंटे पहले',
      unread: false,
      link: '/business/certificates'
    },
    {
      id: 'notif-4',
      type: 'STATUTORY_ALERT',
      title: 'Periodic Verification Cycle Open',
      titleHi: 'आवधिक सत्यापन चक्र प्रारंभ',
      message: 'Quarterly compliance window open under Legal Metrology Act, 2009 for commercial weighing instruments.',
      messageHi: 'वाणिज्यिक माप उपकरणों के लिए विधिक मापविज्ञान अधिनियम, 2009 के तहत तिमाही अनुपालन विंडो खुली है।',
      time: 'Yesterday',
      timeHi: 'कल',
      unread: false,
      link: '/business/instruments'
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotifClick = (notif) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    setNotifOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const effectiveRole = (user?.role || role || 'BUSINESS').toUpperCase();
  const fallbackName = effectiveRole === 'INSPECTOR'
    ? 'Insp. Vikram Sharma'
    : effectiveRole === 'OFFICER'
    ? 'Shri R. Sen'
    : 'Ramesh Kumar';
  const userName = user?.name || fallbackName;

  const cleanNameForInitials = userName
    .replace(/^(insp\.?|officer|dr\.?|shri|smt\.?|mr\.?|ms\.?|mrs\.?)\s+/i, '')
    .trim();
  const nameParts = cleanNameForInitials.split(/\s+/).filter(Boolean);
  const userInitials = nameParts.length >= 2
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : (cleanNameForInitials.slice(0, 2).toUpperCase() || 'MV');

  const userRoleLabel = effectiveRole === 'BUSINESS'
    ? t.roleBusinessOwner
    : effectiveRole === 'INSPECTOR'
    ? t.roleFieldInspector
    : effectiveRole === 'OFFICER'
    ? t.roleStatutoryOfficer
    : t.roleBusinessOwner;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login');
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'AI_DISCREPANCY':
        return (
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case 'INSPECTION_ASSIGNED':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        );
      case 'CERT_ISSUED':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#07132B] text-white px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-md border-b border-slate-800">
      {/* Left: Government Emblem & Metra-Verify Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Ashoka Emblem & Government Dept Stack */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <EmblemIndia variant="light" className="w-7 h-9 shrink-0 drop-shadow-sm" />
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-white leading-tight tracking-tight">
              {t.govIndia}
            </span>
            <span className="text-[9px] text-slate-300 leading-tight hidden sm:block">
              {t.ministryDept}
            </span>
            <span className="text-[9px] text-slate-400 leading-tight hidden sm:block">
              {t.deptLegalMetrology}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-700/80 mx-1 sm:mx-2 hidden sm:block" />

        {/* Brand Title */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight font-heading">
            {t.metraVerify}
          </span>
          <span className="text-[10px] text-slate-300 leading-tight">
            {t.verificationPortal}
          </span>
        </div>
      </div>

      {/* Right: Language Selector, Notifications, User Profile & Sign Out Option */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Language Selector Dropdown */}
        <LanguageSelector variant="dark" />

        {/* Interactive Notification Center */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen(!notifOpen);
              if (menuOpen) setMenuOpen(false);
            }}
            className={`relative p-2 transition-colors rounded-lg cursor-pointer ${
              notifOpen ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title={t.notifications}
            aria-label="Open notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#07132B] shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Center Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl z-50 text-slate-200 backdrop-blur-xl overflow-hidden animate-fadeIn">
              {/* Header */}
              <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white tracking-wide uppercase">
                    {t.notifications || 'Notifications'}
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                      {unreadCount} {isHindi ? 'नई' : 'New'}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'सभी पढ़ें' : 'Mark all read'}</span>
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80 scrollbar-thin scrollbar-thumb-slate-700">
                {notifications.length === 0 ? (
                  <div className="py-8 px-4 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400/80 mb-2" />
                    <p className="text-xs font-semibold text-slate-300">
                      {isHindi ? 'कोई नई सूचना नहीं है' : 'All caught up!'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isHindi ? 'आपकी सभी वैधानिक सूचनाएं अद्यतित हैं।' : 'No pending alerts or notifications.'}
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={`p-3.5 flex items-start gap-3 hover:bg-slate-800/60 transition-colors cursor-pointer group ${
                        notif.unread ? 'bg-slate-800/30' : ''
                      }`}
                    >
                      {getNotifIcon(notif.type)}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p className={`text-xs font-bold truncate ${notif.unread ? 'text-white' : 'text-slate-300'}`}>
                            {isHindi ? notif.titleHi : notif.title}
                          </p>
                          {notif.unread && (
                            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                          {isHindi ? notif.messageHi : notif.message}
                        </p>
                        <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-slate-800/50">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {isHindi ? notif.timeHi : notif.time}
                          </span>
                          <span className="text-[10px] text-blue-400 group-hover:text-blue-300 flex items-center gap-0.5 font-medium">
                            <span>{isHindi ? 'देखें' : 'View'}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'सभी साफ़ करें' : 'Clear all'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false);
                      navigate('/business/applications');
                    }}
                    className="text-[11px] text-blue-400 hover:underline cursor-pointer font-medium"
                  >
                    {isHindi ? 'सभी आवेदन देखें →' : 'View Applications →'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Container with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 select-none rounded-xl hover:bg-slate-800/80 transition-all cursor-pointer group focus:outline-none"
            title="User Profile Menu"
          >
            {/* Avatar Circle with Initials */}
            <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold border border-slate-700 flex items-center justify-center text-xs tracking-wider ring-1 ring-white/10 group-hover:ring-blue-400 transition-all">
              {userInitials}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight group-hover:text-blue-300 transition-colors">
                {userName}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                {userRoleLabel}
              </span>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 ${menuOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          {/* Interactive Profile Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl py-2 z-50 text-slate-200 backdrop-blur-xl animate-fadeIn">
              <div className="px-4 py-3 border-b border-slate-800">
                <p className="text-xs font-bold text-white leading-tight">{userName}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{user?.email || 'ramesh@kirana.in'}</p>
                <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/20">
                  <Building2 className="w-3 h-3" />
                  <span>{userRoleLabel}</span>
                </div>
              </div>

              {user?.organization && (
                <div className="px-4 py-2 text-[11px] text-slate-400 border-b border-slate-800">
                  <span className="block text-slate-500 text-[9px] uppercase font-bold">{t.organization}</span>
                  <span className="text-slate-300 font-medium">{user.organization}</span>
                </div>
              )}

              <div className="p-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600/20 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>{t.signOutPortal}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Sign Out Button Aside User Profile */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/30 hover:border-rose-400 text-xs font-bold transition-all cursor-pointer shadow-xs"
          title={t.signOut}
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">{t.signOut}</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
