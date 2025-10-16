import React from "react";
import {
  Typography,
  Box,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import theme from "../../scss/theme";

interface Props {
  title: string;
  desc: string;
  icon?: React.ReactNode;
}

const FeatureCard: React.FC<Props> = ({ title, desc, icon }) => {
  return (
    <Card elevation={0} sx={{ textAlign: "center", p: 2 }}>
      <CardContent>
        <Box sx={{ mb: 1 }}>{icon}</Box>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {desc}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Hero: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();

  const totalFlights = 128; // Example static data
  const airports = 15;
  const pending = 5;

  return (
    <Box
      sx={{
        height: "560px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 6,
        textAlign: "center",
        color: "white",
        position: "relative",
        overflow: "hidden",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1490730101735-85e8a7056461?q=80&w=2670&auto=format&fit=crop)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 2 }}>
        {/* <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
            fontSize: isMobile ? "2rem" : "3rem",
          }}
        >
          {t("tittle1")}
        </Typography> */}

        {/* <Typography variant="h3" component="h1" gutterBottom>
          Manage Flights — Central Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Monitor flight operations, create new flights, check statuses and
          manage gates.
        </Typography> */}

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 6,
            textAlign: "center",
            backgroundColor: theme.palette.primary.main,
            color: "white",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", fontSize: isMobile ? "2rem" : "3rem" }}
          >
            {t("tittle1")}
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.9, maxWidth: "800px", margin: "0 auto" }}
          >
            Welcome to your comprehensive flight management dashboard
          </Typography>
        </Paper>

        <Typography
          variant="h5"
          sx={{
            mt: 2,
            color: theme.palette.grey[300],
            fontSize: isMobile ? "1.1rem" : "1.5rem",
          }}
        >
          {t("tittle2")}
        </Typography>

        <Box
          sx={{
            mt: 5,
            width: "100%",
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            {t("description2")}
          </Typography>
        </Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Box>
            <Typography variant="h5">{totalFlights}</Typography>
            <Typography variant="caption" color="text.secondary">
              Total Flights
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5">{airports}</Typography>
            <Typography variant="caption" color="text.secondary">
              Airports
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5" color="warning.main">
              {pending}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pending Actions
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Hero;
