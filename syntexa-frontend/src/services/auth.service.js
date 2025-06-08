import axios from 'axios';

// IMPORTANT: Your LIVE Render Backend URL
const API_URL = "https://syntexa-api.onrender.com/api/v1/auth/";

const signup = (username, email, password) => {
    return axios.post(API_URL + "signup", { username, email, password });
};

const login = (username, password) => {
    return axios.post(API_URL + "login", { username, password })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
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

const AuthService = { signup, login, logout, getCurrentUser };
export default AuthService;