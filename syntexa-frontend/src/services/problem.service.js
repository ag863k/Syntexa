import axios from 'axios';
import AuthService from './auth.service';

const API_URL = "https://syntexa-api.onrender.com/api/v1/";

// This helper function gets the JWT from local storage for protected requests
const authHeader = () => {
    const user = AuthService.getCurrentUser();
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};

const getAllProblems = () => {
    // Viewing problems is public, no auth header needed
    return axios.get(API_URL + "problems");
};

const getProblemById = (id) => {
    // Viewing a single problem is public
    return axios.get(API_URL + "problems/" + id);
};

const createProblem = (problemData) => {
    // Creating a problem is protected
    return axios.post(API_URL + "problems", problemData, { headers: authHeader() });
}

const addNoteToProblem = (problemId, noteData) => {
    // Adding a note is protected
    return axios.post(API_URL + `problems/${problemId}/notes`, noteData, { headers: authHeader() });
};

const ProblemService = {
    getAllProblems,
    getProblemById,
    createProblem,
    addNoteToProblem,
};

export default ProblemService;
