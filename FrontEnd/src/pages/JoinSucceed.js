import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import React from 'react';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';
import celebrationAnimation from '../animations/celebration.json'; // Lottie 애니메이션 파일

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  color: 'white',
  borderRadius: 15,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  background: 'white',
  color: '#FE6B8B',
  '&:hover': {
    background: '#f3f3f3',
  },
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
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StyledPaper elevation={6}>
            <Lottie options={defaultOptions} height={200} width={200} />
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              환영합니다!
            </Typography>
            <Typography variant="h6" align="center" paragraph>
              InvestBridge 일동은 당신과 함께하게 되어 기쁩니다.
            </Typography>
            <Typography variant="body1" align="center" paragraph>
              여기서 당신의 아이디어를 펼치고 수많은 혁신적인 프로젝트들을 실현해보세요.
              우리는 당신의 성공을 위해 항상 함께 하겠습니다.
            </Typography>
            <Typography variant="body1" align="center" paragraph>
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
      </Box>
    </Container>
  );
};

export default JoinSucceed;