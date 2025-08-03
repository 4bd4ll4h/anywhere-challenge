import React, { useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { logout } from '../store/slices/authSlice';
import { fetchAnnouncements } from '../store/slices/announcementSlice';
import { fetchUpcomingQuizzes } from '../store/slices/quizSlice';
import { selectUser } from '../store/selectors';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import Header from '../components/Header';
import DashboardContent from '../components/DashboardContent';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(fetchAnnouncements(undefined));
    dispatch(fetchUpcomingQuizzes());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

    return (
    <div className="flex flex-col h-min-screen bg-gray-50 md:flex-row md:overflow-hidden md:h-screen lg:flex-row lg:h-screen lg:overflow-hidden max-w-full">
      {/* Responsive Sidebar */}
      <ResponsiveSidebar onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 max-w-full">
        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 max-w-full">
          <div className="max-w-full min-w-0">
            <Header user={user} />
            <DashboardContent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 