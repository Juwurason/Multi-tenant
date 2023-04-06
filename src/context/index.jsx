import React, { createContext, useContext, useEffect, useState } from 'react';
import useHttp from '../hooks/useHttp';

export const CompanyContext = createContext();

export const useCompanyContext = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
    const [staff, setStaff] = useState([]);
    const [clients, setClients] = useState([]);

    const privateHttp = useHttp();

    let isMounted = true;

    useEffect(() => {
        async function FetchStaff() {
            try {
                const staffResponse = await privateHttp.get('/Staffs');
                const staff = staffResponse.data;
                setStaff(staff);
            } catch (error) {
                console.log(error);
            }

            try {
                const clientResponse = await privateHttp.get('/Profiles');
                const client = clientResponse.data;
                setClients(client);
            } catch (error) {
                console.log(error);
            }
        }

        if (isMounted) {
            FetchStaff();
        }

        return () => {
            isMounted = false;
        };
    }, []);



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

    const contextValue = {
        companyId, email, storeCompanyId,
        storeAdminEmail, clearCompanyData,
        userProfile, setUserProfile,
        staff, setStaff, clients
    };

    return (
        <CompanyContext.Provider value={contextValue}>
            {children}
        </CompanyContext.Provider>
    );
};
