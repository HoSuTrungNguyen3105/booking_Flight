import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  useMediaQuery,
  Stack,
  Paper,
} from "@mui/material";
import { Analytics, TrendingUp, Notifications } from "@mui/icons-material";
import theme from "../../scss/theme";

const AdvancedAnalytics: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        // background: theme.palette.background.default,
        color: theme.palette.primary.dark,
        py: 8,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        width: "100%", // ← Thêm này
        mx: 0,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={1} alignItems="center">
          {/* Left Content Section */}
          <Grid size={6}>
            <Stack spacing={2}>
              <Chip
                icon={<Analytics />}
                label="Advanced analytics"
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  color: "white",
                  fontWeight: "bold",
                  alignSelf: "flex-start",
                }}
              />

              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  lineHeight: 1.2,
                }}
              >
                Uncover the full story of your travel program
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  lineHeight: 1.6,
                }}
              >
                Your travel program has a story — Navari's advanced analytics
                help you tell it. Powered by ThoughtSpot, it transforms complex
                travel spend data into clear, interactive visualizations. Now,
                deep insights are accessible to anyone — not just data analysis.
              </Typography>

              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "white",
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                  transition: "all 0.3s ease",
                  alignSelf: "flex-start",
                }}
              >
                Get started
              </Button>
            </Stack>
          </Grid>

          {/* Right Section with Notification Card */}
          <Grid size={6}>
            <Stack spacing={3} alignItems={isMobile ? "center" : "flex-end"}>
              {/* Main Title for Right Section */}
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  textAlign: isMobile ? "center" : "right",
                }}
              >
                Stay one step ahead.
              </Typography>

              {/* Notification Card */}
              <Paper
                elevation={6}
                sx={{
                  backgroundColor: "white",
                  color: "text.primary",
                  borderRadius: 3,
                  p: 3,
                  maxWidth: 400,
                  width: "100%",
                  borderLeft: `4px solid ${theme.palette.warning.main}`,
                }}
              >
                <Stack spacing={2}>
                  {/* Notification Header */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Notifications color="warning" />
                    <Typography variant="h6" fontWeight="bold">
                      Notification
                    </Typography>
                  </Box>

                  {/* Notification Content */}
                  <Typography variant="body1" color="text.secondary">
                    On of policy spend has hit your threshold.
                  </Typography>

                  {/* Time Stamp */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      pt: 1,
                      borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Chip
                      icon={<TrendingUp />}
                      label="B-21 AM"
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Just now
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdvancedAnalytics;
