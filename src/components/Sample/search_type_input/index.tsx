import { useMemo } from "react";
import type { ActionType } from "../../../common/Dropdown/SelectDropdown";
import {
  SearchFieldType,
  type ISearchFieldRender,
} from "../../../common/AdditionalCustomFC/SearchFieldRender";
import { useGetAllCode } from "../../../context/Api/FlightApi";
import { useFindAllFlightTypes } from "../../../context/Api/EnumApi";
import { mapStringToDropdown } from "../../../context/Api/CommonApi";
import { SwapHoriz } from "@mui/icons-material";

export type SearchFormConfig = {
  passenger: {
    name?: string;
    email?: string;
    phone?: string;
    bookingId?: string;
  };
  flight: {
    origin?: string;
    destination?: string;
    departDate?: number;
    returnDate?: number;
    type?: string;
    passengers?: number;
    // flightClass?: string;
    //discountCode?: string;
  };
  hotel: {
    location?: string;
    checkInDate?: number;
    checkOutDate?: number;
    guests?: number;
    rooms?: number;
    discountCode?: string;
  }[];
  seatBooking: {
    flightId?: number;
    seatType?: string;
    quantity?: number;
  }[];
};

export const useDataSection = (
  section: keyof SearchFormConfig,
  data: Partial<SearchFormConfig[keyof SearchFormConfig]>,
  hasValue: boolean,
  handleSwap: () => void
): ISearchFieldRender[] => {
  const { getAllCode } = useGetAllCode();
  const { dataFlightTypes } = useFindAllFlightTypes();
  const optionDataFlightTypes = mapStringToDropdown(
    dataFlightTypes?.data || []
  );
  const airports: ActionType[] = (getAllCode?.data?.airport || []).map((e) => ({
    value: e.code,
    label: e.value,
  }));

  return useMemo<ISearchFieldRender[]>(() => {
    if (!data) return [];

    // passenger
    if (section === "passenger") {
      const passenger = data as SearchFormConfig["passenger"];

      return [
        {
          label: "Passenger Info",
          fields: [
            {
              id: "name",
              size: 6,
              type: SearchFieldType.INPUT_WITH_TYPE_TEXT,
              value: passenger.name ?? "",
              placeholder: "Nhập tên…",
            },
            {
              id: "email",
              size: 6,
              type: SearchFieldType.INPUT_WITH_TYPE_TEXT,
              value: passenger.email ?? "",
              placeholder: "Nhập email…",
            },
            {
              id: "phone",
              size: 6,
              type: SearchFieldType.INPUT_WITH_TYPE_TEXT,
              value: passenger.phone ?? "",
              placeholder: "Nhập số điện thoại…",
            },
            {
              id: "bookingId",
              size: 6,
              type: SearchFieldType.INPUT_WITH_TYPE_TEXT,
              value: passenger.bookingId ?? "",
              placeholder: "Nhập Booking ID…",
            },
          ],
        },
      ];
    }

    // flight
    if (section === "flight") {
      const flight = data as SearchFormConfig["flight"];

      return [
        {
          label: "Flight Info",
          fields: [
            {
              id: "origin",
              type: SearchFieldType.DROPDOWN,
              size: 5,
              value: flight.origin ?? "",
              placeholder: "Điểm đi…",
              options: airports,
            },
            {
              id: "swap",
              type: SearchFieldType.ICON,
              size: 1,
              value: null,
              onClick: handleSwap,
              startIcon: <SwapHoriz fontSize="small" />,
              disabled: !hasValue,
            },
            {
              id: "destination",
              type: SearchFieldType.DROPDOWN,
              size: 5,
              value: flight.destination ?? "",
              placeholder: "Điểm đến…",
              options: airports,
              //   sx: { minWidth: 120, width: "100%" },
            },
            {
              id: "departDate",
              type: SearchFieldType.DATE,
              size: 5,
              value: flight.departDate ?? 0,
              placeholder: "Ngày đi…",
              sx: { width: "100%" },
            },

            {
              id: "returnDate",
              type: SearchFieldType.DATE,
              size: 5,
              value: flight.returnDate ?? 0,
              placeholder: "Ngày về…",
              sx: { width: "100%" },
              disabled: !hasValue, // disable nếu chuyến 1 chiều
            },
            {
              id: "type",
              type: SearchFieldType.DROPDOWN,
              size: 3,
              value: flight.type ?? "Economy",
              placeholder: "Loại chuyến bay…",
              options: optionDataFlightTypes,
              sx: { width: "100%" },
            },
            {
              id: "passengers",
              type: SearchFieldType.INPUT_WITH_NUMBER,
              size: 3,
              value: flight.passengers ?? 0,
              placeholder: "Số lượng hành khách…",
              sx: { width: "100%" },
            },
          ],
        },
      ];
    }

    // hotel
    if (section === "hotel") {
      const hotels = data as SearchFormConfig["hotel"];

      return hotels.map((hotel, idx) => ({
        label: `Hotel ${idx + 1}`,
        fields: [
          {
            id: `location_${idx}`,
            size: 6,
            type: SearchFieldType.INPUT_WITH_TYPE_TEXT,
            value: hotel.location ?? "",
            placeholder: "Địa điểm…",
          },
          {
            id: `checkInDate_${idx}`,
            size: 6,
            type: SearchFieldType.INPUT_WITH_NUMBER,
            value: hotel.checkInDate ?? 0,
            placeholder: "Ngày nhận phòng…",
          },
          {
            id: `checkOutDate_${idx}`,
            size: 6,
            type: SearchFieldType.INPUT_WITH_NUMBER,
            value: hotel.checkOutDate ?? 0,
            placeholder: "Ngày trả phòng…",
          },
          {
            id: `guests_${idx}`,
            size: 6,
            type: SearchFieldType.INPUT_WITH_NUMBER,
            value: hotel.guests ?? 1,
            placeholder: "Số khách…",
          },
          {
            id: `rooms_${idx}`,
            size: 6,
            type: SearchFieldType.INPUT_WITH_NUMBER,
            value: hotel.rooms ?? 1,
            placeholder: "Số phòng…",
          },
          {
            id: `discountCode_${idx}`,
            size: 6,
            type: SearchFieldType.INPUT_WITH_TYPE_TEXT,
            value: hotel.discountCode ?? "",
            placeholder: "Mã giảm giá…",
          },
        ],
      }));
    }

    // seatBooking
    if (section === "seatBooking") {
      const seats = data as SearchFormConfig["seatBooking"];

      return seats.map((seat, idx) => ({
        label: `Seat Booking ${idx + 1}`,
        fields: [
          {
            id: `flightId_${idx}`,
            size: 6,
            type: SearchFieldType.INPUT_WITH_NUMBER,
            value: seat.flightId ?? 0,
            placeholder: "Flight ID…",
          },
          {
            id: `seatType_${idx}`,
            size: 6,
            type: SearchFieldType.DROPDOWN,
            value: seat.seatType ?? "",
            placeholder: "Loại ghế…",
          },
          {
            id: `quantity_${idx}`,
            size: 6,
            type: SearchFieldType.INPUT_WITH_NUMBER,
            value: seat.quantity ?? 1,
            placeholder: "Số lượng…",
          },
        ],
      }));
    }

    return [];
  }, [section, data, airports, hasValue, optionDataFlightTypes, handleSwap]);
};
