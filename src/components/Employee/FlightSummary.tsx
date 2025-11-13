import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import { MapPin } from "lucide-react";
import type { DataFlight } from "../../utils/type";

// interface FlightInfo {
//   route: string;
//   date: string;
//   time: string;
//   duration: string;
//   stops: string;
// }

interface FlightSummaryProps {
  outbound: DataFlight;
  returnFlight: DataFlight;
}

const FlightSummary: React.FC<FlightSummaryProps> = ({
  outbound,
  returnFlight,
}) => {
  return (
    <Paper elevation={3} sx={{ maxWidth: 800, margin: "auto", p: 3 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        TRIPIFY
      </Typography>

      {/* Flight Summary Section */}
      <Typography variant="h6" component="h2" gutterBottom>
        Flight summary
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableBody>
            {/* Outbound Flight */}
            <TableRow>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Outbound
              </TableCell>
              <TableCell>
                {outbound.departureAirport} - {outbound.arrivalAirport}
              </TableCell>
              {/* <TableCell>{outbound._count}</TableCell> */}
              {/* <TableCell>{outbound.time}</TableCell>
              <TableCell>{outbound.duration}</TableCell> */}
            </TableRow>
            {/* Return Flight */}
            <TableRow>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                Return
              </TableCell>
              {/* <TableCell>{returnFlight.route}</TableCell>
              <TableCell>{returnFlight.date}</TableCell>
              <TableCell>{returnFlight.time}</TableCell>
              <TableCell>{returnFlight.duration}</TableCell> */}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 3 }} />

      {/* View Seats Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <MapPin size={20} style={{ marginRight: 8 }} />
        <Typography variant="body1">
          View a map of the plane and choose from the available seats
        </Typography>
      </Box>

      {/* Continue Button */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{ mb: 3, py: 1.5 }}
      >
        CONTINUE TO PASSENGER INFO
      </Button>

      {/* Flight Total Section */}
      <Box sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Flight Total
        </Typography>
        <Stack spacing={1}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Adult x 1</Typography>
            <Typography variant="body2">-</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Base fare x 1</Typography>
            <Typography variant="body2">-</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Tax x 1</Typography>
            <Typography variant="body2">-</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Total Airfare</Typography>
            <Typography variant="body2">-</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">Discount</Typography>
            <Typography variant="body2">-</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1" fontWeight="bold">
              Total payable
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              -
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

// Example usage with sample data
const FlightSummaryRef: React.FC = () => {
  const sampleData: FlightSummaryProps = {
    outbound: {
      departureAirport: "JFK",
      arrivalAirport: "LAX",
      flightId: 123,
      // date: 'Mon, Mar 20',
      aircraftCode: "A320",
      scheduledDeparture: 0,
      scheduledArrival: 0,
    },
    returnFlight: {
      departureAirport: "JFK",
      arrivalAirport: "LAX",
      flightId: 123,
      // date: 'Mon, Mar 20',
      aircraftCode: "A320",
      scheduledDeparture: 0,
      scheduledArrival: 0,
      // route: 'DXB → DAC',
      // date: 'Thu, Mar 23',
      // time: '5:55 PM - 11:52 PM',
      // duration: '6h 57m',
      // stops: '2 Stop',
    },
  };

  return <FlightSummary {...sampleData} />;
};

export default FlightSummaryRef;
