import {
  Block as BlockIcon,
  CalendarToday as CalendarTodayIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Link as LinkIcon,
  Person as PersonIcon,
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  Title as TitleIcon
} from '@mui/icons-material';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, Paper, Snackbar, ThemeProvider, Typography,
  createTheme, useMediaQuery
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { alpha } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#000000' },
    secondary: { main: '#ffffff' },
    background: { default: '#ffffff', paper: '#f8f8f8' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
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
            fontWeight: 700
          },
          '& .MuiDataGrid-cell': { borderBottom: '1px solid #e0e0e0' },
          '& .MuiDataGrid-columnSeparator': { display: 'none' },
          '& .MuiDataGrid-menuIcon': { display: 'none' },
          '& .MuiDataGrid-columnHeaderTitleContainer': { justifyContent: 'center' },
        },
      },
    },
  },
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const columns = [
  // { field: 'id', headerName: 'ID', width: 150, headerAlign: 'center', align: 'center' },
  { field: 'title', headerName: 'Title', width: 150, headerAlign: 'center', align: 'center' },
  { field: 'content', headerName: 'Content', width: 150, headerAlign: 'center', align: 'center' },
  { field: 'userName', headerName: 'User Name', width: 150, headerAlign: 'center', align: 'center' },
  { field: 'likes', headerName: 'Likes', width: 100, headerAlign: 'center', align: 'center', type: 'number' },
  { field: 'favorites', headerName: 'Favorites', width: 100, headerAlign: 'center', align: 'center', type: 'number' },
  { field: 'createdAt', headerName: 'Created At', width: 150, headerAlign: 'center', align: 'center'},
  { field: 'contracted', headerName: 'Contracted', width: 135, headerAlign: 'center',align: 'center',type: 'boolean'},
  { field: 'blocked', headerName: 'Blocked', width: 135, headerAlign: 'center',align: 'center',type: 'boolean'}
];

export default function IdeaManagement() {
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });
  const [rows, setRows] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => { fetchIdeas(); }, []);

  const fetchIdeas = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/ideas`, { method: 'GET', credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch ideas');
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error('Fetching ideas failed:', error);
      setSnackbar({ open: true, message: 'Failed to load ideas. Please try again.', severity: 'error' });
    }
  };

  const handleRowClick = (params) => {
    setSelectedIdea(params.row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleDeleteIdea = async () => {
    if (!selectedIdea) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/ideas/${selectedIdea.id}`, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) throw new Error('Failed to delete idea');
      setRows(rows.filter(row => row.id !== selectedIdea.id));
      setOpenDialog(false);
      setSnackbar({ open: true, message: 'Idea successfully deleted!', severity: 'success' });
    } catch (error) {
      console.error('Delete idea failed:', error);
      setSnackbar({ open: true, message: 'Failed to delete idea. Please try again.', severity: 'error' });
    }
  };

  const handleBlockUnblock = async () => {
    if (!selectedIdea) return;
    try {
      const newBlockedStatus = !selectedIdea.blocked;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/ideas/block/${selectedIdea.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlockedStatus),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to block/unblock idea');
      const updatedIdea = { ...selectedIdea, blocked: newBlockedStatus };
      setSelectedIdea(updatedIdea);
      setRows(rows.map(row => row.id === selectedIdea.id ? updatedIdea : row));
      setSnackbar({ open: true, message: `Idea successfully ${newBlockedStatus ? 'blocked' : 'unblocked'}!`, severity: 'success' });
    } catch (error) {
      console.error('Error blocking/unblocking idea:', error);
      setSnackbar({ open: true, message: 'Failed to block/unblock idea. Please try again.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: '100vh', width: '100%', p: 3, backgroundColor: theme.palette.background.default }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: theme.palette.primary.main }}>
          Idea Management
        </Typography>
        <Paper elevation={3} sx={{ height: 'calc(100% - 100px)', borderRadius: 2, overflow: 'hidden' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            onRowClick={handleRowClick}
            getRowId={(row) => row.id}
            sx={{
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
                '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04), transition: 'background-color 0.2s ease' },
              },
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
              '& .MuiDataGrid-columnHeaders': { borderBottom: `2px solid ${theme.palette.primary.main}` },
            }}
          />
        </Paper>
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth 
        fullScreen={isMobile}
        PaperProps={{ style: { borderRadius: isMobile ? 0 : 16, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ m: 0, p: 3, backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontWeight: 700, fontSize: '1.5rem' }}>
          Idea Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: theme.palette.primary.contrastText,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          {selectedIdea && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
                      <TitleIcon sx={{ mr: 1 }} /> Title
                    </Typography>
                    <Typography variant="body1">{selectedIdea.title || 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
                      <DescriptionIcon sx={{ mr: 1 }} /> Content
                    </Typography>
                    <Typography variant="body1">{selectedIdea.content || 'N/A'}</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>Idea Information</Typography>
                  <Grid container spacing={2}>
                    {[
                      { icon: <PersonIcon />, label: 'User Name', value: selectedIdea.userName },
                      { icon: <BlockIcon />, label: 'Contracted', value: selectedIdea.contracted ? 'Yes' : 'No' },
                      { icon: <ThumbUpIcon />, label: 'Likes', value: selectedIdea.likes },
                      { icon: <StarIcon />, label: 'Favorites', value: selectedIdea.favorites },
                      { icon: <CalendarTodayIcon />, label: 'Created At', value: selectedIdea.createdAt ? new Date(selectedIdea.createdAt).toLocaleString() : 'N/A' },
                      { icon: <CalendarTodayIcon />, label: 'Updated At', value: selectedIdea.updatedAt ? new Date(selectedIdea.updatedAt).toLocaleString() : 'N/A' },
                      { icon: <LinkIcon />, label: 'Git Link', value: selectedIdea.gitLink },
                      { icon: <LinkIcon />, label: 'Notion Link', value: selectedIdea.notionLink },
                    ].map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {React.cloneElement(item.icon, { sx: { color: theme.palette.primary.main, mr: 1 } })}
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 'bold' }}>{item.label}</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ ml: 4 }}>{item.value ?? 'N/A'}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={handleDeleteIdea} variant="contained" color="error" startIcon={<DeleteIcon />} sx={{ mr: 2 }}>
            Delete
          </Button>
          <Button onClick={handleBlockUnblock} variant="contained" color="warning" startIcon={<BlockIcon />} sx={{ mr: 2 }}>
            {selectedIdea?.blocked ? 'Unblock' : 'Block'}
          </Button>
          <Button onClick={handleCloseDialog} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}