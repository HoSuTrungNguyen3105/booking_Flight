import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  useTheme,
  Chip,
  styled,
  type BoxProps,
} from "@mui/material";
import {
  ErrorOutline,
  Home,
  Refresh,
  ReportProblem,
} from "@mui/icons-material";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { memo } from "react";
import theme from "../../scss/theme";
import ErrorIcon from "../../svgs/error-404.png";

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "90vw",
  },
}));

const Img = styled("img")(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down("lg")]: {
    height: 450,
    marginTop: theme.spacing(10),
  },
  [theme.breakpoints.down("md")]: {
    height: 400,
  },
  [theme.breakpoints.up("lg")]: {
    marginTop: theme.spacing(13),
  },
}));

const TreeIllustration = styled("img")(({ theme }) => ({
  left: 0,
  bottom: "5rem",
  position: "absolute",
  [theme.breakpoints.down("lg")]: {
    bottom: 0,
  },
}));

const ErrorLayout = () => {
  const error = useRouteError();

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
        <BoxWrapper>
          <Typography variant="h1">404</Typography>
          <Typography
            variant="h5"
            sx={{ mb: 1, fontSize: "1.5rem !important" }}
          >
            Page Not Found ⚠️
          </Typography>
          <Typography variant="body2">
            We couldn&prime;t find the page you are looking for.
          </Typography>
        </BoxWrapper>
        <Img src={ErrorIcon} />
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
          {/* </Paper> */}

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

export default memo(ErrorLayout);
