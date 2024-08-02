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
import ProjectSection from './components//ProjectSection';
import DetailedProfileInfo from './components/DetailedProfileInfo';
import ProfileInfo from './components/ProfileInfo';

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

const Profile = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const myProjects = [
    { title: "AI 헬스케어", team: "Team #1" },
    { title: "빅데이터 분석 플랫폼", team: "Team #2" },
    { title: "블록체인 기반 계약 시스템", team: "Team #3" },
  ];

  const supportedProjects = [
    { title: "스마트 시티 프로젝트", team: "Team #4" },
    { title: "신재생 에너지 솔루션", team: "Team #5" },
    { title: "AR 교육 플랫폼", team: "Team #6" },
  ];

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
          method: 'GET',
          credentials: 'include' // This is equivalent to withCredentials: true in axios
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setProfileData(data);
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
            userName={profileData.userName}
            />
            <DetailedProfileInfo 
            userEmail={profileData.userEmail}
            // birth={profileData.birth}
            phoneNumber={profileData.phoneNumber}
            // userInterest={profileData.userInterest}
            />
          </Box>
          <Box>
            <ProjectSection title="My Dream" projects={myProjects} />
            <ProjectSection title="My Support" projects={supportedProjects} />
          </Box>
        </Grid>
      </Container>
    </Box>
  </ChakraProvider>
  )
};

export default Profile;
