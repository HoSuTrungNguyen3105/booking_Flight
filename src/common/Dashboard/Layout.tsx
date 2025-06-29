import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import { LoadingOrbit } from "../Loading/LoadingOrbit";

const Layout = () => {
  const loading = true; // hoặc const { loading } = useApi();

  return (
    <Box
      sx={{
        // height: "100vh",
        // display: "flex",
        // flexDirection: "column",
        // backgroundColor: "gray", // màu nâu bên ngoài
        height: "100vh",
        display: "flex",
        justifyContent: "center", // 👈 căn giữa theo trục ngang
        alignItems: "center", // 👈 căn giữa theo trục dọc
        backgroundColor: "#FFFFF0",
      }}
    >
      <Box
        sx={{
          borderRadius: 2,
          display: "flex",
          alignContent: "center",
          width: "50%",
          height: "50%",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography>{}</Typography>
        <Backdrop
          sx={{
            //   color: "#333",
            // phần trong màu trắng
            // alignItems: "center",
            // boxShadow: 1,
            // zIndex: (theme) => theme.zIndex.drawer + 1,
            //   backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          open={loading}
        >
          {/* <CircularProgress
            sx={{ height: "30px" }}
            color="secondary"
            // disableShrink
          /> */}
          <LoadingOrbit />
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            ...로딩 중입니다
          </Typography>
        </Backdrop>
      </Box>
    </Box>
  );
};

export default Layout;
