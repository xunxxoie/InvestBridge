import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import  Login  from './pages/Login'
import MainPage from './pages/MainPage';
import Dreamer from './pages/Dreamer';
import DreamerIdea from './pages/DreamerIdea';
import Supporter from './pages/Supporter';
import Idea from './pages/Idea';

import './App.css';
import Join from './pages/Join';
import JoinDreamer from './pages/JoinDreamer';
import JoinSupporter from './pages/JoinSupporter';


const theme = createTheme({
  typography: {
    fontFamily: "'Noto Sans KR', sans-serif",
  },
  palette: {
    primary: {
      main: '#1976d2', 
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/join" element={<Join />} />
            <Route path="/join/dreamer" element={<JoinDreamer />} />
            <Route path="/join/supporter" element={<JoinSupporter />} />
            
            <Route path="/main" element={<MainPage />} />

            <Route path="/dreamer" element={<Dreamer />} />
            <Route path="/dreamer/write" element={<DreamerIdea />} />
            <Route path="/supporter" element={<Supporter />} />

            <Route path="/idea" element={<Idea />} />
            <Route path="/idea/*" element={<Idea />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;