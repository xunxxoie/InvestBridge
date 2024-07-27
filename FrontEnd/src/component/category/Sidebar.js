import { Box, Checkbox, Divider, Text, VStack } from '@chakra-ui/react';
import React from 'react';

const categories = [
  { label: '전체보기', value: 'all' },
  { label: '인공지능', value: '인공지능' },
  { label: '빅데이터', value: '빅데이터' },
  { label: '게임', value: '게임' },
  { label: '의료 · 보건', value: '의료 · 보건' },
  { label: '에너지 · 화학', value: '에너지 · 화학' },
  { label: '금융', value: '금융' },
];

const Sidebar = ({ selectedCategories, setSelectedCategories }) => {
  const handleCategoryChange = (value) => {
    if (value === 'all') {
      setSelectedCategories(['all']);
    } else {
      setSelectedCategories(prev => {
        if (prev.includes('all')) {
          return [value];
        } else if (prev.includes(value)) {
          const newCategories = prev.filter(cat => cat !== value);
          return newCategories.length === 0 ? ['all'] : newCategories;
        } else {
          return [...prev, value];
        }
      });
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      mt={8}
      ml={8}
      h="fit-content"
      w="250px"
      flexShrink={0}
      boxShadow="md"
      bg="white"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        카테고리
      </Text>
      <Divider mb={4} />
      <VStack align="stretch" spacing={3}>
        {categories.map((category) => (
          <Checkbox
            key={category.value}
            isChecked={selectedCategories.includes(category.value)}
            onChange={() => handleCategoryChange(category.value)}
            colorScheme="teal"
          >
            <Text fontSize="md">{category.label}</Text>
          </Checkbox>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;