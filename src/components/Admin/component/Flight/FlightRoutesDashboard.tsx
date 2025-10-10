import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  styled,
  alpha,
} from "@mui/material";
import { TrendingUp, FlightTakeoff, FlightLand } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import TabPanel, {
  type ITabItem,
} from "../../../../common/CustomRender/TabPanel";
import theme from "../../../../scss/theme";

// Styled components
const RouteCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "12px",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  },
}));

const StatBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: "12px",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}));

// Types
interface FlightRoute {
  id: string;
  from: { city: string; airport: string };
  to: { city: string; airport: string };
  revenue: number;
  distance: string;
  passengers: number;
  growth?: number;
}

interface ChartData {
  month: string;
  domestic: number;
  international: number;
}

// Mock data
const flightRoutes: FlightRoute[] = [
  {
    id: "1",
    from: { city: "New York", airport: "JFK" },
    to: { city: "Los Angeles", airport: "LAX" },
    revenue: 2500000,
    distance: "3,945 km",
    passengers: 12500,
    growth: 15,
  },
  {
    id: "2",
    from: { city: "London", airport: "LHR" },
    to: { city: "New York", airport: "JFK" },
    revenue: 2200000,
    distance: "5,570 km",
    passengers: 9800,
    growth: 12,
  },
  {
    id: "3",
    from: { city: "Tokyo", airport: "HND" },
    to: { city: "San Francisco", airport: "SFO" },
    revenue: 1800000,
    distance: "8,700 km",
    passengers: 8500,
    growth: 8,
  },
  {
    id: "4",
    from: { city: "Sydney", airport: "SYD" },
    to: { city: "Singapore", airport: "SIN" },
    revenue: 1500000,
    distance: "6,300 km",
    passengers: 7200,
    growth: 18,
  },
  {
    id: "5",
    from: { city: "Dubai", airport: "DXB" },
    to: { city: "London", airport: "LHR" },
    revenue: 1900000,
    distance: "5,500 km",
    passengers: 8900,
    growth: 10,
  },
];

const chartData: ChartData[] = [
  { month: "Jan", domestic: 120, international: 80 },
  { month: "Feb", domestic: 150, international: 95 },
  { month: "Mar", domestic: 180, international: 110 },
  { month: "Apr", domestic: 210, international: 130 },
  { month: "May", domestic: 190, international: 140 },
  { month: "Jun", domestic: 220, international: 160 },
  { month: "Jul", domestic: 250, international: 180 },
  { month: "Aug", domestic: 230, international: 170 },
  { month: "Sep", domestic: 260, international: 190 },
  { month: "Oct", domestic: 280, international: 210 },
  { month: "Nov", domestic: 300, international: 230 },
  { month: "Dec", domestic: 320, international: 250 },
];

const FlightRoutesDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };

  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" fontWeight="bold">
            {label}
          </Typography>
          <Typography variant="body2" color="primary">
            Domestic: {payload[0].value}
          </Typography>
          <Typography variant="body2" color="secondary">
            International: {payload[1].value}
          </Typography>
        </Paper>
      );
    } else return null;
  };

  const tabs: ITabItem[] = [
    { label: "International", value: "International" },
    { label: "Domestic", value: "Domestic" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Flight Analytics Dashboard
          </Typography>
        </Grid>
        <Grid size={6} sx={{ md: 6 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Top Flight Routes
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Most profitable routes by revenue
            </Typography>

            <Box sx={{ mt: 2, maxHeight: 400, overflow: "auto" }}>
              {flightRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  sx={{ mb: 2 }}
                  onClick={() => setSelectedRoute(route.id)}
                  elevation={selectedRoute === route.id ? 3 : 0}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {route.from.city} ({route.from.airport}) →{" "}
                          {route.to.city} ({route.to.airport})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Distance: {route.distance}
                        </Typography>
                      </Box>
                      {route.growth && (
                        <Chip
                          label={`+${route.growth}%`}
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
                        mt: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight="bold"
                        >
                          {formatRevenue(route.revenue)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Revenue
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" fontWeight="bold">
                          {route.passengers.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Passengers
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <FlightTakeoff fontSize="small" color="action" />
                      <Box
                        sx={{
                          flex: 1,
                          height: 4,
                          bgcolor: "grey.200",
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${(route.passengers / 15000) * 100}%`,
                            height: "100%",
                            bgcolor: "primary.main",
                            borderRadius: 2,
                          }}
                        />
                      </Box>
                      <FlightLand fontSize="small" color="action" />
                    </Box>
                  </CardContent>
                </RouteCard>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid size={6} sx={{ md: 6 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Flights Schedule
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last 12 Months Performance
                </Typography>
              </Box>

              <TabPanel
                tabs={tabs}
                activeTab={tabValue}
                onChangeTab={handleTabChange}
              />
            </Box>
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.palette.divider}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                  />
                  <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="domestic"
                    name="Domestic Flights"
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="international"
                    name="International Flights"
                    fill={theme.palette.secondary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={6}>
                <StatBox>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {chartData.reduce((sum, data) => sum + data.domestic, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Domestic
                    </Typography>
                  </Box>
                </StatBox>
              </Grid>
              <Grid size={6}>
                <StatBox>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="secondary"
                    >
                      {chartData.reduce(
                        (sum, data) => sum + data.international,
                        0
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total International
                    </Typography>
                  </Box>
                </StatBox>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid size={3} sx={{ md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Total Revenue
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {formatRevenue(
                flightRoutes.reduce((sum, route) => sum + route.revenue, 0)
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              From all routes
            </Typography>
          </Paper>
        </Grid>

        <Grid size={3} sx={{ md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Total Passengers
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="secondary">
              {flightRoutes
                .reduce((sum, route) => sum + route.passengers, 0)
                .toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Across all routes
            </Typography>
          </Paper>
        </Grid>

        <Grid size={4} sx={{ md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Average Growth
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              +
              {Math.round(
                flightRoutes.reduce(
                  (sum, route) => sum + (route.growth || 0),
                  0
                ) / flightRoutes.length
              )}
              %
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monthly average
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FlightRoutesDashboard;
