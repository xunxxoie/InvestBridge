import { Box, Button, ChakraProvider, Container, Heading, Icon, Text, VStack, extendTheme, useColorModeValue } from '@chakra-ui/react';
import { motion } from "framer-motion";
import React, { useCallback } from 'react';
import { CiLight } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import Header from "./components/Header";

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

const Dreamer = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/dreamer/write');
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const bgGradient = useColorModeValue(
    "linear(to-b, #030328, #191970, #1E3A8A)",
    "linear(to-b, #000011, #191970, #1E3A8A)"
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
        <Header/>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: "rgba(0, 0, 0, 0.7)",
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
                value: ["#2C3E50", "#34495E", "#3A4A5C", "#445566"],
              },
              links: {
                color: "#E6E6FA",
                distance: 150,
                enable: true,
                opacity: 0.4,
                width: 1.5,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: true,
                speed: 1,
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
                value: 0.7,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 4 },
              },
            },
            detectRetina: true,
          }}
        />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="calc(100vh + 10px)"
          width="100%"
        >
          <Container maxW="container.xl" centerContent position="relative" zIndex={1}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <VStack align="center" spacing={12} py={20}>
              <Icon as={CiLight} w={20} h={20} color="skyblue" />
              <Heading
                fontSize={["4xl", "5xl", "6xl", "7xl"]}
                fontWeight="extrabold"
                color="white"
                textAlign="center"
                textShadow="0 0 15px rgba(255,255,255,0.7)"
                letterSpacing="tight"
                lineHeight={1}  // 줄 간격을 줄입니다
              >
                당신의 꿈,
              </Heading>
              <Heading
                fontSize={["1xl", "2xl", "3xl", "4xl"]}
                fontWeight="extrabold"
                color="white"
                textAlign="center"
                textShadow="0 0 15px rgba(255,255,255,0.7)"
                letterSpacing="tight"
                lineHeight={0}  // 약간의 줄 간격을 유지합니다
              >
                InvestBridge가 함께 이뤄가겠습니다.
              </Heading>
                <Text
                  pt={10}
                  color="whiteAlpha.900"
                  textAlign="center"
                  fontSize={["lg", "xl", "2xl"]}
                  maxW="800px"
                  lineHeight="tall"
                  textShadow="0 0 8px rgba(255,255,255,0.5)"
                  fontWeight="medium"
                >
                  무한한 가능성의 우주처럼, 여러분의 아이디어는 무한한 잠재력을 가지고 있습니다. 
                  InvestBridge는 그 잠재력을 현실로 만들어가는 여정의 동반자가 되겠습니다.
                </Text>
                <Button
                  onClick={handleButtonClick}
                  size="lg"
                  fontSize="2xl"
                  py={8}
                  px={12}
                  bgGradient="linear(to-r, #4AD5B7, #20B2AA)"
                  color="white"
                  boxShadow="0 0 20px rgba(74, 213, 183, 0.6)"
                  _hover={{
                    bgGradient: "linear(to-r, #5AE5C7, #30C2BA)",
                    transform: 'translateY(-3px)',
                    boxShadow: '0 0 25px rgba(74, 213, 183, 0.8)'
                  }}
                  transition="all 0.4s ease"
                  borderRadius="full"
                  fontWeight="bold"
                >
                  아이디어 실현하기
                </Button>
              </VStack>
            </motion.div>
          </Container>
        </Box>
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height="150px"
          bgGradient="linear(to-t, rgba(255,255,255,0.1), transparent)"
          zIndex={0}
        />
      </Box>
    </ChakraProvider>
  );
};

export default Dreamer;