import React from 'react';
import { Box, Avatar, Typography, Chip } from '@mui/material';

function ProfileArea({ username = '', userType = 'dreamer' }) {
  // username이 빈 문자열이면 'X'를 사용
  const avatarLetter = username ? username.charAt(0).toUpperCase() : 'X';
  
  const userTypeDisplay = userType === 'supporter' ? '서포터' : '드리머';
  const userTypeColor = userType === 'supporter' ? 'primary' : 'secondary';

  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Avatar sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}>
        {avatarLetter}
      </Avatar>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {username ? `@${username}` : 'Username not set'}
      </Typography>
      <Chip 
        label={userTypeDisplay} 
        color={userTypeColor} 
        size="small" 
        sx={{ mb: 2 }}
      />
    </Box>
  );
}

export default ProfileArea;

// username과 userType을 props로 받습니다. 이들은 나중에 DB에서 가져온 정보로 대체될 수 있습니다.
// userType에 따라 '서포터' 또는 '드리머'로 표시되는 텍스트를 결정합니다.
// Chip 컴포넌트를 사용하여 사용자 타입을 표시합니다. 타입에 따라 색상도 다르게 설정했습니다.
// Avatar에 사용자 이름의 첫 글자를 대문자로 표시합니다.

// 이 컴포넌트를 사용하는 부모 컴포넌트에서는 다음과 같이 사용할 수 있습니다:
// <ProfileArea username="xunxxoie" userType="dreamer" />

// 나중에 DB와 연동할 때는, 부모 컴포넌트에서 DB에서 가져온 정보를 props로 전달하면 됩니다. 
// 예를 들어:
// function ParentComponent() {
//     const [userData, setUserData] = useState(null);
  
//     useEffect(() => {
//       // DB에서 사용자 정보를 가져오는 비동기 함수
//       async function fetchUserData() {
//         const data = await getUserDataFromDB();
//         setUserData(data);
//       }
  
//       fetchUserData();
//     }, []);
  
//     if (!userData) return null;
  
//     return (
//       <ProfileArea username={userData.username} userType={userData.userType} />
//     );
//   }

//   이렇게 하면 DB 연동 시 ProfileArea 컴포넌트 자체를 수정할 필요 없이, 데이터를 가져오는 부분만 구현하면 됩니다.