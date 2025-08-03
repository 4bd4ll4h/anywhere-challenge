import React from 'react';
import { Assignment as AssignmentIcon, Quiz as QuizIcon } from '@mui/icons-material';
import { Quiz } from '../store/slices/quizSlice';
import { useTranslation } from 'react-i18next';

interface QuizzesSectionProps {
  quizzes: Quiz[];
  loading: boolean;
}

const formatDueDate = (dueDate: string) => {
  const date = new Date(dueDate);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }) + ' – ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const QuizzesSection: React.FC<QuizzesSectionProps> = ({ quizzes, loading }) => {
  const { t } = useTranslation();
  
  const getTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} ${t('dashboard.quizzes.due')} ${days > 1 ? 's' : ''} ${t('dashboard.quizzes.remaining')}`;
    } else if (hours > 0) {
      return `${hours} ${t('dashboard.quizzes.due')} ${hours > 1 ? 's' : ''} ${t('dashboard.quizzes.remaining')}`;
    } else {
      return t('dashboard.quizzes.dueSoon');
    }
      };
    
    if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" dir="auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('dashboard.quizzes.title')}</h2>
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-4/5"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-3/5"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-2/5"></div>
              <div className="h-9 bg-gray-200 rounded animate-pulse w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" dir="auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('dashboard.quizzes.title')}</h2>

             {quizzes.length === 0 ? (
         <div className="text-center py-8 text-gray-500">
           {t('dashboard.quizzes.noQuizzes')}
         </div>
      ) : (
        <div className="space-y-4">
          {quizzes.slice(0, 2).map((quiz) => (
            <div
              key={quiz._id}
              className="pb-4 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center mb-2">
                                 {quiz.type === 'quiz' ? (
                   <QuizIcon className="text-blue-600 me-2" />
                 ) : (
                   <AssignmentIcon className="text-green-600 me-2" />
                 )}
                <span className="text-sm font-medium text-gray-900">
                  {quiz.title}
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">
                  {formatDueDate(quiz.dueDate)}
                </span>
                <span className="text-xs font-medium text-orange-600">
                  {getTimeRemaining(quiz.dueDate)}
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">
                  {quiz.course} • {quiz.totalPoints} points
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  quiz.type === 'quiz' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {quiz.type}
                </span>
              </div>
              
                             <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                 {quiz.type === 'quiz' ? t('dashboard.quizzes.startQuiz') : t('dashboard.quizzes.solveAssignment')}
               </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizzesSection; 