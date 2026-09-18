import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export const AppLayout = ({ title = 'Portal Workspace' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Topbar
        onOpenSidebar={() => setSidebarOpen(true)}
        title={title}
      />

      <div className="flex-1 flex min-w-0 relative">
        {/* Responsive Collapsible Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-60 min-w-0 transition-all duration-300">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* Breadcrumbs Navigation */}
            <Breadcrumbs />

            {/* Render Active View */}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
