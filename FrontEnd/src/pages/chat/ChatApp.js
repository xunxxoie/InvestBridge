import { Chat as ChatIcon, Edit as EditIcon, Send as SendIcon } from '@mui/icons-material';
import { Avatar, Box, CircularProgress, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#4fd1c5',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(79, 209, 197, 0.08)', // Light mint color on hover
          },
        },
      },
    },
  },
});

const ChatApp = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChatList();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  const fetchChatList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/room/list`,{
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch chat list');
      const data = await response.json();
      console.log(data);
      setChatList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/chats/${chatId}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChat) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/chats/${selectedChat.id}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: newMessage }),
        });
        if (!response.ok) throw new Error('Failed to send message');
        const sentMessage = await response.json();
        setMessages([...messages, sentMessage]);
        setNewMessage('');
        // 채팅 목록 업데이트
        setChatList(chatList.map(chat => 
          chat.id === selectedChat.id 
            ? {...chat, lastMessage: { content: newMessage, sentAt: new Date(), isRead: false }}
            : chat
        ));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        {/* 왼쪽 사이드 - 채팅 목록 */}
        <Paper elevation={3} sx={{ width: 350, borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold">xunsscie_</Typography>
            <IconButton size="small">
              <EditIcon />
            </IconButton>
          </Box>
          {loading && <CircularProgress sx={{ m: 2 }} />}
          {error && <Typography color="error" sx={{ m: 2 }}>{error}</Typography>}
          <List>
            {chatList.map((chat) => (
              <React.Fragment key={chat.id}>
                <ListItem
                  button
                  selected={selectedChat?.id === chat.id}
                  onClick={() => setSelectedChat(chat)}
                >
                  <ListItemAvatar>
                    <Avatar>{chat.otherUserId[0].toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={chat.otherUserId}
                    secondary={
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {chat.lastMessage.content} · {new Date(chat.lastMessage.sentAt).toLocaleTimeString()}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* 오른쪽 - 채팅 창 또는 기본 메시지 */}
        <Box flex={1} display="flex" flexDirection="column">
          {selectedChat ? (
            <>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2 }}>{selectedChat.otherUserId[0].toUpperCase()}</Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  {selectedChat.otherUserId}
                </Typography>
              </Box>
              <Box flex={1} sx={{ overflowY: 'auto', p: 2 }}>
                {loading && <CircularProgress sx={{ m: 2 }} />}
                {error && <Typography color="error" sx={{ m: 2 }}>{error}</Typography>}
                {messages.map((message) => (
                  <Box key={message.id} sx={{ mb: 2, display: 'flex', justifyContent: message.senderId === 'currentUser' ? 'flex-end' : 'flex-start' }}>
                    <Paper sx={{ p: 1, maxWidth: '70%', bgcolor: message.senderId === 'currentUser' ? 'primary.light' : 'background.paper' }}>
                      <Typography variant="body1">{message.content}</Typography>
                      <Typography variant="caption" display="block" textAlign="right">
                        {new Date(message.sentAt).toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="메시지 입력..."
                  size="small"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  sx={{ mr: 1 }}
                />
                <IconButton color="primary" onClick={handleSendMessage} disabled={loading}>
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'secondary.main' }}>
                <ChatIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom fontWeight="bold">내 메시지</Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 300, mb: 3 }}>
                친구나 그룹에 비공개 사진과 메시지를 보내세요
              </Typography>
              <IconButton
                color="secondary"
                size="large"
                sx={{
                  border: 2,
                  borderColor: 'secondary.main',
                  '&:hover': { bgcolor: 'secondary.main', color: 'common.white' },
                  transition: 'all 0.3s'
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ChatApp;