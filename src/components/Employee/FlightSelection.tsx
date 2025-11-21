import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { Flight } from "@mui/icons-material";
import CardGroup from "../../common/AdditionalCustomFC/CardGroup";
import TimeSelectCard from "../../common/DayPicker/TimeSelectCard";
import type { DataFlight, FlightByDay } from "../../utils/type";
import { useGetFlightAvailableDates } from "../../context/Api/useGetApi";

interface FlightOption {
  departure: string;
  arrival: string;
  code: string;
  aircraftCode: string;
  price: number;
}

const FlightSelection: React.FC<{ aircraftCode: string }> = ({
  aircraftCode,
}) => {
  const { getFlightData } = useGetFlightAvailableDates(aircraftCode);
  // Mock data
  const flightDays: FlightByDay[] = getFlightData?.list || [];
  //   { day: "Mon", date: "17 Nov", aircraftCode: 1202.5 },
  //   { day: "Tue", date: "18 Nov", price: 749.5 },
  //   { day: "Wed", date: "19 Nov", price: 748.5 },
  //   { day: "Thu", date: "20 Nov", price: 859.5 },
  //   { day: "Fri", date: "21 Nov", price: 894.5 },
  //   { day: "Sat", date: "22 Nov", price: 969.5 },
  //   { day: "Sun", date: "23 Nov", price: 969.5 },
  // ];

  const flightOptions: DataFlight[] = [
    {
      scheduledDeparture: 77727723,
      scheduledArrival: 77727723,
      departureAirport: "",
      arrivalAirport: "",
      aircraftCode: "",
    },
  ];

  const sortOptions = [
    "Recommended",
    "Departure time",
    "Arrival time",
    "Duration",
    "Fare",
  ];

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 2 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        Choose flights
      </Typography>

      {/* Passenger Information */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          2 Passenger information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The latest travel information: Stay up to date travel requirements{" "}
          <strong>Find FAQs. View more</strong>
        </Typography>
      </Paper>

      {/* Departing Flight Section */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Han to Okayama"
            />
          </Grid>
          <Grid>
            <Chip label="Modify Search" variant="outlined" />
          </Grid>
        </Grid>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Price displayed is the round trip fare per adult and includes
          taxes/fees/charges. Fares change in real time and are not final until
          payment is completed and the booking is confirmed.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          All flights are subject to aircraft changes due to operational
          requirements without notice. Cabin and seating configuration may vary
          between aircraft, including aircraft of the same type.
        </Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <CardGroup title="Featured Products" color="primary">
          {daysInMonth.map((d, i) => {
            const dayData = flightDays.find(
              (f) => Number(f.date?.split(" ")[1]) === d
            );

            return (
              <TimeSelectCard
                key={i}
                onSelect={() => console.log("Selected date:", dayData)}
                day={dayData as FlightByDay}
                // selected={selectedDay?.date === dayData?.date} // nếu muốn highlight ngày được chọn
              />
            );
          })}
        </CardGroup>
      </Paper>

      {/* Sort and Filter Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortOptions[0]} label="Sort by">
            {sortOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Chip label="Filter" variant="outlined" />
      </Box>

      {/* Flight Results */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        2 flights found
      </Typography>

      {flightOptions.map((flight, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              {/* Flight Times */}
              <Grid size={3}>
                <Typography variant="h6">{flight.departureAirport}</Typography>
                <Typography variant="body2" color="text.secondary">
                  HAN
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6">{flight.arrivalAirport}</Typography>
                <Typography variant="body2" color="text.secondary">
                  OKJ
                </Typography>
              </Grid>

              <Grid size={3}>
                <Typography variant="body2">{flight.aircraftCode}</Typography>
                <Typography variant="body2" color="text.secondary">
                  View details
                </Typography>
              </Grid>

              {/* <Grid size={3}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Flight fontSize="small" />
                  <Typography variant="body2">{flight.cabin}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Mixed Cabin
                </Typography>
              </Grid> */}

              <Grid size={3} textAlign="right">
                <Typography variant="h6" color="primary">
                  From USD{flight.priceBusiness?.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default FlightSelection;
