import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";

const fetchUserData = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Account/get_all_users?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching User Data:');
        throw error;
    }
};
const fetchActivityLog = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Account/activity_logs?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching Activity Log:');
        throw error;
    }
};
const fetchAdminData = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Administrators?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching admin data:');
        throw error;
    }
};
const filterAdminData = async (companyId, status) => {
    try {
        const response = await axiosInstance.get(`/Administrators/get_active_admin?companyId=${companyId}&IsActive=${status}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching Admin data:');
        throw error;
    }
};
const fetchStaffData = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Staffs?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching staff data:');
        throw error;
    }
};
const filterStaffData = async (companyId, status) => {
    try {
        const response = await axiosInstance.get(`/Staffs/get_active_staffs?companyId=${companyId}&IsActive=${status}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching staff data:');
        throw error;
    }
};
const fetchClientData = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Profiles?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching client data:');
        throw error;
    }
};
const filterClientData = async (companyId, status) => {
    try {
        const response = await axiosInstance.get(`/Profiles/get_active_clients?companyId=${companyId}&IsActive=${status}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching client data:');
        throw error;
    }
};
const fetchDocumentData = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Documents/get_all_documents?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching document data:');
        throw error;
    }
};
const fetchShiftRoaster = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/ShiftRosters/get_all_shift_rosters?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching shift Roaster:');
        throw error;
    }
};
const fetchAttendance = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Attendances/get_all_attendances_by_company?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching Attendance:');
        throw error;
    }
};
const filterAttendance = async (fromDate, toDate, staff, company) => {
    try {
        const response = await axiosInstance.get(`/Attendances/get_periodic_attendances_by_company?fromDate=${fromDate}&toDate=${toDate}&staffId=${staff}&companyId=${company}`);
        return response.data;
    } catch (error) {
        toast.error('Error filtering Attendance:');
        throw error;
    }
};
const filterActivityLogs = async (company, fromDate, toDate, user,) => {
    try {
        const response = await axiosInstance.post(`/Account/get_periodic_activities?companyId=${company}&fromDate=${fromDate}&toDate=${toDate}&username=${user}`);
        return response.data;
    } catch (error) {
        toast.error('Error getting Activities:');
        throw error;
    }
};

const getShiftsByUser = async (dateFrom, dateTo, staff, client, company) => {
    try {
        const response = await axiosInstance.get(`/ShiftRosters/get_periodic_shift_rosters?fromDate=${dateFrom}&toDate=${dateTo}&staffId=${staff}&clientId=${client}&companyId=${company}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching shift Roaster:');
        throw error;
    }
};

const getChartData = async (value, company) => {

    try {
        const response = await axiosInstance.get(`/Attendances/staff_duration_chart?period=${value}&companyId=${company}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching chart Data:');
        throw error;
    }
};
const getSplittedAttendance = async (value) => {
    try {
        const response = await axiosInstance.get(`/Attendances/get_split_attendances?attendanceId=${value}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching splitted Attendance:');
        throw error;
    }
};
const fetchIntegrationData = async (company) => {
    try {
        const response = await axiosInstance.get(`/Integrations/get_integrations?companyId=${company}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching third-party Data:');
        throw error;
    }
};
const fetchProgressNotes = async (company) => {
    try {
        const response = await axiosInstance.get(`/ProgressNotes/get_all_progressnote_by_company?companyId=${company}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching Progress Notes');
        throw error;
    }
};
const fetchTicket = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Tickets/get_all_tickets?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching Tickets');
        throw error;
    }
};
const fetchFormTemplate = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Templates/get_templates?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching Form Templates');
        throw error;
    }
};
const fetchShiftAttendance = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Attendances/get_shift_attendance?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching shift Attendance');
        throw error;
    }
};
const fetchStaffAttendance = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/StaffAttendances/get_all_staff_attendances?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching staff Attendance');
        throw error;
    }
};
const fetchAdminAttendance = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/AdminAttendances/get_admin_attendance?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching Admin Attendance');
        throw error;
    }
};

const filterShiftAttendance = async (company, fromDate, toDate, staff, client, type) => {
    try {
        const response = await axiosInstance.get(`/Attendances/get_periodic_shift_attendnace?companyId=${company}&fromDate=${fromDate}&toDate=${toDate}&staffId=${staff}&clientId=${client}&shifttype=${type}`);
        return response.data;
    } catch (error) {
        toast.error('Error filtering Attendance:');
        throw error;
    }
};
const filterProgressNotes = async (staff, client) => {
    try {
        const response = await axiosInstance.get(`/ProgressNotes/get_progressnote_by_user?staffname=${staff}&profileId=${client}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching Progress Notes:');
        throw error;
    }
};
const fetchTimesheet = async (user, sta, dateFrom, dateTo) => {
    try {
        const response = await axiosInstance.get(`/Attendances/generate_staff_timesheet?userId=${user}&staffid=${sta}&fromDate=${dateFrom}&toDate=${dateTo}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching Timesheet');
        throw error;
    }
};
const fetchAllTimesheet = async (user, dateFrom, dateTo) => {
    try {
        const response = await axiosInstance.get(`/Attendances/generate_all_staff_timesheet?userId=${user}&fromDate=${dateFrom}&toDate=${dateTo}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching Timesheet');
        throw error;
    }
};
const fetchSupportSchedule = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/Invoice/get_all_support_schedules?companyId=${companyId}`);
        return response.data;
    } catch (error) {
        toast.error('Error fetching Support Schedule');
        throw error;
    }
};
const api = {
    fetchAdminData,
    filterAdminData,
    fetchStaffData,
    filterStaffData,
    fetchClientData,
    filterClientData,
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
    fetchStaffAttendance,
    fetchAdminAttendance,
    fetchTimesheet,
    fetchAllTimesheet,
    fetchSupportSchedule
    // Add other API endpoints and corresponding methods as needed
};

export default api;
