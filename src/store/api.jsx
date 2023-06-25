import axiosInstance from "./axiosInstance";

const id = JSON.parse(localStorage.getItem('user'));

const fetchUserData = async () => {
    try {
        const response = await axiosInstance.get(`/Account/get_all_users?companyId=${id.companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching User Data:', error);
        throw error;
    }
};
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
const fetchAttendance = async () => {
    try {
        const response = await axiosInstance.get(`/Attendances/get_all_attendances_by_company?companyId=${id.companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Attendance:', error);
        throw error;
    }
};
const filterAttendance = async (fromDate, toDate, staff, company) => {
    try {
        const response = await axiosInstance.get(`/Attendances/get_periodic_attendances_by_company?fromDate=${fromDate}&toDate=${toDate}&staffId=${staff}&companyId=${company}`);
        return response.data;
    } catch (error) {
        console.error('Error filtering Attendance:', error);
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
const getChartData = async (value) => {
    try {
        const response = await axiosInstance.get(`/Attendances/staff_duration_chart?period=${value}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chart Data:', error);
        throw error;
    }
};
const fetchIntegrationData = async () => {
    try {
        const response = await axiosInstance.get(`/Integrations/get_integrations?companyId=${id.companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching third-party Data:', error);
        throw error;
    }
};


const api = {
    fetchAdminData,
    fetchStaffData,
    fetchClientData,
    fetchDocumentData,
    fetchShiftRoaster,
    fetchAttendance,
    getShiftsByUser,
    fetchUserData,
    filterAttendance,
    getChartData,
    fetchIntegrationData
    // Add other API endpoints and corresponding methods as needed
};

export default api;
