import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useHttp from '../hooks/useHttp';

export const CompanyContext = createContext();

export const useCompanyContext = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
    const [staff, setStaff] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [document, setDocument] = useState([]);

    const privateHttp = useHttp();

    let isMounted = true;

    useEffect(() => {
        if (isMounted) {
            FetchStaff();
        }

        return () => {
            isMounted = false;
        };
    }, []);
    async function FetchStaff() {
        setLoading(true)
        try {
            const staffResponse = await privateHttp.get('/Staffs');
            const staff = staffResponse.data;
            setStaff(staff);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }

        try {
            const clientResponse = await privateHttp.get('/Profiles');
            const client = clientResponse.data;
            setClients(client);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }

        try {
            const { data } = await privateHttp.get('/Documents/get_all_documents')
            console.log(data);
            setDocument(data)
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false);
        }




        finally {
            setLoading(false)
        }
    }

    if (loading) {
        toast("Fetching Data")
    }


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
        userProfile, setUserProfile, document,
        staff, setStaff, clients, FetchStaff, loading, setLoading
    };

    return (
        <CompanyContext.Provider value={contextValue}>
            {children}
        </CompanyContext.Provider>
    );
};
