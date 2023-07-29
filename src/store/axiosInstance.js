import axios from 'axios';
import { toast } from 'react-toastify';

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
        const { response } = error;
        if (response) {
            // Handle 401 Unauthorized error
            if (response.status === 401) {
                localStorage.clear(); // Clear user data from local storage
                toast.error("Session TimeOut")
                window.location.replace = '/login'; // Redirect the user to the login page
            }
            // Handle 403 Forbidden error
            else if (response.status === 403) {
                // Perform actions to handle the 403 error, e.g., show a forbidden page
                console.error('Forbidden Error:', response.data.message);
                // window.location.href = '/forbidden'; // Redirect the user to a forbidden page
            }
            // Handle 404 Not Found error
            else if (response.status === 404) {
                // Perform actions to handle the 404 error, e.g., show a not found page
                console.error('Not Found Error:', response.data.message);
                // window.location.href = '/not-found'; // Redirect the user to a not found page
            }
            // Handle 500 Internal Server Error
            else if (response.status === 500) {
                // Perform actions to handle the 500 error, e.g., show an error page
                console.error('Internal Server Error:', response.data.message);
                window.history.pushState(null, null, '/app/error/500');
                window.location.reload(); // Refresh the page to render the new route
            }
        } else {
            // Handle other errors, like network issues or CORS errors
            console.error('Network Error:', error.message);
            // window.location.href = '/network-error'; // Redirect the user to a network error page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

