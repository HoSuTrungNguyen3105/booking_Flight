import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  LinearProgress,
  Stack,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  ZAxis,
  ComposedChart,
  Area,
} from "recharts";
import type { DataFlight } from "../../../../utils/type";
import {
  useGetAllFlightIds,
  useGetFlightData,
} from "../../../../context/Api/useGetApi";
import {
  FlightTakeoff,
  Schedule,
  Cancel,
  AirlineSeatReclineNormal,
} from "@mui/icons-material";

const STATUS_COLORS: { [key: string]: string } = {
  Scheduled: "#14b8a6",
  Boarding: "#2563eb",
  Departed: "#f59e42",
  Landed: "#10b981",
  Delayed: "#ef4444",
  Cancelled: "#64748b",
};

const AIRLINE_COLORS: { [key: string]: string } = {
  VN: "#0ea5e9",
  VJ: "#f472b6",
  QH: "#a3e635",
  default: "#94a3b8",
};

const FlightStatisticsPage: React.FC = () => {
  const theme = useTheme();
  const { getFlightData, loadingFlightData } = useGetFlightData();
  const [flights, setFlights] = useState<DataFlight[]>([]);

  const { getAllFlightIds } = useGetAllFlightIds();

  useEffect(() => {
    if (getFlightData?.list) {
      setFlights(getFlightData.list as DataFlight[]);
    }
  }, [getFlightData]);

  // Thống kê tổng quan
  const stats = useMemo(() => {
    const totalFlights = flights.length;
    const delayedFlights = flights.filter((f) => f.status === "Delayed").length;
    const cancelledFlights = flights.filter(
      (f) => f.status === "Cancelled"
    ).length;
    const onTimeFlights = flights.filter(
      (f) =>
        f.status === "Scheduled" ||
        f.status === "Departed" ||
        f.status === "Landed"
    ).length;
    const boardingFlights = flights.filter(
      (f) => f.status === "Boarding"
    ).length;

    return {
      totalFlights,
      delayedFlights,
      cancelledFlights,
      onTimeFlights,
      boardingFlights,
      onTimePercentage:
        totalFlights > 0 ? (onTimeFlights / totalFlights) * 100 : 0,
    };
  }, [flights]);

  // const statusCounts = Object.keys(STATUS_COLORS)
  //   .map((status) => ({
  //     name: status,
  //     value: flights.filter((f) => f.status === status).length || 0,
  //     color: STATUS_COLORS[status],
  //   }))
  //   .filter((item) => item.value > 0);

  const airlines = [
    ...new Set(flights.map((f) => f.arrivalAirportRel?.name as string)),
  ];
  const airlineData = airlines.map((airline) => ({
    name: airline,
    value: flights.filter((f) => f.arrivalAirportRel?.name === airline).length,
    color: AIRLINE_COLORS[airline.substring(0, 2)] || AIRLINE_COLORS["default"],
  }));

  const delayScatterData = flights
    .filter((f) => f.actualDeparture && f.scheduledDeparture)
    .map((f) => {
      const scheduled = f.scheduledDeparture;
      const actual = f.actualDeparture!;
      const delayMinutes = Math.round((actual - scheduled) / (1000 * 60));
      return {
        delay: delayMinutes,
        airport: f.departureAirport,
        flightNo: f.flightNo,
        status: f.status,
        size: 8 + Math.abs(delayMinutes) / 10,
      };
    })
    .filter((item) => item.delay !== 0);

  const departureAirportCounts = getAllFlightIds?.list?.map((airport) => ({
    name: airport,
    flights: flights.filter((f) => f.departureAirport === airport.flightNo)
      .length,
  }));

  const hourlyPerformance = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map((hour) => {
      const hourFlights = flights.filter((f) => {
        const date = new Date(f.scheduledDeparture);
        return date.getHours() === hour;
      });

      const onTime = hourFlights.filter(
        (f) =>
          f.status === "Scheduled" ||
          f.status === "Departed" ||
          f.status === "Landed"
      ).length;

      return {
        hour: `${hour}:00`,
        total: hourFlights.length,
        onTime,
        onTimeRate:
          hourFlights.length > 0 ? (onTime / hourFlights.length) * 100 : 0,
      };
    });
  }, [flights]);

  if (loadingFlightData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Loading flight data...
        </Typography>
        <LinearProgress sx={{ width: "300px" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.grey[50],
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "600",
            color: theme.palette.grey[800],
            mb: 0.5,
          }}
        >
          Flight Operations Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Real-time monitoring and analytics of flight operations
        </Typography>
      </Box>

      {/* Thống kê tổng quan */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={6}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              background: `linear-gradient(135deg, ${
                theme.palette.primary.main
              } 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <FlightTakeoff sx={{ mr: 1, fontSize: "1.2rem" }} />
                <Typography variant="body2" fontWeight="500">
                  TOTAL FLIGHTS
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "600" }}>
                {stats.totalFlights}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Today's scheduled flights
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={6}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              background: `linear-gradient(135deg, ${
                theme.palette.success.main
              } 0%, ${alpha(theme.palette.success.main, 0.8)} 100%)`,
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Schedule sx={{ mr: 1, fontSize: "1.2rem" }} />
                <Typography variant="body2" fontWeight="500">
                  ON TIME
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "600" }}>
                {stats.onTimeFlights}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <Typography variant="caption" sx={{ opacity: 0.9, mr: 1 }}>
                  {stats.onTimePercentage.toFixed(1)}% on-time rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={6}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              background: `linear-gradient(135deg, ${
                theme.palette.warning.main
              } 0%, ${alpha(theme.palette.warning.main, 0.8)} 100%)`,
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AirlineSeatReclineNormal sx={{ mr: 1, fontSize: "1.2rem" }} />
                <Typography variant="body2" fontWeight="500">
                  DELAYED
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "600" }}>
                {stats.delayedFlights}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {stats.totalFlights > 0
                  ? ((stats.delayedFlights / stats.totalFlights) * 100).toFixed(
                      1
                    )
                  : 0}
                % of flights
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={6}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              background: `linear-gradient(135deg, ${
                theme.palette.error.main
              } 0%, ${alpha(theme.palette.error.main, 0.8)} 100%)`,
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Cancel sx={{ mr: 1, fontSize: "1.2rem" }} />
                <Typography variant="body2" fontWeight="500">
                  CANCELLED
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: "600" }}>
                {stats.cancelledFlights}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {stats.totalFlights > 0
                  ? (
                      (stats.cancelledFlights / stats.totalFlights) *
                      100
                    ).toFixed(1)
                  : 0}
                % of flights
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={6}>
          <Paper
            sx={{
              p: 3,
              height: 400,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "600", color: theme.palette.grey[800] }}
            >
              Flights by Airline
            </Typography>
            <Stack>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={airlineData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name}: ${((percent as number) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {airlineData.map((entry, index) => (
                      <Cell
                        key={`cell-airline-${index}`}
                        fill={entry.color}
                        stroke={theme.palette.background.paper}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      `${name}: ${(
                        (Number(value) / stats.totalFlights) *
                        100
                      ).toFixed(1)}%`,
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <Box
                        component="span"
                        sx={{
                          color: theme.palette.text.primary,
                          fontSize: "0.75rem",
                        }}
                      >
                        {value}
                      </Box>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Stack>
          </Paper>
        </Grid>

        {/* Phân tích độ trễ */}
        <Grid size={6}>
          <Paper
            sx={{
              p: 3,
              height: 400,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "600", color: theme.palette.grey[800] }}
            >
              Departure Delay Analysis (minutes)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.palette.grey[300]}
                />
                <XAxis
                  type="number"
                  dataKey="delay"
                  name="Delay (min)"
                  domain={["auto", "auto"]}
                  tickCount={8}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={{ stroke: theme.palette.grey[400] }}
                />
                <YAxis
                  type="category"
                  dataKey="airport"
                  name="Departure Airport"
                  allowDuplicatedCategory={false}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={{ stroke: theme.palette.grey[400] }}
                />
                <ZAxis
                  type="number"
                  dataKey="size"
                  range={[50, 300]}
                  name="Size"
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [
                    value,
                    name === "delay"
                      ? "Delay (min)"
                      : name === "airport"
                      ? "Airport"
                      : "Size",
                  ]}
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.grey[300]}`,
                    borderRadius: 4,
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <Box
                      component="span"
                      sx={{
                        color: theme.palette.text.primary,
                        fontSize: "0.75rem",
                      }}
                    >
                      {value}
                    </Box>
                  )}
                />
                <Scatter
                  name="Flights"
                  data={delayScatterData}
                  fill={theme.palette.primary.main}
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Số chuyến theo sân bay */}
        <Grid size={4}>
          <Paper
            sx={{
              p: 3,
              height: 400,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "600", color: theme.palette.grey[800] }}
            >
              Flights by Departure Airport
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={departureAirportCounts}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.palette.grey[300]}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={{ stroke: theme.palette.grey[400] }}
                />
                <YAxis
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={{ stroke: theme.palette.grey[400] }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.grey[300]}`,
                    borderRadius: 4,
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <Box
                      component="span"
                      sx={{
                        color: theme.palette.text.primary,
                        fontSize: "0.75rem",
                      }}
                    >
                      {value}
                    </Box>
                  )}
                />
                <Bar
                  dataKey="flights"
                  name="Number of Flights"
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Performance by hour */}
        <Grid size={12}>
          <Paper
            sx={{
              p: 3,
              height: 400,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "600", color: theme.palette.grey[800] }}
            >
              Flight Performance by Hour
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <ComposedChart data={hourlyPerformance}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.palette.grey[300]}
                />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={{ stroke: theme.palette.grey[400] }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={{ stroke: theme.palette.grey[400] }}
                  label={{
                    value: "Number of Flights",
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      textAnchor: "middle",
                      fill: theme.palette.text.primary,
                    },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={{ stroke: theme.palette.grey[400] }}
                  label={{
                    value: "On-Time Rate (%)",
                    angle: 90,
                    position: "insideRight",
                    style: {
                      textAnchor: "middle",
                      fill: theme.palette.text.primary,
                    },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.grey[300]}`,
                    borderRadius: 4,
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <Box
                      component="span"
                      sx={{
                        color: theme.palette.text.primary,
                        fontSize: "0.75rem",
                      }}
                    >
                      {value}
                    </Box>
                  )}
                />
                <Bar
                  yAxisId="left"
                  dataKey="total"
                  name="Total Flights"
                  fill={alpha(theme.palette.primary.main, 0.6)}
                  radius={[4, 4, 0, 0]}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="onTimeRate"
                  name="On-Time Rate (%)"
                  stroke={theme.palette.success.main}
                  fill={alpha(theme.palette.success.main, 0.3)}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FlightStatisticsPage;
