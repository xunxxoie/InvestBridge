import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../../image/p1.jpg';

const IdeaCard = ({ project }) => {
  const{id, userName, title, categories, likes, favorites} = project;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/idea/detail?id=${id}`);
  };

  return (
    <Box 
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        border: '1px solid #ccc',
        borderRadius: '10px',
        overflow: 'hidden',
        width: '300px',
        mb: 2,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        backgroundColor: '#fff',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
        }
      }}
    >
      <img 
        src={image} 
        alt={userName} 
        style={{ 
          width: '100%', 
          height: '150px', 
          objectFit: 'cover'
        }} 
      />
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2' }}>{userName}</Typography>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>{title}</Typography>
        <Box sx={{ mb: 2 }}>
          {categories.map((tag, index) => (
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