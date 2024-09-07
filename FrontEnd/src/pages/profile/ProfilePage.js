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
import EditProfileModal from './components/EditProfileModal';

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



const fetchProjects = async (userId) => { 
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const projectsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/profile/projects`, {
        method: 'GET',
        credentials: 'include'
      });

      console.log('Server response status:', projectsResponse.status);

      if (!projectsResponse.ok) {
        if (projectsResponse.status === 404) {
          console.log('No projects found');
          return [];
        }
        throw new Error(`HTTP error! status: ${projectsResponse.status}`);
      }

      const projectsData = await projectsResponse.json();
      console.log('Fetched projects:', projectsData);

      if (Array.isArray(projectsData)) {
        return projectsData.filter(project => project.userId === userId); 
      } else if (projectsData.message === "아이디어를 찾을 수 없습니다. 새로운 아이디어를 등록해주세요.") {
        console.log('No ideas found');
        return [];
      } else {
        console.error('Unexpected projects data structure:', projectsData);
        throw new Error('프로젝트 데이터 구조가 예상과 다릅니다.');
      }
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed:`, error);
      retries++;
      if (retries === maxRetries) {
        console.error('Max retries reached. Failed to fetch projects');
        throw error;
      }
      // Wait for a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

const Profile = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // (profileData.userId == projects.userId) idea
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

  const updateProfile = async (updatedData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다.');
      }

      const updatedProfile = await response.json();
      setProfileData(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('프로필 업데이트에 실패했습니다.');
    }
  };

 
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profile`, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProfileData(data);
  
        if (data.userRole === 'DREAMER') {
          try {
            const userProjects = await fetchProjects(data.userName);
            setMyProjects(userProjects);
          } catch (error) {
            console.error('Error fetching projects:', error);
            setError('프로젝트 정보를 가져오는 데 실패했습니다. 다시 시도해 주세요.');
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('프로필 정보를 가져오는 데 실패했습니다. 페이지를 새로고침 해주세요.');
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
            onUpdateProfile={updateProfile} // 추가
            />
          </Box>
          <Box>
            {profileData?.userRole === 'DREAMER' && (
              myProjects.length > 0 ? (
                <ProjectSection title="My Dream" projects={myProjects} />
              ) : (
                <Text>아직 등록된 프로젝트가 없습니다. 새로운 아이디어를 등록해보세요!</Text>
              )
            )}
            
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
