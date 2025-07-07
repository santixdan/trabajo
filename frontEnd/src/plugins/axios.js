import axios from 'axios';

const APIClient = axios.create({
    baseURL: 'https://ll5j1d5z-4000.use2.devtunnels.ms/users/api',
});

// Interceptor para adjuntar el token actualizado
APIClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.token = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default APIClient;