import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://profitmax-001-site10.ctempurl.com/api',
});

axiosInstance.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
});

export default axiosInstance;
