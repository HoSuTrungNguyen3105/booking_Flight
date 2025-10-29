import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { memo } from "react";
import { Loading } from "../../common/Loading/Loading";
import ScrollToTop from "../../context/use[custom]/useScrollToTop";

const FullLayout = () => {
  return (
    <Stack direction="column" sx={{ height: "100vh" }}>
      <Box component="main" flexGrow={1} bgcolor="var(--bg-green-md)">
        <ScrollToTop />
        <Outlet />
      </Box>
      <Loading />
    </Stack>
  );
};

export default memo(FullLayout);
