import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from './TaskForm';
import { createTask } from '../services/api';

// Mock the API module
jest.mock('../services/api', () => ({
  createTask: jest.fn().mockResolvedValue({}),
}));

// Mock DateTimePicker to simplify testing
jest.mock('@mui/x-date-pickers', () => ({
    __esModule: true,
    DateTimePicker: (props) => (
      <input
        data-testid="date-time-picker"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    ),
}));

describe('TaskForm Component', () => {
  const mockOnTaskCreated = jest.fn();
  const mockHideForm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} hideForm={mockHideForm} />);
    //screen.logTestingPlaygroundURL();

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByTestId('date-time-picker')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('capitalizes the first letter of the title', () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} hideForm={mockHideForm} />);
    
    const titleInput = screen.getByRole('textbox', { name: /title/i });
    fireEvent.change(titleInput, { target: { value: 'test title' } });
    
    expect(titleInput.value).toBe('Test title');
  });

  it('submits the form with correct data', async () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} hideForm={mockHideForm} />);
    
    const testDate = new Date('2023-12-31T12:00:00');

    // Fill out the form
    fireEvent.change(screen.getByRole('textbox', { name: /title/i }), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByRole('textbox', { name: /description/i }), { target: { value: 'Test Description' } });
    
    // Select status
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('In Progress'));
    
    // Mock date selection
    fireEvent.change(screen.getByTestId('date-time-picker'), { 
      target: { value: testDate } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Create Task'));
    
    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        status: 'in-progress',
        dueDateTime: expect.any(String)
      });
      expect(mockOnTaskCreated).toHaveBeenCalled();
    });
  });

  it('closes the form when cancel is clicked', () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} hideForm={mockHideForm} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(mockHideForm).toHaveBeenCalled();
  });

  it('should display error message when task creation fails', async () => {
    const errorMessage = 'Title cannot be empty';
    createTask.mockRejectedValueOnce({
      response: {
        data: {
          error: errorMessage
        }
      }
    });

    render(<TaskForm onTaskCreated={mockOnTaskCreated} hideForm={mockHideForm} />);
    
    fireEvent.click(screen.getByText('Create Task'));
    
    await waitFor(() => {
      expect(createTask).toHaveBeenCalled();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toHaveStyle('color: red');
    });
  });
});