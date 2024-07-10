import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Divider, Paper, Chip, Grid, Button, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const IdeaDetail = ({ projects }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = parseInt(queryParams.get('id'));

  const [idea, setIdea] = useState(projects.find(project => project.id === id));

  if (!idea) return <Typography>Project not found</Typography>;

  const handleLike = () => {
    setIdea(prevIdea => ({ ...prevIdea, likes: prevIdea.likes + 1 }));
  };

  const handleFavorite = () => {
    setIdea(prevIdea => ({ ...prevIdea, favorites: prevIdea.favorites + 1 }));
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${idea.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 4.3,
          color: 'white',
          textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
        }}>
          <Typography variant="h3" sx={{ mb: 1, fontWeight: 'bold' }}>{idea.name}</Typography>
          <Typography variant="h6">{idea.subTitle}</Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Grid item>
              <Chip
                icon={<GroupIcon />}
                label={`Team ${idea.team}`}
                color="primary"
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handleLike} color="secondary">
                  <FavoriteIcon />
                </IconButton>
                <Typography sx={{ mr: 2 }}>{idea.likes}</Typography>
                <IconButton onClick={handleFavorite} color="warning">
                  <StarIcon />
                </IconButton>
                <Typography>{idea.favorites}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>{idea.detail}</Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {idea.hashtags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Typography variant="h8" sx={{ fontWeight: 'bold', color: 'text.secondary', mr: 2, mt:2 }}>
          이 아이디어가 맘에 든다면?
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          startIcon={<RocketLaunchIcon />}
          sx={{
            backgroundColor: '#6200EA',
            color: 'white',
            borderRadius: '28px',
            padding: '10px 24px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 20px 0 rgba(98, 0, 234, 0.14), 0 7px 10px -5px rgba(98, 0, 234, 0.4)',
            '&:hover': {
              backgroundColor: '#3700B3',
              boxShadow: '0 8px 25px 0 rgba(98, 0, 234, 0.3), 0 10px 15px -5px rgba(98, 0, 234, 0.5)',
            },
            transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
          }}
        >
          아이디어 실현하기!
        </Button>
      </Box>
    </Box>
  );
};

export default IdeaDetail;