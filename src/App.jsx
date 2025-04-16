import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TaskDetailPage from './pages/TaskDetailPage';
import { CssBaseline, Container } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Router>
        <CssBaseline />
        <Container maxWidth='md'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/tasks/:id' element={<TaskDetailPage />} />
          </Routes>
        </Container>
      </Router>
    </LocalizationProvider>
  )
}

export default App;