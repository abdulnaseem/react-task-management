import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';
import TaskItem from './TaskItem';

jest.mock('./TaskItem', () => ({
    __esModule: true,
    default: jest.fn((props) => {
        return <div data-testid="mock-task-item" {...props} />;
    }),
}));
  
describe('TaskList Component' ,() => {

    const mockOnTaskUpdated = jest.fn();

    const mockTasks = [
        {
            _id: '1',
            title: 'Task 1',
            description: 'Description 1',
            status: 'pending',
            dueDateTime: new Date().toISOString(),
        },
        {
            _id: '2',
            title: 'Task 2',
            description: 'Description 2',
            status: 'completed',
            dueDateTime: new Date().toISOString(),
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('renders TaskItem for each task', () => {
        render(<TaskList tasks={mockTasks} onTaskUpdated={mockOnTaskUpdated} />);

        const taskItems = screen.getAllByTestId('mock-task-item');
        expect(taskItems).toHaveLength(mockTasks.length);

        expect(TaskItem).toHaveBeenCalledTimes(mockTasks.length);

        expect(TaskItem.mock.calls[0][0]).toEqual(
            expect.objectContaining({
              task: mockTasks[0],
              onTaskUpdated: mockOnTaskUpdated,
            })
        );
        expect(TaskItem.mock.calls[1][0]).toEqual(
            expect.objectContaining({
              task: mockTasks[1],
              onTaskUpdated: mockOnTaskUpdated,
            })
        );
    });

    it('renders nothing if tasks list is empty', () => {
        render(<TaskList tasks={[]} onTaskUpdated={mockOnTaskUpdated} />);
        expect(screen.queryByTestId('mock-task-item')).toBeNull();
    });
})