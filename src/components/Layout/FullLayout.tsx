import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { memo } from "react";

const FullLayout = () => {
  return (
    <Stack direction="column" sx={{ height: "100vh" }}>
      {/* <Header /> */}
      <Box component="main" flexGrow={1} bgcolor="var(--bg-green-md)">
        <Outlet />
      </Box>
      {/* <Footer /> */}
    </Stack>
  );
};

export default memo(FullLayout);
