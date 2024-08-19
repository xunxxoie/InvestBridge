import { Chat as ChatIcon, Edit as EditIcon, Send as SendIcon } from '@mui/icons-material';
import { Avatar, Box, CircularProgress, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    fetchChatList();
  }, []);

  useEffect(() => {
    fetchUserId()
  }, []);

  const fetchChatList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/room/list`, {
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

  const fetchUserId = async () => {
    try{
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/id`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch userId');

      const data = await response.json();
      console.log(data);
      setUserInfo(data.userId);
    }catch(err){
      setError(err.message);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        {/* 왼쪽 사이드 - 채팅 목록 */}
        <Paper elevation={3} sx={{ width: 350, borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold">{userInfo}</Typography>
            <IconButton size="small">
              <EditIcon />
            </IconButton>
          </Box>
          {loading && <CircularProgress sx={{ m: 2 }} />}
          {error && <Typography color="error" sx={{ m: 2 }}>{error}</Typography>}
          <List>
            {chatList.map((chat) => (
              <React.Fragment key={chat.id}>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar>{chat.userId[0].toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={chat.userId}
                    secondary={
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {/* 마지막 메시지가 없을 경우를 대비한 조건부 렌더링 */}
                        {chat.lastMessage ? (
                          <>
                            {chat.lastMessage} · {new Date(chat.lastMessage).toLocaleTimeString()}
                          </>
                        ) : (
                          "No messages yet"
                        )}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* 오른쪽 - 기본 메시지 */}
        <Box flex={1} display="flex" flexDirection="column">
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
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ChatApp;