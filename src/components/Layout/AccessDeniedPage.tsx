import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  useTheme,
  styled,
  type BoxProps,
} from "@mui/material";
import { Home, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { memo, useCallback } from "react";
import { useExit } from "../../context/use[custom]/useExit";

const GradientBox = styled(Box)<BoxProps>(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(4),
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
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

const AccessDeniedPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const exit = useExit();

  const returnHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

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
              textAlign: "center",
              flex: 1,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                mb: 1,
                color: theme.palette.error.main,
              }}
            >
              403
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme.palette.text.primary,
              }}
            >
              Access Denied
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: "1.1rem",
                maxWidth: 500,
                mb: 4,
              }}
            >
              Sorry, you don't have permission to access this page. If you
              believe this is a mistake, please contact your administrator.
            </Typography>

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
                onClick={exit}
                startIcon={<ArrowBack />}
              >
                Go Back
              </ActionButton>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </GradientBox>
  );
};

export default memo(AccessDeniedPage);
