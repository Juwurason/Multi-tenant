import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axiosInstance from '../../../store/axiosInstance';
import Swal from 'sweetalert2';

const ResponsePage = () => {
    const history = useHistory();
    const location = useLocation();
    const id = JSON.parse(localStorage.getItem('user'));


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        // Handle the code and state as needed
        const handleResponse = async () => {
            try {

                Swal.fire({
                    title: 'Creating Xero Connection...',
                    text: 'Please wait...',
                    allowOutsideClick: false,
                    showConfirmButton: false, // Remove the OK button
                    onBeforeOpen: () => {
                        Swal.showLoading();
                    }
                });
                const { data } = axiosInstance.get(`/SetUp/xero_auth?userId=${id.userId}&code=${code}&state=${state}`);
                if (data.status === "Success") {
                    toast.success(data.message)
                    Swal.close(); // Close the loading state
                    history.push(`/app/main/dashboard`)
                } else {
                    toast.error(data.message)
                    Swal.close(); // Close the loading state
                    history.push(`/app/main/dashboard`)

                }
            } catch (error) {
                toast.error(error.response.data.message);
                Swal.close(); // Close the loading state
                history.push(`/app/main/dashboard`)

            }
        }

        // Redirect to another page after handling the response URL
        // history.push('/dashboard');
        handleResponse();
    }, [history]);

    return (
        <>
        </>
    );
};

export default ResponsePage;