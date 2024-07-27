import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Heading, Input, Text, VStack } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function HeroSection() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Box
      bgGradient="linear(to-r, #000000, #1A202C)"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      position="relative"
      overflow="hidden"
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      <Container maxW="container.xl" zIndex={1}>
        <VStack spacing={8} textAlign="center">
          <Heading as="h1" size="2xl" fontWeight="bold" letterSpacing="wide">
            아이디어를 공유하고 투자하세요 🚀
          </Heading>
          <Text fontSize="xl" maxW="2xl" color="gray.300">
            혁신적인 아이디어와 투자자를 연결하는 플랫폼
          </Text>
          <Box display="flex" width="100%" maxW="600px">
            <Input
              placeholder="#OpenAI #Recommend System"
              size="lg"
              bg="whiteAlpha.200"
              _placeholder={{ color: 'whiteAlpha.600' }}
              borderColor="whiteAlpha.300"
              _hover={{ borderColor: 'whiteAlpha.400' }}
              _focus={{ borderColor: 'brand.300', boxShadow: '0 0 0 1px #4FD1C5' }}
            />
            <Button
              leftIcon={<SearchIcon />}
              colorScheme="brand"
              size="lg"
              ml={2}
            >
              검색
            </Button>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}