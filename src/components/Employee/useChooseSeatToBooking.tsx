import { useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { useGetAllInfoFlightByIDData } from "../../context/Api/useGetApi";
import type { Seat } from "../../utils/type";
import type { IDetailItem } from "../../common/AdditionalCustomFC/DetailSection";
import { useToast } from "../../context/ToastContext";
import type { FilterType } from "../Admin/component/Flight/hooks/useSeatInFlightDetail";
import { useNavigate } from "react-router-dom";

type FlightWithSeatLayoutProps = {
  id: number;
};

export const useChooseSeatToBooking = ({ id }: FlightWithSeatLayoutProps) => {
  const { getAllInfoFlightByIdData } = useGetAllInfoFlightByIDData({ id });
  const toast = useToast();
  const navigate = useNavigate();

  // Seats được chọn
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  // Chỉ cho phép chọn 1 ghế (nếu cần thay đổi sau này thì mở rộng)
  const maxSelectSeats = 1;
  // Lọc loại ghế
  const [filter] = useState<FilterType>("ALL");

  // Dữ liệu chi tiết flight
  const flightData = getAllInfoFlightByIdData?.data;

  // const detail: IDetailItem[] = useMemo(
  //   () => [
  //     { title: "Flight No", description: flightData?.flightNo, size: 12 },
  //     { title: "Aircraft", description: flightData?.aircraft?.model, size: 12 },
  //     {
  //       title: "Aircraft Code",
  //       description: flightData?.aircraftCode,
  //       size: 12,
  //     },
  //     {
  //       title: "Arrival Airport",
  //       description: flightData?.arrivalAirport,
  //       size: 12,
  //     },
  //     {
  //       title: "Departure Airport",
  //       description: flightData?.departureAirport,
  //       size: 12,
  //     },
  //     {
  //       title: "City",
  //       description: flightData?.arrivalAirportRel?.city,
  //       size: 12,
  //     },
  //     { title: "Flight ID", description: flightData?.flightId, size: 12 },
  //     {
  //       title: "Status",
  //       description: flightData?.flightStatuses?.[0]?.status,
  //       size: 12,
  //     },
  //     { title: "Flight Type", description: flightData?.flightType, size: 12 },
  //     { title: "Seats", description: flightData?.seats?.length, size: 12 },
  //     { title: "Price First", description: flightData?.priceFirst, size: 12 },
  //   ],
  //   [flightData]
  // );

  // Lọc danh sách ghế
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

  // Đếm số ghế duy nhất
  const seatCount = useMemo(
    () => _.uniqBy(flightData?.seats || [], "seatNumber").length,
    [flightData]
  );

  //  Chọn ghế
  // const handleSelectSeat = useCallback(
  //   (seat: Seat) => {
  //     setSelectedSeats((prev) => {
  //       const exists = prev.some((s) => s.id === seat.id);
  //       if (exists) {
  //         return prev.filter((s) => s.id !== seat.id);
  //       }

  //       if (maxSelectSeats === 1) {
  //         return [seat]; // chỉ giữ 1 ghế
  //       }

  //       if (prev.length < maxSelectSeats) {
  //         return [...prev, seat];
  //       }

  //       toast(`You can select up to ${maxSelectSeats} seats only.`);
  //       return prev;
  //     });
  //   },
  //   [maxSelectSeats, toast]
  // );

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

        // if (prev.length < maxSelectSeats) {

        toast(`Đã chọn ${prev.length + 1} ghế`);
        return [...prev, seat];
      });
    },
    [maxSelectSeats]
  );

  //  Reset chọn ghế
  const handleResetSelections = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  //  Mở trang thanh toán
  const handleOpenUpdateModal = useCallback(() => {
    if (selectedSeats.length === 0) {
      toast("Please select at least one seat to continue.");
      return;
    }

    const selectedSeatIds = selectedSeats.map((s) => s.id);
    const seatNos = selectedSeats.map((s) => s.seatNumber).join(",");
// console.log('location', id,
//        selectedSeatIds,
//         seatNos,
//         flightData,)
    navigate("/payment", {
      state: {
        flightId: id,
        seats: selectedSeatIds,
        seatNos,
        flightData,
      },
    });
  }, [selectedSeats, id, flightData, navigate, toast]);

  return {
    // detail,
    handleSelectSeat,
    seatCount,
    filteredSeats,
    handleResetSelections,
    handleOpenUpdateModal,
    flightData,
    selectedSeats,
  } as const;
};
