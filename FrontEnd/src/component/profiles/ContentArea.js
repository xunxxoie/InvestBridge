import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Container, Chip } from '@mui/material';
import IdeaCard from './IdeaCard';

function ContentArea({ selectedMenu }) {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const ideas = [
    { id: 1, team: 'Team #1', name: 'AI-Powered Healthcare', likes: 135, views: 17320, category: '인공지능' },
    { id: 2, team: 'Team #2', name: 'Big Data Analytics Platform', likes: 155, views: 17320, category: '빅데이터' },
    { id: 3, team: 'Team #3', name: 'Blockchain for Legal Contracts', likes: 135, views: 17320, category: '법률' },
  ];

  const categories = ['전체', '인공지능', '빅데이터', '게임', '법률'];

  const filteredIdeas = selectedCategory === '전체'
    ? ideas
    : ideas.filter(idea => idea.category === selectedCategory);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'Home':
        return (
            <Box>
              <Typography variant="h6">프로필 정보</Typography>
              <TextField fullWidth label="이름" value="한준서" margin="normal" />
              <TextField fullWidth label="연락처" value="010-7753-3204" margin="normal" />
              <TextField fullWidth label="이메일" value="ah0520@naver.com" margin="normal" />
              <TextField fullWidth label="생년월일" value="2001.05.20" margin="normal" />
              <TextField fullWidth label="직업" value="인천대학교 재학생" margin="normal" />
              <Button variant="contained" sx={{ mt: 2 }}>수정하기</Button>
            </Box>
          );
      case 'Idea':
        return (
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>My Ideas</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  clickable
                  color="primary"
                  variant={category === selectedCategory ? 'filled' : 'outlined'}
                  sx={{ mx: 0.5 }}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </Box>
            <Grid container spacing={3}>
              {filteredIdeas.map((idea) => (
                <Grid item xs={12} sm={6} md={4} key={idea.id}>
                  <IdeaCard {...idea} />
                </Grid>
              ))}
            </Grid>
          </Container>
        );
        
      case 'Support':
        return (
            <Container maxWidth="lg">
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>My Supporters</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    clickable
                    color="primary"
                    variant={category === selectedCategory ? 'filled' : 'outlined'}
                    sx={{ mx: 0.5 }}
                    onClick={() => handleCategoryClick(category)}
                  />
                ))}
              </Box>
              <Grid container spacing={3}>
                {filteredIdeas.map((idea) => (
                  <Grid item xs={12} sm={6} md={4} key={idea.id}>
                    <IdeaCard {...idea} />
                  </Grid>
                ))}
              </Grid>
            </Container>
          );
          
      default:
        return <Typography>선택된 메뉴가 없습니다.</Typography>;
    }
  };

  return (
    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {renderContent()}
    </Box>
  );
}

export default ContentArea;