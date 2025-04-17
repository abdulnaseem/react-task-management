import { useState } from 'react';
import { 
  ListItem, 
  ListItemText, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem,
  Chip
} from '@mui/material';
import { 
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { deleteTask, updateTaskStatus } from '../services/api';

const statusColors = {
  pending: 'default',
  'in-progress': 'primary',
  completed: 'success'
};

const TaskItem = ({ task, onTaskUpdated }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleStatusChange = async (newStatus) => {
        await updateTaskStatus(task._id, newStatus);
        onTaskUpdated();
        handleMenuClose();
    };

    const handleDelete = async () => {
        await deleteTask(task._id);
        onTaskUpdated();
        handleMenuClose();
    };

    const handleEdit = () => {
        navigate(`/tasks/${task._id}`);
        handleMenuClose();
    };

    return (
        <ListItem
            secondaryAction={
                <>
                    <IconButton onClick={handleMenuOpen}>
                        <MoreIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => handleStatusChange('pending')}>
                            Set as Pending
                        </MenuItem>
                        <MenuItem onClick={() => handleStatusChange('in-progress')}>
                            Set as In Progress
                        </MenuItem>
                        <MenuItem onClick={() => handleStatusChange('completed')}>
                            Set as Completed
                        </MenuItem>
                        <MenuItem onClick={handleEdit}>
                            <ViewIcon fontSize="small" sx={{ mr: 1 }} />
                            View
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>
                            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                            Delete
                        </MenuItem>
                    </Menu>
                </>
            }
        >
            <ListItemText
                primary={task.title}
                secondary={
                    <>
                        <Typography component="span" display="block">
                            {task.description}
                        </Typography>
                        <Typography component="span" display="block" variant="caption">
                            Due: {new Date(task.dueDateTime).toLocaleString()}
                        </Typography>
                    </>
                }
            />
            <Chip 
                label={task.status} 
                color={statusColors[task.status]} 
                sx={{ ml: 2 }}
            />
        </ListItem>
    );
}

export default TaskItem;