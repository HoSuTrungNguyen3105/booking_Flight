import { Box, Button, Paper, Typography, Container } from "@mui/material";
import { memo, useCallback } from "react";
import type { DataFlight } from "../../../../utils/type";
import DetailSection from "../../../../common/AdditionalCustomFC/DetailSection.tsx";
import { useFlightManagement } from "./hooks/useFlightManagement.tsx";

export interface FlightDetailPageProps {
  flight?: DataFlight;
  onBookFlight?: (flightId: number) => void;
}

const FlightDetailPage = ({ flight, onBookFlight }: FlightDetailPageProps) => {
  const management = useFlightManagement({ flight, onBookFlight });

  if (typeof management === "string") return <div>{management}</div>;

  const {
    priceData,
    handleBookFlight,
    handleGoBack,
    scheduleData,
    airportData,
  } = management;

  const renderContent = useCallback(() => {
    if (!flight) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Flight not found
          </Typography>
          <Button variant="contained" onClick={handleGoBack} sx={{ mt: 2 }}>
            Go Back
          </Button>
        </Box>
      );
    }

    return (
      <>
        <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h4" gutterBottom color="primary">
              {flight.flightNo}
            </Typography>
          </Box>

          <DetailSection
            title="schedule Information"
            itemPerRow={3}
            data={scheduleData}
          />

          <DetailSection
            title="Airport Information"
            itemPerRow={3}
            data={airportData}
          />

          <Box sx={{ my: 3 }} />

          <DetailSection
            title="Pricing Information"
            itemPerRow={3}
            data={priceData}
          />

          {/* <FlightPath arrivalTime={flight.} departureTime={} /> */}
        </Paper>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button onClick={handleGoBack} variant="contained">
            Back
          </Button>
        </Box>
      </>
    );
  }, [
    flight,
    handleGoBack,
    handleBookFlight,
    scheduleData,
    airportData,
    priceData,
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {renderContent()}
    </Container>
  );
};

export default memo(FlightDetailPage);
