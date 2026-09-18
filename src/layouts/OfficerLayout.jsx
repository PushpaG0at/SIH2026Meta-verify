import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export const OfficerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-900 flex flex-col font-sans">
      {/* Official Government Full-Width Topbar */}
      <Topbar
        onOpenSidebar={() => setSidebarOpen(true)}
        title="Authorized Verification Officer Desk"
      />

      <div className="flex-1 flex min-w-0 relative">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-60 min-w-0">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Breadcrumbs />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default OfficerLayout;
