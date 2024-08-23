import { ArrowForwardIcon, ChatIcon, CloseIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';

const ChatWindow = ({ selectedChat, messages, newMessage, userInfo, onSendMessage, onNewMessageChange, onLeaveRoom, onChatAction }) => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerBgColor = useColorModeValue('white', 'gray.800');
  const userMsgBgColor = useColorModeValue('brand.500', 'brand.200');
  const otherMsgBgColor = useColorModeValue('gray.100', 'gray.600');

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedChat) {
      inputRef.current?.focus();
    }
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleLeaveRoom = () => {
    onClose();
    onChatAction(selectedChat.chatRoomId, 'reject');
    onLeaveRoom();
  };

  if (!selectedChat) {
    return (
      <Flex direction="column" justify="center" align="center" h="full" bg={bgColor}>
        <Avatar size="xl" icon={<ChatIcon fontSize="3rem" />} bg="brand.500" mb={4} />
        <Text fontSize="2xl" fontWeight="bold" mb={2}>내 메시지</Text>
        <Text color="gray.500" textAlign="center" maxW="300px" mb={4}>
          채팅방을 선택하거나 새로운 대화를 시작하세요.
        </Text>
      </Flex>
    );
  }

  const partnerId = userInfo.userRole === 'SUPPORTER' ? selectedChat.dreamerId : selectedChat.supporterId;
  return (
    <Flex direction="column" h="full" bg={bgColor}>
      {/* 채팅방 헤더 */}
      <Box p={4} bg={headerBgColor} borderBottom="1px" borderColor={borderColor}>
        <HStack justify="space-between">
          <HStack>
            <Avatar size="sm" name={partnerId} src={`https://api.dicebear.com/6.x/initials/svg?seed=${partnerId}`} />
            <Text fontSize="lg" fontWeight="bold">{partnerId}</Text>
          </HStack>
          <Button
            leftIcon={<CloseIcon />}
            onClick={onOpen}
            colorScheme="red"
            variant="outline"
            size="sm"
          >
            나가기
          </Button>
        </HStack>
      </Box>

      {/* 메시지 목록 */}
      <VStack flex={1} overflowY="auto" spacing={4} p={4} align="stretch">
        {messages.map((msg, index) => (
          <HStack key={index} alignSelf={msg.senderId === userInfo.userId ? "flex-end" : "flex-start"} maxW="70%">
            {msg.senderId !== userInfo.userId && (
              <Avatar size="sm" name={msg.senderId} src={`https://api.dicebear.com/6.x/initials/svg?seed=${msg.senderId}`} />
            )}
            <Box
              bg={msg.senderId === userInfo.userId ? userMsgBgColor : otherMsgBgColor}
              color={msg.senderId === userInfo.userId ? "white" : "inherit"}
              borderRadius="lg"
              p={3}
            >
              {msg.type === 'CHAT' && <Text>{msg.content}</Text>}
              {msg.type === 'JOIN' && <Text fontStyle="italic">{msg.senderId}님이 입장하셨습니다.</Text>}
              {msg.type === 'LEAVE' && <Text fontStyle="italic">{msg.senderId}님이 퇴장하셨습니다.</Text>}
            </Box>
          </HStack>
        ))}
        <div ref={messagesEndRef} />
      </VStack>

      {/* 메시지 입력 */}
      <HStack p={4} borderTop="1px" borderColor={borderColor}>
        <Input
          placeholder="메시지를 입력하세요"
          value={newMessage}
          onChange={(e) => onNewMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          ref={inputRef}
        />
        <IconButton
          icon={<ArrowForwardIcon />}
          colorScheme="brand"
          onClick={onSendMessage}
          isDisabled={!newMessage.trim()}
          aria-label="Send message"
        />
      </HStack>

      {/* 나가기 확인 모달 */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              채팅방 나가기
            </AlertDialogHeader>

            <AlertDialogBody>
              정말 나가시겠습니까?
              <Text mt={2} color="gray.500">
                대화방을 나가시면 상대방과 연결이 종료됩니다.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                취소
              </Button>
              <Button colorScheme="red" onClick={handleLeaveRoom} ml={3}>
                나가기
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default ChatWindow;