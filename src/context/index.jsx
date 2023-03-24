import React, { createContext, useContext, useEffect, useState } from 'react';

export const CompanyContext = createContext();

export const useCompanyContext = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
    const [companyId, setCompanyId] = useState('');
    const [email, setEmail] = useState('');
    const [userProfile, setUserProfile] = useState(
        {
            companyId: 0,
            email: "",
            firstName: "",
            fullName: "",
            lastName: "",
            phoneNumber: "",
            role: "",
            token: "",
            tokenExpiration: ""
        }
    )
    useEffect(() => {
        setUserProfile(JSON.parse(localStorage.getItem('user')))
    }, [])

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

    const contextValue = { companyId, email, storeCompanyId, storeAdminEmail, clearCompanyData, userProfile, setUserProfile };

    return (
        <CompanyContext.Provider value={contextValue}>
            {children}
        </CompanyContext.Provider>
    );
};
