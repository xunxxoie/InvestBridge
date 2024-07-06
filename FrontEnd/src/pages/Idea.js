// pages/Idea.js
import React from 'react';
import Header from "../component/main/Header";
import Sidebar from "../component/category/Sidebar";
import { Box } from '@mui/material';
import topImage from '../image/no6.jpg';
import IdeaCard from '../component/category/IdeaCard';

import p1 from '../image/p1.jpg'
import p2 from '../image/p2.jpg'
import p3 from '../image/p3.jpg'
import p4 from '../image/p4.jpg'

export default function Idea() {
  // Example projects data
  const exampleProjects = [
    {
      id: 1,
      team: 1,
      name: "AI Project",
      hashtags: ["인공지능", "AI", "OpenAI"],
      likes: 35,
      favorites: 7320,
      image: p1 // Add the path to your image
    },
    {
      id: 2,
      team: 2,
      name: "Big Data Analysis",
      hashtags: ["빅데이터", "Analysis"],
      likes: 20,
      favorites: 5120,
      image: p2 // Add the path to your image
    },
    {
      id: 3,
      team: 3,
      name: "Game Development",
      hashtags: ["게임", "Unity"],
      likes: 45,
      favorites: 8420,
      image: p3 // Add the path to your image
    },
    {
      id: 4,
      team: 4,
      name: "Open AI with Google!",
      hashtags: ["GPT", "Django"],
      likes: 10,
      favorites: 420,
      image: p4 // Add the path to your image
    }
  ];

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: 'none', py: 4, textAlign: 'center', pt: 0 }}>
        <img 
          src={topImage} 
          alt="Hero" 
          style={{ 
            width: '100%', 
            height: '250px', 
            objectFit: 'cover' // 이미지 크기 조정
          }} 
        />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box sx={{ mt: 4, ml: '50px', flexGrow: 1, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {exampleProjects.map(project => (
            <IdeaCard key={project.id} project={project} />
          ))}
        </Box>
      </Box>
    </>
  );
}