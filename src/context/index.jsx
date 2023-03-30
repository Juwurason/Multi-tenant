import React, { createContext, useContext, useEffect, useState } from 'react';
import useHttp from '../hooks/useHttp';

export const CompanyContext = createContext();

export const useCompanyContext = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
    const [staff, setStaff] = useState([]);
    const [staffNum, setStaffNum] = useState(0);
    const [staffProfile, setStaffProfile] = useState({});

    const getStaffProfile = JSON.parse(localStorage.getItem('staffProfile'))
    const privateHttp = useHttp();
    
    useEffect(() => {
        let isMounted = true;
        async function FetchStaff() {


            try {
                const response = await Promise.all([
                    privateHttp.get('/Staffs'),
                    privateHttp.get(`/Staffs/${getStaffProfile.staffId}`)

                ])
                const staff = response[0].data;
                const staffPro = response[1].data;
                setStaff(staff)
                setStaffNum(staff.length)
                setStaffProfile(staffPro)

            } catch (error) {
                console.log(error);
            }
        }
        if (isMounted) FetchStaff()
        return () => {
            isMounted = false
        }


    }, [])



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
        userProfile, setUserProfile, staffNum, setStaffNum,
        staff, setStaff, staffProfile
    };

    return (
        <CompanyContext.Provider value={contextValue}>
            {children}
        </CompanyContext.Provider>
    );
};
