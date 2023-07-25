import React, { createContext, useContext, useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { useHistory } from 'react-router-dom';

export const CompanyContext = createContext();

export const useCompanyContext = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [companyId, setCompanyId] = useState('');
    const [email, setEmail] = useState('');

    const [userProfile, setUserProfile] = useState({});
    const navigate = useHistory();

    // useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem('user'))
    //     if (!user || !user.token) {
    //         navigate.push('/')
    //     }
    // }, []);
    // const decryptedUserProfileString = CryptoJS.AES.decrypt(
    //     encryptedUserProfile,
    //     'promax-care001#'
    //   ).toString(CryptoJS.enc.Utf8);

    //   if (decryptedUserProfileString) {
    //     const decryptedUserProfile = JSON.parse(decryptedUserProfileString);
    //     dispatch(loginSuccess({ userProfile: decryptedUserProfile, token }));
    //   } else {
    //     // Handle decryption error or empty decrypted string
    //     dispatch(loginFailure('Failed to decrypt user profile'));
    //   }

    // useEffect(() => {
    //     try {
    //         const encryptedData = localStorage.getItem('userEnc');
    //         if (encryptedData) {
    //             const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, 'promax-001#');
    //             const decryptedObject = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    //             setUserProfile(decryptedObject)
    //             // Handle the decrypted object as needed
    //         } else {
    //             // Handle the case when the encrypted data is not found

    //             console.log('Error fetching details');
    //         }
    //     } catch (error) {
    //         // Handle decryption errors
    //         console.error('Decryption error:', error);
    //     }
    // }, []);


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

    const contextValue = {
        companyId, email, storeCompanyId,
        storeAdminEmail, clearCompanyData,
        userProfile, setUserProfile, loading, setLoading
    };

    return (
        <CompanyContext.Provider value={contextValue}>
            {children}
        </CompanyContext.Provider>
    );
};
