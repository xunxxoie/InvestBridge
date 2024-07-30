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

export default function Header({ bgColor = 'rgba(0, 0, 0, 0.7)', textColor = 'white' }) {
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();

  const handleLogout = async () =>{
    try{
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        method : 'POST',
        credentials : 'include'
      });

      if(response.ok){
        console.log('Logout Succeed');
        navigate('/');
      }
    }catch(error){
      console.log('Logout Failed : Unexpected Error');
    }
  }

  return (
    <Box position="fixed" w="100%" zIndex={1000}>
      <Flex
        bg={bgColor}
        color={textColor}
        minH={'60px'}
        py={{ base: 4 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={'whiteAlpha.300'}
        align={'center'}
        backdropFilter="blur(10px)"
      >
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} align="center">
          <Link to="/main">
            <Flex align="center">
              <Text
                fontSize={'2xl'}
                fontWeight={'bold'}
                textTransform={'uppercase'}
                letterSpacing={'wider'}
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
                    bg="gray.600"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text fontSize="sm" fontWeight="bold">
                    U
                    </Text>
                </Box>
                </MenuButton>
                <MenuList bg="gray.800">
                <MenuItem as={Link} to="/profile" bg="gray.800" _hover={{ bg: 'gray.700' }}>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} bg="gray.800" _hover={{ bg: 'gray.700' }}>
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
            />
        </Flex>
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: 'none' }} bg={bgColor}>
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