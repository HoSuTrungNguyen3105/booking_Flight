import { useState } from "react";
import { Box, Typography, Paper, Grid, Card, CardContent } from "@mui/material";
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
} from "recharts";
import type { DataFlight } from "../../utils/type";
import theme from "../../scss/theme";

// Màu sắc cho các trạng thái chuyến bay
const STATUS_COLORS: { [key: string]: string } = {
  Scheduled: "#14b8a6", // Teal - Đúng giờ/Theo lịch trình
  Boarding: "#2563eb", // Blue - Đang lên máy bay
  Departed: "#f59e42", // Amber - Đã cất cánh
  Landed: "#10b981", // Emerald - Đã hạ cánh
  Delayed: "#ef4444", // Red - Bị hoãn
  Cancelled: "#64748b", // Slate - Đã hủy
};

// Màu sắc cho các hãng bay (có thể mở rộng)
const AIRLINE_COLORS: { [key: string]: string } = {
  VN: "#0ea5e9", // Vietnam Airlines
  VJ: "#f472b6", // VietJet Air
  QH: "#a3e635", // Bamboo Airways
  default: "#94a3b8", // Màu mặc định cho các hãng chưa định nghĩa
};

// Danh sách các sân bay chính (dùng cho trục Y)
const MAJOR_AIRPORTS = ["SGN", "HAN", "DAD", "CXR", "PQC", "VDO", "VCA", "DLI"];

// Dữ liệu mẫu phù hợp với interface DataFlight
const sampleFlights: DataFlight[] = [
  {
    flightId: 1,
    flightNo: "VN123",
    airline: "Vietnam Airlines",
    departureAirport: "SGN",
    arrivalAirport: "HAN",
    origin: "Ho Chi Minh City",
    destination: "Hanoi",
    status: "Departed",
    aircraftCode: "A321",
    scheduledDeparture: new Date("2024-05-01T08:00:00Z").getTime(),
    scheduledArrival: new Date("2024-05-01T10:00:00Z").getTime(),
    actualDeparture: new Date("2024-05-01T08:15:00Z").getTime(),
    actualArrival: new Date("2024-05-01T10:15:00Z").getTime(),
    delayMinutes: 15,
    priceEconomy: 1500000,
    priceBusiness: 3000000,
    maxCapacity: 180,
    terminal: "T2",
    gateId: "G5",
  },
  {
    flightId: 2,
    flightNo: "VJ456",
    airline: "VietJet Air",
    departureAirport: "HAN",
    arrivalAirport: "CXR",
    origin: "Hanoi",
    destination: "Cam Ranh",
    status: "Scheduled",
    aircraftCode: "A320",
    scheduledDeparture: new Date("2024-05-01T09:30:00Z").getTime(),
    scheduledArrival: new Date("2024-05-01T11:30:00Z").getTime(),
    actualDeparture: null,
    actualArrival: null,
    delayMinutes: null,
    priceEconomy: 800000,
    priceBusiness: 1600000,
    maxCapacity: 186,
    terminal: "T1",
    gateId: "G12",
  },
  {
    flightId: 3,
    flightNo: "QH789",
    airline: "Bamboo Airways",
    departureAirport: "DAD",
    arrivalAirport: "SGN",
    origin: "Da Nang",
    destination: "Ho Chi Minh City",
    status: "Delayed",
    aircraftCode: "B787",
    scheduledDeparture: new Date("2024-05-01T10:15:00Z").getTime(),
    scheduledArrival: new Date("2024-05-01T11:45:00Z").getTime(),
    actualDeparture: new Date("2024-05-01T11:45:00Z").getTime(),
    actualArrival: new Date("2024-05-01T13:15:00Z").getTime(),
    delayMinutes: 90,
    delayReason: "Technical issues",
    priceEconomy: 1200000,
    priceBusiness: 2500000,
    maxCapacity: 294,
    terminal: "T2",
    gateId: "G8",
  },
  {
    flightId: 4,
    flightNo: "VN101",
    airline: "Vietnam Airlines",
    departureAirport: "SGN",
    arrivalAirport: "DAD",
    origin: "Ho Chi Minh City",
    destination: "Da Nang",
    status: "Boarding",
    aircraftCode: "A321",
    scheduledDeparture: new Date("2024-05-01T11:05:00Z").getTime(),
    scheduledArrival: new Date("2024-05-01T12:25:00Z").getTime(),
    actualDeparture: new Date("2024-05-01T11:05:00Z").getTime(),
    actualArrival: null,
    delayMinutes: 0,
    priceEconomy: 1300000,
    priceBusiness: 2600000,
    maxCapacity: 180,
    terminal: "T2",
    gateId: "G3",
  },
  {
    flightId: 5,
    flightNo: "VJ202",
    airline: "VietJet Air",
    departureAirport: "HAN",
    arrivalAirport: "PQC",
    origin: "Hanoi",
    destination: "Phu Quoc",
    status: "Cancelled",
    aircraftCode: "A320",
    scheduledDeparture: new Date("2024-05-01T12:40:00Z").getTime(),
    scheduledArrival: new Date("2024-05-01T14:40:00Z").getTime(),
    actualDeparture: null,
    actualArrival: null,
    isCancelled: true,
    cancellationReason: "Bad weather conditions",
    priceEconomy: 900000,
    priceBusiness: 1800000,
    maxCapacity: 186,
    terminal: "T1",
    gateId: "G7",
  },
  {
    flightId: 6,
    flightNo: "VN999",
    airline: "Vietnam Airlines",
    departureAirport: "SGN",
    arrivalAirport: "DLI",
    origin: "Ho Chi Minh City",
    destination: "Dalat",
    status: "Landed",
    aircraftCode: "ATR72",
    scheduledDeparture: new Date("2024-05-01T07:20:00Z").getTime(),
    scheduledArrival: new Date("2024-05-01T08:20:00Z").getTime(),
    actualDeparture: new Date("2024-05-01T07:20:00Z").getTime(),
    actualArrival: new Date("2024-05-01T08:15:00Z").getTime(),
    delayMinutes: -5,
    priceEconomy: 1000000,
    priceBusiness: 2000000,
    maxCapacity: 70,
    terminal: "T2",
    gateId: "G1",
  },
  {
    flightId: 7,
    flightNo: "VJ777",
    airline: "VietJet Air",
    departureAirport: "CXR",
    arrivalAirport: "SGN",
    origin: "Cam Ranh",
    destination: "Ho Chi Minh City",
    status: "Departed",
    aircraftCode: "A321",
    scheduledDeparture: new Date("2024-05-01T13:10:00Z").getTime(),
    scheduledArrival: new Date("2024-05-01T14:40:00Z").getTime(),
    actualDeparture: new Date("2024-05-01T13:25:00Z").getTime(),
    actualArrival: new Date("2024-05-01T14:55:00Z").getTime(),
    delayMinutes: 15,
    priceEconomy: 850000,
    priceBusiness: 1700000,
    maxCapacity: 220,
    terminal: "T1",
    gateId: "G9",
  },
  {
    flightId: 8,
    flightNo: "QH505",
    airline: "Bamboo Airways",
    departureAirport: "VCA",
    arrivalAirport: "HAN",
    origin: "Can Tho",
    destination: "Hanoi",
    status: "Scheduled",
    aircraftCode: "E190",
    scheduledDeparture: new Date("2024-05-01T14:00:00Z").getTime(),
    scheduledArrival: new Date("2024-05-01T16:00:00Z").getTime(),
    actualDeparture: null,
    actualArrival: null,
    delayMinutes: null,
    priceEconomy: 1100000,
    priceBusiness: 2200000,
    maxCapacity: 114,
    terminal: "T2",
    gateId: "G6",
  },
  {
    flightId: 9,
    flightNo: "VN888",
    airline: "Vietnam Airlines",
    departureAirport: "HAN",
    arrivalAirport: "VDO",
    origin: "Hanoi",
    destination: "Van Don",
    status: "Landed",
    aircraftCode: "A320",
    scheduledDeparture: new Date("2024-05-01T15:30:00Z").getTime(),
    scheduledArrival: new Date("2024-05-01T16:30:00Z").getTime(),
    actualDeparture: new Date("2024-05-01T15:30:00Z").getTime(),
    actualArrival: new Date("2024-05-01T16:25:00Z").getTime(),
    delayMinutes: -5,
    priceEconomy: 950000,
    priceBusiness: 1900000,
    maxCapacity: 180,
    terminal: "T2",
    gateId: "G4",
  },
  {
    flightId: 10,
    flightNo: "VJ303",
    airline: "VietJet Air",
    departureAirport: "DAD",
    arrivalAirport: "VCA",
    origin: "Da Nang",
    destination: "Can Tho",
    status: "Delayed",
    aircraftCode: "A320",
    scheduledDeparture: new Date("2024-05-01T16:45:00Z").getTime(),
    scheduledArrival: new Date("2024-05-01T18:15:00Z").getTime(),
    actualDeparture: new Date("2024-05-01T17:30:00Z").getTime(),
    actualArrival: new Date("2024-05-01T19:00:00Z").getTime(),
    delayMinutes: 45,
    delayReason: "Air traffic congestion",
    priceEconomy: 750000,
    priceBusiness: 1500000,
    maxCapacity: 186,
    terminal: "T1",
    gateId: "G11",
  },
];

const FlightStatisticsPage: React.FC = () => {
  const [flights] = useState<DataFlight[]>(sampleFlights);

  // Thống kê tổng quan
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

  // 1. Dữ liệu cho biểu đồ tròn: Phân bố trạng thái chuyến bay
  const statusCounts = Object.keys(STATUS_COLORS)
    .map((status) => ({
      name: status,
      value: flights.filter((f) => f.status === status).length || 0,
    }))
    .filter((item) => item.value > 0);

  // 2. Dữ liệu cho biểu đồ tròn: Phân bố theo hãng hàng không
  const airlines = [...new Set(flights.map((f) => f.airline))];
  const airlineData = airlines.map((airline) => ({
    name: airline,
    value: flights.filter((f) => f.airline === airline).length,
  }));

  // 3. Dữ liệu cho biểu đồ scatter: Thời gian khởi hành thực tế so với lịch trình (Độ trễ)
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
      };
    })
    .filter((item) => item.delay !== 0);

  // 4. Dữ liệu cho biểu đồ cột: Số chuyến bay theo sân bay khởi hành
  const departureAirportCounts = MAJOR_AIRPORTS.map((airport) => ({
    name: airport,
    flights: flights.filter((f) => f.departureAirport === airport).length,
  }));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: "8px", fontWeight: "bold", color: "primary.main" }}
      >
        Flight Operations Dashboard
      </Typography>

      {/* Thống kê tổng quan */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={3}>
          <Card sx={{ bgcolor: "primary.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Total Flights</Typography>
              <Typography variant="h4">{totalFlights}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={3}>
          <Card sx={{ bgcolor: "success.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6">On Time</Typography>
              <Typography variant="h4">{onTimeFlights}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={3}>
          {" "}
          <Card sx={{ bgcolor: "warning.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Delayed</Typography>
              <Typography variant="h4">{delayedFlights}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={3}>
          {" "}
          <Card sx={{ bgcolor: "error.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6">Cancelled</Typography>
              <Typography variant="h4">{cancelledFlights}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Phân bố trạng thái */}
        <Grid size={6}>
          {" "}
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Flight Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name}: ${((percent as number) * 100).toFixed(0)}%`
                  }
                >
                  {statusCounts.map((entry, index) => (
                    <Cell
                      key={`cell-status-${index}`}
                      fill={STATUS_COLORS[entry.name]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Phân bố hãng bay */}
        <Grid size={6}>
          {" "}
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Flights by Airline
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
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
                >
                  {airlineData.map((entry, index) => (
                    <Cell
                      key={`cell-airline-${index}`}
                      fill={
                        AIRLINE_COLORS[entry.name.substring(0, 2)] ||
                        AIRLINE_COLORS["default"]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Phân tích độ trễ */}
        <Grid size={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Departure Delay Analysis (minutes)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
              >
                <CartesianGrid />
                <XAxis
                  type="number"
                  dataKey="delay"
                  name="Delay (min)"
                  domain={["dataMin - 5", "dataMax + 5"]}
                  tickCount={10}
                />
                <YAxis
                  type="category"
                  dataKey="airport"
                  name="Departure Airport"
                  allowDuplicatedCategory={false}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [
                    value,
                    name === "delay" ? "Delay (min)" : "Airport",
                  ]}
                />
                <Legend />
                <Scatter
                  name="Flights"
                  data={delayScatterData}
                  fill="#8884d8"
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Số chuyến theo sân bay */}
        <Grid size={4}>
          {" "}
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Flights by Departure Airport
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={departureAirportCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="flights"
                  name="Number of Flights"
                  fill="#0ea5e9"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FlightStatisticsPage;
