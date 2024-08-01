import { Box, Button, Icon, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import React from 'react';
import { FiBarChart2, FiBookOpen, FiFileText, FiHome, FiLink, FiUsers } from 'react-icons/fi';

function SidebarItem({ icon, children, onClick }) {
  return (
    <Button
      w="full"
      variant="ghost"
      justifyContent="flex-start"
      onClick={onClick}
      leftIcon={<Icon as={icon} />}
      _hover={{
        bg: 'cyan.400',
        color: 'white',
      }}
    >
      {children}
    </Button>
  );
}

export default function Sidebar({ setCurrentPage }) {
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      pos="fixed"
      left="0"
      w="250px"
      h="full"
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
    >
      <VStack align="stretch" spacing={0} h="full">
        <Box p={5}>
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            Admin Panel
          </Text>
        </Box>
        <VStack align="stretch" flex={1} py={5} spacing={1}>
          <SidebarItem icon={FiHome} onClick={() => setCurrentPage('dashboard')}>Dashboard</SidebarItem>
          <SidebarItem icon={FiUsers} onClick={() => setCurrentPage('users')}>Users</SidebarItem>
          <SidebarItem icon={FiBookOpen} onClick={() => setCurrentPage('ideas')}>Ideas</SidebarItem>
          <SidebarItem icon={FiLink} onClick={() => setCurrentPage('matching')}>Matching</SidebarItem>
          <SidebarItem icon={FiBarChart2} onClick={() => setCurrentPage('statistics')}>Statistics</SidebarItem>
          <SidebarItem icon={FiFileText} onClick={() => setCurrentPage('patchnotes')}>Patch Notes</SidebarItem>
        </VStack>
      </VStack>
    </Box>
  );
}