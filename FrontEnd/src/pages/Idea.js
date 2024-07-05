import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import { Box } from '@mui/material';
import topImage from '../image/maintop.avif';

export default function Idea(){
  return (
    <>
      <Header />
      <Box sx={{backgroundColor: 'none', py: 4, textAlign: 'center', pt : 0}}>
        <img src={topImage} alt="Hero" style={{ width: '100%', height : '200px'}} />
      </Box>
      <Sidebar />
    </>
  )
}