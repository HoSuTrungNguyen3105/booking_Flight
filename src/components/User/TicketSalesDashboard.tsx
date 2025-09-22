import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  useTheme,
  styled,
  alpha,
} from "@mui/material";
import {
  TrendingUp,
  FlightTakeoff,
  FlightLand,
  AccessTime,
  Public,
  LocalAirport,
} from "@mui/icons-material";

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0.9
  )} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
  color: "white",
  borderRadius: "16px",
  textAlign: "center",
}));

const RouteCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "12px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const BookingCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: "12px",
  border: `1px solid ${theme.palette.divider}`,
}));

// Types
interface FlightRoute {
  id: string;
  from: { city: string; airport: string };
  to: { city: string; airport: string };
  passengers: number;
  distance: string;
}

interface BookingData {
  id: string;
  airline: string;
  departure: { city: string; airport: string; time: string };
  arrival: { city: string; airport: string; time: string };
  date: string;
  duration: string;
  growth?: number;
}

// Mock data
const flightRoutes: FlightRoute[] = [
  {
    id: "1",
    from: { city: "New York", airport: "JFK" },
    to: { city: "Los Angeles", airport: "LAX" },
    passengers: 25000,
    distance: "3,945 km",
  },
  {
    id: "2",
    from: { city: "Tokyo", airport: "HND" },
    to: { city: "New York", airport: "JFK" },
    passengers: 25000,
    distance: "10,835 km",
  },
  {
    id: "3",
    from: { city: "Paris", airport: "CDG" },
    to: { city: "New York", airport: "JFK" },
    passengers: 25000,
    distance: "5,835 km",
  },
  {
    id: "4",
    from: { city: "Sydney", airport: "SYD" },
    to: { city: "Singapore", airport: "SIN" },
    passengers: 25000,
    distance: "6,300 km",
  },
  {
    id: "5",
    from: { city: "Dubai", airport: "DXB" },
    to: { city: "London", airport: "LHR" },
    passengers: 25000,
    distance: "5,500 km",
  },
];

const bookingData: BookingData[] = [
  {
    id: "1",
    airline: "SkyHigh Airlines",
    departure: { city: "New York", airport: "JFK", time: "10:00 AM" },
    arrival: { city: "Los Angeles", airport: "LAX", time: "1:00 PM" },
    date: "Jun 15, 2024",
    duration: "3 hours",
  },
  {
    id: "2",
    airline: "FlyFast Airways",
    departure: { city: "London", airport: "LHR", time: "8:00 AM" },
    arrival: { city: "New York", airport: "JFK", time: "11:00 AM" },
    date: "Jun 16, 2024",
    duration: "5 hours",
    growth: 25,
  },
  {
    id: "3",
    airline: "AeroJet",
    departure: { city: "Sydney", airport: "SYD", time: "9:00 PM" },
    arrival: { city: "Singapore", airport: "SIN", time: "5:20 AM" },
    date: "Jun 17, 2024",
    duration: "6 hours",
  },
  {
    id: "4",
    airline: "Juststream Aviation",
    departure: { city: "Dubai", airport: "DXB", time: "2:00 PM" },
    arrival: { city: "London", airport: "LHR", time: "6:20 PM" },
    date: "Jun 18, 2024",
    duration: "7 hours",
  },
];

const statsData = {
  commercialFlights: 1842,
  domestic: 1000,
  international: 842,
  totalBookings: 3456,
  ticketSales: 12500,
};

const TicketSalesDashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, bgcolor: "grey.50", minHeight: "100vh" }}>
      <Grid container spacing={3}>
        {/* Header - Ticket Sales */}
        <Grid size={12}>
          <StatCard elevation={3}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Ticket Sales
            </Typography>
            <Typography variant="h2" fontWeight="bold">
              {statsData.ticketSales.toLocaleString()}
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              Last 6 Months
            </Typography>
          </StatCard>
        </Grid>

        {/* Stats Cards */}
        <Grid size={12} sx={{ md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Commercial Flights
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {statsData.commercialFlights}
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}
            >
              <Chip
                icon={<Public />}
                label={`Domestic: ${statsData.domestic}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<FlightTakeoff />}
                label={`International: ${statsData.international}`}
                color="secondary"
                variant="outlined"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid size={12} sx={{ md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
            <Typography variant="h6" color="primary" gutterBottom>
              All Bookings
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {statsData.totalBookings.toLocaleString()}
            </Typography>
            <Chip label="See All" color="primary" sx={{ mt: 2 }} clickable />
          </Paper>
        </Grid>

        <Grid size={12} sx={{ md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Customer Growth
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="success.main">
              25%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              From last Month
            </Typography>
            <TrendingUp sx={{ fontSize: 40, color: "success.main", mt: 1 }} />
          </Paper>
        </Grid>

        {/* Top Flight Routes */}
        <Grid size={12} sx={{ md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Top Flight Routes
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: "auto" }}>
              {flightRoutes.map((route, index) => (
                <React.Fragment key={route.id}>
                  <RouteCard sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight="bold">
                            {route.from.city} ({route.from.airport}) -{" "}
                            {route.to.city} ({route.to.airport})
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {route.distance}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="h6" color="primary">
                            {route.passengers.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Passengers
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </RouteCard>
                  {index < flightRoutes.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Bookings */}
        <Grid size={12} sx={{ md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Bookings
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: "auto" }}>
              {bookingData.map((booking) => (
                <BookingCard key={booking.id}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {booking.airline}
                      </Typography>
                      {booking.growth && (
                        <Chip
                          label={`+${booking.growth}%`}
                          color="success"
                          size="small"
                          icon={<TrendingUp />}
                        />
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="body2" fontWeight="bold">
                          {booking.departure.city}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.departure.airport}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: 0.5,
                          }}
                        >
                          <FlightTakeoff fontSize="small" color="action" />
                          <Typography variant="body2">
                            {booking.departure.time}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: "center", mx: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {booking.date}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: 0.5,
                          }}
                        >
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2">
                            {booking.duration}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="body2" fontWeight="bold">
                          {booking.arrival.city}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.arrival.airport}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: 0.5,
                          }}
                        >
                          <FlightLand fontSize="small" color="action" />
                          <Typography variant="body2">
                            {booking.arrival.time}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </BookingCard>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Additional Stats */}
        <Grid size={12} sx={{ md: 6 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Last 6 Months Performance
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}
            >
              <Box>
                <LocalAirport sx={{ fontSize: 40, color: "primary.main" }} />
                <Typography variant="h4" fontWeight="bold">
                  18
                </Typography>
                <Typography variant="body2">New Routes</Typography>
              </Box>
              <Box>
                <TrendingUp sx={{ fontSize: 40, color: "success.main" }} />
                <Typography variant="h4" fontWeight="bold">
                  235
                </Typography>
                <Typography variant="body2">Growth Rate</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid size={12} sx={{ md: 6 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Revenue Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Last 6 Months
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}
            >
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  $2.5M
                </Typography>
                <Typography variant="body2">Revenue</Typography>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  +15%
                </Typography>
                <Typography variant="body2">Growth</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TicketSalesDashboard;
