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
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0.03
  )} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${alpha(
      theme.palette.primary.main,
      0.1
    )} 0%, transparent 70%)`,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${alpha(
      theme.palette.secondary.main,
      0.1
    )} 0%, transparent 70%)`,
  },
}));

const FloatingIllustration = styled("img")(() => ({
  width: "100%",
  maxWidth: 280,
  height: "auto",
  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))",
  animation: "float 6s ease-in-out infinite",
  "@keyframes float": {
    "0%, 100%": {
      transform: "translateY(0px)",
    },
    "50%": {
      transform: "translateY(-20px)",
    },
  },
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
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
  },
}));

const StatusChip = styled(Chip)(() => ({
  borderRadius: 8,
  fontWeight: 600,
  borderWidth: 2,
  "&.MuiChip-outlined": {
    borderWidth: 2,
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
            <FloatingIllustration
              src="/api/placeholder/280/280"
              alt="Error Illustration"
              onError={(e) => {
                e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(`
                  <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="140" cy="140" r="120" fill="${theme.palette.primary.main}" fill-opacity="0.1"/>
                    <path d="M120 120L160 160M160 120L120 160" stroke="${theme.palette.primary.main}" stroke-width="3"/>
                    <circle cx="140" cy="140" r="80" stroke="${theme.palette.primary.main}" stroke-width="2" fill="none"/>
                  </svg>
                `)}`;
              }}
            />

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
                // sx={{
                //   background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                // }}
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
