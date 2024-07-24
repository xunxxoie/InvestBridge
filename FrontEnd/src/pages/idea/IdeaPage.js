import { Box, ChakraProvider, extendTheme, Flex, Image, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import IdeaCard from '../../component/category/IdeaCard';
import Sidebar from "../../component/category/Sidebar";
import Header from "../../component/main/Header";
import topImage from '../../image/no6.jpg';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#F0F4F8',
        color: '#2D3748',
      },
    },
  },
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Inter, sans-serif',
  },
  colors: {
    brand: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      500: '#319795',
      700: '#2C7A7B',
    },
  },
});

export default function IdeaPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category');

  const [projects, setProjects] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : ['all']);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ideas`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Internal Server Error')
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Project load is failed');
    }
  }

  useEffect(() => {
    if (selectedCategories.includes('all')) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project =>
        selectedCategories.some(cat => project.categories.includes(cat))
      );
      setFilteredProjects(filtered);
    }
  }, [selectedCategories, projects]);

  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Box bg="brand.50" py={0} textAlign="center">
        <Image
          src={topImage}
          alt="Hero"
          objectFit="cover"
          w="100%"
          h="250px"
        />
      </Box>
      <Flex>
        <Sidebar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <VStack spacing={8} align="stretch" flex={1} p={8}>
          {filteredProjects.map(project => (
            <IdeaCard key={project.id} project={project} />
          ))}
        </VStack>
      </Flex>
    </ChakraProvider>
  );
}