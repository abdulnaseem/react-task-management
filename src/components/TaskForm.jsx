import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Stack, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  InputLabel,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';
import { createTask } from '../services/api';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function TaskForm({ onTaskCreated }) {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDateTime: new Date()
  });
  const [dueDate, setDueDate] = useState(new Date());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dueDateTime: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask(formData);
    onTaskCreated();
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
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
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            renderInput={(params) => (
                <TextField 
                {...params} 
                fullWidth 
                sx={{ mt: 2 }} 
                />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create Task</Button>
      </DialogActions>
    </Dialog>
  );
}