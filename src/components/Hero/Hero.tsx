import React from "react";
import { Typography, Box, useMediaQuery, useTheme } from "@mui/material";

const Hero: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box
        sx={{
          height: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 6,
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1490730101735-85e8a7056461?q=80&w=2670&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Lớp phủ mờ
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              color: "white",
              textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
              fontSize: isMobile ? "2rem" : "3rem",
            }}
          >
            Chào mừng đến với Hệ thống Nội bộ
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mt: 2,
              color: theme.palette.grey[300],
              fontSize: isMobile ? "1.1rem" : "1.5rem",
            }}
          >
            Nền tảng kết nối và hỗ trợ nhân viên toàn công ty
          </Typography>

          <Box
            sx={{
              mt: 5,
              width: "100%",
              maxWidth: "800px",
              mx: "auto",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              p: 3,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
              "Nơi cung cấp thông tin, tài nguyên và công cụ làm việc cần thiết
              cho mọi nhân viên"
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Hero;
