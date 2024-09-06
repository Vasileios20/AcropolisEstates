import React, { createContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const { i18n } = useTranslation();



    useEffect(() => {
        const storedLanguage = localStorage.getItem('i18n_language');
        i18n.changeLanguage(storedLanguage);
    }, [i18n]);

    const value = useMemo(
        () => {
            const changeLanguage = (lng) => {
                i18n.changeLanguage(lng);
                localStorage.setItem('i18n_language', lng);
            };
            return {
                changeLanguage,
            };
        },
        [i18n]
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export default LanguageContext;