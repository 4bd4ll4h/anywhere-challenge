import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { logout } from '../store/slices/authSlice';
import {
  Dashboard as DashboardIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
  TrendingUp as PerformanceIcon,
  Announcement as AnnouncementIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ResponsiveSidebarProps {
  onLogout: () => void;
}

const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({ onLogout }) => {
  const { t } = useTranslation();
  
  const menuItems = [
    { text: t('common.dashboard'), icon: DashboardIcon, active: true, href: '/dashboard' },
    { text: t('common.schedule'), icon: ScheduleIcon, active: false, href: '/schedule' },
    { text: t('common.courses'), icon: SchoolIcon, active: false, href: '/courses' },
    { text: t('common.gradebook'), icon: GradeIcon, active: false, href: '/gradebook' },
    { text: t('common.performance'), icon: PerformanceIcon, active: false, href: '/performance' },
    { text: t('common.announcement'), icon: AnnouncementIcon, active: false, href: '/announcements' },
  ];
  const [sidebarState, setSidebarState] = useState<'full' | 'icon' | 'top'>('full');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isIconSidebarExpanded, setIsIconSidebarExpanded] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setSidebarState('top'); // Small screen: top nav with vertical dropdown
      } else if (width < 1200) {
        setSidebarState('icon'); // Medium screen: icon-only with expand option
      } else {
        setSidebarState('full'); // Large screen: full sidebar with text and icons
      }
      // Close menus when resizing to larger screens
      if (width >= 768) {
        setIsMobileMenuOpen(false);
      }
      if (width >= 1280) {
        setIsIconSidebarExpanded(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Close mobile menu when clicking outside
      if (isMobileMenuOpen && sidebarState === 'top') {
        if (!target.closest('nav')) {
          setIsMobileMenuOpen(false);
        }
      }
      
      // Close icon sidebar when clicking outside
      if (isIconSidebarExpanded && sidebarState === 'icon') {
        if (!target.closest('.sidebar-container')) {
          setIsIconSidebarExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen, isIconSidebarExpanded, sidebarState]);

  const handleLogout = () => {
    onLogout();
  };

  const handleMobileMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Mobile menu toggle clicked, current state:', isMobileMenuOpen);
    setIsMobileMenuOpen(prev => !prev);
  };

  const handleIconSidebarToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Icon sidebar toggle clicked, current state:', isIconSidebarExpanded);
    setIsIconSidebarExpanded(prev => !prev);
  };

   // Top Navigation Bar (Small Screen)
   if (sidebarState === 'top') {
     return (
       <>
         {/* Top Navigation Bar */}
         <nav className="sticky top-0 z-50 bg-blue-600 shadow-md" dir="auto">
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
               <h1 className="text-xl sm:text-2xl font-bold text-white">Coligo</h1>
             </div>

            {/* Hamburger Menu Button (3 dashes) */}
            <button
              onClick={handleMobileMenuToggle}
              className="p-2 rounded-lg hover:bg-blue-500 transition-colors touch-manipulation"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="h-6 w-6 text-white" />
              ) : (
                <MenuIcon className="h-6 w-6 text-white" />
              )}
            </button>
          </div>

          {/* Vertical Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="bg-blue-600 border-t border-blue-500">
              <div className="py-2">
                {menuItems.map((item) => (
                  <a
                    key={item.text}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-4 text-base transition-colors touch-manipulation ${
                       item.active
                         ? 'bg-cyan-500 text-white border-inline-end-4 border-white'
                         : 'text-white hover:bg-blue-500 active:bg-blue-700'
                     }`}
                  >
                    <item.icon className="h-6 w-6 me-3 flex-shrink-0" />
                    <span className="font-medium">{item.text}</span>
                  </a>
                ))}
                
                <div className="border-t border-blue-500 mt-2 pt-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-4 text-base text-white hover:bg-blue-500 active:bg-blue-700 transition-colors touch-manipulation"
                  >
                    <LogoutIcon className="h-6 w-6 me-3 flex-shrink-0" />
                    <span className="font-medium">{t('common.logout')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* No spacer needed for sticky nav */}
      </>
    );
  }

   // Icon-Only Sidebar (Medium Screen)
   if (sidebarState === 'icon') {
     return (
       <div className="sidebar-container relative h-full flex-shrink-0">
         {/* Icon-Only Sidebar */}
         <div className="h-full w-16 min-w-16 bg-blue-600 shadow-lg z-40">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-3 text-center border-b border-blue-500">
              <h1 className="text-white text-lg font-bold">C</h1>
            </div>

            {/* Hamburger Menu Button */}
            <div className="p-2">
              <button
                onClick={handleIconSidebarToggle}
                className="flex items-center justify-center p-3 rounded-lg text-white hover:bg-white hover:text-blue-600 transition-all duration-200 w-full"
                title="Menu"
                aria-label="Toggle menu"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-2 space-y-1">
              {menuItems.map((item) => (
                <div key={item.text} className="relative group px-2">
                  <a
                    href={item.href}
                    className={`flex items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                       item.active
                         ? 'bg-cyan-500 text-white'
                         : 'text-white hover:bg-white hover:text-blue-600'
                     }`}
                    title={item.text}
                  >
                    <item.icon className="h-5 w-5" />
                  </a>
                  
                  {/* Tooltip - only show when not expanded */}
                  {!isIconSidebarExpanded && (
                    <div className="absolute start-full ms-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 top-1/2 -translate-y-1/2">
                      {item.text}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Logout Button */}
             <div className="p-2 border-t border-blue-500">
               <div className="relative group px-2">
                 <button
                   onClick={handleLogout}
                   className="flex items-center justify-center p-3 rounded-lg text-white hover:bg-white hover:text-blue-600 transition-all duration-200 w-full"
                   title={t('common.logout')}
                 >
                   <LogoutIcon className="h-5 w-5" />
                 </button>
                 
                 {/* Logout Tooltip - only show when not expanded */}
                 {!isIconSidebarExpanded && (
                   <div className="absolute start-full ms-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 top-1/2 -translate-y-1/2">
                     {t('common.logout')}
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>

        {/* Expanded Overlay Menu */}
        {isIconSidebarExpanded && (
          <div className="absolute top-0 start-16 h-full w-48 bg-blue-600 shadow-xl z-50 border-l border-blue-500">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-blue-500 flex items-center justify-between">
                <h2 className="text-white font-semibold">Menu</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsIconSidebarExpanded(false);
                  }}
                  className="text-white hover:text-gray-300 transition-colors"
                  aria-label="Close menu"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Items with Text */}
              <nav className="flex-1 py-4 px-4 space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.text}
                    href={item.href}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsIconSidebarExpanded(false);
                    }}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                       item.active
                         ? 'bg-cyan-500 text-white'
                         : 'text-white hover:bg-white hover:text-blue-600'
                     }`}
                  >
                    <item.icon className="h-5 w-5 me-3" />
                    <span className="font-medium">{item.text}</span>
                  </a>
                ))}
              </nav>

              {/* Logout Button with Text */}
              <div className="p-4 border-t border-blue-500">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                    setIsIconSidebarExpanded(false);
                  }}
                  className="flex items-center p-3 rounded-lg text-white hover:bg-white hover:text-blue-600 transition-all duration-200 w-full"
                >
                  <LogoutIcon className="h-5 w-5 me-3" />
                  <span className="font-medium">{t('common.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
       </div>
     );
   }

     // Full Sidebar (Desktop)
   return (
     <div className="h-full w-64 min-w-64 bg-blue-600 shadow-lg z-40 sidebar-transition flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 text-center border-b border-blue-500">
          <h1 className="text-white text-2xl font-bold tracking-wide">Coligo</h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.text}
              href={item.href}
              className={`sidebar-item ${
                item.active ? 'active' : ''
              }`}
            >
              <item.icon className="h-6 w-6 me-3 sidebar-icon" />
              <span className="font-medium">{item.text}</span>
            </a>
          ))}
        </nav>

        {/* Logout Button */}
         <div className="p-4 border-t border-blue-500">
           <button
             onClick={handleLogout}
             className="sidebar-item w-full"
           >
             <LogoutIcon className="h-6 w-6 me-3 sidebar-icon" />
             <span className="font-medium">{t('common.logout')}</span>
           </button>
         </div>
      </div>
    </div>
  );
};

export default ResponsiveSidebar; 