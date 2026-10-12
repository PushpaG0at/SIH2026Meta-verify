import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { useLanguage } from '../context/LanguageContext';

export const BusinessLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isHindi } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-900 flex flex-col font-sans">
      {/* Official Government Full-Width Topbar */}
      <Topbar
        onOpenSidebar={() => setSidebarOpen(true)}
        title={isHindi ? 'व्यापारी आवेदक सत्यापन डेस्क' : 'Applicant Business Portal Desk'}
      />

      <div className="flex-1 flex min-w-0 relative">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-60 min-w-0">
          <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1440px] w-full mx-auto">
            <Outlet />
          </main>

          {/* Official Government Footer */}
          <footer className="bg-[#07132B] text-slate-400 py-4 px-6 sm:px-8 border-t border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
            <div className="flex flex-wrap items-center gap-3.5 text-slate-300">
              <Link to="/business/dashboard" className="hover:text-white transition-colors">
                {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
              </Link>
              <span className="text-slate-600">|</span>
              <Link to="/about" className="hover:text-white transition-colors">
                {isHindi ? 'हमारे बारे में' : 'About Us'}
              </Link>
              <span className="text-slate-600">|</span>
              <Link to="/business/applications/new" className="hover:text-white transition-colors">
                {isHindi ? 'सेवाएं' : 'Services'}
              </Link>
              <span className="text-slate-600">|</span>
              <Link to="/how-it-works" className="hover:text-white transition-colors">
                {isHindi ? 'सहायता' : 'Help'}
              </Link>
              <span className="text-slate-600">|</span>
              <Link to="/how-it-works" className="hover:text-white transition-colors">
                {isHindi ? 'संपर्क करें' : 'Contact Us'}
              </Link>
            </div>
            <div className="text-slate-400 text-center sm:text-right">
              <span>
                {isHindi ? '© 2025 मेट्रा-सत्यापन। सर्वाधिकार सुरक्षित।' : '© 2025 Metra - Verify. All rights reserved.'}
              </span>
              <span className="mx-2 text-slate-600">|</span>
              <span className="text-slate-300 font-medium">
                {isHindi ? 'भारत सरकार द्वारा संचालित' : 'Powered by Government of India'}
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default BusinessLayout;
