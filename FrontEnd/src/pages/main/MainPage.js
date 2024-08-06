import { Box, Button, ChakraProvider, CircularProgress, extendTheme, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySection from "./components/CategorySection";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/is-user`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to validate User');
        }

        setLoading(false);
      } catch (error) {
        console.log('Failed to validate User Data:', error);
        setError('Failed to validate User. Please try again');
        setLoading(false);

        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleAdminClick = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/check-admin`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/admin/main');
      } else {
        toast({
          title: "접근 권한이 없습니다.",
          description: "관리자 권한이 필요합니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('관리자 권한 확인 중 오류 발생:', error);
      toast({
        title: "오류가 발생했습니다.",
        description: "잠시 후 다시 시도해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <ChakraProvider theme={theme}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress isIndeterminate color="brand.500" />
        </Box>
      </ChakraProvider>
    );
  }

  if (error) {
    return (
      <ChakraProvider theme={theme}>
        <Box textAlign="center" mt={10}>
          <div>{error}</div>
        </Box>
      </ChakraProvider>
    );
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
          onClick={handleAdminClick}
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