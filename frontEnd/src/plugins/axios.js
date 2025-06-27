import axios from 'axios'
const token = localStorage.getItem('token'); 
const APIClient = axios.create({
    baseURL: 'http://localhost:4000/users/',
    headers: {
        "token": token
    }
});

export default APIClient;