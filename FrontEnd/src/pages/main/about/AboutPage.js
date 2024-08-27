import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, ChakraProvider,
  Divider, extendTheme, Flex,
  Heading, HStack, Icon, Image,
  Text, VStack
} from '@chakra-ui/react';
import React from 'react';
import patchImg from "../../../image/patchNote.png";
import Header from "../components/Header";
import useAboutPage from './useAboutPage';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#F7FAFC',
        color: 'gray.800',
        margin: 0,
        padding: 0,
      },
    },
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Inter", sans-serif',
  },
  colors: {
    brand: {
      50: '#E6FFFA', 100: '#B2F5EA', 200: '#81E6D9', 300: '#4FD1C5', 400: '#38B2AC',
      500: '#319795', 600: '#2C7A7B', 700: '#285E61', 800: '#234E52', 900: '#1D4044',
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
    color={isSelected ? "gray.800" : "gray.600"}
    _hover={{ bg: "gray.100", color: "gray.800" }}
    transition="all 0.3s"
    fontSize="sm"
    onClick={onClick}
    borderLeft={isSelected ? "4px solid" : "4px solid transparent"}
    borderLeftColor={isSelected ? "brand.500" : "transparent"}
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

const formatContent = (text) => {
  return text.replace(/\n/g, '<br />');
};

const PatchNoteContent = ({ patchNote }) => (
  <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
    <VStack align="stretch" spacing={6} mb={6}>
      <Box borderRadius="md" overflow="hidden" mb={6}>
        <Image 
          src={patchImg} 
          alt="Patch Note Header" 
          width="100%" 
          height="200px"
          objectFit="cover"
        />
      </Box>
      <Divider />
      <VStack align="stretch" spacing={4}>
        <Heading size="lg" color="gray.800">{patchNote.title}</Heading>
        {patchNote.content ? (
          <Box
            fontSize="md"
            color="gray.700"
            whiteSpace="pre-wrap"
            dangerouslySetInnerHTML={{ __html: formatContent(patchNote.content) }}
          />
        ) : (
          <Text fontSize="md" color="gray.700">
            Content is not available at the moment. Please check back later.
          </Text>
        )}
      </VStack>
      {patchNote.files && patchNote.files.length > 0 && (
        <Box>
          <Heading size="md" mb={2}>Attachments</Heading>
          <HStack spacing={2}>
            {patchNote.files.map((file, index) => (
              <Badge key={index} colorScheme="gray">{file}</Badge>
            ))}
          </HStack>
        </Box>
      )}
    </VStack>
  </Box>
);

const AboutPage = () => {
  const { selectedItem, expandedItems, versions, selectedPatchNote, handleItemClick } = useAboutPage();

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

  return (
    <ChakraProvider theme={theme}>
      <Flex flexDirection="column" minHeight="100vh">
        <Header />
        <Box flex={1}>
          <Flex minHeight="calc(100vh - 60px)">
            <Box w="250px" bg="white" borderRight="1px" borderColor="gray.200">
              <VStack align="stretch" spacing={4}>
                <Box p={6} borderBottom="1px" borderColor="gray.200">
                  <Heading size="md" color="gray.800">ABOUT US</Heading>
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