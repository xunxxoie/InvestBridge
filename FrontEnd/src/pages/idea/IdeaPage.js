import { Box, ChakraProvider, extendTheme, Flex, Heading, Icon, Image, Tab, TabList, Tabs, Text, Wrap, WrapItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import topImage from '../../image/no6.jpg';
import Header from '../main/components/Header';
import IdeaCard from './components/IdeaCard';

// Import MUI icons
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BiotechIcon from '@mui/icons-material/Biotech';
import Co2Icon from '@mui/icons-material/Co2';
import ComputerIcon from '@mui/icons-material/Computer';
import EngineeringIcon from '@mui/icons-material/Engineering';
import MemoryIcon from '@mui/icons-material/Memory';
import PaletteIcon from '@mui/icons-material/Palette';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StorageIcon from '@mui/icons-material/Storage';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import WorkIcon from '@mui/icons-material/Work';

// Theme configuration
const theme = extendTheme({
  styles: { global: { body: { bg: '#F0F4F8', color: '#2D3748' } } },
  fonts: { heading: 'Poppins, sans-serif', body: 'Inter, sans-serif' },
  colors: { brand: { 50: '#E6FFFA', 100: '#B2F5EA', 500: '#319795', 700: '#2C7A7B' } },
});

// Updated Category definitions with MUI icons
const categories = [
  { label: '전체', value: 'all', icon: ViewModuleIcon },
  { label: '디자인 · 아트', value: 'Design', icon: PaletteIcon },
  { label: '생명공학', value: 'Bio', icon: BiotechIcon },
  { label: '화학공학', value: 'Chemical', icon: Co2Icon },
  { label: '게임 개발', value: 'Game', icon: SportsEsportsIcon },
  { label: '인공지능', value: 'AI', icon: PsychologyIcon },
  { label: '데이터 사이언스', value: 'Data_Science', icon: StorageIcon },
  { label: '하드웨어', value: 'HW_Engineering', icon: MemoryIcon },
  { label: '개발 · 프로그래밍', value: 'SW_Engineering', icon: ComputerIcon },
  { label: '공학', value: 'Engineering', icon: EngineeringIcon },
  { label: '금융 · 경제', value: 'Business', icon: AttachMoneyIcon },
  { label: '비즈니스', value: 'Business', icon: WorkIcon },
];

// Utility function to fetch projects
const fetchProjects = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ideas`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Internal Server Error');
    return await response.json();
  } catch (error) {
    console.error('There is no Data in DB');
    return [];
  }
};

// Hero Section Component
const HeroSection = () => (
  <Box position="relative">
    <Image src={topImage} alt="Hero" objectFit="cover" w="100%" h="300px" filter="brightness(0.5)" />
    <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" textAlign="center" color="white" zIndex={2} width="100%" px={4}>
      <Box p={6} borderRadius="md" maxWidth="800px" margin="0 auto">
        <Heading as="h1" size="2xl" mb={4} mt={10} textShadow="2px 2px 4px rgba(0,0,0,0.8)">
          혁신적인 아이디어를 찾아보세요
        </Heading>
        <Text fontSize="xl" textShadow="1px 1px 2px rgba(0,0,0,0.6)">
          당신의 지원으로 꿈이 현실이 됩니다
        </Text>
      </Box>
    </Box>
  </Box>
);

// Category Tabs Component
const CategoryTabs = ({ selectedCategory, onChange }) => (
  <Tabs onChange={(index) => onChange(categories[index].value)} variant="unstyled" mb={6}>
    <TabList overflowX="auto" whiteSpace="nowrap" css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
      {categories.map((category) => (
        <Tab 
          key={category.value}
          _selected={{ color: 'white', bg: 'brand.500' }}
          mr={3}
          mb={3}
          borderRadius="md"
          px={4}
          py={3}
          fontWeight="semibold"
          transition="all 0.2s"
          _hover={{ bg: 'brand.100' }}
          flexDirection="column"
          alignItems="center"
          width="100px"
          height="80px"
        >
          <Icon as={category.icon} boxSize={6} mb={2} />
          <Text fontSize="sm">{category.label}</Text>
        </Tab>
      ))}
    </TabList>
  </Tabs>
);

// Project Grid Component
const ProjectGrid = ({ projects }) => (
  <Wrap spacing={6} justify="flex-start">
    {projects.map(project => (
      <WrapItem key={project.id}>
        <IdeaCard project={project} />
      </WrapItem>
    ))}
  </Wrap>
);

// Main IdeaPage Component
export default function IdeaPage() {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    fetchProjects().then(setProjects);
    const category = searchParams.get('category');
    setSelectedCategory(category && category !== 'undefined' ? category : 'all');
  }, [searchParams]);

  useEffect(() => {
    setFilteredProjects(projects.filter(project => 
      !project.blocked && (selectedCategory === 'all' || project.categories.includes(selectedCategory))
    ));
  }, [selectedCategory, projects]);

  return (
    <ChakraProvider theme={theme}>
      <Header />
      <HeroSection />
      <Box p={8} bg="gray.50">
        <Flex direction="column" maxWidth="1200px" margin="0 auto">
          <CategoryTabs selectedCategory={selectedCategory} onChange={setSelectedCategory} />
          <ProjectGrid projects={filteredProjects} />
        </Flex>
      </Box>
    </ChakraProvider>
  );
}