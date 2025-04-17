import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import TaskDetailPage from './TaskDetailPage';
import * as api from '../services/api';

jest.mock('../services/api', () => ({
    getTask: jest.fn(),
    updateTaskStatus: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ id: '123' }),
    useNavigate: () => mockNavigate
}));

describe('TaskDetailPage', () => {
    const mockTask = {
        _id: '123',
        title: 'Test Task',
        description: 'Test Description',
        status: 'in-progress',
        dueDateTime: new Date('2025-04-17T14:12:03.949Z').toISOString(),
    };

    beforeEach(() => {
        api.getTask.mockResolvedValue(mockTask);
    });

    it('shows loading spinner initially', async () => {
        render(
            <MemoryRouter>
                <TaskDetailPage />
            </MemoryRouter>
        );
        //screen.logTestingPlaygroundURL();

        expect(screen.getByRole('loading')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Test Task')).toBeInTheDocument();
        });
    });

    it('displays task details after loading', async () => {
        render(
            <MemoryRouter>
                <TaskDetailPage />
            </MemoryRouter>
        );

        await screen.findByText('Test Task');
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText(/Status/i)).toBeInTheDocument();
        expect(screen.getByText(/Due:/i)).toBeInTheDocument();
    });

    it('navigates back when "Back to Tasks" is clicked ', async () => {
        render(
            <MemoryRouter>
                <TaskDetailPage />
            </MemoryRouter>
        );

        await screen.findByText('Test Task');

        const backButton = screen.getByRole('button', { name: /back to tasks/i });
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});