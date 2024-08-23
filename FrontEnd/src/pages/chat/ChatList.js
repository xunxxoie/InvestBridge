import { CheckIcon, CloseIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Avatar, AvatarBadge, Badge, Box, Flex, HStack, IconButton,
  Spinner, Text, useColorModeValue, VStack
} from '@chakra-ui/react';
import React from 'react';

const ChatList = ({ pendingChats, activeChats, selectedChat, userInfo, loading, error, onChatSelect, onChatAction, currentRoom }) => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mintColor = useColorModeValue('teal.400', 'teal.200');

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays < 7) return ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return date.toLocaleDateString();
  };

  const renderUserInfo = () => (
    <HStack spacing={3} p={4} borderBottom="1px" borderColor={borderColor}>
      <Avatar size="md" name={userInfo.userId} src={`https://api.dicebear.com/6.x/initials/svg?seed=${userInfo.userId}`} bg={mintColor}>
        <AvatarBadge boxSize="1em" bg="green.500" />
      </Avatar>
      <VStack align="start" spacing={0}>
        <Text fontWeight="bold" fontSize="lg" color={textColor}>{userInfo.userId}</Text>
        <Text fontSize="sm" color={mutedTextColor}>{userInfo.userRole}</Text>
      </VStack>
      <IconButton
        icon={<SettingsIcon />}
        variant="ghost"
        colorScheme="teal"
        aria-label="Settings"
        size="sm"
        ml="auto"
      />
    </HStack>
  );

  const renderChatItem = (chat, isPending = false) => {
    const partnerId = userInfo.userRole === 'SUPPORTER' ? chat.dreamerId : chat.supporterId;
    const isCurrentRoom = currentRoom && currentRoom.chatRoomId === chat.chatRoomId;
    
    return (
      <HStack
        key={chat.chatRoomId}
        w="full"
        p={4}
        borderRadius="lg"
        transition="all 0.2s"
        cursor={isPending || isCurrentRoom ? 'default' : 'pointer'} // 현재 입장중인 채팅룸만 클릭 못하게 설정
        bg={selectedChat?.chatRoomId === chat.chatRoomId ? hoverBgColor : 'transparent'}
        _hover={isPending || isCurrentRoom ? {} : { bg: hoverBgColor }}
        onClick={() => onChatSelect(chat)} 
        opacity={isCurrentRoom ? 0.5 : 1}
      >
        <Avatar size="md" name={partnerId} src={`https://api.dicebear.com/6.x/initials/svg?seed=${partnerId}`}>
          {!isPending && chat.unreadCount > 0 && <AvatarBadge boxSize="1.25em" bg={mintColor} />}
        </Avatar>
        <VStack align="start" flex={1} spacing={0} overflow="hidden">
          <Flex w="full" justify="space-between" align="center">
            <Text fontWeight="semibold" color={textColor} isTruncated>{partnerId}</Text>
            <Text fontSize="xs" color={mutedTextColor}>{formatTimestamp(chat.latestMessageTime)}</Text>
          </Flex>
          <Text fontSize="sm" color={mutedTextColor} isTruncated>
            {chat.latestMessage || "새로운 대화를 시작하세요"}
          </Text>
        </VStack>
        {renderChatItemBadges(chat, isPending, isCurrentRoom)}
      </HStack>
    );
  };

  const renderChatItemBadges = (chat, isPending, isCurrentRoom) => {
    if (isPending) {
      return userInfo.userRole === 'DREAMER' ? (
        <HStack spacing={2}>
          <IconButton
            size="sm"
            icon={<CheckIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); onChatAction(chat.chatRoomId, 'accept'); }}
            aria-label="Accept"
          />
          <IconButton
            size="sm"
            icon={<CloseIcon />}
            colorScheme="red"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); onChatAction(chat.chatRoomId, 'reject'); }}
            aria-label="Reject"
          />
        </HStack>
      ) : (
        <Badge colorScheme="orange" variant="subtle">대기중</Badge>
      );
    }
    if (!isPending && chat.unreadCount > 0) {
      return (
        <Badge colorScheme="teal" variant="solid" borderRadius="full" px={2}>
          {chat.unreadCount}
        </Badge>
      );
    }
    if (isCurrentRoom) {
      return <Badge colorScheme="green">참여 중</Badge>;
    }
    return null;
  };

  const renderChatSection = (title, chats, isPending) => (
    <Box mb={6}>
      <Text
        fontWeight="bold"
        fontSize="lg"
        py={2}
        pt={4}
        pl="15px"
        pb="10px"
        color={textColor}
        borderBottom="4px"
        borderColor="gray.600"
        mb={2}
        textAlign="left"
        width="100%"
      >
        {title} ({chats.length})
      </Text>
      <VStack align="stretch" spacing={1}>
        {chats.length > 0 ? (
          chats.map(chat => renderChatItem(chat, isPending))
        ) : (
          <Text fontSize="sm" color={mutedTextColor} py={4} textAlign="center">
            {isPending ? "수락 대기중인 채팅방이 없습니다." : "활성화된 채팅방이 없습니다."}
          </Text>
        )}
      </VStack>
    </Box>
  );

  return (
    <Box bg={bgColor} h="full" borderRight="1px" borderColor={borderColor}>
      {renderUserInfo()}
      <VStack spacing={0} align="stretch" overflowY="auto" h="calc(100% - 73px)">
        {loading ? (
          <Flex justify="center" align="center" h="full">
            <Spinner color={mintColor} size="xl" />
          </Flex>
        ) : error ? (
          <Box p={4} textAlign="center">
            <Text color="red.500">{error}</Text>
          </Box>
        ) : (
          <>
            {renderChatSection("수락 대기중", pendingChats, true)}
            {renderChatSection("활성화된 채팅방", activeChats, false)}
          </>
        )}
      </VStack>
    </Box>
  );
};

export default ChatList;