import { ChakraProvider } from '@chakra-ui/react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Dreamer from './pages/Dreamer';
import DreamerIdea from './pages/DreamerIdea';
import Idea from './pages/Idea';
import Join from './pages/Join';
import JoinDreamer from './pages/JoinDreamer';
import JoinSucceed from './pages/JoinSucceed';
import JoinSupporter from './pages/JoinSupporter';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import Profile from './pages/Profile';
import Supporter from './pages/Supporter';

const muiTheme = createTheme({
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
    <ChakraProvider>
      <MuiThemeProvider theme={muiTheme}>
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
      </MuiThemeProvider>
    </ChakraProvider>
  );
}

export default App;