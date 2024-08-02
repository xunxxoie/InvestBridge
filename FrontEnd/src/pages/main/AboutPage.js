import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, ChakraProvider, Divider, extendTheme, Flex, Heading, HStack, Icon, Image, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import patchImg from "../../image/patchNote.png";
import Header from "./components/Header";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#000000',
        color: 'white',
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

const MenuItem = ({ label, isSelected, isExpanded, onClick, depth = 0, hasChildren = false }) => (
  <Flex
    py={3}
    px={4 + depth * 4}
    cursor="pointer"
    alignItems="center"
    justifyContent="space-between"
    fontWeight={isSelected ? "semibold" : "normal"}
    bg={isSelected ? "gray.100" : "white"}
    color={isSelected ? "black" : "gray.700"}
    _hover={{ bg: "gray.100", color: "black" }}
    transition="all 0.3s"
    fontSize="sm"
    onClick={onClick}
    borderLeft={isSelected ? "4px solid" : "4px solid transparent"}
    borderLeftColor={isSelected ? "black" : "transparent"}
  >
    <Text>{label}</Text>
    {hasChildren && (
      <Icon
        as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
        w={3}
        h={3}
        transition="transform 0.3s"
      />
    )}
  </Flex>
);

const PatchNoteContent = ({ patchNote }) => (
  <VStack align="stretch" spacing={6} bg="white" p={8} borderRadius="lg" boxShadow="xl">
    <Box borderRadius="md" overflow="hidden">
      <Image 
        src={patchImg} 
        alt="Patch Note Header" 
        width="75%" 
        height="200px"
        objectFit="fit"
      />
    </Box>
    <Divider />
    <HStack spacing={4} justifyContent="space-between">
      <Text fontWeight="bold" color="gray.700">Version: {patchNote.version}</Text>
      <Text color="gray.500">Author ID: {patchNote.adminId}</Text>
    </HStack>
    <Divider />
    <VStack align="stretch" spacing={4}>
      <Heading size="lg" color="black">{patchNote.title}</Heading>
      <Text fontSize="md" color="gray.700" whiteSpace="pre-wrap">
        {patchNote.content || "Content is not available at the moment. Please check back later."}
      </Text>
    </VStack>
  </VStack>
);

const AboutPage = () => {
  const [selectedItem, setSelectedItem] = useState('기업소개');
  const [expandedItems, setExpandedItems] = useState({});
  const [versions, setVersions] = useState([]);
  const [selectedPatchNote, setSelectedPatchNote] = useState(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/patchnotes-versions`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const versionValues = data.map(item => {
          const parsedItem = JSON.parse(item);
          return parsedItem.version;
        });
        setVersions(versionValues);
      } catch (error) {
        console.error("버전 목록을 가져오는데 실패했습니다:", error);
      }
    };

    fetchVersions();
  }, []);

  const fetchPatchNote = async (version) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/patchnote/${version}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSelectedPatchNote(data);
    } catch (error) {
      console.error(`${version} 패치노트를 가져오는데 실패했습니다:`, error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (item === '패치노트') {
      setExpandedItems(prev => ({ ...prev, '패치노트': !prev['패치노트'] }));
    } else if (item.startsWith('버전')) {
      const version = item.split(' ')[1];
      fetchPatchNote(version);
    } else {
      setExpandedItems(prev => ({ ...prev, '패치노트': false }));
    }
  };

  const renderContent = () => {
    switch (selectedItem) {
      case '기업소개':
        return "우리 회사는 혁신적인 기술 솔루션을 제공하는 선도적인 기업입니다.";
      case '패치노트':
        return "패치노트를 선택하세요.";
      case 'INFO':
        return "추가 정보 및 중요 공지사항은 이 섹션에서 확인하실 수 있습니다.";
      default:
        if (selectedItem.startsWith('버전')) {
          return selectedPatchNote ? (
            <PatchNoteContent patchNote={selectedPatchNote} />
          ) : (
            "패치노트 로딩 중..."
          );
        }
        return "";
    }
  };

  const menuItems = [
    { label: '기업소개' },
    { label: 'INFO' },
    { label: '패치노트', children: versions },
  ];

  const isPatchNoteSelected = selectedItem.startsWith('버전');

  return (
    <ChakraProvider theme={theme}>
      <Flex flexDirection="column" minHeight="100vh">
        <Header />
        <Box flex={1} mt={"80px"}>
          <Flex minHeight="calc(100vh - 80px)" bg="white">
            <Box w="250px" bg="white" borderRight="1px" borderColor="gray.200">
              <VStack align="stretch" spacing={0}>
                <Box p={6} borderBottom="1px" borderColor="gray.200">
                  <Heading size="md" color="black">ABOUT US</Heading>
                </Box>
                {menuItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <MenuItem
                      label={item.label}
                      isSelected={selectedItem === item.label || (item.label === '패치노트' && selectedItem.startsWith('버전'))}
                      isExpanded={expandedItems[item.label]}
                      onClick={() => handleItemClick(item.label)}
                      hasChildren={item.children}
                    />
                    {item.children && expandedItems[item.label] && (
                      <VStack align="stretch" spacing={0} pl={4} bg="gray.50">
                        {item.children.map((version, index) => (
                          <MenuItem
                            key={index}
                            label={`버전 ${version}`}
                            isSelected={selectedItem === `버전 ${version}`}
                            onClick={() => handleItemClick(`버전 ${version}`)}
                            depth={1}
                          />
                        ))}
                      </VStack>
                    )}
                  </React.Fragment>
                ))}
              </VStack>
            </Box>
            <Box flex={1} p={8} bg="gray.50">
              <VStack align="stretch" spacing={8}>
                <Breadcrumb fontSize="sm" color="gray.500">
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">문서</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">About Us</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">{selectedItem}</BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
                {renderContent()}
              </VStack>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default AboutPage;