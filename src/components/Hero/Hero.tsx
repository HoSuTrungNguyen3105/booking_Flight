import React from "react";
import { Typography, Box, useMediaQuery, Stack, Button } from "@mui/material";
import plane from "../../svgs/plane.png";
import theme from "../../scss/theme";

const Hero: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const { t } = useTranslation();

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: theme.palette.primary.light,
        width: "100%",
        height: "73vh",
        display: "grid",
        placeItems: "center",
        zIndex: 1,
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems="center"
        justifyContent="space-between"
        spacing={isMobile ? 8 : 0}
        sx={{
          width: "100%",
          px: { xs: 2, md: 25 },
        }}
      >
        {/* Left Content */}
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: 500 }}
          >
            Welcome To Our Website!
          </Typography>

          <Typography
            variant={isMobile ? "h3" : "h2"}
            sx={{ color: "white", fontWeight: 600, lineHeight: 1.2 }}
          >
            Luxury Experience <br /> With Our Services.
          </Typography>

          <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                //bgcolor: "primary.main",
                color: "#141b2b",
                // fontWeight: 600,
                borderRadius: 10,
                // px: 4,
                // py: 1.5,
                // "&:hover": { bgcolor: "#2d9cdb" },
              }}
            >
              Book Flight
            </Button>

            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "primary.main",
                // fontWeight: 600,
                borderRadius: 10,
                // px: 4,
                // py: 1.5,
                // "&:hover": {
                //   bgcolor: "rgba(45,156,219,0.1)",
                //   borderColor: "primary.main",
                // },
              }}
            >
              Contact Us
            </Button>
          </Stack>
        </Stack>

        {/* Right Image */}
        <Box
          component="img"
          src={plane}
          alt="plane"
          sx={{
            width: { xs: "100%", md: "53%" },
            animation: "fadeInRight 1s ease-in-out",
          }}
        />
      </Stack>
    </Box>
  );
};

export default Hero;
