import { Badge, Box, Button, ChakraProvider, Checkbox, CircularProgress, Container, Divider, extendTheme, Flex, Image, keyframes, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useBreakpointValue, useColorModeValue, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaBookmark, FaComments, FaHeart, FaRocket } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import CoverImg from '../../image/no1.jpg';
import Header from '../main/components/Header';

const theme = extendTheme({
  styles:{global:{body:{bg:'gray.50',color:'gray.800'}}},
  fonts:{heading:'Poppins, sans-serif',body:'Inter, sans-serif'},
  colors:{
    brand:{50:'#E6FFFA',100:'#B2F5EA',500:'#319795',700:'#2C7A7B'},
    mint:{50:'#E6FFFA',100:'#B2F5EA',200:'#81E6D9',300:'#4FD1C5',400:'#38B2AC',500:'#319795',600:'#2C7A7B',700:'#285E61',800:'#234E52',900:'#1D4044'},
  }
});

const pulseAnimation = keyframes`
  0%{transform:scale(1);}
  50%{transform:scale(1.2);}
  100%{transform:scale(1);}
`;

const ActionButton = ({ icon: Icon, isActive, count, onClick, activeColor, inactiveColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Flex direction="column" align="center" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Button onClick={onClick} bg="transparent" _hover={{bg:'transparent'}} h="auto" p={2} position="relative">
        <Box as={Icon} fontSize="2xl" color={isActive ? activeColor : inactiveColor} transition="all 0.3s" transform={isHovered ? 'scale(1.1)' : 'scale(1)'} animation={isActive ? `${pulseAnimation} 0.5s` : 'none'} />
        {isHovered && !isActive && (
          <Box position="absolute" top="-2px" right="-2px" bg={activeColor} borderRadius="full" w="10px" h="10px" />
        )}
      </Button>
      <Text fontSize="sm" fontWeight="bold" color={isActive ? activeColor : 'gray.500'} mt={1}>{count}</Text>
    </Flex>
  );
};

const formatContent = (text) => {
  return text.split('\n').map((line, i) => (
    <React.Fragment key={i}>{line}<br /></React.Fragment>
  ));
};

const IdeaDetailPage = () => {
  const [idea, setIdea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    confidentiality: false,
    intellectualProperty: false,
    respect: false
  });
  const navigate = useNavigate();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const modalSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const modalBgColor = useColorModeValue('white', 'gray.800');
  const modalBorderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('#319795', '#4FD1C5');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const highlightColor = useColorModeValue('mint.600', 'mint.300');
  const checkboxBgColor = useColorModeValue('gray.50', 'gray.700');
  const checkboxTextColor = useColorModeValue('gray.700', 'gray.200');

  useEffect(() => { fetchProject(); }, [id]);
  
  const fetchProject = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ideas/detail/${id}`, { method: 'GET', credentials: 'include' });
      if (!response.ok) throw new Error('Internal Server Error');
      const data = await response.json();
      if (data || data.length > 0) setIdea(data);
      else throw new Error('There is no Data in DB');
    } catch (error) {
      console.error('Loading Idea failed:', error);
      setError('Loading Idea failed');
    } finally {
      setIsLoading(false);
    }
  }

  const handleLike = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ideas/${idea.id}/like`, { method: 'POST', credentials: 'include' });
      if(!response.ok) throw new Error('Failed to like idea');
      const updatedIdea = await response.json();
      setIdea(prevIdea => ({
        ...prevIdea,
        isLiked: !prevIdea.isLiked,
        likes: prevIdea.isLiked ? prevIdea.likes - 1 : prevIdea.likes + 1
      }));
    } catch(error) {
      console.error('Internal Server Error', error);
    }
  };

  const handleFavorite = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ideas/${idea.id}/favorite`, { method: 'POST', credentials: 'include' });
      if(!response.ok) throw new Error('Failed to favorite idea');
      const updatedIdea = await response.json();
      setIdea(prevIdea => ({
        ...prevIdea,
        isFavorited: !prevIdea.isFavorited,
        favorites: prevIdea.isFavorited ? prevIdea.favorites - 1 : prevIdea.favorites + 1
      }));
    } catch(error) {
      console.error('Internal Server Error', error);
    }
  };

  const handleCheckboxChange = (name) => {
    setCheckboxes(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const isAllChecked = Object.values(checkboxes).every(Boolean);

  const handleRealizeIdea = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCheckboxes({
      confidentiality: false,
      intellectualProperty: false,
      respect: false
    });
  };

  const handleEnterChatRoom = () => {
    console.log("Entering chat room...");
    handleCloseModal();
    navigate('/chat-App');
  };

  if (isLoading) return (<Flex justify="center" align="center" height="100vh"><CircularProgress isIndeterminate color="mint.500" /></Flex>);
  if (error) return <Text color="red.500">{error}</Text>;
  if (!idea) return <Text>Idea Load failed</Text>;

  return (
    <ChakraProvider theme={theme}>
      <Box minHeight="100vh" bg="gray.50">
        <Header bgColor="black" textColor="white" />
        <Container maxW="container.xl">
          <Box position="relative" height="270px" my={8}>
            <Image src={CoverImg} alt="Project background" objectFit="cover" width="100%" height="100%" filter="brightness(50%)" borderRadius="lg" />
            <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" textAlign="center" color="white">
              <Text fontSize="6xl" fontWeight="bold">{idea.title}</Text>
              <Text fontSize="2xl" mt={2}>{idea.userId}</Text>
            </Box>
          </Box>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={8} mb={8}>
            <VStack flex="3" align="stretch" spacing={8}>
              {[
                { title: 'Project Summary', content: idea.projectSummary },
                { title: 'Team Summary', content: idea.teamSummary },
                { title: 'Details', content: idea.content }
              ].map((section, index) => (
                <Box key={index} bg={bgColor} p={8} borderRadius="lg" boxShadow="md">
                  <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="left">{section.title}</Text>
                  <Divider mb={4} borderWidth="2px" borderColor="black"  />
                  <Text fontSize="lg" textAlign="start">{formatContent(section.content)}</Text>
                </Box>
              ))}
            </VStack>
            <VStack flex="1" align="stretch" spacing={8}>
              <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
                <Flex justify="space-around" mb={6}>
                  <ActionButton icon={FaHeart} isActive={idea.isLiked} count={idea.likes} onClick={handleLike} activeColor="red.500" inactiveColor="gray.400" />
                  <ActionButton icon={FaBookmark} isActive={idea.isFavorited} count={idea.favorites} onClick={handleFavorite} activeColor="yellow.500" inactiveColor="gray.400" />
                </Flex>
                <Divider my={4} />
                <Text fontWeight="bold" fontSize="xl" mb={3}>Categories</Text>
                <Flex flexWrap="wrap" gap={3}>
                  {(idea.categories || []).map((tag, index) => (
                    <Badge key={index} colorScheme="mint" fontSize="sm" py={1} px={3} borderRadius="full">#{tag}</Badge>
                  ))}
                </Flex>
              </Box>
              <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
                <Text fontSize="xl" fontWeight="bold" color="black" mb={4}>Interested in this idea?</Text>
                <Button leftIcon={<FaRocket />} colorScheme="mint" size="lg" width="full" fontWeight="bold" onClick={handleRealizeIdea} _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }} transition="all 0.3s">
                  Realize this idea
                </Button>
              </Box>
            </VStack>
          </Flex>
        </Container>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} isCentered size={modalSize} motionPreset="slideInBottom">
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent bg={modalBgColor} borderRadius="xl" boxShadow="xl">
            <ModalHeader borderBottom="1px" borderColor={modalBorderColor} pb={4}>
              <Flex align="center">
                <FaComments size="24px" color={iconColor} />
                <Text ml={3} fontSize="xl" fontWeight="bold">Connect with the Dreamer</Text>
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
              <Text mb={6} fontSize="md" color={textColor}>
                드리머 <Text as="span" fontWeight="bold" color={highlightColor}>{idea.userId}</Text>
                와의 채팅방으로 연결됩니다. <Text as="span" fontWeight="bold" color={highlightColor}>{idea.userId}</Text>님이 대화를 승인하면, 채팅룸이 활성화되며, 대화를 나누실 수 있습니다.
              </Text>
              <VStack align="start" spacing={4} bg={checkboxBgColor} p={4} borderRadius="md">
                <Text fontWeight="semibold" color={checkboxTextColor}>채팅 시작 전 아래 사항에 동의해주세요:</Text>
                <Checkbox isChecked={checkboxes.confidentiality} onChange={() => handleCheckboxChange('confidentiality')} colorScheme="mint">
                  <Text fontSize="sm">기밀 정보 보호에 동의합니다.</Text>
                </Checkbox>
                <Checkbox isChecked={checkboxes.intellectualProperty} onChange={() => handleCheckboxChange('intellectualProperty')} colorScheme="mint">
                  <Text fontSize="sm">지적재산권을 존중하겠습니다.</Text>
                </Checkbox>
                <Checkbox isChecked={checkboxes.respect} onChange={() => handleCheckboxChange('respect')} colorScheme="mint">
                  <Text fontSize="sm">상호 존중과 예의를 지키겠습니다.</Text>
                </Checkbox>
              </VStack>
            </ModalBody>
            <ModalFooter borderTop="1px" borderColor={modalBorderColor} pt={4}>
              <Button colorScheme="mint" isDisabled={!isAllChecked} onClick={handleEnterChatRoom} leftIcon={<FaRocket />} _hover={{transform: 'translateY(-2px)', boxShadow: 'lg',}} transition="all 0.2s">
                채팅룸 입장하기
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
};

export default IdeaDetailPage;