import { ChakraProvider, CircularProgress, extendTheme } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySection from "../../component/main/CategorySection";
import Header from "../../component/main/Header";
import HeroSection from "../../component/main/HeroSection";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#0A1929',
        color: 'white',
      },
    },
  },
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Inter, sans-serif',
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
    </ChakraProvider>
  );
}