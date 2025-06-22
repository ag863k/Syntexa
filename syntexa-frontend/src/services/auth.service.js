import axios from 'axios';

// API URL from environment variable, fallback to local development
const API_URL = process.env.REACT_APP_AUTH_API_URL || "http://localhost:8080/api/v1/auth/";

// Helper: Promise with timeout - reduced to 5 seconds for faster response
function withTimeout(promise, ms = 5000) {
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

// Check if token is expired
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch (e) {
        return true;
    }
};

// Get valid token (auto-logout if expired)
const getValidToken = () => {
    const user = getCurrentUser();
    if (!user || !user.token) return null;
    
    if (isTokenExpired(user.token)) {
        logout();
        return null;
    }
    return user.token;
};

// Enhanced logout with event dispatch
const enhancedLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/login';
};

const AuthService = { 
    signup, 
    login, 
    logout, 
    getCurrentUser, 
    getToken, 
    getValidToken,
    isTokenExpired,
    enhancedLogout
};
export default AuthService;