import { Button, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import React from 'react';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';
import celebrationAnimation from '../../animations/celebration.json';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'linear-gradient(45deg, #1a1a1a 30%, #2c2c2c 90%)',
  color: 'white',
  borderRadius: 15,
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  background: 'white',
  color: '#1a1a1a',
  '&:hover': {
    background: '#f3f3f3',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  transition: 'all 0.3s ease-in-out',
}));

const JoinSucceed = () => {
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: celebrationAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledPaper elevation={6}>
          <Lottie options={defaultOptions} height={150} width={150} />
          <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            환영합니다!
          </Typography>
          <Typography variant="h6" align="center" paragraph sx={{ mb: 2 }}>
            InvestBridge 일동은 당신과 함께하게 되어 기쁩니다.
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 2 }}>
            여기서 당신의 아이디어를 펼치고 수많은 혁신적인 프로젝트들을 실현해보세요.
            우리는 당신의 성공을 위해 항상 함께 하겠습니다.
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ fontWeight: 'medium' }}>
            새로운 여정의 시작을 축하드립니다!
          </Typography>
          <StyledButton
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
          >
            로그인하러 가기
          </StyledButton>
        </StyledPaper>
      </motion.div>
    </Container>
  );
};

export default JoinSucceed;