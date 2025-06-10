import axios from 'axios';

// API URL from environment variable, fallback to local development
const API_URL = process.env.REACT_APP_AUTH_API_URL || "http://localhost:8080/api/v1/auth/";

// Helper: Promise with timeout
function withTimeout(promise, ms = 10000) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out. Please try again.')), ms))
    ]);
}

const signup = async (username, email, password) => {
    try {
        const response = await withTimeout(
            axios.post(API_URL + "signup", { username, email, password })
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message || error.toString();
    }
};

const login = async (username, password) => {
    try {
        const response = await withTimeout(
            axios.post(API_URL + "login", { username, password })
        );
        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message || error.toString();
    }
};

const logout = () => {
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch (e) {
        return null;
    }
};

const getToken = () => {
    const user = getCurrentUser();
    return user?.token || null;
};

const AuthService = { signup, login, logout, getCurrentUser, getToken };
export default AuthService;