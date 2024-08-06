import { Box, Paper, ThemeProvider, Typography, createTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a1a',
    },
    background: {
      default: '#ffffff',
      paper: '#fafafa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f5f5f5',
            color: '#1a1a1a',
            fontWeight: 600,
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
          '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
            display: 'none',
          },
        },
      },
    },
  },
});

const columns = [
  { field: 'userId', headerName: 'ID', width: 170 },
  { field: 'userEmail', headerName: 'E-mail', width: 170 },
  { field: 'phoneNumber', headerName: 'Phone Number', width: 170 },
  { field: 'birth', headerName: 'Birth', width: 170 },
  { field: 'role', headerName: 'Role', width: 170 },
  { field: 'createdAt', headerName: 'createdAt', width: 170 },
];

export default function UserManagement() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
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
      setRows(rowsWithId);
    } catch (error) {
      console.error('Loading UserInfo failed:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: 'calc(100vh - 100px)', width: '100%', p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          User Management
        </Typography>
        <Paper elevation={2} sx={{ height: 'calc(100% - 60px)', overflow: 'hidden' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-row': {
                '&:nth-of-type(odd)': {
                  backgroundColor: '#fafafa',
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: '2px solid #e0e0e0',
              },
            }}
          />
        </Paper>
      </Box>
    </ThemeProvider>
  );
}