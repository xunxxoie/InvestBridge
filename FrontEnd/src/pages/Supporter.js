import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/main/Header';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import supporterImage from '../image/supporter.jpg'; 

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'Noto Sans KR', sans-serif",
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  display: 'block',
  margin: '0 auto',
}));

const Supporter = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용합니다

  // 버튼 클릭 핸들러 함수를 추가합니다
  const handleButtonClick = () => {
    navigate('/idea');
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Grid container spacing={10} sx={{ mt: 0 }}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={supporterImage}
              alt="Supporter"
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
                당신의 지원으로 꿈이 현실이 됩니다
              </StyledTypography>
              <StyledTypography variant="body1">
                세상에는 무한한 가능성을 가진 아이디어들이 존재합니다. 하지만 이러한 아이디어들이 현실이 되기 위해서는 적절한 지원과 후원이 필요합니다. 여기 <strong>InvestBridge</strong>에서 여러분은 그 변화의 주역이 될 수 있습니다.
              </StyledTypography>
              <StyledTypography variant="body1">
                <strong>Supporter</strong>는 창의적인 아이디어와 열정적인 드리머들을 후원하는 분들을 의미합니다. 여러분의 투자와 지원은 혁신적인 아이디어가 세상에 나오는 데 결정적인 역할을 합니다.
              </StyledTypography>
              <StyledTypography variant="body1">
                <strong>InvestBridge</strong>는 서포터와 드리머를 연결하는 플랫폼입니다. 우리의 목표는 여러분이 믿는 프로젝트에 투자하고, 그 성장 과정을 함께 경험할 수 있도록 하는 것입니다. 여러분의 지원을 통해 혁신적인 아이디어들이 현실이 되는 순간을 목격하게 될 것입니다.
              </StyledTypography>
              <StyledTypography variant="body1">
                서포터로서 여러분은 단순한 투자자가 아닙니다. 여러분은 꿈을 실현시키는 조력자이자, 새로운 가치를 창출하는 파트너입니다. 여러분의 지원은 드리머들에게 큰 힘이 되며, 그들의 성공은 곧 여러분의 성공이 됩니다.
              </StyledTypography>
              <StyledTypography variant="body1">
                지금 바로 <strong>InvestBridge</strong>에서 여러분의 관심사와 일치하는 프로젝트를 찾아보세요. 여러분의 지원으로 세상을 변화시킬 수 있는 아이디어들이 기다리고 있습니다. 함께 더 나은 미래를 만들어갈 준비가 되셨나요?
              </StyledTypography>
              <Box sx={{ mt: 5 }}>
                <StyledButton variant="contained" color="primary" size="large" onClick={handleButtonClick}>
                  프로젝트 후원하기
                </StyledButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Supporter;