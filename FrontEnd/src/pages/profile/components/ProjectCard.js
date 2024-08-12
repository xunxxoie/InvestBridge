import {
  Badge,
  Box,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ title, team, id }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ideas/detail/${id}`);
  };

  return (
    <Box 
      onClick={handleClick}
      bg="white" 
      p={5} 
      borderRadius="lg" 
      boxShadow="md" 
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
    >
      <VStack align="stretch" spacing={3}>
        <Text fontWeight="bold" fontSize="xl" color="brand.900">{title}</Text>
        <Badge colorScheme="brand" alignSelf="flex-start">{team}</Badge>
        <HStack spacing={6} pt={2}>
          <StatBadge icon={FaHeart} value="24" />
          <StatBadge icon={FaStar} value="12" />
        </HStack>
      </VStack>
    </Box>
  );
};

const StatBadge = ({ icon, value }) => (
  <HStack spacing={1} bg="gray.100" px={3} py={1} borderRadius="full">
    <Icon as={icon} color="brand.500" />
    <Text fontSize="sm" fontWeight="medium">{value}</Text>
  </HStack>
);

export default ProjectCard;