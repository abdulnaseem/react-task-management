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
  FormControl,
  Typography
} from '@mui/material';
import { createTask } from '../services/api';
import { DateTimePicker } from '@mui/x-date-pickers';

const TaskForm = ({ onTaskCreated, hideForm }) => {
    const [open, setOpen] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        dueDateTime: new Date()
    });
    const [dueDate, setDueDate] = useState(new Date());
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Capitalize only the first letter while preserving cursor position
        let capitalizedValue = value;
        if (value.length === 1) {
            capitalizedValue = value.charAt(0).toUpperCase();
        } else if (value.length > 1 && formData[name].length === 0) {
            capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
        }

        setFormData({ ...formData, [name]: capitalizedValue });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, dueDateTime: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
    
        try {
            await createTask(formData);
            onTaskCreated();
            setOpen(false);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                const errorMsg = Array.isArray(error.response.data.error)
                    ? error.response.data.error.join(', ')
                    : error.response.data.error;
                console.log(errorMsg);    
                setError(errorMsg);
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    };
    

    const handleHideDialog = () => {
        setOpen(false);
        hideForm();
    }

    return (
        <Dialog 
            open={open} 
            onClose={handleHideDialog}
            PaperProps={{
            className: "bg-white rounded-lg shadow-xl w-full max-w-md"
            }}
        >
            <DialogTitle className="bg-blue-500 text-white pt-[20px]">
                Create New Task
            </DialogTitle>

            {error && (
                <Typography style={{ color: 'red', marginLeft: '30px', fontWeight: 'bold' }}>
                    {error}
                </Typography>
            )}
            
            <DialogContent className="p-6">
                <Stack spacing={4} className="mt-[5px]">
                    <TextField
                        name="title"
                        label="Title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        required
                        className="mb-4"
                        InputProps={{
                            className: "bg-gray-50 rounded", // Added 'capitalize' here
                        }}
                        InputLabelProps={{
                            className: "text-gray-600"
                        }}
                    />
                    
                    <TextField
                        name="description"
                        label="Description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        className="mb-4"
                        InputProps={{
                            className: "bg-gray-50 rounded",
                        }}
                        InputLabelProps={{
                            className: "text-gray-600"
                        }}
                    />
                    
                    <FormControl fullWidth className="mb-4">
                        <InputLabel className="text-gray-600">Status</InputLabel>
                        <Select
                            name="status"
                            value={formData.status}
                            label="Status"
                            onChange={handleChange}
                            className="bg-gray-50 rounded"
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="in-progress">In Progress</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <DateTimePicker
                        label="Due Date & Time"
                        value={dueDate}
                        onChange={(newValue) => {
                            setDueDate(newValue);
                            handleDateChange(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField 
                            {...params} 
                            fullWidth 
                            className="bg-gray-50 rounded"
                            InputLabelProps={{
                                className: "text-gray-600"
                            }}
                            />
                        )}
                    />
                </Stack>
            </DialogContent>
            
            <DialogActions className="p-4 bg-gray-100 rounded-b-lg">
                <Button 
                    onClick={handleHideDialog}
                    className="text-gray-600 hover:bg-gray-200 px-4 py-2 rounded"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Create Task
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TaskForm;