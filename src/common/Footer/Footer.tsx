import { forwardRef } from "react";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

export const Footer = forwardRef<HTMLElement>((_, ref) => (
  <Box
    ref={ref}
    component="footer"
    sx={{
      backgroundColor: "#f5f5f5",
      borderTop: "1px solid #ccc",
      mt: 4,
      py: 3,
      px: { xs: 2, md: 6 },
      textAlign: "center",
    }}
  >
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} MyFlight Co. All rights reserved.
    </Typography>

    <Box
      sx={{
        mt: 1,
        display: "flex",
        justifyContent: "center",
        gap: 2,
        flexWrap: "wrap",
        fontWeight: 500,
      }}
    >
      <MuiLink
        component={Link}
        sx={{ fontSize: "18px" }}
        to="/terms"
        underline="hover"
        color="textSecondary"
      >
        Terms
      </MuiLink>
      <MuiLink
        component={Link}
        sx={{ fontSize: "18px" }}
        to="/privacy"
        underline="hover"
        color="textSecondary"
      >
        Privacy
      </MuiLink>
      <MuiLink
        component={Link}
        sx={{ fontSize: "18px" }}
        to="/contact"
        underline="hover"
        color="textSecondary"
      >
        Contact
      </MuiLink>
    </Box>
  </Box>
));
