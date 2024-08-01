import { Box, ChakraProvider, Flex, useColorModeValue } from '@chakra-ui/react';
import React, { useState } from 'react';

import Dashboard from './components/Dashboard';
import IdeaManagement from './components/IdeaManagement';
import MatchingManagement from './components/MatchingManagement';
import PatchNotes from './components/PatchNotes';
import Sidebar from './components/Sidebar';
import Statistics from './components/Statistics';
import UserManagement from './components/UserManagement';

export default function AdminLayout() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const contentBgColor = useColorModeValue('white', 'gray.800');

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'ideas':
        return <IdeaManagement />;
      case 'matching':
        return <MatchingManagement />;
      case 'statistics':
        return <Statistics />;
      case 'patchnotes':
        return <PatchNotes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ChakraProvider>
      <Flex minH="100vh" bg={bgColor}>
        <Sidebar setCurrentPage={setCurrentPage} />
        <Box flex={1} p={8} bg={contentBgColor} ml="250px">
          {renderPage()}
        </Box>
      </Flex>
    </ChakraProvider>
  );
}