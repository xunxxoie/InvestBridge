import AttachmentIcon from '@mui/icons-material/Attachment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Dialog, DialogActions, Divider, IconButton, DialogContent as MuiDialogContent, DialogTitle as MuiDialogTitle, Paper, TextField, TextareaAutosize, ThemeProvider, Typography, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState } from 'react';
  
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#1a1a1a' },
      secondary: { main: '#000000' },
      background: { default: '#ffffff', paper: '#fafafa' }
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 600 }
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
              paddingLeft: '16px'
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e0e0e0',
              paddingLeft: '16px'
            },
            '& .MuiDataGrid-columnSeparator, & .MuiDataGrid-menuIcon': {
              display: 'none'
            },
            '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
              display: 'none'
            }
          },
          columnHeader: {
            '& .MuiDataGrid-columnHeader:nth-of-type(1)': {
              paddingLeft: '24px'
            }
          },
          cell: {
            '& .MuiDataGrid-cell:nth-of-type(1)': {
              paddingLeft: '24px'
            }
          }
        }
      }
    }
  });
  
  const EditButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: 500,
    padding: '6px 16px',
  }));
  
  const DeleteButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: 500,
    padding: '6px 16px',
  }));
  
  const DialogTitle = styled(MuiDialogTitle)(({ theme }) => ({
    color: '#1a1a1a',
  }));
  
  const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
    color: '#1a1a1a',
  }));
  
  export default function PatchNotes() {
    const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);
    const [patchNote, setPatchNote] = useState({ version: '', title: '', content: '', adminId: '', createdAt: '' });
    const [files, setFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const fileInputRef = useRef(null);
  
    useEffect(() => { fetchPatchNotes(); }, []);
  
    const fetchPatchNotes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/patchnote`, {
          method: 'GET',
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`Error fetching patch notes: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          const rowsWithId = data.map((item) => {
            let note = typeof item === 'string' ? JSON.parse(item) : item;
            let createdAtFormatted = new Date(note.createdAt).toLocaleString('en-US', { timeZone: 'UTC' });
            return {
              id: note.version,
              version: note.version || 'N/A',
              title: note.title || 'Untitled',
              adminId: note.adminId || 'Unknown',
              createdAt: createdAtFormatted
            };
          });
          setRows(rowsWithId);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Failed to fetch patch notes:', error.message);
      }
    };
  
    const handleFileDrop = (event) => {
      event.preventDefault();
      const droppedFiles = Array.from(event.dataTransfer.files);
      setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
    };
  
    const handleFileDragOver = (event) => { event.preventDefault(); };
  
    const handleFileInput = (event) => {
      const selectedFiles = Array.from(event.target.files);
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    };
  
    const handleRemoveFile = (indexToRemove) => {
      setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };
  
    const handleRemoveExistingFile = (indexToRemove) => {
      setExistingFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setPatchNote(prevState => ({ ...prevState, [name]: value }));
    };
  
    const handleCreate = async () => {
      try {
        if (!patchNote.version || !patchNote.title) {
          alert('Version and Title are required.');
          return;
        }
        const formData = new FormData();
        formData.append('version', patchNote.version);
        formData.append('title', patchNote.title);
        formData.append('content', patchNote.content);
        files.forEach(file => formData.append('files', file));
        formData.append('adminId', patchNote.adminId);
        formData.append('createdAt', new Date().toISOString());
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/patchnote`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error(`Error creating patch note: ${response.status} ${response.statusText}`);
        }
        fetchPatchNotes();
        handleClose();
      } catch (error) {
        console.error('Failed to create patch note:', error.message);
      }
    };
  
    const handleUpdate = async () => {
      try {
        if (!patchNote.version || !patchNote.title) {
          alert('Version and Title are required.');
          return;
        }
        const formData = new FormData();
        formData.append('version', patchNote.version);
        formData.append('title', patchNote.title);
        formData.append('content', patchNote.content);
        files.forEach(file => formData.append('files', file));
        formData.append('adminId', patchNote.adminId);
        formData.append('createdAt', new Date().toISOString());
        formData.append('existingFiles', JSON.stringify(existingFiles));
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/patchnote/${currentEditId}`, {
          method: 'PUT',
          body: formData,
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error(`Error updating patch note: ${response.status} ${response.statusText}`);
        }
        fetchPatchNotes();
        handleClose();
      } catch (error) {
        console.error('Failed to update patch note:', error.message);
      }
    };
  
    const handleSubmit = async () => {
      if (editMode) {
        await handleUpdate();
      } else {
        await handleCreate();
      }
    };
  
    const handleEdit = async (row) => {
      setEditMode(true);
      setCurrentEditId(row.version);
      setPatchNote({
        version: row.version,
        title: row.title,
        content: row.content || '',
        adminId: row.adminId,
        createdAt: row.createdAt
      });
  
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/patchnote/${row.version}`, {
          method: 'GET',
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`Error fetching patch note: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.files) {
          setExistingFiles(data.files);
        }
      } catch (error) {
        console.error('Failed to fetch patch note files:', error.message);
      }
  
      handleOpen();
    };
  
    const handleDelete = async (version) => {
      if (!window.confirm('Are you sure you want to delete this patch note?')) return;
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/patchnote/${version}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`Error deleting patch note: ${response.status} ${response.statusText}`);
        }
        fetchPatchNotes();
      } catch (error) {
        console.error('Failed to delete patch note:', error.message);
      }
    };
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setFiles([]);
      setPatchNote({ version: '', title: '', content: '', adminId: '', createdAt: '' });
    };
  
    const columns = [
        { field: 'version', headerName: 'Version', width: 150 },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'adminId', headerName: 'Admin ID', width: 150 },
        { field: 'createdAt', headerName: 'Created At', width: 200 },
        {
          field: 'actions',
          headerName: 'Actions',
          
          width: 200,
          top: 200,
          renderCell: (params) => (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              <EditButton size="small" startIcon={<EditIcon />} onClick={() => handleEdit(params.row)}>
                Edit
              </EditButton>
              <DeleteButton size="small" startIcon={<DeleteIcon />} onClick={() => handleDelete(params.row.version)}>
                Delete
              </DeleteButton>
            </Box>
          )
        }
      ];
      
  
    const downloadFile = (file) => {
      const link = document.createElement('a');
      link.href = `data:${file.fileType};base64,${file.fileData}`;
      link.download = file.fileName;
      link.click();
    };
  
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', p: 3 }}>
          <Paper sx={{ width: '100%', maxWidth: 1200, p: 3 }}>
            <Typography variant="h4" gutterBottom>Patch Notes</Typography>
            <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>Add Patch Note</Button>
            <DataGrid
              rows={rows}
              columns={columns}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 20]}
              autoHeight
            />
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
              <DialogTitle>{editMode ? 'Edit Patch Note' : 'Create Patch Note'}</DialogTitle>
              <DialogContent>
                <TextField autoFocus margin="dense" label="Version" type="text" fullWidth name="version" value={patchNote.version} onChange={handleChange} variant="outlined" />
                <TextField margin="dense" label="Title" type="text" fullWidth name="title" value={patchNote.title} onChange={handleChange} variant="outlined" />
                <TextareaAutosize
                  minRows={3}
                  placeholder="Content"
                  name="content"
                  value={patchNote.content}
                  onChange={handleChange}
                  style={{ width: '100%', marginTop: '16px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <Box sx={{ mt: 2 }}>
                  <input type="file" multiple onChange={handleFileInput} ref={fileInputRef} hidden />
                  <Button variant="contained" onClick={() => fileInputRef.current.click()} startIcon={<AttachmentIcon />}>Upload Files</Button>
                  <Box
                    onDrop={handleFileDrop}
                    onDragOver={handleFileDragOver}
                    sx={{ border: '2px dashed #ccc', borderRadius: 1, p: 2, mt: 2, textAlign: 'center', bgcolor: '#fafafa' }}
                  >
                    <Typography>Drag & drop files here</Typography>
                  </Box>
                  {files.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">Files:</Typography>
                      <Divider sx={{ mb: 2 }} />
                      {files.map((file, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography>{file.name}</Typography>
                          <IconButton color="secondary" onClick={() => handleRemoveFile(index)}><DeleteIcon /></IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {existingFiles.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">Existing Files:</Typography>
                      <Divider sx={{ mb: 2 }} />
                      {existingFiles.map((file, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography>{file.fileName}</Typography>
                          <Button variant="contained" color="secondary" onClick={() => downloadFile(file)} startIcon={<AttachmentIcon />}>Download</Button>
                          <IconButton color="secondary" onClick={() => handleRemoveExistingFile(index)}><DeleteIcon /></IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">{editMode ? 'Update' : 'Create'}</Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }
