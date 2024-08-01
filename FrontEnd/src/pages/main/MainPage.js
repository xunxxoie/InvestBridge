import { Box, Button, ChakraProvider, CircularProgress, extendTheme, Link } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySection from "../../component/main/CategorySection";
import Header from "../../component/main/Header";
import HeroSection from "../../component/main/HeroSection";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#000000',
        color: 'white',
      },
    },
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Inter", sans-serif',
  },
  colors: {
    brand: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      200: '#81E6D9',
      300: '#4FD1C5',
      400: '#38B2AC',
      500: '#319795',
      600: '#2C7A7B',
      700: '#285E61',
      800: '#234E52',
      900: '#1D4044',
    },
  },
});

export default function MainPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
          method: 'GET',
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch User Data');
        }
  
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.log('Failed to fetch User Data:', error);
        setError('Failed to find User Data. Please try again');
        setLoading(false);
        
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };
  
    fetchUserData();
  }, [navigate]);

  if (loading){
    return(
        <ChakraProvider theme={theme}>
          <CircularProgress size={24} color="inherit" />
        </ChakraProvider> 
    );
  }

  if (error){
    return <div>{error}</div>
  }

  return (
    <ChakraProvider theme={theme}>
    <Header />
    <HeroSection />
    <CategorySection />
    <Box 
      as="footer" 
      textAlign="right" 
      py={4} 
      px={6}
    >
      <Button 
        as={Link} 
        href="/admin/main" 
        size="sm" 
        variant="ghost" 
        color="gray.500" 
        _hover={{ color: "gray.700" }}
      >
        관리자
      </Button>
    </Box>
  </ChakraProvider>
  );
}