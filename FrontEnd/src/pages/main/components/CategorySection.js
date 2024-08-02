import { Box, Icon, SimpleGrid, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaBrain, FaChartBar, FaGamepad, FaHeartbeat, FaMoneyBillWave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ icon, label, value }) => {
  const navigate = useNavigate();

  return (
    <VStack
      bg={useColorModeValue('whiteAlpha.100', 'whiteAlpha.50')}
      p={5}
      borderRadius="lg"
      transition="all 0.3s"
      cursor="pointer"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'xl',
        bg: 'whiteAlpha.200',
      }}
      onClick={() => navigate(`/ideas?category=${value}`)}
    >
      <Icon as={icon} w={10} h={10} mb={3} color="brand.300" />
      <Text fontWeight="semibold" fontSize="lg">{label}</Text>
    </VStack>
  );
};

export default function CategorySection() {
  const categories = [
    { icon: FaBrain, label: '#인공지능', value: '인공지능' },
    { icon: FaChartBar, label: '#빅데이터', value: '빅데이터' },
    { icon: FaGamepad, label: '#게임', value: '게임' },
    { icon: FaHeartbeat, label: '#의료 #보건', value: '의료 · 보건' },
    { icon: FaMoneyBillWave, label: '#금융 #경제', value: '금융' },
  ];

  return (
    <Box py={16} bg="black">
      <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={10} color="white">
        카테고리
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={10} px={5} maxW="container.xl" mx="auto">
        {categories.map((category, index) => (
          <CategoryCard key={index} {...category} />
        ))}
      </SimpleGrid>
    </Box>
  );
}