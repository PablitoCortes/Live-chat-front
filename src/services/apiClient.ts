import axios from "axios";

const NODE_ENV = process.env.NODE_ENV;

export const apiClient = axios.create({
    baseURL: NODE_ENV === 'production' ? 'https://live-chat-back-qjac.onrender.com/api' : 'http://localhost:5500/api',
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json'
    }
});