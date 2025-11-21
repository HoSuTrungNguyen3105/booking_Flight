import { useCallback, useMemo, useState } from "react";
import _ from "lodash";
import type { Seat } from "../../utils/type";
import { useToast } from "../../context/ToastContext";
import type { FilterType } from "../Admin/component/Flight/hooks/useSeatInFlightDetail";
import { useGetAllInfoFlightByIDData } from "../../context/Api/FlightApi";

type FlightWithSeatLayoutProps = {
  id: number;
};

export const useChooseSeatToBooking = ({ id }: FlightWithSeatLayoutProps) => {
  const { getAllInfoFlightByIdData } = useGetAllInfoFlightByIDData({ id });
  const toast = useToast();
  // const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const maxSelectSeats = 1;
  const [filter] = useState<FilterType>("ALL");
  const flightData = getAllInfoFlightByIdData?.data;

  const filteredSeats = useMemo(() => {
    if (!flightData?.seats) return [];
    const { seats } = flightData;
    const filters: Record<FilterType, (s: Seat) => boolean> = {
      ALL: () => true,
      EXIT_ROW: (s) => !!s.isExitRow,
      EXTRA_LEGROOM: (s) => !!s.isExtraLegroom,
      AVAILABLE: (s) => !!s.isAvailable,
      HANDICAP_ACCESSIBLE: (s) => !!s.isHandicapAccessible,
      IS_BOOKED: (s) => !!s.isBooked,
      IS_NEAR_LAVATORY: (s) => !!s.isNearLavatory,
      IS_UPPERDECK: (s) => !!s.isUpperDeck,
      IS_WING: (s) => !!s.isWing,
    };

    return seats.filter(filters[filter] || (() => true));
  }, [flightData, filter]);

  const seatCount = useMemo(
    () => _.uniqBy(flightData?.seats || [], "seatNumber").length,
    [flightData]
  );

  const handleSelectSeat = useCallback(
    (seat: Seat) => {
      setSelectedSeats((prev) => {
        const exists = prev.some((s) => s.id === seat.id);
        if (exists) {
          toast("Đã bỏ chọn ghế");
          return prev.filter((s) => s.id !== seat.id);
        }

        if (seat.isBooked) {
          toast("Ghế đã được đặt, vui lòng chọn ghế khác");
          return prev;
        }

        if (maxSelectSeats === 1) {
          return [seat];
        }

        toast(`Đã chọn ${prev.length + 1} ghế`);
        return [...prev, seat];
      });
    },
    [maxSelectSeats]
  );

  //  Reset chọn ghế
  // const handleResetSelections = useCallback(() => {
  //   setSelectedSeats([]);
  // }, []);

  // //  Mở trang thanh toán
  // const handleOpenUpdateModal = useCallback(() => {
  //   if (selectedSeats.length === 0) {
  //     toast("Please select at least one seat to continue.");
  //     return;
  //   }

  //   const selectedSeatIds = selectedSeats.map((s) => s.id);
  //   const seatNos = selectedSeats.map((s) => s.seatNumber).join(",");

  //   navigate("/payment", {
  //     state: {
  //       flightId: id,
  //       seats: selectedSeatIds,
  //       seatNos,
  //       flightData,
  //     },
  //   });
  // }, [selectedSeats, id, flightData, navigate, toast]);

  return {
    handleSelectSeat,
    seatCount,
    filteredSeats,
    flightData,
    selectedSeats,
  } as const;
};
