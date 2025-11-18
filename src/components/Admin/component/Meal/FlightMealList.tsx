import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Divider,
  Stack,
  Avatar,
} from "@mui/material";
import type { FlightMeal } from "../../../../utils/type";
import { useGetMealByFlightId } from "../../../../context/Api/useGetApi";

interface Props {
  meals: FlightMeal[];
}

export default function FlightMealList() {
  //   if (!meals || meals.length === 0) {
  //     return (
  //       <Typography textAlign="center" mt={4} color="text.secondary">
  //         Không có meal nào áp dụng cho chuyến bay này.
  //       </Typography>
  //     );
  //   }

  const { getGetMealByFlightId } = useGetMealByFlightId(71);

  const flightMeals = getGetMealByFlightId?.list || [];
  const flight = flightMeals.length > 0 ? flightMeals[0].flight : null;

  if (!flight) return;

  return (
    <Box>
      {/* FLIGHT HEADER */}
      <Paper
        elevation={2}
        sx={{ p: 3, borderRadius: 3, mb: 3, bgcolor: "#f6f9ff" }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Flight {flight.flightNo}
        </Typography>

        <Stack direction="row" spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Departure
            </Typography>
            <Typography fontWeight={600}>{flight.departureAirport}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Arrival
            </Typography>
            <Typography fontWeight={600}>{flight.arrivalAirport}</Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Aircraft
            </Typography>
            <Typography fontWeight={600}>{flight.aircraftCode}</Typography>
          </Box>

          <Chip
            label={flight?.flightType?.toUpperCase()}
            color="primary"
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Paper>

      {/* MEAL LIST */}
      <Grid container spacing={2}>
        {flightMeals.map((item) => (
          <Grid size={6} key={item.id}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {/* Meal Header */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "#1976d2", width: 48, height: 48 }}>
                  🍽️
                </Avatar>

                <Box>
                  <Typography fontWeight={700}>{item.meal.name}</Typography>
                  <Chip
                    size="small"
                    label={item.meal.mealType}
                    color="secondary"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Stack>

              <Typography color="text.secondary" fontSize={14}>
                {item.meal.description}
              </Typography>

              <Divider />

              {/* Details */}
              <Box>
                <Typography variant="body2">
                  <strong>Meal Code:</strong> {item.meal.mealCode}
                </Typography>

                <Typography variant="body2">
                  <strong>Base Price:</strong>{" "}
                  {item.meal.price.toLocaleString()}đ
                </Typography>

                <Typography variant="body2">
                  <strong>Quantity:</strong> {item.quantity}
                </Typography>

                <Typography variant="body2">
                  <strong>Total:</strong>{" "}
                  {(item.quantity * item.meal.price).toLocaleString()}đ
                </Typography>

                <Chip
                  label={item.meal.isAvailable ? "Available" : "Unavailable"}
                  color={item.meal.isAvailable ? "success" : "error"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
