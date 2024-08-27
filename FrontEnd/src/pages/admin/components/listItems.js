import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import NoteIcon from '@mui/icons-material/Note';
import PeopleIcon from '@mui/icons-material/People';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

export const mainListItems = (setCurrentPage) => (
  <React.Fragment>
    {[
      { icon: <DashboardIcon />, text: 'Dashboard', page: 'dashboard' },
      { icon: <PeopleIcon />, text: 'User Management', page: 'users' },
      { icon: <LightbulbIcon />, text: 'Idea Management', page: 'ideas' },
      { icon: <CompareArrowsIcon />, text: 'Matching', page: 'matching' },
      { icon: <NoteIcon />, text: 'Patch Notes', page: 'patchnotes' },
    ].map((item, index) => (
      <ListItemButton
        key={index}
        onClick={() => setCurrentPage(item.page)}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <ListItemIcon sx={{ color: 'inherit' }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItemButton>
    ))}
  </React.Fragment>
);