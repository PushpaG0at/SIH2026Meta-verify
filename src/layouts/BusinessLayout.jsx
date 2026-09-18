import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

export const BusinessLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-900 flex flex-col font-sans">
      {/* Official Government Full-Width Topbar */}
      <Topbar onOpenSidebar={() => setSidebarOpen(true)} />

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
              <Link to="/business/dashboard" className="hover:text-white transition-colors">Home</Link>
              <span className="text-slate-600">|</span>
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              <span className="text-slate-600">|</span>
              <Link to="/business/applications/new" className="hover:text-white transition-colors">Services</Link>
              <span className="text-slate-600">|</span>
              <Link to="/how-it-works" className="hover:text-white transition-colors">Help</Link>
              <span className="text-slate-600">|</span>
              <Link to="/how-it-works" className="hover:text-white transition-colors">Contact Us</Link>
            </div>
            <div className="text-slate-400 text-center sm:text-right">
              <span>© 2025 Metra - Verify. All rights reserved.</span>
              <span className="mx-2 text-slate-600">|</span>
              <span className="text-slate-300 font-medium">Powered by Government of India</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default BusinessLayout;
