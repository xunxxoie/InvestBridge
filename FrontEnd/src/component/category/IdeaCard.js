// components/IdeaCard.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';

const IdeaCard = ({ project }) => {
  const { team, name, hashtags, likes, favorites, image } = project;

  return (
    <Box sx={{
      border: '1px solid #ccc',
      borderRadius: '10px',
      overflow: 'hidden', // 카드가 overflow될 때 이미지가 잘리도록 함
      width: '300px',
      mb: 2,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      textAlign: 'center',
      backgroundColor: '#fff',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)', // hover 시 카드가 약간 떠오르는 효과
      }
    }}>
      <img 
        src={image} 
        alt={name} 
        style={{ 
          width: '100%', 
          height: '150px', 
          objectFit: 'cover' // 이미지 크기 조정
        }} 
      />
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2' }}>Team #{team}</Typography>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>{name}</Typography>
        <Box sx={{ mb: 2 }}>
          {hashtags.map((tag, index) => (
            <Typography variant="body2" key={index} sx={{ display: 'inline', mx: 0.5, color: '#555' }}>
              #{tag}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FavoriteIcon sx={{ mr: 0.5, color: 'red' }} /> {likes}
          <StarIcon sx={{ ml: 2, mr: 0.5, color: 'gold' }} /> {favorites}
        </Box>
      </Box>
    </Box>
  );
};

export default IdeaCard;