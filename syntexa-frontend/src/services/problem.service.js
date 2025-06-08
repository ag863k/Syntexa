import axios from 'axios';
import AuthService from './auth.service';

const API_URL = "https://syntexa-api.onrender.com/api/v1/";

// This helper function gets the JWT from local storage for protected requests
const authHeader = () => {
    const token = AuthService.getToken();
    return token ? { Authorization: 'Bearer ' + token } : {};
};

const getAllProblems = async () => {
    try {
        const response = await axios.get(API_URL + "problems");
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

const getProblemById = async (id) => {
    try {
        const response = await axios.get(API_URL + "problems/" + id);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

const createProblem = async (problemData) => {
    try {
        const response = await axios.post(API_URL + "problems", problemData, { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

const addNoteToProblem = async (problemId, noteData) => {
    try {
        const response = await axios.post(API_URL + `problems/${problemId}/notes`, noteData, { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

// Update note
const updateNote = async (problemId, noteId, noteData) => {
    try {
        const response = await axios.put(API_URL + `problems/${problemId}/notes/${noteId}`, noteData, { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

// Delete note
const deleteNote = async (problemId, noteId) => {
    try {
        const response = await axios.delete(API_URL + `problems/${problemId}/notes/${noteId}`, { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

const getCurrentUserProfile = async () => {
    try {
        const response = await axios.get("https://syntexa-api.onrender.com/api/v1/problems/1/notes/me", { headers: authHeader() });
        return response.data;
    } catch (error) {
        return null;
    }
};

const ProblemService = {
    getAllProblems,
    getProblemById,
    createProblem,
    addNoteToProblem,
    updateNote,
    deleteNote,
    getCurrentUserProfile,
};

export default ProblemService;
