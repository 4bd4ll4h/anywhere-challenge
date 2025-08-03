import React from 'react';
import { School, Assignment, TrendingUp } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const ExamsBanner: React.FC = () => {
  const { t } = useTranslation();
  
    return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white p-8" dir="auto">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Content */}
          <div className="lg:col-span-2">
                         <h2 className="text-4xl font-bold mb-4 text-shadow-lg">
               {t('dashboard.examsBanner.title')}
             </h2>
             <p className="text-xl mb-4 opacity-90 leading-relaxed">
               {t('dashboard.examsBanner.subtitle')}
             </p>
             <p className="text-lg mb-6 opacity-80 italic">
               {t('dashboard.examsBanner.quote')}
             </p>
             <button className="bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg">
               {t('dashboard.examsBanner.button')}
             </button>
          </div>

          {/* Icons */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <div className="flex gap-4 mb-4 flex-wrap justify-center">
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <School className="text-cyan-600 text-3xl" />
              </div>
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <Assignment className="text-cyan-600 text-3xl" />
              </div>
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <TrendingUp className="text-cyan-600 text-3xl" />
              </div>
            </div>
                         <p className="text-center opacity-80 max-w-xs text-sm">
               {t('dashboard.examsBanner.description')}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsBanner; 