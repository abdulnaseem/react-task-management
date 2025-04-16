import axios from 'axios';

//const BASE_URL = 'https://task-management-w92z.onrender.com/api/tasks';
//const BASE_URL = 'http://localhost:5173/api/tasks';
const BASE_URL = import.meta.env.VITE_API_URL;

export const getTasks = async() => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data.data;
    } catch(error) {
        console.log(error);
    }
}   

export const getTask = async(id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data.data;
    } catch(error) {
        console.log(error);
    }
}  

export const createTask = async(taskData) => {
    try {
        const response = await axios.post(BASE_URL, taskData);
        return response.data.data;
    } catch(error) {
        console.log(error);
    }
}  

export const updateTaskStatus = async(id, status) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, { status });
        return response.data.data;
    } catch(error) {
        console.log(error);
    }
}  

export const deleteTask = async(id) => {
    try {
        await axios.delete(`${BASE_URL}/${id}`);
    } catch(error) {
        console.log(error);
    }
}  