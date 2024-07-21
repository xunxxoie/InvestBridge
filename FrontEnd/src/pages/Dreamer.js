import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import Header from '../component/main/Header';

const Dreamer = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/dreamer/write');
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const bgGradient = useColorModeValue(
    "linear(to-b, #030328, #191970)",
    "linear(to-b, #000011, #191970)"
  );

  return (
    <Box position="relative" minHeight="100vh" overflow="hidden">
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient={bgGradient}
      />
      <Header />
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab",
              },
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.5,
                },
              },
            },
          },
          particles: {
            color: {
              value: ["#ffffff", "#87CEFA", "#E6E6FA"],
            },
            links: {
              color: "#E6E6FA",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: true,
              speed: 0.8,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 100,
            },
            opacity: {
              value: 0.7,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="calc(100vh - 64px)"
        width="100%"
      >
        <Container maxW="container.xl" centerContent position="relative" zIndex={1}>
          <VStack align="center" spacing={8}>
            <Heading
              as="h1"
              fontSize={["4xl", "5xl", "6xl"]}
              fontWeight="bold"
              color="white"
              textAlign="center"
              textShadow="0 0 10px rgba(255,255,255,0.5)"
            >
              당신의 꿈, 우리가 함께 이루어갑니다
            </Heading>
            <Text
              color="whiteAlpha.900"
              textAlign="center"
              fontSize={["md", "lg", "xl"]}
              maxW="800px"
              lineHeight="tall"
              textShadow="0 0 5px rgba(255,255,255,0.3)"
            >
              무한한 가능성의 우주처럼, 여러분의 아이디어는 무한한 잠재력을 가지고 있습니다. 
              InvestBridge는 그 잠재력을 현실로 만들어가는 여정의 동반자가 되겠습니다.
            </Text>
            <Button
              onClick={handleButtonClick}
              size="lg"
              fontSize="xl"
              py={6}
              px={10}
              bgGradient="linear(to-r, #4F46E5, #7C3AED)"
              color="white"
              boxShadow="0 0 15px rgba(124, 58, 237, 0.5)"
              _hover={{
                bgGradient: "linear(to-r, #5E54E6, #8B4FEE)",
                transform: 'translateY(-2px)',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.7)'
              }}
              transition="all 0.3s ease"
              borderRadius="full"
            >
              아이디어 실현하기
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Dreamer;