import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Breadcrumbs = ({ items, className = '' }) => {
  const location = useLocation();
  const { isHindi } = useLanguage();

  const hindiLabelMap = {
    'Inspector': 'निरीक्षक',
    'Assignments': 'असाइनमेंट',
    'Officer': 'अधिकारी',
    'Business': 'व्यवसाय',
    'Applications': 'आवेदन',
    'Instruments': 'उपकरण',
    'Certificates': 'प्रमाणपत्र',
    'Settings': 'सेटिंग्स',
    'New': 'नया',
    'Dashboard': 'डैशबोर्ड',
    'Review': 'समीक्षा',
    'Inspections': 'निरीक्षण',
    'Completed': 'पूर्ण'
  };

  // Auto-generate items from pathname if not explicitly passed
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    if (pathnames.length === 0) return [];

    const breadcrumbList = [];
    let currentPath = '';

    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathnames.length - 1;

      // Clean label
      const formattedLabel = segment
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const displayLabel = isHindi && hindiLabelMap[formattedLabel]
        ? hindiLabelMap[formattedLabel]
        : formattedLabel;

      breadcrumbList.push({
        label: displayLabel,
        path: isLast ? null : currentPath
      });
    });

    return breadcrumbList;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length === 0) return null;

  const homePath = location.pathname.startsWith('/inspector')
    ? '/inspector/dashboard'
    : location.pathname.startsWith('/officer')
    ? '/officer/dashboard'
    : location.pathname.startsWith('/business')
    ? '/business/dashboard'
    : '/';

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-1.5 text-xs text-slate-500 mb-4 ${className}`}>
      <Link
        to={homePath}
        className="flex items-center gap-1 hover:text-slate-800 transition-colors"
        title="Dashboard"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isLast || !item.path ? (
              <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-blue-600 transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
