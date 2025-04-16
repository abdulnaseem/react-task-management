import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Stack, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { getTask, updateTaskStatus } from '../services/api';

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDateTime: new Date()
  });

  useEffect(() => {
    const fetchTask = async () => {
      const task = await getTask(id);
      setTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDateTime: new Date(task.dueDateTime)
      });
    };
    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dueDateTime: date });
  };

  const handleStatusChange = async (newStatus) => {
    await updateTaskStatus(id, newStatus);
    const updatedTask = await getTask(id);
    setTask(updatedTask);
  };

  if (!task) return <Typography>Loading...</Typography>;

  return (
    <Stack spacing={3}>
      <Button variant="outlined" onClick={() => navigate('/')}>
        Back to Tasks
      </Button>
      
      {isEditing ? (
        <Stack component="form" spacing={3}>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <DateTimePicker
            label="Due Date & Time"
            value={formData.dueDateTime}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <Stack direction="row" spacing={2}>
            <Button 
              variant="contained" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setIsEditing(false)}
            >
              Save Changes
            </Button>
          </Stack>
        </Stack>
      ) : (
        <>
          <Typography variant="h4">{task.title}</Typography>
          <Typography>{task.description}</Typography>
          <Typography>
            Status: <span style={{ 
              color: task.status === 'completed' ? 'green' : 
                     task.status === 'in-progress' ? 'orange' : 'gray'
            }}>
              {task.status}
            </span>
          </Typography>
          <Typography>
            Due: {new Date(task.dueDateTime).toLocaleString()}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setIsEditing(true)}
          >
            Edit Task
          </Button>
        </>
      )}
    </Stack>
  );
}