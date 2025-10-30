import React from "react";
import { Typography, Box } from "@mui/material";

const Hero: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 2,
        gap: 1,
        width: "100%",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 500 }}>
        Welcome To Our Website!
      </Typography>
      {/* <Typography variant="h6" sx={{ color: "primary.main" }}>
        To Our Website!
      </Typography> */}
    </Box>
  );
};

export default Hero;
