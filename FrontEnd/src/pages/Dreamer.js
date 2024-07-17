import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/main/Header';
import balloonImage from '../image/dream.jpg';

import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';


const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'Noto Sans KR', sans-serif",
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'block',
  margin: '0 auto',
}));

const Dreamer = () => {
  const navigate = useNavigate(); 

  const handleButtonClick = () => {
    navigate('/dreamer/write'); 
  };
  return (

    <>
      <Header />
      <Container maxWidth="lg">
        <Grid container spacing={10} sx={{ mt: 0 }}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={balloonImage}
              alt="Dream"
              sx={{
                width: '500px',
                height: '650px',
                borderRadius: 2,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'left', pl: { md: 4 } }}>
              <StyledTypography variant="h4" component="h1" gutterBottom>
                여러분의 꿈은 모두 가치가 있습니다
              </StyledTypography>
              <StyledTypography variant="body1">
                세상에는 무수히 많은 아이디어가 존재합니다. 누군가는 혁신적인 기술로 세상을 변화시키고자 하고, 누군가는 따뜻한 마음으로 이웃을 돕고자 합니다. 하지만 이 모든 아이디어가 빛을 발하기 위해서는 실현될 기회가 필요합니다.
              </StyledTypography>
              <StyledTypography variant="body1">
                여기, 여러분의 꿈을 실현시킬 플랫폼, <strong>InvestBridge</strong>가 있습니다. <strong>Dreamer</strong>는 독창적이고 창의적인 아이디어를 가진 분들을 뜻합니다. 당신의 머릿속에 떠오른 멋진 아이디어가 해커톤이나 아이디어 공모전에서 수상하지 못했다고 해서 그 가치를 잃은 것은 아닙니다.
              </StyledTypography>
              <StyledTypography variant="body1">
                <strong>InvestBridge</strong>는 여러분의 꿈을 이루기 위해 만들어진 플랫폼입니다. 우리의 목표는 드리머와 서포터를 연결하여 아이디어가 현실이 되도록 돕는 것입니다. 여러분의 아이디어는 이곳에서 새로운 가능성을 만나고, 투자와 지원을 통해 실현될 수 있습니다.
              </StyledTypography>
              <StyledTypography variant="body1">
                여러분의 열정과 창의력은 <strong>InvestBridge</strong>를 통해 빛을 발할 것입니다. 우리는 여러분의 아이디어가 세상을 변화시킬 잠재력을 믿습니다. 여러분의 꿈은 결코 작은 것이 아닙니다. 어떤 꿈이든, 그 가치는 무한합니다.
              </StyledTypography>
              <StyledTypography variant="body1">
                지금 바로 <strong>InvestBridge</strong>에 가입하여 여러분의 아이디어를 소개하고, 그 아이디어가 현실로 이루어지는 과정을 경험해보세요. 우리는 여러분의 꿈이 빛날 수 있도록 항상 함께할 것입니다.
              </StyledTypography>
              <Box sx={{mt: 5}}>
                <StyledButton variant="contained" color="primary" size="large" onClick={handleButtonClick} >
                  아이디어 실현하기
                </StyledButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dreamer;