import axios from 'axios';

// IMPORTANT: Your LIVE Render Backend URL
const API_URL = "https://syntexa-api.onrender.com/api/v1/auth/";

const signup = async (username, email, password) => {
    try {
        const response = await axios.post(API_URL + "signup", { username, email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

const login = async (username, password) => {
    try {
        const response = await axios.post(API_URL + "login", { username, password });
        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
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