import { useRouter } from 'next/router';
import React, { useState } from 'react';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (locale: string) => {
    router.push({ pathname, query }, asPath, { locale });
    setIsOpen(false); // Close the dropdown after selecting a language
  };

  return (
    <div className="language-switcher">
      <button className="lang-btn" onClick={() => setIsOpen(!isOpen)}>
        {router.locale ? router.locale.toUpperCase() : 'EN'} <span>&#9660;</span>
      </button>

      {isOpen && (
        <ul className="dropdown">
          <li onClick={() => changeLanguage('en')} className="dropdown-item">
            <img src="/images/uk.jpg" alt="English" className="flag" /> EN
          </li>
          <li onClick={() => changeLanguage('fr')} className="dropdown-item">
            <img src="/images/fr.jpg" alt="French" className="flag" /> FR
          </li>
          <li onClick={() => changeLanguage('ar')} className="dropdown-item">
            <img src="/images/ar.jpg" alt="Arabic" className="flag" /> AR
          </li>
        </ul>
      )}

      <style jsx>{`
        .language-switcher {
          position: relative;
          display: inline-block;
        }
        .lang-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lang-btn span {
          font-size: 12px;
        }
        .dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          background-color: white;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #ddd;
          border-radius: 4px;
          list-style: none;
          padding: 0;
          margin: 5px 0;
          width: 150px;
          z-index: 1000;
        }
        .dropdown-item {
          padding: 10px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background-color: #f0f0f0;
        }
        .flag {
          width: 20px;
          height: 15px;
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
