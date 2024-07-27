import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Heading,
  Icon,
  Text,
  VStack,
  extendTheme,
  useColorModeValue
} from '@chakra-ui/react';
import { motion } from "framer-motion";
import React, { useCallback } from 'react';
import { FaHandHoldingHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import Header from '../../component/main/Header';

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
        <Header 
          bgColor="rgba(10, 25, 41, 0.7)"
          textColor="white"
          boxShadow="0 2px 10px rgba(0,0,0,0.1)"
        />
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
                value: ["#ffffff", "#87CEFA", "#E6E6FA", "#4F46E5"],
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
                <Icon as={FaHandHoldingHeart} w={20} h={20} color="pink.400" />
                <Heading
                  as="h1"
                  fontSize={["4xl", "5xl", "6xl", "7xl"]}
                  fontWeight="extrabold"
                  color="white"
                  textAlign="center"
                  textShadow="0 0 15px rgba(255,255,255,0.7)"
                  letterSpacing="tight"
                >
                  당신의 지원으로 꿈이 현실이 됩니다
                </Heading>
                <Text
                  color="whiteAlpha.900"
                  textAlign="center"
                  fontSize={["lg", "xl", "2xl"]}
                  maxW="800px"
                  lineHeight="tall"
                  textShadow="0 0 8px rgba(255,255,255,0.5)"
                  fontWeight="medium"
                >
                  세상에는 무한한 가능성을 가진 아이디어들이 존재합니다. 하지만 이러한 아이디어들이 현실이 되기 위해선 적절한 지원과 후원이 필요합니다. InvestBridge에서 여러분은 그 변화의 주역이 될 수 있습니다.
                </Text>
                <Text
                  color="whiteAlpha.900"
                  textAlign="center"
                  fontSize={["lg", "xl", "2xl"]}
                  maxW="800px"
                  lineHeight="tall"
                  textShadow="0 0 8px rgba(255,255,255,0.5)"
                  fontWeight="medium"
                >
                  InvestBridge는 서포터와 드리머를 연결하는 플랫폼입니다. 우리의 목표는 여러분이 믿는 프로젝트에 투자하고, 그 성장 과정을 함께 경험할 수 있도록 하는 것입니다.
                </Text>
                <Button
                  onClick={handleButtonClick}
                  size="lg"
                  fontSize="2xl"
                  py={8}
                  px={12}
                  bgGradient="linear(to-r, #4F46E5, #7C3AED)"
                  color="white"
                  boxShadow="0 0 20px rgba(124, 58, 237, 0.6)"
                  _hover={{
                    bgGradient: "linear(to-r, #5E54E6, #8B4FEE)",
                    transform: 'translateY(-3px)',
                    boxShadow: '0 0 25px rgba(124, 58, 237, 0.8)'
                  }}
                  transition="all 0.4s ease"
                  borderRadius="full"
                  fontWeight="bold"
                >
                  프로젝트 후원하기
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

export default Supporter;