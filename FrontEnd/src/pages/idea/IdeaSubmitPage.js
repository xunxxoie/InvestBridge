import { AttachmentIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ChakraProvider,
  Checkbox,
  Container,
  extendTheme,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  List,
  ListItem,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import githubIcon from '../../image/githubc.png';
import notionIcon from '../../image/Notion.webp';
import Header from '../main/components/Header';

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
    heading: '"Poppins", sans-serif',
    body: '"Inter", sans-serif',
  },
  colors: {
    brand: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      200: '#81E6D9',
      300: '#4FD1C5',
      400: '#38B2AC',
      500: '#319795',
      600: '#2C7A7B',
      700: '#285E61',
      800: '#234E52',
      900: '#1D4044',
    },
  },
});

export default function DreamerIdea() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [gitLink, setGitLink] = useState('');
  const [notionLink, setNotionLink] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
  };

  const handleFileDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileInput = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : prev.length < 3
          ? [...prev, category]
          : prev
    );
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setSelectedCategories(prev => prev.filter(category => category !== categoryToRemove));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isChecked) {
      toast({
        title: "동의 필요",
        description: "제3자 정보 활용 동의에 체크해주세요.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('gitLink', gitLink);
    formData.append('notionLink', notionLink);
    selectedCategories.forEach(category => formData.append('categories', category));
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ideas`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('서버 오류');
      }
      const data = await response.json();
      console.log('아이디어 생성 성공:', data);
      toast({
        title: "아이디어 등록 성공",
        description: "아이디어가 성공적으로 등록되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/main');
    } catch (error) {
      console.error('아이디어 생성 실패:', error);
      toast({
        title: "아이디어 등록 실패",
        description: "아이디어 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const categories = ['인공지능', '의료 · 보건', '빅데이터', '에너지 · 화학', '금융', '게임'];

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Container maxW="container.xl" py={100}>
        <VStack spacing={8} as="form" onSubmit={handleSubmit}>
          <Heading as="h1" size="xl"></Heading>

          <Box w="full" bg={bgColor} p={6} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth={1}>
            <VStack spacing={4} align="stretch">
              <Heading as="h2" size="lg">Step 1: 아이디어 명세 작성</Heading>
              <FormControl isRequired>
                <FormLabel>프로젝트 제목</FormLabel>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="프로젝트 제목을 입력하세요" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>아이디어 내용</FormLabel>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="아이디어 내용을 간단하게 작성해주세요"
                  minH="200px"
                />
              </FormControl>
              <Box
                borderWidth={2}
                borderStyle="dashed"
                borderColor="gray.300"
                borderRadius="md"
                p={4}
                textAlign="center"
                cursor="pointer"
                onDrop={handleFileDrop}
                onDragOver={handleFileDragOver}
                onClick={() => fileInputRef.current.click()}
              >
                <AttachmentIcon boxSize={8} color="gray.400" />
                <Text mt={2}>파일을 드래그하거나 클릭하여 추가하세요</Text>
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  hidden
                  multiple
                />
              </Box>
              {files.length > 0 && (
                <List spacing={2}>
                  {files.map((file, index) => (
                    <ListItem key={index} display="flex" alignItems="center" justifyContent="space-between">
                      <Text>{file.name} ({(file.size / 1024).toFixed(2)} KB)</Text>
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        aria-label="Remove file"
                        onClick={() => handleRemoveFile(index)}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </VStack>
          </Box>

          <Box w="full" bg={bgColor} p={6} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth={1}>
            <VStack spacing={4} align="stretch">
              <Heading as="h2" size="lg">Step 2: 아이디어 포트폴리오 첨부</Heading>
              <HStack spacing={8} justify="center">
                <VStack>
                  <Image src={githubIcon} alt="GitHub" boxSize="50px" />
                  <Input
                    value={gitLink}
                    onChange={(e) => setGitLink(e.target.value)}
                    placeholder="GitHub 링크"
                  />
                </VStack>
                <VStack>
                  <Image src={notionIcon} alt="Notion" boxSize="50px" />
                  <Input
                    value={notionLink}
                    onChange={(e) => setNotionLink(e.target.value)}
                    placeholder="Notion 링크"
                  />
                </VStack>
              </HStack>
            </VStack>
          </Box>

          <Box w="full" bg={bgColor} p={6} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth={1}>
            <VStack spacing={4} align="stretch">
              <Heading as="h2" size="lg">Step 3: 카테고리 선택 (최대 3개)</Heading>
              <Flex wrap="wrap" gap={2}>
                {categories.map((category) => (
                  <Tag
                    key={category}
                    size="lg"
                    variant={selectedCategories.includes(category) ? "solid" : "outline"}
                    colorScheme="teal"
                    cursor="pointer"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Tag>
                ))}
              </Flex>
              <Flex wrap="wrap" gap={2}>
                {selectedCategories.map((category) => (
                  <Tag key={category} size="md" variant="subtle" colorScheme="teal">
                    <TagLabel>{category}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveCategory(category)} />
                  </Tag>
                ))}
              </Flex>
            </VStack>
          </Box>

          <Checkbox isChecked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}>
            위 아이디어를 제 3자 <strong>'InvestBridge : 아이디어 공유 플랫폼'</strong> 에 제공함을 동의합니다.
          </Checkbox>

          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            isDisabled={!isChecked}
            w="full"
          >
            ⭐️ 아이디어 등록하기 ⭐️
          </Button>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}