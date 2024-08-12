import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box, Button, createTheme, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, Paper,
  Snackbar,
  Tab, Tabs, ThemeProvider, Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
    error: {
      main: '#ff0000',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f8f8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          '&.Mui-selected': {
            color: '#000000',
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f0f0f0',
            color: '#000000',
            fontWeight: 700,
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #e0e0e0',
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '& .MuiDataGrid-menuIcon': {
            display: 'none',
          },
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            justifyContent: 'center',
          },
        },
      },
    },
  },
});

const columns = [
  { field: 'userId', headerName: 'ID', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
  { field: 'userEmail', headerName: 'E-mail', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center' },
  { field: 'phoneNumber', headerName: 'Phone Number', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
  { field: 'birth', headerName: 'Birth', flex: 1, minWidth: 120, headerAlign: 'center', align: 'center' },
  { field: 'role', headerName: 'Role', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
  { field: 'createdAt', headerName: 'Created At', flex: 1.5, minWidth: 180, headerAlign: 'center', align: 'center' },
  { field: 'blocked', headerName: 'Blocked', flex: 1, minWidth: 120, headerAlign: 'center', align: 'center'}
];

export default function UserManagement() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [rows, setRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userIdeas, setUserIdeas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchUsers('Dreamer');
  }, []);

  const fetchUsers = async (role) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/${role}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok)
        throw new Error('Internal Server Error');

      const data = await response.json();
      const rowsWithId = data.map(user => ({
        ...user,
        id: user.userId 
      }));
      console.log(rowsWithId);
      setRows(rowsWithId);
    } catch (error) {
      console.error('Loading UserInfo failed:', error);
    }
  };

  const handleRowClick = (params) => {
    setSelectedUser(params.row);
    fetchUserIdeas(params.row.userId);
  };

  const fetchUserIdeas = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users/${userId}/idea-summary`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch user ideas');

      const ideasData = await response.json();
      setUserIdeas(ideasData);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching user ideas:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const roles = ['Dreamer', 'Supporter', 'Admin'];
    fetchUsers(roles[newValue]);
  };

  const handleBlockUnblock = async () => {
    try {
      const newBlockedStatus = !selectedUser.blocked;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/block/${selectedUser.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBlockedStatus),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to block/unblock user');

      const updatedUser = { ...selectedUser, blocked: newBlockedStatus };
      console.log(updatedUser);
      setSelectedUser(updatedUser);
      setRows(rows.map(row => row.userId === selectedUser.userId ? updatedUser : row));
      
      setSnackbar({
        open: true,
        message: `User successfully ${newBlockedStatus ? 'blocked' : 'unblocked'}!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      setSnackbar({
        open: true,
        message: 'Failed to block/unblock user. Please try again.',
        severity: 'error'
      });
    }
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: 'calc(100vh - 40px)', width: '100%', p: 3, backgroundColor: theme.palette.background.default }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: '#000000' }}>
          User Management
        </Typography>
        <Paper elevation={0} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            sx={{ 
              borderBottom: '1px solid #e0e0e0',
              '& .MuiTabs-indicator': {
                backgroundColor: '#000000',
                height: 3,
              },
            }}
          >
            <Tab label="Dreamer" />
            <Tab label="Supporter" />
            <Tab label="Admin" />
          </Tabs>
        </Paper>
        <Paper elevation={0} sx={{ height: 'calc(100% - 140px)', borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            onRowClick={handleRowClick}
            sx={{
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: alpha('#000000', 0.04),
                  transition: 'background-color 0.2s ease',
                },
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: '2px solid #000000',
              },
            }}
          />
        </Paper>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 16,
            padding: 0,
            overflow: 'hidden',
          },
        }}
      >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          mb: 2,
          backgroundColor: '#f8f8f8',
          color: '#000000',
          fontWeight: 700,
          fontSize: '1.5rem',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        User Details
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: '#000000',
            '&:hover': {
              backgroundColor: alpha('#000000', 0.04),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 4 }}>
          {selectedUser && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 3, color: '#000000', fontWeight: 700 }}>User Information</Typography>
                <Box sx={{ backgroundColor: '#ffffff', borderRadius: 2, border: '1px solid #e0e0e0', p: 3 }}>
                  {[
                    { label: 'ID', value: selectedUser.userId },
                    { label: 'Email', value: selectedUser.userEmail },
                    { label: 'Phone', value: selectedUser.phoneNumber },
                    { label: 'Birth', value: selectedUser.birth },
                    { label: 'Role', value: selectedUser.role },
                    { label: 'Created At', value: selectedUser.createdAt },
                    { label: 'Status', value: selectedUser.blocked ? 'Blocked' : 'Active' },
                  ].map((item, index) => (
                    <Box key={index} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                      <Typography variant="body2" sx={{ color: '#666666', mb: 0.5, fontWeight: 600 }}>{item.label}</Typography>
                      <Typography variant="body1" sx={{ color: '#000000' }}>{item.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 3, color: '#000000', fontWeight: 700 }}>User Ideas</Typography>
              {userIdeas.length > 0 ? (
                <Box sx={{ maxHeight: 400, overflow: 'auto', pr: 2 }}>
                  {userIdeas.map((idea) => (
                    <Box 
                      key={idea.id} 
                      sx={{ 
                        mb: 3, 
                        p: 3, 
                        backgroundColor: '#ffffff', 
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000000', mb: 1 }}>{idea.title}</Typography>
                      <Typography variant="body2" sx={{ color: '#333333' }}>{idea.description}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ p: 3, backgroundColor: '#f8f8f8', borderRadius: 2, textAlign: 'center', border: '1px solid #e0e0e0' }}>
                  <Typography sx={{ color: '#666666' }}>No ideas found for this user.</Typography>
                </Box>
              )}
            </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={handleBlockUnblock}
            variant="contained" 
            color={selectedUser && selectedUser.blocked ? "primary" : "error"}
            sx={{ 
              px: 4, 
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              mr: 2
            }}
          >
            {selectedUser && selectedUser.blocked ? 'Unblock' : 'Block'}
          </Button>
          <Button 
            onClick={handleCloseDialog} 
            variant="contained" 
            sx={{ 
              backgroundColor: '#000000', 
              color: '#ffffff', 
              px: 4, 
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { 
                backgroundColor: '#333333' 
            } 
          }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}