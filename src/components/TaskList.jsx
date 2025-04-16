import { List } from '@mui/material';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onTaskUpdated }) => {
    return (
        <List>
            {
                tasks.map((task) => (
                    <TaskItem key={task._id} task={task} onTaskUpdated={onTaskUpdated} />
                ))
            }
        </List>
    )
}

export default TaskList;