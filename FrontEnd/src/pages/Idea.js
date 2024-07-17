
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import IdeaCard from '../component/category/IdeaCard';
import IdeaDetail from '../component/category/ideaDetail';
import Sidebar from "../component/category/Sidebar";
import Header from "../component/main/Header";
import topImage from '../image/no6.jpg';

import p1 from '../image/p1.jpg';
import p2 from '../image/p2.jpg';
import p3 from '../image/p3.jpg';
import p4 from '../image/p4.jpg';

export const exampleProjects = [
  {
    id: 1,
    team: 1,
    name: "AI Project",
    subTitle: "Revolutionizing AI",
    hashtags: ["인공지능", "빅데이터"],
    likes: 35,
    favorites: 7320,
    image: p1,
    detail: "This is a detailed description of the AI project..."
  },
  {
    id: 2,
    team: 2,
    name: "Big Data Analysis",
    subTitle: "Unlocking insights from data",
    hashtags: ["빅데이터"],
    likes: 20,
    favorites: 5120,
    image: p2,
    detail: "This project focuses on analyzing large datasets..."
  },
  {
    id: 3,
    team: 3,
    name: "Game Development",
    subTitle: "Creating immersive experiences",
    hashtags: ["게임"],
    likes: 45,
    favorites: 8420,
    image: p3,
    detail: "We are developing a new game that pushes the boundaries..."
  },
  {
    id: 4,
    team: 4,
    name: "Open AI with Google!",
    subTitle: "Collaborating on AI advancements",
    hashtags: ["인공지능", "빅데이터"],
    likes: 10,
    favorites: 420,
    image: p4,
    detail: "A collaborative project between OpenAI and Google..."
  }
];

const categoryMap = {
  ai: '인공지능',
  bigdata: '빅데이터',
  game: '게임',
  health: '의료 · 보건',
  finance: '금융',
};

export default function Idea() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category');
  const isDetailPage = location.pathname.includes('/detail');

  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : ['all']);
  const [filteredProjects, setFilteredProjects] = useState(exampleProjects);

  useEffect(() => {
    if (selectedCategories.includes('all')) {
      setFilteredProjects(exampleProjects);
    } else {
      const filtered = exampleProjects.filter(project =>
        project.hashtags.some(tag =>
          selectedCategories.some(cat => categoryMap[cat] === tag || cat === tag)
        )
      );
      setFilteredProjects(filtered);
    }
  }, [selectedCategories]);

  return (
    <>
      <Header />
      {!isDetailPage && (
        <Box sx={{ backgroundColor: 'none', py: 4, textAlign: 'center', pt: 0 }}>
          <img
            src={topImage}
            alt="Hero"
            style={{
              width: '100%',
              height: '250px',
              objectFit: 'cover'
            }}
          />
        </Box>
      )}
      <Routes>
        <Route path="/" element={
          <Box sx={{ display: 'flex' }}>
            <Sidebar 
              selectedCategories={selectedCategories} 
              setSelectedCategories={setSelectedCategories} 
            />
            <Box sx={{ mt: 4, ml: '50px', flexGrow: 1, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {filteredProjects.map(project => (
                <IdeaCard key={project.id} project={project} />
              ))}
            </Box>
          </Box>
        } />
        <Route path="/detail" element={<IdeaDetail projects={exampleProjects} />} />
      </Routes>
    </>
  );
}