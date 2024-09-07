import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Box,
  Flex,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FiUser, FiMessageSquare, FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant="ghost"
        color="white"
        _hover={{ bg: 'whiteAlpha.200' }}
        _active={{ bg: 'whiteAlpha.300' }}
      >
        <Flex align="center">
          <Avatar size="sm" name={user.name} src={user.avatarUrl} />
          <Box ml="2" textAlign="left">
            <Text fontWeight="bold" fontSize="sm">
              {user.name}
            </Text>
          </Box>
        </Flex>
      </MenuButton>
      <MenuList
        bg="gray.800"
        borderColor="gray.700"
        boxShadow="dark-lg"
        p={4}
        minWidth="300px"
      >
        <Flex align="center" mb={4}>
          <Avatar size="xl" name={user.name} src={user.avatarUrl} />
          <Box ml={4}>
            <Text fontWeight="bold" fontSize="lg" color="white">
              {user.name}
            </Text>
            <Text fontSize="sm" color="gray.300">
              {user.id}
            </Text>
            <Text fontSize="sm" color="gray.300">
              {user.email}
            </Text>
          </Box>
        </Flex>
        <Divider borderColor="gray.600" mb={4} />
        <VStack align="stretch" spacing={2}>
          <MenuItem
            as={Link}
            to="/profile"
            icon={<FiUser />}
            color="white"
            bg="gray.800"
            _hover={{ bg: 'gray.700' }}
          >
            프로필 보기
          </MenuItem>
          <MenuItem
            as={Link}
            to="/chat-App"
            icon={<FiMessageSquare />}
            color="white"
            bg="gray.800"
            _hover={{ bg: 'gray.700' }}
          >
            채팅하기
          </MenuItem>
          <MenuItem
            onClick={onLogout}
            icon={<FiLogOut />}
            color="white"
            bg="gray.800"
            _hover={{ bg: 'gray.700' }}
          >
            로그아웃
          </MenuItem>
        </VStack>
      </MenuList>
    </Menu>
  );
};

export default ProfileDropdown;