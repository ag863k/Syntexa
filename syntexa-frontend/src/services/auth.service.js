import axios from 'axios';

const API_URL = "https://syntexa-api.onrender.com/api/v1/auth/";

const signup = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}signup`, { username, email, password });
    return response.data;
  } catch (error) {
    console.error("Signup error:", error.response ? error.response.data : error);
    const resMessage =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      "Signup failed, please try again.";
    throw new Error(resMessage);
  }
};

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, { username, password });
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response ? error.response.data : error);
    const resMessage =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      "Login failed, please try again.";
    throw new Error(resMessage);
  }
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
  } catch (error) {
    return null;
  }
};

const AuthService = { signup, login, logout, getCurrentUser };

export default AuthService;
