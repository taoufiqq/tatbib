import { useRouter } from 'next/router';
import React from 'react';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const changeLanguage = (locale: string) => {
    router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <div className="language-switcher">
      <button 
        className={`lang-btn ${router.locale === 'en' ? 'active' : ''}`} 
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <button 
        className={`lang-btn ${router.locale === 'fr' ? 'active' : ''}`} 
        onClick={() => changeLanguage('fr')}
      >
        FR
      </button>
      <button 
        className={`lang-btn ${router.locale === 'ar' ? 'active' : ''}`} 
        onClick={() => changeLanguage('ar')}
      >
        AR
      </button>
      
      <style jsx>{`
        .language-switcher {
          display: flex;
          gap: 5px;
        }
        .lang-btn {
          padding: 5px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-weight: 500;
        }
        .lang-btn.active {
          background: #2CA5B8;
          color: white;
          border-color: #2CA5B8;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;