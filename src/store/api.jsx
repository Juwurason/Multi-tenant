import axiosInstance from "./axiosInstance";

const id = JSON.parse(localStorage.getItem('user'));
const fetchAdminData = async () => {
    try {
        const response = await axiosInstance.get(`/Administrators?companyId=${id.companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin data:', error);
        throw error;
    }
};
const fetchStaffData = async () => {
    try {
        const response = await axiosInstance.get(`/Staffs?companyId=${id.companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching staff data:', error);
        throw error;
    }
};
const fetchClientData = async () => {
    try {
        const response = await axiosInstance.get(`/Profiles?companyId=${id.companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching client data:', error);
        throw error;
    }
};
const fetchDocumentData = async () => {
    try {
        const response = await axiosInstance.get(`/Documents/get_all_documents?companyId=${id.companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching document data:', error);
        throw error;
    }
};
const fetchShiftRoaster = async () => {
    try {
        const response = await axiosInstance.get(`/ShiftRosters/get_all_shift_rosters?companyId=${id.companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching shift Roaster:', error);
        throw error;
    }
};
const getShiftsByUser = async (client, staff) => {
    try {
        const response = await axiosInstance.get(`/ShiftRosters/get_shifts_by_user?client=${client}&staff=${staff}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching shift Roaster:', error);
        throw error;
    }
};


const api = {
    fetchAdminData,
    fetchStaffData,
    fetchClientData,
    fetchDocumentData,
    fetchShiftRoaster,
    getShiftsByUser
    // Add other API endpoints and corresponding methods as needed
};

export default api;
