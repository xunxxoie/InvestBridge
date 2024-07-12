import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function IdeaCard({ team, name, likes, views, category }) {
  return (
    <Card sx={{ 
      maxWidth: 345, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: '0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
      }
    }}>
      <Box sx={{ 
        height: 140, 
        backgroundColor: '#1976d2',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
        }
      }} />
      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
        <IconButton sx={{ position: 'absolute', top: 8, right: 8 }}>
          <MoreVertIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {team}
        </Typography>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {name}
        </Typography>
        <Chip label={category} size="small" sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FavoriteIcon color="error" sx={{ mr: 0.5, fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              {likes}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VisibilityIcon sx={{ mr: 0.5, fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              {views.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default IdeaCard;