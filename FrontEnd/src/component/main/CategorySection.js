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
      onClick={() => navigate(`/idea?category=${value}`)}
    >
      <Icon as={icon} w={10} h={10} mb={3} />
      <Text fontWeight="semibold">{label}</Text>
    </VStack>
  );
};

export default function CategorySection() {
  const categories = [
    { icon: FaBrain, label: '#인공지능', value: 'ai' },
    { icon: FaChartBar, label: '#빅데이터', value: 'bigdata' },
    { icon: FaGamepad, label: '#게임', value: 'game' },
    { icon: FaHeartbeat, label: '#의료 #보건', value: 'health' },
    { icon: FaMoneyBillWave, label: '#금융 #경제', value: 'finance' },
  ];

  return (
    <Box py={16}>
      <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={10}>
        카테고리
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={10} px={5}>
        {categories.map((category, index) => (
          <CategoryCard key={index} {...category} />
        ))}
      </SimpleGrid>
    </Box>
  );
}