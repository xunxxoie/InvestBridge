import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Heading,
  Text,
  VStack,
  extendTheme,
  useColorModeValue
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import Header from '../component/main/Header';

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

const Supporter = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/idea');
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const bgGradient = useColorModeValue(
    "linear(to-b, #030328, #191970)",
    "linear(to-b, #000011, #191970)"
  );

  return (
    <ChakraProvider theme={theme}>
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
          minHeight="calc(100vh  + 10px)"
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
                당신의 지원으로 꿈이 현실이 됩니다
              </Heading>
              <Text
                color="whiteAlpha.900"
                textAlign="center"
                fontSize={["md", "lg", "xl"]}
                maxW="800px"
                lineHeight="tall"
                textShadow="0 0 5px rgba(255,255,255,0.3)"
              >
                세상에는 무한한 가능성을 가진 아이디어들이 존재합니다. 하지만 이러한 아이디어들이 현실이 되기 위해선 적절한 지원과 후원이 필요합니다. InvestBridge에서 여러분은 그 변화의 주역이 될 수 있습니다.
              </Text>
              <Text
                color="whiteAlpha.900"
                textAlign="center"
                fontSize={["md", "lg", "xl"]}
                maxW="800px"
                lineHeight="tall"
                textShadow="0 0 5px rgba(255,255,255,0.3)"
              >
                InvestBridge는 서포터와 드리머를 연결하는 플랫폼입니다. 우리의 목표는 여러분이 믿는 프로젝트에 투자하고, 그 성장 과정을 함께 경험할 수 있도록 하는 것입니다.
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
                프로젝트 후원하기
              </Button>
            </VStack>
          </Container>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Supporter;