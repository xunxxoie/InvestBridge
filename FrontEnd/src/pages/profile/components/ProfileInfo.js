import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  VStack
} from '@chakra-ui/react';
import React from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';


const ProfileInfo = ({ userData }) => {
console.log(userData);
console.log("userName:", userData.userName, "userRole:", userData.userRole, "userId:", userData.userId);
return (
  <Box bg="white" p={8} borderRadius="xl" boxShadow="lg" mb={8} position="relative" overflow="hidden">
    <Box position="absolute" top="-20px" right="-20px" w="150px" h="150px" bg="brand.100" borderRadius="full" zIndex="0" />
    <VStack spacing={4} align="stretch" position="relative" zIndex="1">
      <Flex direction="column" justifyContent="center" alignItems="center">
        <Avatar 
          size="2xl" 
          name={userData.userName}
          src="https://bit.ly/broken-link" 
          border="4px solid" 
          borderColor="brand.500"
        />
        <Text mt={2} fontSize="xl" fontWeight="bold">{userData.userName}</Text>
        <Text mt={2} fontSize="xl" fontWeight="bold">{userData.userRole}</Text>
      </Flex>
      <HStack justifyContent="center" spacing={8}>
        <StatItem icon={FaHeart} value="1.2k" label="좋아요"/>
        <StatItem icon={FaStar} value="3.5k" label="스크랩" />
      </HStack>
    </VStack>
  </Box>
);
};

const StatItem = ({ icon, value, label }) => (
  <VStack spacing={1}>
    <Icon as={icon} boxSize={6} color="brand.500" />
    <Text fontSize="xl" fontWeight="bold">{value}</Text>
    <Text fontSize="sm" color="gray.500">{label}</Text>
  </VStack>
);

export default ProfileInfo;