import {
  Badge,
  CalendarToday,
  Email,
  Lock,
  Person,
  Phone,
  PieChart,
  Work
} from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StyledTextField = styled(TextField)({
  marginBottom: '16px',
});

const StyledFormControl = styled(FormControl)({
  marginBottom: '16px',
  minWidth: 120,
  width: '100%',
});

const JoinSupporter = () => {
  const [formData, setFormData] = useState({
    userId: '',
    userPw: '',
    userEmail: '',
    userName: '',
    birth: '',
    phoneNumber: '',
    job: '',
    interest: '',
    userRole: 'SUPPORTER',
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Sending Join request to :', `${process.env.REACT_APP_API_URL}/api/auth/joins`);
    try{
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/join`,{
        method: 'POST',
        headers : {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData, birth: new Date(formData.birth).toISOString()})
      })

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Join failed');
      }
      
      const data = await response.json();
      console.log('Join successful', data);
      navigate('/join/succeeded');
    }catch(error){
      console.log('Join failed', error.message);
    }
  };

  return (
    <Box 
      sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}
      component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" component="h1" sx={{ color: '#1976d2', mb: 2, fontWeight: "bold" }}>
        InvestBridge
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, clear: 'both', mt: 4 }}>
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemIcon><Person /></ListItemIcon>
              <StyledTextField 
                fullWidth 
                label="아이디" 
                variant="standard" 
                name="userId"
                value={formData.userId}
                onChange={handleChange}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon><Lock /></ListItemIcon>
              <StyledTextField 
                fullWidth 
                label="비밀번호" 
                type="password" 
                variant="standard"
                name="userPw"
                value={formData.userPw}
                onChange={handleChange}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon><Email /></ListItemIcon>
              <StyledTextField 
                fullWidth 
                label="이메일" 
                variant="standard"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
              />
            </ListItem>
          </List>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemIcon><Badge /></ListItemIcon>
              <StyledTextField 
                fullWidth 
                label="성명" 
                variant="standard"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon><Phone /></ListItemIcon>
              <StyledTextField 
                fullWidth 
                label="전화번호" 
                variant="standard"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon><CalendarToday /></ListItemIcon>
              <StyledTextField 
                fullWidth 
                label="생년월일" 
                variant="standard"
                name="birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.birth}
                onChange={handleChange}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon><Work /></ListItemIcon>
              <StyledFormControl variant="standard">
                <InputLabel>직업</InputLabel>
                <Select
                  value={formData.job}
                  onChange={handleChange}
                  label="직업"
                  name="job"
                >
                  <MenuItem value="Student">학생</MenuItem>
                  <MenuItem value="Employee">직장인</MenuItem>
                  <MenuItem value="Unemployed">무직</MenuItem>
                  <MenuItem value="Military_Personnel">군인</MenuItem>
                  <MenuItem value="Businessperson">사업가</MenuItem>
                  <MenuItem value="Civil_Servant">공무원</MenuItem>
                </Select>
              </StyledFormControl>
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon><PieChart /></ListItemIcon>
              <StyledFormControl variant="standard">
                <InputLabel>관심분야</InputLabel>
                <Select
                  value={formData.interest}
                  onChange={handleChange}
                  label="관심분야"
                  name="interest"
                >
                  <MenuItem value="Computer_Engineering">컴퓨터공학</MenuItem>
                  <MenuItem value="Bio">생명공학</MenuItem>
                  <MenuItem value="Medical">의료</MenuItem>
                  <MenuItem value="Chemical">화학</MenuItem>
                  <MenuItem value="AI">인공지능</MenuItem>
                  <MenuItem value="Data_Science">데이터처리</MenuItem>
                  <MenuItem value="Finance">금융</MenuItem>
                  <MenuItem value="Business">사업</MenuItem>
                  <MenuItem value="NONE">없음</MenuItem>
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
        type="submit"
      >
        회원가입
      </Button>
    </Box>
  );
};

export default JoinSupporter;