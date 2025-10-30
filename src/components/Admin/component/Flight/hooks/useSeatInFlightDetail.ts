import { useCallback, useEffect, useMemo, useState } from "react";
import type { Seat } from "../../../../../utils/type";
import { useGetAllInfoFlightByIDData } from "../../../../../context/Api/useGetApi";
import { useDeleteSeatInFlightByIds } from "../../../../../context/Api/usePostApi";
import type { IDetailItem } from "../../../../../common/CustomRender/DetailSection";
import { useToast } from "../../../../../context/ToastContext";
import _ from "lodash";

type FlightWithSeatLayoutProps = {
  id: number;
};

export type AircraftSeatTypeProps =
  | "ALL"
  | "VIP"
  | "ECONOMY"
  | "FIRST"
  | "BUSINESS";

export const useSeatInFlightDetail = ({ id }: FlightWithSeatLayoutProps) => {
  const { getAllInfoFlightByIdData, refetchGetAllInfoFlightData } =
    useGetAllInfoFlightByIDData({ id });
  const { refetchDeleteSeatInFlightByIds } = useDeleteSeatInFlightByIds();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
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
  const [createSeat, setCreateSeat] = useState(false);
  const [openSeatModal, setOpenSeatModal] = useState(false);

  const [updateSeat, setUpdateSeat] = useState<{ seatIds: number[] }>({
    seatIds: [],
  });
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const toast = useToast();
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

  const handleDeleteSeatInFlight = (flightId: number) => {
    refetchDeleteSeatInFlightByIds({ flightId });
    refetchGetAllInfoFlightData();
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
        return [seat];
      }

      if (prev.length < maxSelectSeats) {
        return [...prev, seat];
      }

      return prev;
    });
  };

  useEffect(() => {
    if (selectedSeats.length > 0) {
      setSelectedSeat(selectedSeats[selectedSeats.length - 1]);
      setOpenSeatModal(true);
    } else {
      setSelectedSeat(null);
      setOpenSeatModal(false);
    }
  }, [selectedSeats]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "FIRST":
        return "#ff9800";
      case "BUSINESS":
        return "#2196f3";
      default:
        return "#4caf50";
    }
  };

  return {
    detail,
    setMaxSelectSeats,
    getTypeColor,
    handleSelectSeat,
    seatCount,
    filteredSeats,
    handleResetSelections,
    handleCloseModal,
    handleDeleteSeatInFlight,
    isUpdateModalOpen,
    setFilter,
    openSeatModal,
    createSeat,
    setCreateSeat,
    updateSeat,
    handleOpenUpdateModal,
    selectedSeat,
    setSelectedSeats,
    refetchGetAllInfoFlightData,
    getAllInfoFlightByIdData,
    selectedSeats,
    maxSelectSeats,
    filter,
    setOpenSeatModal,
    setSelectedSeat,
  } as const;
};
