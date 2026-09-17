import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import BusinessLayout from '../layouts/BusinessLayout';
import InspectorLayout from '../layouts/InspectorLayout';
import OfficerLayout from '../layouts/OfficerLayout';
import AppLayout from '../layouts/AppLayout';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import PublicVerification from '../pages/public/PublicVerification';
import HowItWorks from '../pages/public/HowItWorks';
import UIKitShowcasePage from '../pages/public/UIKitShowcasePage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Business Pages
import BusinessDashboard from '../pages/business/BusinessDashboard';
import InstrumentsListPage from '../pages/business/InstrumentsListPage';
import InstrumentNewPage from '../pages/business/InstrumentNewPage';
import InstrumentDetailPage from '../pages/business/InstrumentDetailPage';
import ApplicationsListPage from '../pages/business/ApplicationsListPage';
import ApplicationNewPage from '../pages/business/ApplicationNewPage';
import ApplicationDetailPage from '../pages/business/ApplicationDetailPage';
import CertificatesListPage from '../pages/business/CertificatesListPage';
import CertificateDetailPage from '../pages/business/CertificateDetailPage';

// Inspector Pages
import InspectorDashboard from '../pages/inspector/InspectorDashboard';
import AssignmentsListPage from '../pages/inspector/AssignmentsListPage';
import InspectionDetailPage from '../pages/inspector/InspectionDetailPage';

// Officer Pages
import OfficerDashboard from '../pages/officer/OfficerDashboard';
import OfficerApplicationsListPage from '../pages/officer/OfficerApplicationsListPage';
import OfficerApplicationReviewPage from '../pages/officer/OfficerApplicationReviewPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* UI Kit & Design System (under main AppLayout with Sidebar, Top Navbar, Breadcrumbs) */}
      <Route element={<AppLayout title="UI Foundation & Design System" />}>
        <Route path="/ui-kit" element={<UIKitShowcasePage />} />
        <Route path="/design-system" element={<Navigate to="/ui-kit" replace />} />
      </Route>

      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<HowItWorks />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/verify" element={<PublicVerification />} />
        <Route path="/verify/:certificateId" element={<PublicVerification />} />
      </Route>


      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Business Portal */}
      <Route path="/business" element={<BusinessLayout />}>
        <Route index element={<Navigate to="/business/dashboard" replace />} />
        <Route path="dashboard" element={<BusinessDashboard />} />
        <Route path="instruments" element={<InstrumentsListPage />} />
        <Route path="instruments/new" element={<InstrumentNewPage />} />
        <Route path="instruments/:id" element={<InstrumentDetailPage />} />
        <Route path="applications" element={<ApplicationsListPage />} />
        <Route path="applications/new" element={<ApplicationNewPage />} />
        <Route path="applications/:id" element={<ApplicationDetailPage />} />
        <Route path="certificates" element={<CertificatesListPage />} />
        <Route path="certificates/:id" element={<CertificateDetailPage />} />
      </Route>

      {/* Inspector Portal */}
      <Route path="/inspector" element={<InspectorLayout />}>
        <Route index element={<Navigate to="/inspector/dashboard" replace />} />
        <Route path="dashboard" element={<InspectorDashboard />} />
        <Route path="assignments" element={<AssignmentsListPage />} />
        <Route path="assignments/:id" element={<InspectionDetailPage />} />
        <Route path="inspections/:id" element={<InspectionDetailPage />} />
        <Route path="inspections/completed" element={<AssignmentsListPage />} />
      </Route>

      {/* Officer Portal */}
      <Route path="/officer" element={<OfficerLayout />}>
        <Route index element={<Navigate to="/officer/dashboard" replace />} />
        <Route path="dashboard" element={<OfficerDashboard />} />
        <Route path="applications" element={<OfficerApplicationsListPage />} />
        <Route path="applications/:id" element={<OfficerApplicationReviewPage />} />
        <Route path="inspections" element={<AssignmentsListPage />} />
        <Route path="certificates" element={<CertificatesListPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
