import { Badge, Box, Flex, Heading, HStack, Icon, Image, Spacer, Tag, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaEye, FaHeart, FaStar, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CardImg from '../../../image/p4.jpg';

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
  const { id, userId, title, categories, likes, favorites, viewCount, studentCount = 100 } = project;
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
      w="280px"
      h="380px"
      boxShadow="md"
      bg="white"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'xl',
      }}
    >
      <Box position="relative">
        <Image src={CardImg} alt={title} h="160px" w="100%" objectFit="cover" />
        <Badge colorScheme="green" position="absolute" top="10px" left="10px" fontSize="xs" px={2}>
          NEW
        </Badge>
      </Box>
      <VStack align="stretch" p={3} spacing={2} h="220px">
        <Heading as="h3" size="lg" noOfLines={2} lineHeight="shorter" mb={1}>
          {title}
        </Heading>
        <Flex justify="center" wrap="wrap" mb={1}>
          {categories && categories.slice(0, 2).map((tag, index) => (
            <Tag
              key={index}
              size="sm"
              mx={1}
              mb={1}
              colorScheme={categoryColors[tag] || categoryColors.default}
            >
              {tag}
            </Tag>
          ))}
        </Flex>
        <Spacer />
        <HStack justify="space-between" align="center">
          <HStack>
            <Icon as={FaUser} color="gray.500" />
            <Text fontSize="sm" color="gray.500">{userId}</Text>
          </HStack>
        </HStack>
        <HStack justify="space-between" align="center" mt={2}>
          <Flex align="center">
            <Icon as={FaEye} color="gray.500" mr={1} />
            <Text fontSize="sm" color="gray.500">{viewCount || 0}</Text>
          </Flex>
          <Flex align="center">
            <Icon as={FaHeart} color="red.500" mr={1} />
            <Text fontSize="sm" mr={3}>{likes || 0}</Text>
            <Icon as={FaStar} color="yellow.400" mr={1} />
            <Text fontSize="sm">{favorites || 0}</Text>
          </Flex>
        </HStack>
      </VStack>
    </Box>
  );
};

export default IdeaCard;