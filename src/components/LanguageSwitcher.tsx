import { useRouter } from "next/router";
import React, { useState } from "react";
import Image from "next/image"; // ✅ Import the Image component

const LanguageSwitcher = () => {
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (locale: string) => {
    router.push({ pathname, query }, asPath, { locale });
    setIsOpen(false); // Close the dropdown after selecting a language
  };

  const getFlagImage = (locale: string) => {
    switch (locale) {
      case "fr":
        return "/images/fr.jpg";
      case "ar":
        return "/images/ar.jpg";
      case "en":
      default:
        return "/images/uk.jpg";
    }
  };

  return (
    <div className="language-switcher">
      <button className="lang-btn" onClick={() => setIsOpen(!isOpen)}>
        <Image
          src={getFlagImage(router.locale || "en")}
          alt={router.locale?.toUpperCase() || "EN"}
          width={20}
          height={15}
          className="flag"
        />
        {router.locale ? router.locale.toUpperCase() : "EN"} <span>&#9660;</span>
      </button>

      {isOpen && (
        <ul className="dropdown">
          <li onClick={() => changeLanguage("en")} className="dropdown-item">
            <Image src="/images/uk.jpg" alt="English" width={20} height={15} className="flag" /> EN
          </li>
          <li onClick={() => changeLanguage("fr")} className="dropdown-item">
            <Image src="/images/fr.jpg" alt="French" width={20} height={15} className="flag" /> FR
          </li>
          <li onClick={() => changeLanguage("ar")} className="dropdown-item">
            <Image src="/images/ar.jpg" alt="Arabic" width={20} height={15} className="flag" /> AR
          </li>
        </ul>
      )}

      <style jsx>{`
        .language-switcher {
          position: relative;
          display: inline-block;
        }
        .lang-btn {
          padding: 8px 25px;
          border: 1px solid #ffffff;
          border-radius: 4px;
          background: #2ba8bc;
          color: white;
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
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
