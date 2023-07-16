import axiosInstance from "./axiosInstance";

const id = JSON.parse(localStorage.getItem('user'));

const fetchUserData = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Account/get_all_users?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching User Data:', error);
        throw error;
    }
};
const fetchActivityLog = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Account/activity_logs?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Activity Log:', error);
        throw error;
    }
};
const fetchAdminData = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Administrators?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching admin data:', error);
        throw error;
    }
};
const fetchStaffData = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Staffs?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching staff data:', error);
        throw error;
    }
};
const fetchClientData = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Profiles?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching client data:', error);
        throw error;
    }
};
const fetchDocumentData = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Documents/get_all_documents?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching document data:', error);
        throw error;
    }
};
const fetchShiftRoaster = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/ShiftRosters/get_all_shift_rosters?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching shift Roaster:', error);
        throw error;
    }
};
const fetchAttendance = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Attendances/get_all_attendances_by_company?companyId=${companyId}`);
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
const filterActivityLogs = async (company, fromDate, toDate, user,) => {
    try {
        const response = await axiosInstance.post(`/Account/get_periodic_activities?companyId=${company}&fromDate=${fromDate}&toDate=${toDate}&username=${user}`);
        return response.data;
    } catch (error) {
        console.error('Error getting Activities:', error);
        throw error;
    }
};

const getShiftsByUser = async (dateFrom, dateTo, staff, client) => {
    try {
        const response = await axiosInstance.get(`/ShiftRosters/get_periodic_shift_rosters?fromDate=${dateFrom}&toDate=${dateTo}&staffId=${staff}&clientId=${client}&companyId=${id.companyId}`);
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
const getSplittedAttendance = async (value) => {
    try {
        const response = await axiosInstance.get(`/Attendances/get_split_attendances?attendanceId=${value}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching splitted Attendance:', error);
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
const fetchProgressNotes = async () => {
    try {
        const response = await axiosInstance.get(`/ProgressNotes/get_all_progressnote_by_company?companyId=${id.companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Progress Notes', error);
        throw error;
    }
};
const fetchTicket = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Tickets/get_all_tickets?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Tickets', error);
        throw error;
    }
};
const fetchFormTemplate = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Templates/get_templates?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Form Templates', error);
        throw error;
    }
};
const fetchShiftAttendance = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Attendances/get_shift_attendance?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching shift Attendance', error);
        throw error;
    }
};
const fetchStaffAttendance = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/StaffAttendances/get_all_staff_attendances?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching staff Attendance', error);
        throw error;
    }
};
const filterShiftAttendance = async (company, fromDate, toDate, staff, client, type) => {
    try {
        const response = await axiosInstance.get(`/Attendances/get_periodic_shift_attendnace?companyId=${company}&fromDate=${fromDate}&toDate=${toDate}&staffId=${staff}&clientId=${client}&shifttype=${type}`);
        return response.data;
    } catch (error) {
        console.error('Error filtering Attendance:', error);
        throw error;
    }
};
const filterProgressNotes = async (staff, client) => {
    try {
        const response = await axiosInstance.get(`/ProgressNotes/get_progressnote_by_user?staffname=${staff}&profileId=${client}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Progress Notes:', error);
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
    fetchUserData,
    filterAttendance,
    getChartData,
    fetchIntegrationData,
    getSplittedAttendance,
    fetchProgressNotes,
    filterProgressNotes,
    getShiftsByUser,
    fetchTicket,
    fetchActivityLog,
    filterActivityLogs,
    fetchFormTemplate,
    fetchStaffAttendance
    // Add other API endpoints and corresponding methods as needed
};

export default api;
