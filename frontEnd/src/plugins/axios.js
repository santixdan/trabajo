import axios from 'axios';

const APIClient = axios.create({
    baseURL: 'http://localhost:4000/users/api',
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