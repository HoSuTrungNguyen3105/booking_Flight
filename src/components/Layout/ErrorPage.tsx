import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  useTheme,
  Chip,
} from "@mui/material";
import {
  ErrorOutline,
  Home,
  Refresh,
  ReportProblem,
} from "@mui/icons-material";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { memo } from "react";

const ErrorPage = () => {
  const error = useRouteError();
  const theme = useTheme();

  if (error) {
    console.error("Route error:", error);
  } else {
    console.warn("ErrorPage rendered but no error was found");
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[100]} 100%)`,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <ErrorOutline
              sx={{
                fontSize: 80,
                color: theme.palette.error.main,
                opacity: 0.8,
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Oops!
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h6"
            component="h2"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 3 }}
          >
            Sorry, an unexpected error has occurred.
          </Typography>

          {/* Error Details */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              mb: 4,
              backgroundColor: theme.palette.grey[50],
              borderColor: theme.palette.divider,
              borderRadius: 2,
            }}
          >
            <Stack spacing={2} alignItems="center">
              <ReportProblem color="warning" />
              <Typography variant="body1" color="text.secondary">
                <i>
                  {
                    error
                      ? isRouteErrorResponse(error)
                        ? error.statusText ||
                          error.data?.message ||
                          `Error ${error.status}`
                        : error instanceof Error
                        ? error.message
                        : "An unknown error occurred"
                      : "No error details available" // Xử lý khi error là null
                  }
                </i>
              </Typography>

              {isRouteErrorResponse(error) && error.status && (
                <Chip
                  label={`Status: ${error.status}`}
                  color="error"
                  variant="outlined"
                />
              )}
            </Stack>
          </Paper>

          {/* Action Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              component={Link}
              to="/"
              startIcon={<Home />}
              size="large"
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
              }}
            >
              Go Home
            </Button>

            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              startIcon={<Refresh />}
              size="large"
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
              }}
            >
              Refresh Page
            </Button>
          </Stack>

          {/* Additional Help */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 4, opacity: 0.7 }}
          >
            If the problem persists, please contact support.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default memo(ErrorPage);
