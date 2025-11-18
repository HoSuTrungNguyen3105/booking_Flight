import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

// Types
interface FlightRoute {
  route: string;
  passengers: string;
  distance: string;
}

interface StatItem {
  label: string;
  value: string;
  trend: "up" | "down";
  percentage: string;
  period: string;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  bookingId: string;
  route: string;
  airline: string;
  time: string;
}

// Main Component
const FlightScheduleDashboard: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Data
  const stats: StatItem[] = [
    {
      label: "Completed Flights",
      value: "1.325",
      trend: "up",
      percentage: "6.9%",
      period: "This Week",
    },
    {
      label: "Active Flights",
      value: "772",
      trend: "down",
      percentage: "6.9%",
      period: "This Week",
    },
    {
      label: "Canceled Flights",
      value: "243",
      trend: "up",
      percentage: "6.9%",
      period: "This Week",
    },
    {
      label: "Total Revenue",
      value: "$111.325",
      trend: "down",
      percentage: "6.9%",
      period: "This Week",
    },
  ];

  const flightRoutes: FlightRoute[] = [
    {
      route: "New York (JFK) to London (LHR)",
      passengers: "3,200,000 annually",
      distance: "5,555 km",
    },
    {
      route: "Los Angeles (LAX) to Tokyo (NRT)",
      passengers: "2,500,000 annually",
      distance: "8,775 km",
    },
    {
      route: "Sydney (SYD) to Singapore (SIN)",
      passengers: "1,800,000 annually",
      distance: "6,300 km",
    },
    {
      route: "Dubai (DXB) to London (LHR)",
      passengers: "2,200,000 annually",
      distance: "5,510 km",
    },
    {
      route: "Paris (CDG) to New York (JFK)",
      passengers: "2,900,000 annually",
      distance: "5,850 km",
    },
  ];

  const activities: Activity[] = [
    {
      id: "1",
      user: "Giorgia Romano",
      action: "registered a new user and created a booking",
      bookingId: "L07890",
      route: "CDG to NYC",
      airline: "SkyHigh Airways",
      time: "OS:20 PM",
    },
    {
      id: "2",
      user: "Mateo Martinez",
      action: "updated flight schedule for Booking ID EF9012",
      bookingId: "EF9012",
      route: "SVD to SIN",
      airline: "Oceanic Airways",
      time: "has been reached last year",
    },
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Flights Schedule
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Domestic" />
          <Tab label="International" />
          <Tab label="Choose Date" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Section */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Statistics
              </Typography>

              {/* Days Table */}
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 2 }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      {days.map((day) => (
                        <TableCell key={day} align="center">
                          <Typography variant="subtitle2" fontWeight="bold">
                            {day}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Placeholder for actual data rows */}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Stats Cards */}
              <Grid container spacing={2}>
                {stats.map((stat, index) => (
                  <Grid size={6} key={stat.label}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {stat.label}
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {stat.value}
                          </Typography>
                        </Box>
                        <Chip
                          icon={
                            stat.trend === "up" ? (
                              <TrendingUp />
                            ) : (
                              <TrendingDown />
                            )
                          }
                          label={`${stat.trend === "up" ? "↑" : "↓"} ${
                            stat.percentage
                          }`}
                          color={stat.trend === "up" ? "success" : "error"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {stat.period}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Flight Routes */}
        <Grid size={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Top Flight Routes
              </Typography>

              <List dense>
                {flightRoutes.map((route, index) => (
                  <React.Fragment key={route.route}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight="bold">
                            {route.route}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.primary">
                              {route.passengers}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Distance: {route.distance}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < flightRoutes.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Ticket Sales */}
        <Grid size={6}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Ticket Sales
                </Typography>
                <Chip
                  icon={<TrendingUp />}
                  label="8,303 ↑ 6.9%"
                  color="success"
                  size="small"
                />
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Year 2026
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                sx={{ mt: 2 }}
              >
                Recent Activity
              </Typography>

              <List dense>
                {activities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            <strong>{activity.user}</strong> {activity.action}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.primary">
                              Booking ID {activity.bookingId} for{" "}
                              {activity.route} with {activity.airline}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {activity.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FlightScheduleDashboard;
