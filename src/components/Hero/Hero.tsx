import React from "react";
import { Typography, Box, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import theme from "../../scss/theme";

const Hero: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        height: "560px",
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
          backgroundColor: "rgba(0, 0, 0, 0.5)",
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
          {t("hero.title", "Chào mừng đến với Hệ thống Nội bộ")}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mt: 2,
            color: theme.palette.grey[300],
            fontSize: isMobile ? "1.1rem" : "1.5rem",
          }}
        >
          {t(
            "hero.subtitle",
            "Nền tảng kết nối và hỗ trợ nhân viên toàn công ty"
          )}
        </Typography>

        <Box
          sx={{
            mt: 5,
            width: "100%",
            maxWidth: "800px",
            mx: "auto",
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
            {t(
              "hero.description",
              "Nơi cung cấp thông tin, tài nguyên và công cụ làm việc cần thiết cho mọi nhân viên"
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
