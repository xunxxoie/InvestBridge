import { Box, ChakraProvider, extendTheme, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import useChat from './useChat';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6FFFA', 100: '#B2F5EA',
      500: '#319795', 900: '#234E52',
    },
  },
});

const ChatApp = () => {
  // useChat 훅을 사용하여 채팅 관련 상태와 함수들을 가져옴
  const { 
    pendingChats, 
    activeChats, 
    selectedChat, 
    messages, 
    newMessage, 
    loading, 
    error, 
    userInfo, 
    handleChatroomSelect, 
    handleSendMessage, 
    handleChatroomAction,
    setNewMessage,
    handleLeaveChatroom,
    currentRoom  // 현재 참여 중인 채팅방 정보 추가
  } = useChat();

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <ChakraProvider theme={theme}>
      <Flex h="100vh" bg={bgColor}>
        {/* 채팅방 목록 */}
        <Box w="350px" borderRight="1px" borderColor={borderColor}>
          <ChatList
            pendingChats={pendingChats}
            activeChats={activeChats}
            selectedChat={selectedChat}
            userInfo={userInfo}
            loading={loading}
            error={error}
            onChatSelect={handleChatroomSelect}
            onChatAction={handleChatroomAction}
            currentRoom={currentRoom}  // 현재 참여 중인 채팅방 정보 전달
          />
        </Box>
        {/* 채팅 창 */}
        <Box flex={1}>
          <ChatWindow
            selectedChat={selectedChat}
            messages={messages}
            newMessage={newMessage}
            userInfo={userInfo}
            onSendMessage={handleSendMessage}
            onNewMessageChange={setNewMessage}
            onLeaveRoom={handleLeaveChatroom}
            onChatAction={handleChatroomAction}
          />
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default ChatApp;