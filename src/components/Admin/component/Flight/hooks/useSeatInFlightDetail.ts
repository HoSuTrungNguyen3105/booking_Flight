import { useCallback, useMemo, useState } from "react";
import type { Seat, SeatTypeValue } from "../../../../../utils/type";
import type { IDetailItem } from "../../../../../common/AdditionalCustomFC/DetailSection";
import { useToast } from "../../../../../context/ToastContext";
import _ from "lodash";
import { useDeleteSeatInFlightByIds } from "../../../../../context/Api/SeatApi";
import { useGetAllInfoFlightByIDData } from "../../../../../context/Api/FlightApi";

type FlightWithSeatLayoutProps = {
  id: number;
};

export type FilterType =
  | "ALL"
  | "AVAILABLE"
  | "EXIT_ROW"
  | "EXTRA_LEGROOM"
  | "HANDICAP_ACCESSIBLE"
  | "IS_BOOKED"
  | "IS_NEAR_LAVATORY"
  | "IS_UPPERDECK"
  | "IS_WING";

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

  const [filter, setFilter] = useState<FilterType>("ALL");
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

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: "ALL", label: "All Seats" },
    { key: "AVAILABLE", label: "Available" },
    { key: "EXIT_ROW", label: "Exit Row" },
    { key: "EXTRA_LEGROOM", label: "Extra Legroom" },
    { key: "HANDICAP_ACCESSIBLE", label: "Accessible" },
    { key: "IS_BOOKED", label: "Booked" },
    { key: "IS_NEAR_LAVATORY", label: "Near Lavatory" },
    { key: "IS_UPPERDECK", label: "Upper Deck" },
    { key: "IS_WING", label: "Wing" },
  ];

  const filteredSeats = useMemo(() => {
    const allSeats = getAllInfoFlightByIdData?.data?.seats || [];
    if (filter === "ALL") return allSeats;

    const filterMap: Record<FilterType, keyof Seat> = {
      ALL: "isAvailable",
      AVAILABLE: "isAvailable",
      EXIT_ROW: "isExitRow",
      EXTRA_LEGROOM: "isExtraLegroom",
      HANDICAP_ACCESSIBLE: "isHandicapAccessible",
      IS_BOOKED: "isBooked",
      IS_NEAR_LAVATORY: "isNearLavatory",
      IS_UPPERDECK: "isUpperDeck",
      IS_WING: "isWing",
    };

    const key = filterMap[filter as keyof typeof filterMap];
    if (!key) return allSeats;

    // Lọc theo key boolean
    return allSeats.filter((s) => Boolean(s[key]));
  }, [getAllInfoFlightByIdData, filter]);

  const seatNumberCountUnique = _.uniqBy(
    getAllInfoFlightByIdData?.data?.seats || [],
    "seatNumber"
  );

  const seatCount = seatNumberCountUnique.length;

  const handleSelectSeat = useCallback(
    (seat: Seat) => {
      setSelectedSeats((prev) => {
        const exists = prev.some((s) => s.id === seat.id);

        if (exists) {
          toast("Đã bỏ chọn ghế");
          return prev.filter((s) => s.id !== seat.id);
        }

        if (maxSelectSeats === 1) {
          // luôn set seat khi chỉ được chọn 1
          setSelectedSeat(seat);
          setOpenSeatModal(true);
          return [seat];
        }

        if (prev.length < maxSelectSeats) {
          if (seat.isBooked) {
            toast("Ghế đã được đặt, vui lòng chọn ghế khác");
            return prev;
          }
          toast(`Đã chọn ${prev.length + 1} ghế`);
          return [...prev, seat];
        }

        toast(`Bạn chỉ được chọn tối đa ${maxSelectSeats} ghế`);
        return prev;
      });
    },
    [maxSelectSeats]
  );

  const getTypeColor = (type: string) => {
    switch (type as SeatTypeValue) {
      // case "FIRST":
      //   return "#ff9800";
      // case "BUSINESS":
      //   return "#2196f3";
      // default:
      //   return "#4caf50";
      // switch (seat?.type) {
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

  // useEffect(() => {
  //   if (selectedSeats.length > 0) {
  //     setSelectedSeat(selectedSeats[selectedSeats.length - 1]);
  //     setOpenSeatModal(true);
  //   } else {
  //     setSelectedSeat(null);
  //     setOpenSeatModal(false);
  //   }
  // }, [selectedSeats]);

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
    filterOptions,
    refetchGetAllInfoFlightData,
    getAllInfoFlightByIdData,
    selectedSeats,
    maxSelectSeats,
    filter,
    setOpenSeatModal,
    setSelectedSeat,
  } as const;
};
