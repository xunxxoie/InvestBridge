import { AttachmentIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, ChakraProvider, Checkbox, Container, extendTheme, Flex, FormControl, FormLabel, Heading, HStack, IconButton, Image, Input, List, ListItem, Tag, TagCloseButton, TagLabel, Text, Textarea, useColorModeValue, useToast, VStack } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import githubIcon from '../../image/githubc.png';
import notionIcon from '../../image/Notion.webp';
import Header from '../main/components/Header';

const theme = extendTheme({
  styles: { global: { body: { bg: '#F0F4F8', color: '#2D3748' } } },
  fonts: { heading: '"Poppins", sans-serif', body: '"Inter", sans-serif' },
  colors: {
    brand: {
      50: '#E6FFFA', 100: '#B2F5EA', 200: '#81E6D9', 300: '#4FD1C5', 400: '#38B2AC',
      500: '#319795', 600: '#2C7A7B', 700: '#285E61', 800: '#234E52', 900: '#1D4044'
    }
  }
});

export default function DreamerIdea() {
  const [title, setTitle] = useState('');
  const [projectSummary, setProjectSummary] = useState('');
  const [teamSummary, setTeamSummary] = useState('')
  const [content, setContent] = useState('');
  const [gitLink, setGitLink] = useState('');
  const [notionLink, setNotionLink] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  const [agreements, setAgreements] = useState({
    confidentiality: false,
    intellectualProperty: false,
    liability: false
  });

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

  const handleAgreementChange = (event) => {
    setAgreements({
      ...agreements,
      [event.target.name]: event.target.checked
    });
  };

  const allAgreed = Object.values(agreements).every(Boolean);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!allAgreed) {
      toast({
        title: "동의 필요",
        description: "모든 약관에 동의해주세요.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('projectSummary', projectSummary);
    formData.append('teamSummary', teamSummary);
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
      navigate('/ideas');
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

  const categories = ['Design','Bio','Medical','Chemical','Game','AI','Data_Science','HW_Engineering','SW_Engineering','Engineering','Finance','Business'];

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Container maxW="container.xl"  py={30}>
        <VStack spacing={8}  as="form" onSubmit={handleSubmit}>
          <Box w="full" bg={bgColor} p={6} pt={20} borderRadius="lg" boxShadow="md"  borderColor={borderColor} borderWidth={1}>
            <VStack spacing={4}  align="stretch">
              <Heading as="h2" size="lg">Step 1: 아이디어 명세 및 팀 소개 작성</Heading>
              <FormControl isRequired>
                <FormLabel>프로젝트 제목</FormLabel>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="프로젝트 제목을 입력하세요" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>프로젝트 한줄소개!</FormLabel>
                <Input value={projectSummary} onChange={(e) => setProjectSummary(e.target.value)} placeholder="프로젝트를 한줄로 요약해주세요!" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>팀 소개</FormLabel>
                <Textarea value={teamSummary} onChange={(e) => setTeamSummary(e.target.value)} placeholder="팀에 대한 간단한 소개를 적어주세요(구성 인원, 방향성, 간단한 소개 등)" minH="70px"/>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>아이디어 내용 및 기술 스팩</FormLabel>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="아이디어 내용을 간단하게 작성해주세요" minH="200px" />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="file-upload">파일 첨부</FormLabel>
                <Box borderWidth={2} borderStyle="dashed" borderColor="gray.300" borderRadius="md" p={4} textAlign="center" cursor="pointer" onDrop={handleFileDrop} onDragOver={handleFileDragOver} onClick={() => fileInputRef.current.click()} id="file-upload">
                  <AttachmentIcon boxSize={8} color="gray.400" />
                  <Text mt={2}>파일을 드래그하거나 클릭하여 추가하세요</Text>
                  <Input type="file" ref={fileInputRef} onChange={handleFileInput} hidden multiple id="file-upload-input" />
                </Box>
                {files.length > 0 && (
                  <List spacing={2} mt={4}>
                    {files.map((file, index) => (
                      <ListItem key={index} display="flex" alignItems="center" justifyContent="space-between">
                        <Text>{file.name} ({(file.size / 1024).toFixed(2)} KB)</Text>
                        <IconButton icon={<DeleteIcon />} size="sm" aria-label="Remove file" onClick={() => handleRemoveFile(index)} />
                      </ListItem>
                    ))}
                  </List>
                )}
             </FormControl>
            </VStack>
          </Box>

          <Box w="full" bg={bgColor} p={6} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth={1}>
            <VStack spacing={4} align="stretch">
              <Heading as="h2" size="lg">Step 2: 아이디어 포트폴리오 첨부</Heading>
              <HStack spacing={8} justify="center">
                <VStack>
                  <Image src={githubIcon} alt="GitHub" boxSize="50px" />
                  <Input value={gitLink} onChange={(e) => setGitLink(e.target.value)} placeholder="GitHub 링크" />
                </VStack>
                <VStack>
                  <Image src={notionIcon} alt="Notion" boxSize="50px" />
                  <Input value={notionLink} onChange={(e) => setNotionLink(e.target.value)} placeholder="Notion 링크" />
                </VStack>
              </HStack>
            </VStack>
          </Box>

          <Box w="full" bg={bgColor} p={6} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth={1}>
            <VStack spacing={4} align="stretch">
              <Heading as="h2" size="lg">Step 3: 카테고리 선택 (최대 3개)</Heading>
              <Flex wrap="wrap" gap={2}>
                {categories.map((category) => (
                  <Tag key={category} size="lg" variant={selectedCategories.includes(category) ? "solid" : "outline"} colorScheme="teal" cursor="pointer" onClick={() => handleCategoryToggle(category)}>
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

          <Box w="full" bg={bgColor} p={6} borderRadius="lg" boxShadow="md" borderColor={borderColor} borderWidth={1} alignItems="center">
            <VStack spacing={4} align="stretch">
              <Heading as="h2" size="lg" textAlign="center">Step 4: 약관 동의</Heading>
              <VStack spacing={4} alignItems="center">
                <Checkbox 
                  name="confidentiality" 
                  isChecked={agreements.confidentiality} 
                  onChange={handleAgreementChange}
                >
                  <Text textAlign="center">
                    <strong>본인</strong>은 등록한 아이디어의 기밀성을 유지하며, 제 3자 <strong>InvestBridge</strong>가 투자자 매칭을 위해 필요한 범위 내에서 정보를 사용할 수 있음에 동의합니다.
                  </Text>
                </Checkbox>
                <Checkbox 
                  name="intellectualProperty" 
                  isChecked={agreements.intellectualProperty} 
                  onChange={handleAgreementChange}
                >
                  <Text textAlign="center">
                    <strong>본인</strong>은 제출한 아이디어에 대한 지적재산권을 보유하며, <strong>InvestBridge</strong>이 투자자 매칭 목적으로 아이디어를 사용할 수 있는 권한을 부여합니다. 
                  </Text>
                  
                </Checkbox>
                <Checkbox 
                  name="liability" 
                  isChecked={agreements.liability} 
                  onChange={handleAgreementChange}
                >
                  <Text textAlign="center">
                    <strong>본인</strong>은 <strong>InvestBridge</strong>이 투자의 성사나 아이디어의 성공을 보장하지 않으며, 발생 가능한 모든 결과에 대해 본인이 책임짐을 인정합니다.                    
                  </Text>
                </Checkbox>
              </VStack>
            </VStack>
          </Box>

          <Button 
            type="submit" 
            colorScheme="teal" 
            size="lg" 
            isDisabled={!allAgreed} 
            w="full"
          >
            ⭐️ 아이디어 등록하기 ⭐️
          </Button>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}