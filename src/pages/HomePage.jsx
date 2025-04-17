import { useState, useEffect } from "react";
import { Button, Typography } from '@mui/material';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { getTasks } from '../services/api';
import ClipLoader from 'react-spinners/ClipLoader';

const HomePage = () => {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isloading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async() => {
        try {
            setIsLoading(true);
            const tasks = await getTasks();
            setTasks(tasks);
        } catch(error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleHideForm = () => {
        setShowForm(false);
    }

    return (
        <div className="mt-[50px]">
            <Typography variant="h4" gutterBottom>
                Task Manager
            </Typography>
            <Button
                variant="contained"
                onClick={() => setShowForm(!showForm)}
                sx={{ mb: 2 }}
            >
                {showForm ? "Hide Form" : "Add New Task"}
            </Button>
            
            {/* Centered ClipLoader below the button */}
            {isloading && (
                <div className="flex justify-center my-4" role='loading' aria-label='Loading tasks'>
                    <ClipLoader color="#000" size={50} />
                </div>
            )}
            
            {showForm && <TaskForm onTaskCreated={fetchTasks} hideForm={handleHideForm} />}
            {!isloading && <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />}
        </div>
    )
}

export default HomePage;