import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HomePage from '../pages/HomePage';
import * as api from '../services/api';

//mock child components
jest.mock('../components/TaskList', () => (props) => (
    <div data-testid='mock-task-list'>{`Rendering ${props.tasks.length} tasks`}</div>
));

jest.mock('../components/TaskForm', () => (props) => (
    <div data-testid="mock-task-form">Mock Task Form</div>
));

jest.mock('../services/api', () => ({
    getTasks: jest.fn(() => Promise.resolve([
      { _id: '1', title: 'Task 1', status: 'pending', dueDateTime: new Date().toISOString() },
      { _id: '2', title: 'Task 2', status: 'completed', dueDateTime: new Date().toISOString() },
    ]))
}));

//mock api call
const mockTasks = [
    { _id: '1', title: 'Task 1', status: 'pending', dueDateTime: new Date().toISOString() },
    { _id: '2', title: 'Task 2', status: 'completed', dueDateTime: new Date().toISOString() },
];

describe('HomePage', () => {
    beforeEach(() => {
        jest.spyOn(api, 'getTasks').mockResolvedValue(mockTasks);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders title and fetches task on load', async () => {
        render(<HomePage />);
        screen.logTestingPlaygroundURL();

        expect(screen.getByText('Task Manager')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add new task/i })).toBeInTheDocument();

        expect(screen.getByRole('loading')).toBeDefined();

        await waitFor(() => {
            expect(screen.getByTestId('mock-task-list')).toBeInTheDocument();
            expect(screen.getByText('Rendering 2 tasks')).toBeInTheDocument();
        });
    });

    it('toggles form when button is clicked', () => {
        render(<HomePage />);

        const toggleButton = screen.getByRole('button', { name: /add new task/i });

        fireEvent.click(toggleButton);
        expect(screen.getByText('Mock Task Form')).toBeInTheDocument();

        fireEvent.click(toggleButton);
        expect(screen.queryByText('Mock Task Form')).not.toBeInTheDocument();
    });
});