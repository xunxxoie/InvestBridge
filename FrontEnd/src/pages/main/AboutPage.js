import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, ChakraProvider, Flex, Heading, Icon, Image, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import patchImg from "../../image/patchNote.png";
import Header from "./components/Header";

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

const AboutPage = () => {
  const [selectedItem, setSelectedItem] = useState('기업소개');
  const [expandedItems, setExpandedItems] = useState({});

  const handleItemClick = (item) => {
    setSelectedItem(item);
    if (item === '패치노트') {
      setExpandedItems(prev => ({ ...prev, '패치노트': !prev['패치노트'] }));
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
        return selectedItem.startsWith('버전') ? `${selectedItem}에 대한 패치노트 내용입니다.` : "";
    }
  };

  const menuItems = [
    { label: '기업소개' },
    { label: 'INFO' },
    { label: '패치노트', children: ['1.0.2', '1.0.1', '1.0.0'] },
  ];

  const isPatchNoteSelected = selectedItem.startsWith('버전');

  return (
    <ChakraProvider>
      <Flex flexDirection="column" minHeight="100vh">
        <Header bgColor="Black" textColor='White' />
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
                        {item.children.map((child, childIndex) => (
                          <MenuItem
                            key={childIndex}
                            label={`버전 ${child}`}
                            isSelected={selectedItem === `버전 ${child}`}
                            onClick={() => setSelectedItem(`버전 ${child}`)}
                            depth={1}
                          />
                        ))}
                      </VStack>
                    )}
                  </React.Fragment>
                ))}
              </VStack>
            </Box>
            <Box flex={1} p={8}>
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
                {isPatchNoteSelected && (
                  <Box p={1} display="flex" justifyContent="center" alignItems="center">
                    <Image
                      src={patchImg}
                      alt="Example Image"
                      objectFit="contain"
                      width="75%"
                      height="75%"
                      borderRadius="md"
                    />
                  </Box>
                )}
                <Text fontSize="lg" color="gray.700" lineHeight="tall">{renderContent()}</Text>
              </VStack>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default AboutPage;
