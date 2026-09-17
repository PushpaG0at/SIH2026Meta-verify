import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { LayoutDashboard, ClipboardCheck, Camera, CheckCircle2 } from 'lucide-react';

export const InspectorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex pb-16 lg:pb-0">
      {/* Sidebar for desktop/tablet */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Topbar
          onOpenSidebar={() => setSidebarOpen(true)}
          title="Field Inspector Telematics Desk"
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar for field inspectors */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around lg:hidden shadow-lg">
        <NavLink
          to="/inspector/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold py-1 ${
              isActive ? 'text-blue-600' : 'text-slate-500'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Overview</span>
        </NavLink>
        <NavLink
          to="/inspector/assignments"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold py-1 ${
              isActive ? 'text-blue-600' : 'text-slate-500'
            }`
          }
        >
          <ClipboardCheck className="w-5 h-5" />
          <span>Assignments</span>
        </NavLink>
        <NavLink
          to="/inspector/assignments/INSP-2026-00104"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold py-1 ${
              isActive ? 'text-blue-600' : 'text-slate-500'
            }`
          }
        >
          <div className="p-1.5 bg-blue-600 text-white rounded-full -mt-4 shadow-md">
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Active Inspect</span>
        </NavLink>
        <NavLink
          to="/inspector/inspections/completed"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold py-1 ${
              isActive ? 'text-blue-600' : 'text-slate-500'
            }`
          }
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Completed</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default InspectorLayout;
