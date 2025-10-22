import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  useTheme,
  Chip,
  styled,
  type BoxProps,
  alpha,
} from "@mui/material";
import { Home, Refresh, ArrowBack } from "@mui/icons-material";
import {
  useRouteError,
  isRouteErrorResponse,
  // Link,
  useNavigate,
} from "react-router-dom";
import { memo, useCallback } from "react";
import theme from "../../scss/theme";

const GradientBox = styled(Box)<BoxProps>(() => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    maxWidth: 200,
    marginBottom: theme.spacing(4),
  },
}));

const ActionButton = styled(Button)(() => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: "none",
  fontSize: "1rem",
  [theme.breakpoints.down("md")]: {
    maxWidth: 200,
    marginBottom: theme.spacing(4),
  },
}));

const StatusChip = styled(Chip)(() => ({
  borderRadius: 8,
  fontWeight: 600,
  borderWidth: 2,
  "&.MuiChip-outlined": {
    borderWidth: 2,
  },
  [theme.breakpoints.down("md")]: {
    maxWidth: 200,
    marginBottom: theme.spacing(4),
  },
}));

const ErrorLayout = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const theme = useTheme();

  const returnHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  if (error) {
    console.error("Route error:", error);
  } else {
    console.warn("ErrorPage rendered but no error was found");
  }

  const getErrorMessage = () => {
    if (!error) return "No error details available";

    if (isRouteErrorResponse(error)) {
      return error.statusText || error.data?.message || `Error ${error.status}`;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "An unknown error occurred";
  };

  return (
    <GradientBox>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={6}
          alignItems="center"
          justifyContent="center"
          sx={{ py: 8 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: { xs: "center", lg: "left" },
              flex: 1,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                mb: 1,
              }}
            >
              404
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: theme.palette.text.primary,
              }}
            >
              Page Not Found
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: "1.1rem",
                maxWidth: 400,
              }}
            >
              Oops! The page you're looking for seems to have wandered off into
              the digital void.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontStyle: "italic",
                mb: 2,
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              {getErrorMessage()}
            </Typography>

            {isRouteErrorResponse(error) && error.status && (
              <StatusChip
                label={`Status: ${error.status}`}
                color="warning"
                variant="outlined"
              />
            )}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <ActionButton
                variant="contained"
                onClick={returnHome}
                startIcon={<Home />}
              >
                Go Home
              </ActionButton>

              <ActionButton
                variant="outlined"
                onClick={() => navigate(-1)}
                startIcon={<ArrowBack />}
              >
                Go Back
              </ActionButton>

              <ActionButton
                variant="outlined"
                onClick={() => window.location.reload()}
                startIcon={<Refresh />}
              >
                Refresh
              </ActionButton>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </GradientBox>
  );
};

export default memo(ErrorLayout);
