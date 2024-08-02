import { Box, Center, Flex, Heading, Icon, Tag, Text } from '@chakra-ui/react';
import React from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import image from '../../../image/p1.jpg';

const categoryColors = {
  '인공지능': 'blue',
  '빅데이터': 'green',
  '게임': 'purple',
  '의료 · 보건': 'red',
  '에너지 · 화학': 'orange',
  '금융': 'cyan',
  'default': 'gray'
};

const IdeaCard = ({ project }) => {
  const { id, userName, title, categories, likes, favorites } = project;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ideas/detail/${id}`);
  };

  return (
    <Box
      onClick={handleClick}
      cursor="pointer"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      w="300px"
      boxShadow="lg"
      bg="white"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'xl',
      }}
    >
      <Box h="150px" bgImage={`url(${image})`} bgSize="cover" bgPosition="center" />
      <Box p={4}>
        <Heading as="h3" size="md" mb={2} color="blue.600">
          {userName}
        </Heading>
        <Heading as="h2" size="lg" mb={4}>
          {title}
        </Heading>
        <Center mb={4}>
          <Flex wrap="wrap" justify="center">
            {categories.map((tag, index) => (
              <Tag 
                key={index} 
                m={1} 
                colorScheme={categoryColors[tag] || categoryColors.default}
              >
                #{tag}
              </Tag>
            ))}
          </Flex>
        </Center>
        <Flex justify="center" align="center">
          <Flex align="center" mr={4}>
            <Icon as={FaHeart} color="red.500" mr={1} />
            <Text>{likes}</Text>
          </Flex>
          <Flex align="center">
            <Icon as={FaStar} color="yellow.400" mr={1} />
            <Text>{favorites}</Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default IdeaCard;