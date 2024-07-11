import React, { useState, useEffect } from 'react';
import { Box, FormGroup, FormControlLabel, Checkbox, Typography, Divider } from '@mui/material';

const categories = [
  { label: '전체보기', value: 'all' },
  { label: '인공지능', value: 'ai' },
  { label: '빅데이터', value: 'bigdata' },
  { label: '게임', value: 'game' },
  { label: '의료 · 보건', value: 'health' },
  { label: '에너지 · 화학', value: 'energy' },
  { label: '금융', value: 'finance' },
];

const Sidebar = ({ onCategoryChange, initialCategory }) => {
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : ['all']);

  useEffect(() => {
    onCategoryChange(selectedCategories);
  }, [selectedCategories, onCategoryChange]);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    let newSelectedCategories;

    if (value === 'all') {
      newSelectedCategories = checked ? ['all'] : [];
    } else {
      if (checked) {
        newSelectedCategories = [...selectedCategories.filter(cat => cat !== 'all'), value];
      } else {
        newSelectedCategories = selectedCategories.filter(cat => cat !== value);
        if (newSelectedCategories.length === 0) {
          newSelectedCategories = ['all'];
        }
      }
    }

    setSelectedCategories(newSelectedCategories);
  };

  return (
    <>
      <Box
        sx={{
          border: '1px solid #ddd',
          borderRadius: '10px',
          p: 3,
          mt: '30px',
          ml: '50px',
          height: '400px',
          width: '250px',
          flexShrink: 0,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          카테고리
        </Typography>
        <Divider sx={{ my: 2 }} />
        <FormGroup sx={{ alignItems: 'flex-start' }}>
          {categories.map((category) => (
            <FormControlLabel
              key={category.value}
              control={
                <Checkbox
                  checked={
                    category.value === 'all'
                      ? selectedCategories.includes('all')
                      : selectedCategories.includes(category.value)
                  }
                  onChange={handleCategoryChange}
                  value={category.value}
                  sx={{
                    color: '#333',
                    '&.Mui-checked': {
                      color: '#1976d2',
                    },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: '0.95rem', color: '#555' }}>{category.label}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>
    </>
  );
};

export default Sidebar;