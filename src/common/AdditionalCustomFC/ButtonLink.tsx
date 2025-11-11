import { Button, Box } from "@mui/material";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface IProps {
  url: string;
  text: string;
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  variant: "contained" | "outlined" | "text";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const ButtonLink: React.FC<IProps> = ({
  url,
  text,
  color = "primary",
  leftIcon,
  variant,
  rightIcon,
}) => {
  return (
    <Button
      component={Link}
      to={`/${url}`}
      variant={variant}
      color={color}
      sx={{
        color: "gray",
        fontSize: "1.1rem",
        fontWeight: "bold",
        textTransform: "none",
        "&:hover": {
          color: "black",
          backgroundColor: "transparent",
        },
      }}
    >
      {leftIcon && (
        <Box sx={{ display: "flex", alignItems: "center" }}>{leftIcon}</Box>
      )}

      {text}
      {rightIcon && (
        <Box sx={{ display: "flex", alignItems: "center" }}>{rightIcon}</Box>
      )}
    </Button>
  );
};

export default ButtonLink;
