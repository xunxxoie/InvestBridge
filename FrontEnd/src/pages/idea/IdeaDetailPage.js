import { Box, Button, ChakraProvider, CircularProgress, Container, Divider, extendTheme, Flex, IconButton, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaHeart, FaRocket, FaStar, FaUsers } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import Header from '../../component/main/Header';
import image from '../../image/p1.jpg';

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

const IdeaDetailPage = () => {
  const [idea, setIdea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ideaId = queryParams.get('id');

  useEffect(() => {
    fetchProject();
  }, [ideaId])
  
  const fetchProject = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ideas?id=${ideaId}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('서버 에러 발생');
      }

      const data = await response.json();
      if (data && data.length > 0) {
        setIdea(data[0]);
      } else {
        throw new Error('아이디어 데이터가 없습니다.');
      }
    } catch (error) {
      console.error('아이디어 로딩 실패:', error);
      setError('아이디어를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleLike = () => {
    setIdea(prevIdea => ({ ...prevIdea, likes: (prevIdea?.likes || 0) + 1 }));
  };

  const handleFavorite = () => {
    setIdea(prevIdea => ({ ...prevIdea, favorites: (prevIdea?.favorites || 0) + 1 }));
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <CircularProgress isIndeterminate color="blue.300" />
      </Flex>
    );
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (!idea) {
    return <Text>아이디어를 찾을 수 없습니다.</Text>;
  }

  return (
    <ChakraProvider theme={theme}>
      <Box>
      <Header bgColor="black" textColor="white" />
        <Box pt="100px">
          <Container maxW="container.lg" mt={8}>
            <Box maxWidth={1000} margin="auto" mb={4}>
              <Box borderRadius="lg" overflow="hidden" boxShadow="md" bg="white">
                <Box 
                  bgImage={`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${image})`}
                  bgSize="cover"
                  bgPosition="center"
                  height={200}
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  p={4}
                  color="white"
                  textShadow="1px 1px 3px rgba(0,0,0,0.5)"
                >
                  <Text fontSize="4xl" fontWeight="bold" mb={1}>{idea.title || '제목 없음'}</Text>
                  <Text fontSize="xl">{idea.userName || '작성자 미상'}</Text>
                </Box>

                <Box p={4}>
                  <Flex justifyContent="space-between" alignItems="center" mb={3}>
                    <Box>
                      <Button leftIcon={<FaUsers />} variant="outline" colorScheme="blue">
                        Team {idea.userId || '미상'}
                      </Button>
                    </Box>
                    <Flex alignItems="center">
                      <IconButton icon={<FaHeart />} onClick={handleLike} colorScheme="pink" variant="ghost" />
                      <Text mr={2}>{idea.likes || 0}</Text>
                      <IconButton icon={<FaStar />} onClick={handleFavorite} colorScheme="yellow" variant="ghost" />
                      <Text>{idea.favorites || 0}</Text>
                    </Flex>
                  </Flex>

                  <Divider my={3} />

                  <Text mb={3} lineHeight={1.8}>{idea.content || '내용 없음'}</Text>

                  <Divider my={3} />

                  <Flex flexWrap="wrap" gap={2}>
                    {(idea.categories || []).map((tag, index) => (
                      <Button key={index} size="sm" variant="outline">
                        #{tag}
                      </Button>
                    ))}
                  </Flex>
                </Box>
              </Box>
              
              <Flex mt={4} alignItems="center" justifyContent="flex-end">
                <Text fontSize="xl" fontWeight="bold" color="gray.600" mr={2}>
                  이 아이디어가 맘에 든다면?
                </Text>
                <Button 
                  leftIcon={<FaRocket />}
                  colorScheme="purple"
                  size="lg"
                  borderRadius="full"
                  px={6}
                  fontWeight="bold"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.3s"
                >
                  아이디어 실현하기!
                </Button>
              </Flex>
            </Box>
          </Container>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default IdeaDetailPage;