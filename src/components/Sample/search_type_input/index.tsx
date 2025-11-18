import { useMemo } from "react";
import { FieldType } from "../../../common/AdditionalCustomFC/FieldRenderer";
import {
  mapStringToDropdown,
  useFindAllFlightTypes,
  useGetAllCode,
} from "../../../context/Api/useGetApi";
import type { ActionType } from "../../../common/Dropdown/SelectDropdown";
import {
  SearchFieldType,
  type ISearchFieldRender,
} from "../../../common/AdditionalCustomFC/SearchFieldRender";

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
    discountCode?: string;
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
  data: Partial<SearchFormConfig[keyof SearchFormConfig]>
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
              size: 4,
              type: SearchFieldType.DROPDOWN,
              value: flight.origin ?? "",
              placeholder: "Điểm đi…",
              options: airports,
              sx: { minWidth: 120 },
            },
            {
              id: "destination",
              size: 4,
              type: SearchFieldType.DROPDOWN,
              value: flight.destination ?? "",
              placeholder: "Điểm đến…",
              options: airports,
              sx: { minWidth: 120 },
            },
            {
              id: "departDate",
              size: 6,
              type: SearchFieldType.INPUT_WITH_NUMBER,
              value: flight.departDate ?? 0,
              placeholder: "Ngày đi…",
            },
            {
              id: "returnDate",
              size: 6,
              type: SearchFieldType.INPUT_WITH_NUMBER,
              value: flight.returnDate ?? 0,
              placeholder: "Ngày về…",
            },
            {
              id: "type",
              size: 2,
              type: SearchFieldType.DROPDOWN,
              value: flight.type ?? "",
              placeholder: "Loại chuyến bay…",
              options: optionDataFlightTypes,
            },
            {
              id: "discountCode",
              size: 3,
              type: SearchFieldType.INPUT_WITH_TYPE_TEXT,
              value: flight.discountCode ?? "",
              placeholder: "Mã giảm giá…",
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
  }, [section, data, airports, optionDataFlightTypes]);
};
