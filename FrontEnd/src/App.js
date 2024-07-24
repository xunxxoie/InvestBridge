import { ChakraProvider } from '@chakra-ui/react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

import IdeaPage from './pages/idea/IdeaPage';
import IdeaSubmitPage from './pages/idea/IdeaSubmitPage';
import DreamerPage from './pages/main/DreamerPage';
import LoginPage from './pages/main/LoginPage';
import MainPage from './pages/main/MainPage';
import SupporterPage from './pages/main/SupporterPage';
import ProfilePage from './pages/profile/ProfilePage';
import SignUpDreamerPage from './pages/signup/SignUpDreamerPage';
import SignUpSelectPage from './pages/signup/SignUpSelectPage';
import SignUpSupporterPage from './pages/signup/SignUpSupporterPage';
import SignUpWelcomePage from './pages/signup/SignUpWelcomePage';

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
              <Route path="/" element={<LoginPage />} />
              <Route path="/join" element={<SignUpSelectPage />} />
              <Route path="/join/dreamer" element={<SignUpDreamerPage />} />
              <Route path="/join/supporter" element={<SignUpSupporterPage />} />
              <Route path="/join/succeeded" element={<SignUpWelcomePage />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/dreamer" element={<DreamerPage />} />
              <Route path="/dreamer/write" element={<IdeaSubmitPage />} />
              <Route path="/supporter" element={<SupporterPage />} />
              <Route path="/idea" element={<IdeaPage />} />
              <Route path="/idea/*" element={<IdeaPage />} />
              <Route path="/profile" element={<ProfilePage />}/>
            </Routes>
          </div>
        </Router>
      </MuiThemeProvider>
    </ChakraProvider>
  );
}

export default App;