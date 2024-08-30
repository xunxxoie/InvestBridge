import { useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useWebSocket from './useWebSocket';

const useChat = () => {
  const [pendingChats, setPendingChats] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({ userId: '', userRole: '' });
  const [currentRoom, setCurrentRoom] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { isConnected, connectWebSocket, disconnectWebSocket, subscribeToChatRoom, sendMessage } = useWebSocket();
  
  useEffect(() => {
    const initializeChat = async () => {
      await fetchUserInfo();
      await fetchChatroomList();
    };
    initializeChat();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  // useEffect(() => {
  //   const { state } = location;
  //   if (state?.chatRoomId) {
  //     const chat = [...activeChats, ...pendingChats].find(c => c.chatRoomId === state.chatRoomId);
  //     if (chat) {
  //       handleChatroomSelect(chat);
  //     } else {
  //       console.log(`Chat room with ID ${state.chatRoomId} not found.`);
  //       toast({
  //         title: "채팅방을 찾을 수 없습니다.",
  //         status: "error",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     }
  //   }
  // }, [location, activeChats, pendingChats]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/id`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch user info');
      const data = await response.json();
      setUserInfo({ userId: data.userId, userRole: data.userRole || 'UNKNOWN' });
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchChatroomList = async () => {   
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chatroom/list`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch chat list');
      const data = await response.json();
      setPendingChats(data.filter(chat => chat.chatRoomStatus === 'PENDING'));
      setActiveChats(data.filter(chat => chat.chatRoomStatus === 'ACTIVE'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChatroomSelect = useCallback(async (chat) => {
    setSelectedChat(chat);
    setCurrentRoom(chat);

    setLoading(true);
    try {
      if (!isConnected) {
        await connectWebSocket();
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chatroom/${chat.chatRoomId}/messages`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();

      setMessages(data);

      const recipientId = chat.dreamerId === userInfo.userId ? chat.investorId : chat.dreamerId;
      sendMessage(`/app/chat.enterRoom/${chat.chatRoomId}`, {
        roomId: chat.chatRoomId,
        senderId: userInfo.userId,
        recipientId: recipientId,
        type: 'JOIN'
      });

      subscribeToChatRoom(chat.chatRoomId, handleIncomingMessage);
      setCurrentRoom(chat);
    } catch (err) {
      setError(err.message);
      toast({
        title: "채팅방 연결 실패",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [isConnected, connectWebSocket, sendMessage, subscribeToChatRoom, userInfo, toast]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const recipientId = userInfo.userId === selectedChat.dreamerId ? selectedChat.investorId : selectedChat.dreamerId;
      const message = {
        roomId: selectedChat.chatRoomId,
        senderId: userInfo.userId,
        recipientId: recipientId,
        content: newMessage,
        type: 'CHAT'
      };
      sendMessage(`/app/chat.sendMessage/${selectedChat.chatRoomId}`, message);
      setNewMessage('');
    }
  };

  const handleLeaveChatroom = useCallback(() => {
    if (selectedChat) {
      console.log("leave chat room")
      sendMessage(`/app/chat.leaveRoom/${selectedChat.chatRoomId}`, {
        roomId: selectedChat.chatRoomId,
        senderId: userInfo.userId,
        type: 'LEAVE'
      });
      setSelectedChat(null);
      setMessages([]);
      disconnectWebSocket();
      setCurrentRoom(null);
      navigate('/main');
    }
  }, [selectedChat, sendMessage, userInfo, disconnectWebSocket, navigate]);

  const handleIncomingMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const handleChatUpdate = (update) => {
    if (update.chatRoomStatus === 'ACTIVE') {
      setPendingChats(prev => prev.filter(chat => chat.chatRoomId !== update.chatRoomId));
      setActiveChats(prev => [...prev, update]);
    } else if (update.chatRoomStatus === 'CLOSED') {
      setPendingChats(prev => prev.filter(chat => chat.chatRoomId !== update.chatRoomId));
      setActiveChats(prev => prev.filter(chat => chat.chatRoomId !== update.chatRoomId));
      if (selectedChat && selectedChat.chatRoomId === update.chatRoomId) {
        setSelectedChat(null);
      }
    }
  };

  const handleChatroomAction = async (chatRoomId, action) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chatroom/${chatRoomId}/${action}`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`Failed to ${action} chat room`);
      const updatedChat = await response.json();
      handleChatUpdate(updatedChat);
      toast({
        title: `채팅방 ${action === 'accept' ? '수락' : '거절'}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

        await fetchChatroomList();
    } catch (err) {
      setError(err.message);
      toast({
        title: '오류 발생',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return {
    pendingChats,
    activeChats,
    selectedChat,
    messages,
    newMessage,
    loading,
    error,
    userInfo,
    currentRoom,
    handleChatroomSelect,
    handleSendMessage,
    handleChatroomAction,
    setNewMessage,
    handleLeaveChatroom
  };
};

export default useChat;