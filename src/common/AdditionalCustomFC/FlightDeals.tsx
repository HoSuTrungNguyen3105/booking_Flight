import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { Check as CheckIcon, FlightTakeoff } from "@mui/icons-material";
import InputTextField from "../Input/InputTextField";
import type { FlightDiscount } from "../../utils/type";

const FlightDeals: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [flightDeals, setFlightDeals] = useState<FlightDiscount[]>([]);

  const features = [
    "Save €100s on your flights",
    "Save up to €270 on accommodation",
    "Best price guaranteed or we pay 2x the difference",
  ];

  const formatPrice = (price: number): string => {
    return `€${price}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ display: "flex ", justifyContent: "space-around" }}>
        <Box textAlign="start" mb={4}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="primary.main"
          >
            PRIME
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            fontWeight="bold"
          >
            FLIGHT DEALS
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Save big and visit these dream destinations!
          </Typography>
        </Box>

        <Box display={"flex"} justifyContent={"space-around"} gap={1.5}>
          <InputTextField placeholder="FlightCode" sx={{ maxWidth: "10rem" }} />
          <InputTextField
            placeholder="Passenger No"
            sx={{ maxWidth: "10rem" }}
          />
        </Box>
      </Box>

      {/* Flight Deals Grid */}
      <Grid container spacing={3} mb={6}>
        {flightDeals.map((deal) => (
          <Grid
            size={3}
            // display={"flex"}
            // justifyContent={"start"}
            key={deal.id}
          >
            <Card
              sx={{
                maxWidth: 300,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Date */}
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  21 Nov - 24 Nov
                </Typography>

                {/* Destination */}
                <Typography
                  variant="h5"
                  component="h2"
                  fontWeight="bold"
                  color="primary.main"
                  sx={{ mb: 1 }}
                >
                  Bangkok
                </Typography>

                {/* Starting at label */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Starting at
                </Typography>

                {/* Price section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  {/* Original Price */}
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      textDecoration: "line-through",
                      color: "text.secondary",
                      fontSize: "1.1rem",
                    }}
                  >
                    €190
                  </Typography>

                  {/* Prime Price */}
                  <Typography
                    variant="h4"
                    component="span"
                    fontWeight="bold"
                    color="#1976d2" // Primary blue color
                  >
                    €145
                  </Typography>

                  {/* Discount Chip */}
                  <Chip
                    label="-23%"
                    size="small"
                    color="error"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                </Box>

                {/* Prime price label */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  Prime price per passenger
                </Typography>

                {/* Optional: Add a book button */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, alignItems: "center" }}
                >
                  <FlightTakeoff color="primary" fontSize="small" />
                  <Typography
                    variant="body2"
                    color="primary"
                    fontWeight="medium"
                  >
                    Book now
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features Section */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          backgroundColor: theme.palette.grey[50],
          border: `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid size={8}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Compare and book flights, accommodation, and cars
            </Typography>
            <List dense>
              {features.map((feature, index) => (
                <ListItem key={index} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid size={4}>
            <Box
              display="flex"
              justifyContent={isMobile ? "center" : "flex-end"}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                View All Deals
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default FlightDeals;
