import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskItem from './TaskItem';
import { deleteTask, updateTaskStatus } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Mock API and navigation
jest.mock('../services/api', () => ({
    updateTaskStatus: jest.fn().mockResolvedValue({}),
    deleteTask: jest.fn().mockResolvedValue({})
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}))

describe('TaskItem Component', () => {
    const mockTask = {
        _id: '123',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        dueDateTime: '2025-04-30T12:00:00.000Z',
    };

    const onTaskUpdated = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders task data correctly', () => {
        render(<TaskItem task={mockTask} onTaskUpdated={onTaskUpdated} />)
        //screen.logTestingPlaygroundURL();

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText(/Due:/)).toBeInTheDocument();
        expect(screen.getByText('pending')).toBeInTheDocument();
    });

    it('opens menu and changes task status', async () => {
        render(<TaskItem task={mockTask} onTaskUpdated={onTaskUpdated} />)

        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Set as In Progress'));

        await waitFor(() => {
            expect(updateTaskStatus).toHaveBeenCalledWith('123', 'in-progress');
            expect(onTaskUpdated).toHaveBeenCalled();
        })
    });

    it('opens menu and deletes task', async () => {
        render(<TaskItem task={mockTask} onTaskUpdated={onTaskUpdated} />)
        
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(deleteTask).toHaveBeenCalledWith('123');
            expect(onTaskUpdated).toHaveBeenCalled();
        });
    });
})