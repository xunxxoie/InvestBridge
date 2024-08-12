import {
  Box,
  ChakraProvider,
  Container,
  extendTheme,
  Grid,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Header from '../main/components/Header';
import DetailedProfileInfo from './components/DetailedProfileInfo';
import ProfileInfo from './components/ProfileInfo';
import ProjectSection from './components/ProjectSection';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      100: '#E6F0FF',
      200: '#B3D1FF',
      300: '#80B3FF',
      400: '#4D94FF',
      500: '#3182CE',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
  },
  fonts: {
    heading: '"Pretendard", sans-serif',
    body: '"Pretendard", sans-serif',
  },
});

const fetchProjects = async (userName) => {
  try {
    const projectsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/profile/projects`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!projectsResponse.ok) {
      throw new Error('Failed to fetch projects');
    }

    const projectsData = await projectsResponse.json();
    console.log('Fetched projects:', projectsData);

    if (Array.isArray(projectsData)) {
      return projectsData.filter(project => project.userName === userName);
    } else {
      console.error('Unexpected projects data structure:', projectsData);
      throw new Error('프로젝트 데이터 구조가 예상과 다릅니다.');
    }
  } catch (error) {
    console.error('프로젝트를 불러오는 데 실패했습니다:', error);
    throw error;
  }
};

const Profile = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // (profileData.userName == projects.userName) idea
  const [myProjects, setMyProjects] = useState([]);

  const supportedProjects = [
    { title: "스마트 시티 프로젝트", team: "Team #4" },
    { title: "신재생 에너지 솔루션", team: "Team #5" },
    { title: "AR 교육 플랫폼", team: "Team #6" },
  ];

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profile`, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setProfileData(data);
  
        if (data.userRole === 'DREAMER') {
          try {
            const userProjects = await fetchProjects(data.userName);
            setMyProjects(userProjects);
          } catch (error) {
            console.error('Error fetching projects:', error);
            setError('프로젝트 정보를 가져오는 데 실패했습니다.');
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('프로필 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <ChakraProvider theme={theme}>
        <Box minHeight="100vh" bg={bgColor}>
          <Header bgColor="black" textColor="white" />
          <Container maxW="container.xl" pt="120px" centerContent>
            <Spinner />
          </Container>
        </Box>
      </ChakraProvider>
    );
  }

  if (error) {
    return (
      <ChakraProvider theme={theme}>
        <Box minHeight="100vh" bg={bgColor}>
          <Header bgColor="black" textColor="white" />
          <Container maxW="container.xl" pt="120px" centerContent>
            <Text color="red.500">{error}</Text>
          </Container>
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
    <Box minHeight="100vh" bg={bgColor}>
      <Header bgColor="black" textColor="white" />
      <Container maxW="container.xl" pt="120px" centerContent>
        <Grid
          templateColumns={{ base: "1fr", lg: "350px 1fr" }}
          gap={10}
          width="100%"
          justifyContent="center"
        >
          <Box>
            <ProfileInfo 
            userData={profileData}
            
            />
            <DetailedProfileInfo 
            userData={profileData}
            />
          </Box>
          <Box>
            {/* if userRole == DREAMER -> myProjects */}
            {profileData?.userRole === 'DREAMER' && (
              <ProjectSection title="My Dream" projects={myProjects} />
            )}
            {/* if userRole == SUPPORTER -> supportedProjects */}
            {profileData?.userRole === 'SUPPORTER' && (
              <ProjectSection title="My Support" projects={supportedProjects} />
            )}
          </Box>
        </Grid>
      </Container>
    </Box>
  </ChakraProvider>
  )
};

export default Profile;
