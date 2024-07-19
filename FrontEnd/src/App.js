import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dreamer from './pages/Dreamer';
import DreamerIdea from './pages/DreamerIdea';
import Idea from './pages/Idea';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import Supporter from './pages/Supporter';

import './App.css';
import Join from './pages/Join';
import JoinDreamer from './pages/JoinDreamer';
import JoinSupporter from './pages/JoinSupporter';

import JoinSucceed from './pages/JoinSucceed';
import Profile from './pages/Profile';


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
            <Route path="/join/succeeded" element={<JoinSucceed />} />

            <Route path="/main" element={<MainPage />} />

            <Route path="/dreamer" element={<Dreamer />} />
            <Route path="/dreamer/write" element={<DreamerIdea />} />
            <Route path="/supporter" element={<Supporter />} />

            <Route path="/idea" element={<Idea />} />
            <Route path="/idea/*" element={<Idea />} />

            <Route path="/profile" element={<Profile />}/>
            
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;