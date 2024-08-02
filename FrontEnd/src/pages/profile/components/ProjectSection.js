import {
    Box,
    Button,
    Flex,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';
import React from 'react';
import ProjectCard from './ProjectCard';
  
  const ProjectSection = ({ title, projects }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const titleColor = useColorModeValue('brand.900', 'brand.100');
  
    return (
      <Box bg={bgColor} p={8} borderRadius="xl" boxShadow="lg" mb={8}>
        <VStack align="stretch" spacing={6}>
          <Text fontSize="2xl" fontWeight="bold" color={titleColor}>{title}</Text>
          <Flex 
            overflowX="auto" 
            pb={4} 
            sx={{
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
                borderRadius: '8px',
                backgroundColor: `rgba(0, 0, 0, 0.05)`,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: `rgba(0, 0, 0, 0.05)`,
              },
            }}
          >
            {projects.map((project, index) => (
              <Box key={index} minW="280px" mr={6} flex="0 0 auto">
                <ProjectCard {...project} />
              </Box>
            ))}
          </Flex>
          <Button 
            colorScheme="brand" 
            alignSelf="flex-end"
          >
            더 보기
          </Button>
        </VStack>
      </Box>
    );
  };
  
  export default ProjectSection;