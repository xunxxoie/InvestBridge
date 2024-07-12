import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper, Container, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Person, Groups } from '@mui/icons-material';

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Noto Sans KR", sans-serif',
  },
  palette: {
    primary: {
      main: '#0047AB',
    },
    secondary: {
      main: '#FF6F00',
    },
  },
});

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '220px',
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  fontSize: '1.8rem',
  fontWeight: '600',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: theme.shadows[10],
  },
}));

const IconWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Join = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mt: 6, mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ color: 'primary.main', mb: 2 }}
          >
            InvestBridge
          </Typography>
          <Typography variant="h5" sx={{ color: 'text.secondary', mb: 6 }}>
            아이디어를 현실로, 꿈을 투자로
          </Typography>
          <Paper elevation={6} sx={{ p: 6, borderRadius: 8, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h3" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
              회원가입
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
              당신의 역할을 선택해주세요
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={6}>
                <StyledButton
                  component={Link}
                  to="/join/dreamer"
                  variant="contained"
                  sx={{
                    backgroundColor: 'secondary.main',
                    '&:hover': { backgroundColor: 'secondary.dark' },
                  }}
                >
                  <IconWrapper>
                    <Person sx={{ fontSize: 80, color: '#fff' }} />
                  </IconWrapper>
                  Dreamer
                </StyledButton>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledButton
                  component={Link}
                  to="/join/supporter"
                  variant="contained"
                  sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.dark' },
                  }}
                >
                  <IconWrapper>
                    <Groups sx={{ fontSize: 80, color: '#fff' }} />
                  </IconWrapper>
                  Supporter
                </StyledButton>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Join;