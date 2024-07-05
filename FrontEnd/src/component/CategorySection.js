import { Grid, Paper, Typography, Link } from '@mui/material';
import AiIcon from '@mui/icons-material/Memory';
import DescriptionIcon from '@mui/icons-material/Description';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export default function CategorySection() {
  const categories = [
    { icon: <AiIcon sx={{ fontSize: 50 }} />, label: '#인공지능', url: '/idea/ai' },
    { icon: <DescriptionIcon sx={{ fontSize: 50 }} />, label: '#빅데이터', url: '/idea/bigdata' },
    { icon: <SportsEsportsIcon sx={{ fontSize: 50 }} />, label: '#게임', url: '/idea/games' },
    { icon: <MedicalServicesIcon sx={{ fontSize: 50 }} />, label: '#의료 #보건', url: '/idea/healthcare' },
    { icon: <MonetizationOnIcon sx={{ fontSize: 50 }} />, label: '#금융 #경제', url: '/idea/finance' },
  ];

  return (
    <Grid 
      container 
      spacing={4} 
      justifyContent="center" 
      sx={{ mt: 0.5 }}
    >
      {categories.map((category, index) => (
        <Grid 
          item 
          key={index} 
          display="flex" 
          justifyContent="center"
        >
          <Link href={category.url} sx={{ textDecoration: 'none' }}>
            <Paper 
              elevation={3} 
              sx={{ 
                mr: 2, ml: 2,
                p: 2, 
                textAlign: 'center', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                width: 150, 
                height: 100, 
                justifyContent: 'center'
              }}
            >
              {category.icon}
              <Typography>{category.label}</Typography>
            </Paper>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}