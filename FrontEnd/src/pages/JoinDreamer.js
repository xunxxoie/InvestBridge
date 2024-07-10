import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Person, 
  Lock, 
  Email, 
  Badge, 
  Phone, 
  CalendarToday, 
  Work, 
  PieChart
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
  marginBottom: '16px',
});

const StyledFormControl = styled(FormControl)({
  marginBottom: '16px',
  minWidth: 120,
  width: '100%',
});

const JoinDreamer = () => {
  const [job, setJob] = useState('');
  const [interest, setInterest] = useState('');

  const handleJobChange = (event) => {
    setJob(event.target.value);
  };

  const handleInterestChange = (event) => {
    setInterest(event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" sx={{ color: '#1976d2', mb: 2, fontWeight:"bold" }}>
        InvestBridge
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, clear: 'both', mt:4 }}>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemIcon><Person /></ListItemIcon>
            <StyledTextField fullWidth label="아이디" variant="standard" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon><Lock /></ListItemIcon>
            <StyledTextField fullWidth label="비밀번호" type="password" variant="standard" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon><Email /></ListItemIcon>
            <StyledTextField fullWidth label="이메일" variant="standard" />
          </ListItem>
        </List>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemIcon><Badge /></ListItemIcon>
            <StyledTextField fullWidth label="성명" variant="standard" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon><Phone /></ListItemIcon>
            <StyledTextField fullWidth label="전화번호" variant="standard" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon><CalendarToday /></ListItemIcon>
            <StyledTextField fullWidth label="생년월일" variant="standard" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon><Work /></ListItemIcon>
            <StyledFormControl variant="standard">
              <InputLabel>직업</InputLabel>
              <Select
                value={job}
                onChange={handleJobChange}
                label="직업"
              >
                <MenuItem value="employee">직장인</MenuItem>
                <MenuItem value="student">학생</MenuItem>
                <MenuItem value="unemployed">무직</MenuItem>
                <MenuItem value="entrepreneur">사업가</MenuItem>
              </Select>
            </StyledFormControl>
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon><PieChart /></ListItemIcon>
            <StyledFormControl variant="standard">
              <InputLabel>관심분야</InputLabel>
              <Select
                value={interest}
                onChange={handleInterestChange}
                label="관심분야"
              >
                <MenuItem value="bigData">빅데이터</MenuItem>
                <MenuItem value="ai">인공지능</MenuItem>
                <MenuItem value="game">게임</MenuItem>
                <MenuItem value="healthcare">의료-보건</MenuItem>
                <MenuItem value="energyChemistry">에너지-화학</MenuItem>
                <MenuItem value="finance">금융</MenuItem>
              </Select>
            </StyledFormControl>
          </ListItem>
        </List>
      </Paper>
      
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        sx={{ mt: 2 }}
      >
        회원가입
      </Button>
    </Box>
  );
};

export default JoinDreamer;