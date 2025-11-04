import React, { memo } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import theme from "../../scss/theme";

interface ButtonCircleProps {
  url: string;
  icon: React.ReactNode; // icon có thể là MUI icon hoặc React element
  text: string;
}

const ButtonCircle: React.FC<ButtonCircleProps> = ({ url, icon, text }) => {
  return (
    <Link
      to={`${url}`}
      style={{
        textDecoration: "none",
        userSelect: "none",
        color: "var(--gray)",
        textAlign: "center",
        display: "inline-block",
      }}
    >
      <Box
        sx={{
          width: 100,
          height: 120,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 15px",
          borderRadius: "50%",
          transition: "all 0.3s ease",
          cursor: "pointer",
          "&:hover": {
            transform: "scale(1.05)",
            "& .circle": {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        }}
      >
        <IconButton
          className="circle"
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: theme.palette.grey[200],
            color: "#fff",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: theme.palette.grey[100],
            },
          }}
        >
          {icon}
        </IconButton>

        <Typography
          variant="body2"
          sx={{
            marginTop: 1,
            fontWeight: 500,
            color: "text.primary",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Link>
  );
};

export default memo(ButtonCircle);
