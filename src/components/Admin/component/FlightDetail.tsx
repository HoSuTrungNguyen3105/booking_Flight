import { Box, Button, Chip, Paper, Typography, Container } from "@mui/material";
import { memo, useCallback, useEffect } from "react";
import {
  Schedule,
  AirplanemodeActive,
  Home,
  Flight,
} from "@mui/icons-material";
import type { DataFlight } from "../../../utils/type";
import { useNavigate } from "react-router-dom";
import type { BreadcrumbItem } from "../../../common/BreadCrumb/BreadCrumb";
import BreadCrumb from "../../../common/BreadCrumb/BreadCrumb";
import type { IDetailItem } from "../../../common/DetailSection";
import DetailSection from "../../../common/DetailSection";
import FlightPath from "../../User/FlightPath";

interface FlightDetailPageProps {
  flight: DataFlight;
  onBookFlight?: (flightId: number) => void;
}

const FlightDetailPage = ({ flight, onBookFlight }: FlightDetailPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBookFlight = useCallback(() => {
    if (flight && onBookFlight) {
      onBookFlight(flight.flightId as number);
    }
  }, [flight, onBookFlight]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const renderBreadcrumbs = useCallback(() => {
    const breadcrumbItems: BreadcrumbItem[] = [
      {
        label: "Home",
        href: "/",
        icon: <Home sx={{ fontSize: 16 }} />,
      },
      {
        label: "Flights",
        href: "/admin",
        icon: <Flight sx={{ fontSize: 16 }} />,
      },
      {
        label: `Flight ${flight.flightId}`,
      },
    ];

    return (
      <BreadCrumb
        items={breadcrumbItems}
        separator={<span style={{ margin: "0 8px" }}>/</span>}
      />
    );
  }, [flight.flightId]);

  // Tạo dữ liệu cho DetailSection - Thông tin lịch trình
  const scheduleData: IDetailItem[] = [
    {
      title: "Scheduled Departure",
      description: new Date(Number(flight.scheduledDeparture)).toLocaleString(),
      size: 4,
    },
    {
      title: "Actual Departure",
      description: flight.actualDeparture
        ? new Date(Number(flight.actualDeparture)).toLocaleString()
        : "-",
      size: 4,
    },
    {
      title: "Scheduled Arrival",
      description: new Date(Number(flight.scheduledArrival)).toLocaleString(),
      size: 4,
    },
    {
      title: "Actual Arrival",
      description: flight.actualArrival
        ? new Date(Number(flight.actualArrival)).toLocaleString()
        : "-",
      size: 4,
    },
    {
      title: "Delay Minutes",
      description: flight.delayMinutes ? `${flight.delayMinutes} minutes` : "-",
      size: 4,
    },
    {
      title: "Delay Reason",
      description: flight.delayReason || "-",
      size: 8,
    },
  ];

  // Tạo dữ liệu cho DetailSection - Thông tin sân bay
  const airportData: IDetailItem[] = [
    {
      title: "Departure Airport",
      description: flight.departureAirport,
      size: 4,
    },
    {
      title: "Arrival Airport",
      description: flight.arrivalAirport,
      size: 4,
    },
    {
      title: "Gate",
      description: flight.gate || "-",
      size: 2,
    },
    {
      title: "Terminal",
      description: flight.terminal || "-",
      size: 2,
    },
    {
      title: "Aircraft Code",
      description: flight.aircraftCode,
      size: 4,
    },
    {
      title: "Flight Type",
      description: flight.flightType,
      size: 4,
    },
    {
      title: "Status",
      description: (
        <Chip
          label={flight.status}
          color={
            flight.status === "scheduled"
              ? "primary"
              : flight.status === "departed"
              ? "success"
              : flight.status === "cancelled"
              ? "error"
              : flight.status === "delayed"
              ? "warning"
              : "default"
          }
          size="small"
        />
      ),
      size: 4,
    },
  ];

  // Tạo dữ liệu cho DetailSection - Thông tin giá
  const priceData: IDetailItem[] = [
    {
      title: "Economy Price",
      description: flight.priceEconomy
        ? `$${flight.priceEconomy.toLocaleString()}`
        : "-",
      size: 4,
    },
    {
      title: "Business Price",
      description: flight.priceBusiness
        ? `$${flight.priceBusiness.toLocaleString()}`
        : "-",
      size: 4,
    },
    {
      title: "First Class Price",
      description: flight.priceFirst
        ? `$${flight.priceFirst.toLocaleString()}`
        : "-",
      size: 4,
    },
  ];

  // Thông tin hủy chuyến (nếu có)
  const cancellationData: IDetailItem[] =
    flight.isCancelled && flight.cancellationReason
      ? [
          {
            title: "Cancellation Reason",
            description: flight.cancellationReason,
            size: 12,
          },
        ]
      : [];

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
        {/* Header Section */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h4" gutterBottom color="primary">
              {flight.flightNo}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {flight.departureAirport} → {flight.arrivalAirport}
            </Typography>
          </Box>

          {/* Flight Details using DetailSection */}
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

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button onClick={handleGoBack} variant="outlined">
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBookFlight}
            disabled={flight.status === "cancelled"}
          >
            Book This Flight
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
