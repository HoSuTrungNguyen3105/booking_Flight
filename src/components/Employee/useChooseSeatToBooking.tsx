import { useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { useGetAllInfoFlightByIDData } from "../../context/Api/useGetApi";
import type { Seat, SeatTypeValue } from "../../utils/type";
import type { IDetailItem } from "../../common/CustomRender/DetailSection";
import { useToast } from "../../context/ToastContext";
import type { AircraftSeatTypeProps } from "../Admin/component/Flight/hooks/useSeatInFlightDetail";

type FlightWithSeatLayoutProps = {
  id: number;
};

export const useChooseSeatToBooking = ({ id }: FlightWithSeatLayoutProps) => {
  const { getAllInfoFlightByIdData } = useGetAllInfoFlightByIDData({ id });
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const toast = useToast();

  const [maxSelectSeats, setMaxSelectSeats] = useState<number>(1);
  const detail: IDetailItem[] = [
    {
      title: "Flight No",
      description: getAllInfoFlightByIdData?.data?.flightNo,
      size: 12,
    },
    {
      title: "Aircraft",
      description: getAllInfoFlightByIdData?.data?.aircraft?.model,
      size: 12,
    },
    {
      title: "Aircraft Code",
      description: getAllInfoFlightByIdData?.data?.aircraftCode,
      size: 12,
    },
    {
      title: "Arrival Airport",
      description: getAllInfoFlightByIdData?.data?.arrivalAirport,
      size: 12,
    },
    {
      title: "Departure Airport",
      description: getAllInfoFlightByIdData?.data?.departureAirport,
      size: 12,
    },
    {
      title: "City",
      description: getAllInfoFlightByIdData?.data?.arrivalAirportRel?.city,
      size: 12,
    },
    {
      title: "Flight ID",
      description: getAllInfoFlightByIdData?.data?.flightId,
      size: 12,
    },
    {
      title: "Status",
      description: getAllInfoFlightByIdData?.data?.flightStatuses?.[0]?.status,
      size: 12,
    },
    {
      title: "Flight Type",
      description: getAllInfoFlightByIdData?.data?.flightType,
      size: 12,
    },
    {
      title: "Seats",
      description: getAllInfoFlightByIdData?.data?.seats?.length,
      size: 12,
    },
  ];

  const [filter, setFilter] = useState<AircraftSeatTypeProps>("ALL");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [openSeatModal, setOpenSeatModal] = useState(false);

  const [updateSeat, setUpdateSeat] = useState<{ seatIds: number[] }>({
    seatIds: [],
  });
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const handleOpenUpdateModal = useCallback(() => {
    if (selectedSeats.length === 0) {
      toast("Please select at least one seat to update.");
      return;
    }
    setUpdateSeat({
      seatIds: selectedSeats.map((seat) => seat.id),
    });

    setIsUpdateModalOpen(true);
  }, [selectedSeats]);

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleResetSelections = () => {
    setSelectedSeats([]);
    setUpdateSeat({
      seatIds: [],
    });
  };

  const filteredSeats = useMemo(() => {
    if (filter === "ALL") return getAllInfoFlightByIdData?.data?.seats;
    if (filter === "FIRST")
      return getAllInfoFlightByIdData?.data?.seats?.filter(
        (s) => s.type === "FIRST"
      );
    if (filter === "BUSINESS")
      return getAllInfoFlightByIdData?.data?.seats?.filter(
        (s) => s.type === "BUSINESS"
      );
    if (filter === "VIP")
      return getAllInfoFlightByIdData?.data?.seats?.filter(
        (s) => s.type === "VIP"
      );
    if (filter === "ECONOMY")
      return getAllInfoFlightByIdData?.data?.seats?.filter(
        (s) => s.type === "ECONOMY"
      );
    return getAllInfoFlightByIdData?.data?.seats?.filter(
      (s) => s.type === filter
    );
  }, [getAllInfoFlightByIdData, filter]);

  const seatNumberCountUnique = _.uniqBy(
    getAllInfoFlightByIdData?.data?.seats || [],
    "seatNumber"
  );

  const seatCount = seatNumberCountUnique.length;

  const handleSelectSeat = (seat: Seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);

      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }

      if (maxSelectSeats === 1) {
        // setOpenSeatModal(true);
        setSelectedSeat(selectedSeats[selectedSeats.length - 1]);
        setOpenSeatModal(true);
        return [seat];
      }

      if (prev.length < maxSelectSeats) {
        return [...prev, seat];
      }

      return prev;
    });
  };

  const getTypeColor = (type: string) => {
    switch (type as SeatTypeValue) {
      case "ECONOMY":
        return "#ff9800";
      case "BUSINESS":
        return "#2196f3";
      case "VIP":
        return "#fff3e0";
      case "FIRST":
        return "#d3d3d3";
      default:
        return "#4caf50";
    }
  };

  return {
    detail,
    getTypeColor,
    handleSelectSeat,
    seatCount,
    filteredSeats,
    handleResetSelections,
    handleCloseModal,
    isUpdateModalOpen,
    setFilter,
    openSeatModal,
    updateSeat,
    handleOpenUpdateModal,
    getAllInfoFlightByIdData,
    selectedSeats,
    filter,
  } as const;
};
