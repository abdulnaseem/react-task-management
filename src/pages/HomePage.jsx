import { useState, useEffect } from "react";
import { Button, Typography } from '@mui/material';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { getTasks } from '../services/api';

const HomePage = () => {

    const [tasks, setTasks]= useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async() => {
        const tasks = await getTasks();
        console.log(tasks);
        setTasks(tasks);
    }

    console.log(tasks);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Task Manager
            </Typography>
            <Button
                variant="contained"
                onClick={() => setShowForm(!showForm)}
                sx={{ mb: 2 }}
            >
                { showForm ? "Hide Form" : "Add New Task" }
            </Button>
            { showForm && <TaskForm onTaskCreated={fetchTasks} /> }
            <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
        </div>
    )

}

export default HomePage;