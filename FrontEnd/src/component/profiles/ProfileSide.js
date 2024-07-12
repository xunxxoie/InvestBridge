import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

function ProfileSide({ setSelectedMenu }) {
  const menuItems = ['Home', 'Idea', 'Support'];

  return (
    <List>
      {menuItems.map((item) => (
        <ListItem button key={item} onClick={() => setSelectedMenu(item)}>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );
}

export default ProfileSide;

