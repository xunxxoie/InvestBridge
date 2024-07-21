import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Text,
    VStack,
} from '@chakra-ui/react';
import React from 'react';
import { FaHeart, FaStar, FaUserPlus } from 'react-icons/fa';
  
  const ProfileInfo = () => {
    return (
      <Box bg="white" p={8} borderRadius="xl" boxShadow="lg" mb={8} position="relative" overflow="hidden">
        <Box position="absolute" top="-20px" right="-20px" w="150px" h="150px" bg="brand.100" borderRadius="full" zIndex="0" />
        <VStack spacing={6} align="stretch" position="relative" zIndex="1">
          <Flex justifyContent="center" alignItems="center">
            <Avatar size="2xl" name="John Doe" src="https://bit.ly/broken-link" border="4px solid" borderColor="brand.500" />
          </Flex>
          <Text fontSize="3xl" fontWeight="bold" textAlign="center" color="brand.900">John Doe</Text>
          <HStack justifyContent="center" spacing={8}>
            <StatItem icon={FaHeart} value="1.2k" label="좋아요"/>
            <StatItem icon={FaStar} value="3.5k" label="스크랩" />
          </HStack>
          <Button leftIcon={<FaUserPlus />} colorScheme="brand" size="lg" borderRadius="full">
            팔로우
          </Button>
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