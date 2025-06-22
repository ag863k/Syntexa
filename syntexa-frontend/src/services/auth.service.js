import axios from 'axios';

// API URL from environment variable with production fallback
const API_URL = process.env.REACT_APP_AUTH_API_URL || 
    (process.env.NODE_ENV === 'production' ? 
        "https://syntexa-api.onrender.com/api/v1/auth/" : 
        "http://localhost:8080/api/v1/auth/");

// Create axios instance with interceptors for better error handling
const authAxios = axios.create({
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor to handle common auth errors
authAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("user");
            window.dispatchEvent(new Event('storage'));
        }
        return Promise.reject(error);
    }
);

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
            authAxios.post(API_URL + "signup", { username, email, password })
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message || error.toString();
    }
};

const login = async (username, password) => {
    try {
        const response = await withTimeout(
            authAxios.post(API_URL + "login", { username, password })
        );
        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message || error.toString();
    }
};

// Auto-refresh token when close to expiry
const refreshToken = async () => {
    try {
        const token = getToken();
        if (!token) throw new Error('No token available');
        
        const response = await withTimeout(
            authAxios.post(API_URL + "refresh", {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
        );
        
        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
        }
    } catch (error) {
        // If refresh fails, logout user
        logout();
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

// Automatic token refresh checker
const shouldRefreshToken = (token) => {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const timeUntilExpiry = payload.exp * 1000 - Date.now();
        // Refresh if token expires in less than 5 minutes
        return timeUntilExpiry < 300000 && timeUntilExpiry > 0;
    } catch (e) {
        return false;
    }
};

// Smart token getter with auto-refresh
const getSmartToken = async () => {
    const user = getCurrentUser();
    if (!user || !user.token) return null;
    
    if (isTokenExpired(user.token)) {
        logout();
        return null;
    }
    
    if (shouldRefreshToken(user.token)) {
        try {
            await refreshToken();
            const refreshedUser = getCurrentUser();
            return refreshedUser?.token || null;
        } catch (error) {
            console.warn('Token refresh failed:', error);
            return user.token; // Return current token as fallback
        }
    }
    
    return user.token;
};

const AuthService = { 
    signup, 
    login, 
    logout, 
    getCurrentUser, 
    getToken, 
    getValidToken,
    isTokenExpired,
    enhancedLogout,
    refreshToken,
    getSmartToken
};
export default AuthService;