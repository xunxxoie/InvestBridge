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

const useParticles = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
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
        color: "#FEFEFE",
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
  };

  return { particlesInit, particlesOptions };
};

const PageLayout = ({ children, bgGradient, particlesInit, particlesOptions }) => (
  <Box position="relative" minHeight="100vh" overflow="hidden">
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bgGradient={bgGradient}
    />
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particlesOptions}
    />
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="calc(100vh + 10px)"
      width="100%"
    >
      {children}
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
);

const Supporter = () => {
  const navigate = useNavigate();
  const { particlesInit, particlesOptions } = useParticles();

  const handleButtonClick = () => {
    navigate('/ideas');
  };

  const bgGradient = useColorModeValue(
    "linear(to-b, #030328, #191970, #1E3A8A)",
    "linear(to-b, #000011, #191970, #1E3A8A)"
  );

  return (
    <ChakraProvider theme={theme}>
      <PageLayout
        bgGradient={bgGradient}
        particlesInit={particlesInit}
        particlesOptions={particlesOptions}
      >
        <Header 
          bgColor="rgba(10, 25, 41, 0.7)"
          textColor="white"
          boxShadow="0 2px 10px rgba(0,0,0,0.1)"
        />
        <Container maxW="container.xl" centerContent position="relative" zIndex={1}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <VStack align="center" spacing={12} py={20}>
              <Icon as={FaHandHoldingHeart} w={20} h={20} color="Red" />
              <Heading
                as="h2"
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
                maxW="1000px"
                lineHeight="tall"
                textShadow="0 0 8px rgba(255,255,255,0.5)"
                fontWeight="medium"
              >
                세상을 변화시킬 아이디어들이 당신의 지원을 기다리고 있습니다.<br/>
                InvestBridge는 혁신적인 드리머와 선견지명이 있는 서포터를 연결합니다.<br/><br/>
                당신의 투자는 단순한 자금 지원이 아닌, 꿈을 현실로 만드는 힘이 됩니다.<br/>
                함께 미래를 만들어갈 준비가 되셨나요? 지금 InvestBridge와 함께 시작하세요.                
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
                아이디어 둘러보기
              </Button>
            </VStack>
          </motion.div>
        </Container>
      </PageLayout>
    </ChakraProvider>
  );
};

export default Supporter;