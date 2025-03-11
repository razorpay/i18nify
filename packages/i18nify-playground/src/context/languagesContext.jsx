import React, { createContext, useContext, useEffect, useState } from 'react';
import { NAV_ITEMS_MAP } from 'src/components/Dashboard/Sidebar/navItems';
import { LANGUAGES } from 'src/context/constants';
import { useMobile } from 'src/hooks/useMobile';

const languagesContext = createContext({});

export const LanguagesProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES.JS);
  const [loading, setLoading] = useState(false);
  const [sidebarItems, setSidebarItems] = useState(
    NAV_ITEMS_MAP[selectedLanguage],
  );

  const isMobile = useMobile();

  useEffect(() => {
    const availableLanguages = Object.keys(LANGUAGES);
    const language = availableLanguages.find((language) =>
      location.pathname.includes(language.toLowerCase()),
    );
    setSelectedLanguage(language);
    setSidebarItems(NAV_ITEMS_MAP[language]);
  }, [location.pathname, isMobile]);

  return (
    <languagesContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        loading,
        setLoading,
        setSidebarItems,
        sidebarItems,
      }}
    >
      {children}
    </languagesContext.Provider>
  );
};

export const useLanguageContext = () => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    loading,
    setLoading,
    setSidebarItems,
    sidebarItems,
  } = useContext(languagesContext);

  return {
    selectedLanguage,
    setSelectedLanguage,
    loading,
    setLoading,
    setSidebarItems,
    sidebarItems,
  };
};
