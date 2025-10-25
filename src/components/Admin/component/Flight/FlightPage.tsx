import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { useState } from "react";
import type { DataFlight } from "../../../../utils/type";
import { DateFormatEnum, formatDate } from "../../../../hooks/format";
import { useFlightList } from "../../../../context/Api/useGetApi";
import SeatManager from "../Seat/SeatManager";
const FlightPage = () => {
  const { flightList } = useFlightList();
  const [selectedFlight, setSelectedFlight] = useState<DataFlight | null>(null);
  const [message, setMessage] = useState("");

  const handleSelectFlight = (flight: DataFlight) => {
    setSelectedFlight(flight);
    setMessage("");
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Available Flights {selectedFlight?.flightNo}
      </Typography>

      <SeatManager flightList={flightList?.list as DataFlight[]} />

      <Grid container spacing={2}>
        {flightList?.list?.map((flight) => (
          <Grid size={4} key={flight.flightId} p={"8px"}>
            <Card
              onClick={() => handleSelectFlight(flight)}
              sx={{
                borderRadius: 2,
                boxShadow: 2,
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  boxShadow: 5,
                },
              }}
            >
              {/* <CardMedia
                component="img"
                height="180"
                image={ImageFlight}
                alt={"img"}
              /> */}
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Flight {flight.flightNo}
                </Typography>
                <Box display={"flex"} justifyContent={"space-around"}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {flight.departureAirportRel?.city} ➝{" "}
                      {flight.arrivalAirportRel?.city}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      Departure:{" "}
                      {formatDate(
                        DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                        flight.scheduledDeparture
                      )}
                    </Typography>
                    <Typography variant="body2">
                      Arrival:{" "}
                      {formatDate(
                        DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                        flight.scheduledArrival
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={"bold"} mt={1}>
                      ${flight.priceEconomy ?? 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {message && (
        <Typography mt={3} color="error">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default FlightPage;
