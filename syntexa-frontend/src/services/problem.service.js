import axios from 'axios';
import AuthService from './auth.service';

const API_URL = "https://syntexa-api.onrender.com/api/v1/";

const authHeader = () => {
  const user = AuthService.getCurrentUser();
  return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const getAllProblems = async () => {
  try {
    const response = await axios.get(`${API_URL}problems`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getProblemById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}problems/${id}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createProblem = async (problemData) => {
  try {
    const response = await axios.post(`${API_URL}problems`, problemData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addNoteToProblem = async (problemId, noteData) => {
  try {
    const response = await axios.post(
      `${API_URL}problems/${problemId}/notes`,
      noteData,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const ProblemService = {
  getAllProblems,
  getProblemById,
  createProblem,
  addNoteToProblem,
};

export default ProblemService;
