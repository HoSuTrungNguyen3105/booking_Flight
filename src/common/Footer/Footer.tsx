import { forwardRef } from "react";
import { Box, Typography, Link } from "@mui/material";

export const Footer = forwardRef<HTMLElement>((_, ref) => (
  <Box
    ref={ref}
    component="footer"
    sx={{
      backgroundColor: "#f5f5f5",
      padding: "20px 40px",
      textAlign: "center",
      borderTop: "1px solid #ccc",
      mt: 4,
    }}
  >
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} MyFlight Co. All rights reserved.
    </Typography>
    <span className="text-white font-bold tracking-tight flex gap-4">
      <Box sx={{ mt: 1 }}>
        <Link href="/terms" underline="hover" color="inherit" sx={{ mx: 1 }}>
          Terms
        </Link>
        |
        <Link href="/privacy" underline="hover" color="inherit" sx={{ mx: 1 }}>
          Privacy
        </Link>
        |
        <Link href="/contact" underline="hover" color="inherit" sx={{ mx: 1 }}>
          Contact
        </Link>
      </Box>
    </span>
  </Box>
));
