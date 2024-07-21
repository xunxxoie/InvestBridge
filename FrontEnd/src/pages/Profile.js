import {
  Box,
  ChakraProvider,
  Container,
  extendTheme,
  Grid,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import Header from '../component/main/Header';
import DetailedProfileInfo from '../component/profiles/DetailedProfileInfo';
import ProfileInfo from '../component/profiles/ProfileInfo';
import ProjectSection from '../component/profiles/ProjectSection';

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

  return (
    <ChakraProvider theme={theme}>
      <Box minHeight="100vh" bg={bgColor}>
        <Header bgColor="black" textColor="white" />
        <Container maxW="container.xl" pt="120px" mr="150px" >
          <Grid templateColumns={{ base: "1fr", lg: "350px 1fr" }} gap={10}>
            <Box ml={{ base: "0", lg: "10px" }}>
              <ProfileInfo />
              <DetailedProfileInfo />
            </Box>
            <Box>
              <ProjectSection title="My Dream" projects={myProjects} />
              <ProjectSection title="My Support" projects={supportedProjects} />
            </Box>
          </Grid>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default Profile;