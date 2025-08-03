import React from 'react';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
} from '@mui/icons-material';
import { User } from '../store/slices/authSlice';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const { t } = useTranslation();
  
    return (
    <div className="flex justify-between flex-wrap flex-row gap-4 w-full max-w-full  mb-6 sm:mb-8" dir="auto">
      {/* Welcome Message - Always on one line */}
      <div className="w-fit flex flex-row sm:flex-col sm:items-baseline sm:gap-3 min-w-0 justify-between">
        <h1 className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 truncate flex-shrink-0">
          {t('common.welcome')} {user?.name || 'Student'},
        </h1>
        <p className="text-sm xl:text-base text-gray-600  min-w-0">
          {t('dashboard.welcomeMessage')}
        </p>
      </div>

      {/* Search and Actions - Always on second line */}
      <div className="w-fit flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 min-w-0" dir="auto">
        {/* Search Bar */}
        <div className="relative flex-1 sm:flex-none sm:w-48 md:w-52 lg:w-56 xl:w-60 2xl:w-64">
          <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('common.search')}
            className="block w-full ps-9 sm:ps-10 pe-3 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Notifications and Profile */}
        <div className="flex items-center gap-2 xl:gap-3 flex-shrink-0">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications */}
          <button className="relative p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-200 touch-manipulation">
            <NotificationsIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs">
              1
            </span>
          </button>

          {/* Mail */}
          <button className="relative p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-200 touch-manipulation">
            <MailIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs">
              3
            </span>
          </button>

          {/* Profile Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={user?.avatar || 'https://picsum.photos/150'}
              alt={user?.name || 'User'}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-blue-500 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 