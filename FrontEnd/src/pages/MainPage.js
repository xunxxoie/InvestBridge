import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import CategorySection from "../component/main/CategorySection";
import Header from "../component/main/Header";
import HeroSection from "../component/main/HeroSection";

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
  return (
    <ChakraProvider theme={theme}>
      <Header />
      <HeroSection />
      <CategorySection />
    </ChakraProvider>
  );
}