import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import mainImage from '../../image/main.webp';

export default function HeroSection() {
  return (
    <Box sx={{backgroundColor: 'none', py: 4, textAlign: 'center', pt : 0}}>
      <img src={mainImage} alt="Hero" style={{maxWidth: '100%'}} />
      <Typography variant="h6" sx={{my: 2}}>
        아이디어를 공유하고 투자하세요 🚀
      </Typography>
      <TextField
        style={{ width: '50%' }}
        fullWidth
        variant="outlined"
        placeholder="#OpenAI #Recommend System"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}