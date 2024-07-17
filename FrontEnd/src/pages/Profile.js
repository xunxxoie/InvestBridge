import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import Header from "../component/main/Header";
import ContentArea from "../component/profiles/ContentArea";
import ProfileArea from "../component/profiles/ProfileArea";
import ProfileSide from "../component/profiles/ProfileSide";

function App() {
  const [selectedMenu, setSelectedMenu] = useState('Home');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <ProfileArea />
          <ProfileSide setSelectedMenu={setSelectedMenu} />
        </Grid>
        <Grid item xs={12} md={9}>
          <ContentArea selectedMenu={selectedMenu} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;