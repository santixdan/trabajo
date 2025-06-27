// import { ref } from 'vue';
import APIClient from './../plugins/axios.js';

// Función GET
export async function getData(url) {
    try {
        const response = await APIClient.get(url);
        return response.data;
    } catch (error) {
        console.error('Error en la petición GET:', error);
        throw error;
    }
}

// Función POST
export async function postData(url, data) {
    try {
        const response = await APIClient.post(url, data);
        return response.data;
    } catch (error) {
        console.error('Error en la petición POST:', error);
        throw error;
    }
}

// Función POST Login
export async function postLogin(url, data) {
    try {
        const response = await APIClient.post(url, data);

        const { token } = response.data;
        localStorage.setItem('token', token);

        return response.data;
    } catch (error) {
        console.error('Error en la petición POST de Login:', error);
        throw error;
    }
}

// Función PUT
export async function putData(url, data) {
    try {
        const response = await APIClient.put(url, data);
        return response.data;
    } catch (error) {
        console.error('Error en la petición PUT:', error);
        throw error;
    }
}