import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response){
            if(error.response.status === 401) {
                console.error("Unauthorized access - redirecting to login");
                window.location.href = '/login'; 
        }else if (error.response.status === 500) {
                console.error("Server error - please try again later");
            }
        } else {
            console.error("Network error or no response from server");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
