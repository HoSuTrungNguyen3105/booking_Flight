import React, { memo } from "react";
import {
  Box,
  Typography,
  IconButton,
  type SxProps,
  type Theme,
} from "@mui/material";
import { Link } from "react-router-dom";
import theme from "../../scss/theme";

interface ButtonCircleProps {
  url?: string;
  setState?: React.Dispatch<React.SetStateAction<boolean>>;
  icon: React.ReactNode;
  text: string;
  sx?: SxProps<Theme>;
}

const ButtonCircle: React.FC<ButtonCircleProps> = ({
  setState,
  url,
  icon,
  text,
  sx,
}) => {
  const content = (
    <Box
      onClick={() => setState?.(true)}
      sx={[
        {
          width: 100,
          height: 120,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
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
  );

  if (url) {
    return (
      <Link
        to={url}
        style={{
          textDecoration: "none",
          userSelect: "none",
          color: "var(--gray)",
          textAlign: "center",
          display: "inline-block",
        }}
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default memo(ButtonCircle);
