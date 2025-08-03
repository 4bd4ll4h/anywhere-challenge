import React from 'react';
import { Announcement as AnnouncementIcon } from '@mui/icons-material';
import { Announcement } from '../store/slices/announcementSlice';
import { useTranslation } from 'react-i18next';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  loading: boolean;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  announcements,
  loading,
}) => {
  const { t } = useTranslation();
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <AnnouncementIcon className="text-blue-600 me-2" />
          <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.announcements.title')}</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" dir="auto">
      <div className="flex items-center mb-6">
        <AnnouncementIcon className="text-blue-600 me-2" />
        <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.announcements.title')}</h2>
      </div>

             {announcements.length === 0 ? (
         <div className="text-center py-8 text-gray-500">
           {t('dashboard.announcements.noAnnouncements')}
         </div>
      ) : (
        <div className="space-y-4">
          {announcements.slice(0, 4).map((announcement) => (
            <div
              key={announcement._id}
              className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0"
            >
              <img
                src={announcement.author.avatar || `https://placehold.co/600x400?text=${announcement.author.name.charAt(0)}`}
                alt={announcement.author.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {announcement.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {announcement.content}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{announcement.author.name}</span>
                  <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsSection; 