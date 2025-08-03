import React from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { 
  selectAnnouncements, 
  selectAnnouncementLoading,
  selectQuizzes,
  selectQuizLoading 
} from '../store/selectors';
import ExamsBanner from './ExamsBanner';
import AnnouncementsSection from './AnnouncementsSection';
import QuizzesSection from './QuizzesSection';

const DashboardContent: React.FC = () => {
  const announcements = useAppSelector(selectAnnouncements);
  const announcementsLoading = useAppSelector(selectAnnouncementLoading);
  const quizzes = useAppSelector(selectQuizzes);
  const quizzesLoading = useAppSelector(selectQuizLoading);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-full min-w-0 overflow-hidden">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6 min-w-0 overflow-hidden">
        {/* Exams Banner */}
        <div className="min-w-0">
          <ExamsBanner />
        </div>

        {/* Announcements Section */}
        <div className="min-w-0">
          <AnnouncementsSection
            announcements={announcements}
            loading={announcementsLoading}
          />
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="lg:col-span-1 min-w-0">
        <QuizzesSection
          quizzes={quizzes}
          loading={quizzesLoading}
        />
      </div>
    </div>
  );
};

export default DashboardContent; 