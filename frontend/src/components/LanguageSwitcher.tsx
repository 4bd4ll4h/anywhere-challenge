import React from 'react';
import { useTranslation } from 'react-i18next';
import { Language as LanguageIcon } from '@mui/icons-material';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    // Update document direction for RTL languages
    document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = languageCode;
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-200">
        <LanguageIcon className="h-5 w-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <span className="text-sm font-medium text-gray-700 sm:hidden">
          {currentLanguage.flag}
        </span>
      </button>
      
             {/* Dropdown Menu */}
       <div className="absolute end-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[140px]">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
                         className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
               i18n.language === language.code 
                 ? 'bg-blue-50 text-blue-600' 
                 : 'text-gray-700'
             }`}
             style={{ textAlign: language.code === 'ar' ? 'end' : 'start' }}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="font-medium sm:block hidden md:block">{language.name}</span>
                         {i18n.language === language.code && (
               <span className="ms-auto text-blue-600">✓</span>
             )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher; 