import { Box, Button, Paper, Typography, Container } from "@mui/material";
import { memo, useCallback, useEffect } from "react";
import type { DataFlight } from "../../../../utils/type";
import DetailSection from "../../../../common/DetailSection";
import FlightPath from "./FlightPath";
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
    cancellationData,
    handleBookFlight,
    handleGoBack,
    renderBreadcrumbs,
    scheduleData,
    airportData,
  } = management;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

          <Box sx={{ my: 3 }} />

          <DetailSection
            title="Airport Information"
            itemPerRow={3}
            data={airportData}
          />

          {cancellationData.length > 0 && (
            <>
              <Box sx={{ my: 3 }} />
              <DetailSection
                title="Cancellation Information"
                itemPerRow={1}
                data={cancellationData}
              />
            </>
          )}

          <Box sx={{ my: 3 }} />

          <DetailSection
            title="Pricing Information"
            itemPerRow={3}
            data={priceData}
          />

          <FlightPath />
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
    cancellationData,
    priceData,
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {renderBreadcrumbs()}
      {renderContent()}
    </Container>
  );
};

export default memo(FlightDetailPage);
