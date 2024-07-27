import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Box,
  Button,
  Checkbox,
  Container,
  createTheme,
  CssBaseline,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#f0f0f0',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            '&:hover': {
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
    },
  },
});

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/xunxxoie" target="_blank" rel="noopener noreferrer">
        xunxxoie
      </Link>
      {' '}
      <Link color="inherit" href="https://github.com/ijnim1121" target="_blank" rel="noopener noreferrer">
        ijinim1121 
      </Link>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Login() {
  const [userEmail, setUserEmail] = useState('');
  const [userPw, setUserPw] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Sending login request to:', `${process.env.REACT_APP_API_URL}/api/auth/login`);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: userEmail, userPw: userPw }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful', data);
      navigate('/main');
    } catch (error) {
      console.error('Login failed', error.message);
      setError('잘못된 이메일 또는 비밀번호를 입력하셨습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #1a1a1a 0%, #4a4a4a 100%)',
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Paper
            elevation={24}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: `
                0 2.8px 2.2px rgba(0, 0, 0, 0.034),
                0 6.7px 5.3px rgba(0, 0, 0, 0.048),
                0 12.5px 10px rgba(0, 0, 0, 0.06),
                0 22.3px 17.9px rgba(0, 0, 0, 0.072),
                0 41.8px 33.4px rgba(0, 0, 0, 0.086),
                0 100px 80px rgba(0, 0, 0, 0.12)
              `,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              <LockOutlinedIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
            </Box>
            <Typography component="h1" variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
              InvestBridge
            </Typography>
            <Typography component="h2" variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Sign in to your account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="userEmail"
                label="Email Address"
                name="userEmail"
                autoComplete="email"
                autoFocus
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                error={!!error}
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="userPw"
                label="Password"
                type="password"
                id="userPw"
                autoComplete="current-password"
                value={userPw}
                onChange={(e) => setUserPw(e.target.value)}
                error={!!error}
                helperText={error}
                variant="outlined"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  bgcolor: 'primary.main',
                  color: 'secondary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
                disabled={isLoading}
              >
                Sign In
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Link href="#" variant="body2" color="primary.main">
                  Forgot password?
                </Link>
                <Link href="/join" variant="body2" color="primary.main">
                  Don't have an account? Sign Up
                </Link>
              </Box>
            </Box>
          </Paper>
          <Copyright sx={{ mt: 5, color: 'text.secondary' }} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}