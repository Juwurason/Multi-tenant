import React, { createContext, useContext, useState } from 'react';

export const CompanyContext = createContext();

export const useCompanyContext = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
    const [companyId, setCompanyId] = useState('');
    const [email, setEmail] = useState('');
    const [test, setTest] = useState("Testing")

    const storeCompanyId = (companyId) => {
        setCompanyId(companyId);
        localStorage.setItem('companyId', companyId);
    };
    const storeAdminEmail = (email) => {
        setEmail(email);
        localStorage.setItem('email', email);
    };

    const clearCompanyData = () => {
        setCompanyId('');
        setEmail('');
        localStorage.removeItem('companyId');
        localStorage.removeItem('email');
    };

    const contextValue = { companyId, email, storeCompanyId, storeAdminEmail, clearCompanyData, test };

    return (
        <CompanyContext.Provider value={contextValue}>
            {children}
        </CompanyContext.Provider>
    );
};
