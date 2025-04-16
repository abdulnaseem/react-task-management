import axios from 'axios';

// Configure base URL from environment variables
const BASE_URL = import.meta.env.VITE_API_URL;

// Create configured Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Unified error handler
const handleError = (error, context) => {
  console.error(`Error in ${context}:`, error);
  if (error.response) {
    // Server responded with non-2xx status
    console.error('Response data:', error.response.data);
    console.error('Status code:', error.response.status);
    throw new Error(error.response.data.message || `Request failed with status ${error.response.status}`);
  } else if (error.request) {
    // No response received
    throw new Error('No response received from server');
  } else {
    // Request setup error
    throw new Error(`Error setting up request: ${error.message}`);
  }
};

export const getTasks = async () => {
  try {
    const response = await api.get('/');
    return response.data.data;
  } catch (error) {
    return handleError(error, 'getTasks');
  }
};

export const getTask = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data.data;
  } catch (error) {
    return handleError(error, `getTask(${id})`);
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await api.post('/', taskData);
    return response.data.data;
  } catch (error) {
    return handleError(error, 'createTask');
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    const response = await api.put(`/${id}`, { status });
    return response.data.data;
  } catch (error) {
    return handleError(error, `updateTaskStatus(${id})`);
  }
};

export const deleteTask = async (id) => {
  try {
    await api.delete(`/${id}`);
  } catch (error) {
    return handleError(error, `deleteTask(${id})`);
  }
};