import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavItem = ({ children, to = '/', color }) => (
  <Link to={to}>
    <Button
      fontWeight={500}
      color={color}
      bg={'transparent'}
      _hover={{
        bg: 'whiteAlpha.200',
      }}
    >
      {children}
    </Button>
  </Link>
);

export default function Header({ textColor = 'white' }) {
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        console.log('Logout Succeed');
        navigate('/');
      }
    } catch (error) {
      console.log('Logout Failed : Unexpected Error');
    }
  }

  return (
    <Box position="fixed" top="0" w="100%" zIndex={1000}>
      <Flex
        bgGradient="linear(to-r, #000000, #1a1a1a, #000000)"
        color={textColor}
        minH={'80px'}
        py={{ base: 4 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={'gray.800'}
        align={'center'}
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      >
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} align="center">
          <Link to="/main">
            <Flex align="center">
              <Text
                fontSize={'2xl'}
                fontWeight={'bold'}
                textTransform={'uppercase'}
                letterSpacing={'wider'}
                mb={0}
                mt={1}
                bgGradient="linear(to-r, #f7f7f7, #c3c3c3)"
                bgClip="text"
              >
                InvestBridge
              </Text>
            </Flex>
          </Link>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <Stack direction={'row'} spacing={4}>
              <NavItem to="/dreamer" color={textColor}>Dreamer</NavItem>
              <NavItem to="/supporter" color={textColor}>Supporter</NavItem>
              <NavItem to="/ideas" color={textColor}>Idea</NavItem>
              <NavItem to="/about" color={textColor}>About</NavItem>
            </Stack>
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
            >
              <Box
                width="40px"
                height="40px"
                borderRadius="full"
                bg="gray.700"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="2px solid"
                borderColor="gray.600"
              >
                <Text fontSize="sm" fontWeight="bold" mb={0}>
                  User
                </Text>
              </Box>
            </MenuButton>
            <MenuList bg="gray.900" borderColor="gray.700">
              <MenuItem as={Link} to="/profile" bg="gray.900" _hover={{ bg: 'gray.800' }}>
                Profile
              </MenuItem>
              <MenuItem as={Link} to="/chat-App" bg="gray.900" _hover={{ bg: 'gray.800' }}>
                Message
              </MenuItem>
              <MenuItem onClick={handleLogout} bg="gray.900" _hover={{ bg: 'gray.800' }}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>

        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
          justify="flex-end"
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
            color={textColor}
          />
        </Flex>
      </Flex>

      {isOpen && (
        <Box 
          pb={4} 
          display={{ md: 'none' }} 
          bgGradient="linear(to-r, #1a1a1a, #2a2a2a, #1a1a1a)" 
        >
          <Stack as={'nav'} spacing={4}>
            <NavItem to="/dreamer" color={textColor}>Dreamer</NavItem>
            <NavItem to="/supporter" color={textColor}>Supporter</NavItem>
            <NavItem to="/idea" color={textColor}>Idea</NavItem>
            <NavItem to="/about" color={textColor}>About</NavItem>
          </Stack>
        </Box>
      )}
    </Box>
  );
}