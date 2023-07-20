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

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle 401 error here, such as logging out the user
            // For example:
            localStorage.clear(); // Clear user data from local storage
            window.location.href = '/login'; // Redirect the user to the login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
