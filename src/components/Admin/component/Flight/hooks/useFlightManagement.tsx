import { useCallback } from "react";
import type { FlightDetailPageProps } from "../FlightDetail";
import { useNavigate } from "react-router-dom";
import type { IDetailItem } from "../../../../../common/CustomRender/DetailSection";
import { DateFormatEnum, formatDate } from "../../../../../hooks/format";

export const useFlightManagement = ({
  flight,
  onBookFlight,
}: FlightDetailPageProps) => {
  const navigate = useNavigate();

  const handleBookFlight = useCallback(() => {
    if (flight && onBookFlight) {
      onBookFlight(flight.flightId as number);
    }
  }, [flight, onBookFlight]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (!flight) {
    return "No item";
  }

  const scheduleData: IDetailItem[] = [
    {
      title: "Scheduled Departure",
      description: formatDate(
        DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
        flight.scheduledDeparture
      ),
      size: 4,
    },
    {
      title: "Actual Departure",
      description: formatDate(
        DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
        flight.actualDeparture
      ),
      size: 4,
    },
    {
      title: "Scheduled Arrival",
      description: formatDate(
        DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
        flight.scheduledArrival
      ),
      size: 4,
    },
    {
      title: "Actual Arrival",
      description: formatDate(
        DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
        flight.actualArrival
      ),
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
      description: flight.gateId || "-",
      size: 2,
    },
    {
      title: "Is Domestic",
      description: flight.isDomestic || "-",
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
  ];

  const priceData: IDetailItem[] = [
    {
      title: "Economy Price",
      description: flight.priceEconomy
        ? `${flight.priceEconomy.toLocaleString()}`
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

  return {
    priceData,
    cancellationData,
    handleBookFlight,
    handleGoBack,
    scheduleData,
    airportData,
  } as const;
};
