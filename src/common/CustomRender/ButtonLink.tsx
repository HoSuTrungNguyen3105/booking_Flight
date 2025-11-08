import { Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

interface IProps {
  url: string;
  text: string;
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  variant: "contained" | "outlined" | "text";
  leftIcon?: string;
  rightIcon?: string;
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
        <Box component="span" sx={{ fontSize: 20 }}>
          {leftIcon}
        </Box>
      )}

      {text}

      {rightIcon && (
        <Box component="span" sx={{ fontSize: 20 }}>
          {rightIcon}
        </Box>
      )}
    </Button>
  );
};

export default ButtonLink;
