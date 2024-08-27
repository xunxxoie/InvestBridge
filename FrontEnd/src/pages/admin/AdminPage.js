import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { mainListItems } from './components/listItems';

import Dashboard from './components/Dashboard';
import IdeaManagement from './components/IdeaManagement';
import MatchingManagement from './components/MatchingManagement';
import PatchNotes from './components/PatchNotes';
import UserManagement from './components/UserManagement';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f5f5f5',
          color: '#000000',
        },
      },
    },
  },
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: 'none',
  borderBottom: '1px solid #e0e0e0',
}));

const StyledDrawer = styled(Drawer)(() => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    borderRight: 'none',
  },
}));

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'users': return <UserManagement />;
      case 'ideas': return <IdeaManagement />;
      case 'matching': return <MatchingManagement />;
      case 'patchnotes': return <PatchNotes />;
      default: return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <StyledAppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
              Admin Dashboard
            </Typography>
          </Toolbar>
        </StyledAppBar>
        <StyledDrawer variant="permanent">
          <Toolbar />
          <Box sx={{ overflow: 'auto', mt: 2 }}>
            {mainListItems(setCurrentPage)}
          </Box>
        </StyledDrawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#ffffff' }}>
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  {renderPage()}
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}