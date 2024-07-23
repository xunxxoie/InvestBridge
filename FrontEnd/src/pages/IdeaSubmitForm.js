import { Close, CloudUpload, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/main/Header';
import githubIcon from '../image/githubc.png';
import notionIcon from '../image/Notion.webp';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const DropZone = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '120px',
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const LinkInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const StepTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  color: 'black',
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export default function DreamerIdea() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [gitLink, setGitLink] = useState('');
  const [notionLink, setNotionLink] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
  };

  const handleFileDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileInput = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : prev.length < 3
          ? [...prev, category]
          : prev
    );
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setSelectedCategories(prev => prev.filter(category => category !== categoryToRemove));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('gitLink', gitLink);
    formData.append('notionLink', notionLink);
    selectedCategories.forEach(category => formData.append('categories', category));
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ideas`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Internal Server Error');
      }
      const data = await response.json();
      console.log('Idea create successed:', data);
      navigate('/main');
    } catch (error) {
      console.error('Idea create failed:', error);
      navigate('/main');
    }
  };

  const categories = ['인공지능', '의료 · 보건', '빅데이터', '에너지 · 화학', '금융', '게임'];

  return (
    <>
      <Header />
      <Box component="form" onSubmit={handleSubmit} sx={{ padding: '20px', maxWidth: 1200, margin: '0 auto', pt:'50px' }}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <StepTitle variant="h6" gutterBottom>
                Step 1: <span className="underline">아이디어에 대한 간단한 명세 작성</span>
              </StepTitle>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="프로젝트 제목"
                sx={{ marginBottom: 2 }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextareaAutosize
                minRows={6}
                placeholder="아이디어 내용(간단하게 작성하여 주세요!)"
                style={{
                  width: '100%',
                  marginBottom: '16px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  resize: 'vertical',
                }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <DropZone
                onDrop={handleFileDrop}
                onDragOver={handleFileDragOver}
                onClick={() => fileInputRef.current.click()}
              >
                <CloudUpload color="primary" sx={{ fontSize: 40, marginBottom: 1 }} />
                <Typography variant="body2">파일을 드래그하거나 클릭하여 추가하세요</Typography>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                  multiple
                />
              </DropZone>
              {files.length > 0 && (
                <List>
                  {files.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(2)} KB`} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFile(index)}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <StepTitle variant="h6" gutterBottom>
                Step 2: <span className="underline">아이디어를 자세하게 나타낼 수 있는 자료 첨부</span>
              </StepTitle>
              <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 2 }}>
                <LinkInput>
                  <img src={githubIcon} alt="GitHub" style={{ width: '50px', height: '50px' }} />
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="GitHub 링크 첨부"
                    size="small"
                    sx={{mt:'10px'}}
                    value={gitLink}
                    onChange={(e) => setGitLink(e.target.value)}
                  />
                </LinkInput>
                <LinkInput>
                  <img src={notionIcon} alt="Notion" style={{ width: '50px', height: '50px' }} />
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Notion 링크 첨부"
                    size="small"
                    sx={{mt:'10px'}}
                    value={notionLink}
                    onChange={(e) => setNotionLink(e.target.value)}
                  />
                </LinkInput>
              </Box>
            </StyledPaper>
            
            <StyledPaper sx={{ mt: 2 }}>
              <StepTitle variant="h6" gutterBottom>
                Step 3:  <span className="underline">카테고리 선택 (최대 3개)</span>
              </StepTitle>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginBottom: 2 }}>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => handleCategoryToggle(category)}
                    color={selectedCategories.includes(category) ? "primary" : "default"}
                    variant={selectedCategories.includes(category) ? "filled" : "outlined"}
                    sx={{ borderRadius: '16px' }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2 }}>
                {selectedCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onDelete={() => handleRemoveCategory(category)}
                    color="primary"
                    deleteIcon={<Close />}
                    size='small'
                    sx={{ borderRadius: '16px' }}
                  />
                ))}
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 3 }}>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label={
              <Typography>
                위 아이디어를 제 3자 <strong>'InvestBridge : 아이디어 공유 플랫폼'</strong> 에 제공함을 동의합니다.
              </Typography>
              }
          />
          <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
           ⭐️ 아이디어 등록하기 ⭐️
          </Button>
        </Box>
      </Box>
    </>
  );
}