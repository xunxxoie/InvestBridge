import { Box, ChakraProvider, extendTheme, Flex, Heading, Image, Text, Wrap, WrapItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && category !== 'undefined' && category !== 'all') {
      setSelectedCategories([category]);
    } else {
      setSelectedCategories(['all']);
    }
  }, [searchParams]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ideas`, {
        method: 'GET',
        credentials: 'include'
      });
      console.log(1)
      if (!response.ok) {
        throw new Error('Internal Server Error')
      }

      const data = await response.json();
      console.log(data)
      setProjects(data);
    } catch (error) {
      console.error('There is no Data in DB');
    }
  }
 
  useEffect(() => {
    if (selectedCategories.includes('all')) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project =>
        project.categories.some(cat => selectedCategories.includes(cat))
      );
      setFilteredProjects(filtered);
    }
  }, [selectedCategories, projects]);

  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Box position="relative">
        <Image
          src={topImage}
          alt="Hero"
          objectFit="cover"
          w="100%"
          h="300px"
          filter="brightness(0.5)"
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
          color="white"
          zIndex={2}
          width="100%"
          px={4}
        >
          <Box
            p={6}
            borderRadius="md"
            maxWidth="800px"
            margin="0 auto"
          >
            <Heading 
              as="h1" 
              size="2xl" 
              mb={4} 
              mt={10}
              textShadow="2px 2px 4px rgba(0,0,0,0.8)"
            >
              혁신적인 아이디어를 찾아보세요
            </Heading>
            <Text 
              fontSize="xl"
              textShadow="1px 1px 2px rgba(0,0,0,0.6)"
            >
              당신의 지원으로 꿈이 현실이 됩니다
            </Text>
          </Box>
        </Box>
      </Box>
      <Flex p={8} bg="gray.50">
        <Sidebar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <Wrap spacing={8} justify="flex-start" flex={1} p={8}>
          {filteredProjects.map(project => (
            <WrapItem key={project.id}>
              <IdeaCard project={project} />
            </WrapItem>
          ))}
        </Wrap>
      </Flex>
    </ChakraProvider>
  );
}