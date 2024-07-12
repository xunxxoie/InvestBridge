import React from 'react';
import { Grid, Paper, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AiIcon from '@mui/icons-material/Memory';
import DescriptionIcon from '@mui/icons-material/Description';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export default function CategorySection() {
  const navigate = useNavigate(); // useNavigate is a hook that handle change page

  const categories = [
    { icon: <AiIcon sx={{ fontSize: 50 }} />, label: '#인공지능', value: 'ai' },
    { icon: <DescriptionIcon sx={{ fontSize: 50 }} />, label: '#빅데이터', value: 'bigdata' },
    { icon: <SportsEsportsIcon sx={{ fontSize: 50 }} />, label: '#게임', value: 'game' },
    { icon: <MedicalServicesIcon sx={{ fontSize: 50 }} />, label: '#의료 #보건', value: 'health' },
    { icon: <MonetizationOnIcon sx={{ fontSize: 50 }} />, label: '#금융 #경제', value: 'finance' },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/idea?category=${category}`);
  };

  return (
    <Grid
      container
      spacing={4}
      justifyContent="center"
      sx={{ mt: 0, mb:4 }}
    >
      {categories.map((category, index) => (
        <Grid
          item
          display="flex"
          justifyContent="center"
        >
          <Link 
            onClick={() => handleCategoryClick(category.value)} 
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            <Paper
              elevation={3}
              sx={{
                mr: 2, ml: 2,
                p: 2,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 150,
                height: 100,
                justifyContent: 'center'
              }}
            >
              {category.icon}
              <Typography>{category.label}</Typography>
            </Paper>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}