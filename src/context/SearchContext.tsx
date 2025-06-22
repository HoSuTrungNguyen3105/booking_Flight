// import React, { useContext, useState } from "react";

// type SearchContext = {
//   destination: string;
//   checkIn: Date;
//   checkOut: Date;
//   adultCount: number;
//   childCount: number;
//   hotelId: string;
//   saveSearchValues: (
//     destination: string,
//     checkIn: Date,
//     checkOut: Date,
//     adultCount: number,
//     childCount: number
//   ) => void;
// };

// const SearchContext = React.createContext<SearchContext | undefined>(undefined);

// type SearchContextProviderProps = {
//   children: React.ReactNode;
// };

// export const SearchContextProvider = ({
//   children,
// }: SearchContextProviderProps) => {
//   const [destination, setDestination] = useState<string>(
//     () => sessionStorage.getItem("destination") || ""
//   );
//   const [checkIn, setCheckIn] = useState<Date>(
//     () =>
//       new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
//   );
//   const [checkOut, setCheckOut] = useState<Date>(
//     () =>
//       new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
//   );
//   const [adultCount, setAdultCount] = useState<number>(() =>
//     parseInt(sessionStorage.getItem("adultCount") || "1")
//   );
//   const [childCount, setChildCount] = useState<number>(() =>
//     parseInt(sessionStorage.getItem("childCount") || "1")
//   );
//   const [hotelId, setHotelId] = useState<string>(
//     () => sessionStorage.getItem("hotelID") || ""
//   );

//   const saveSearchValues = (
//     destination: string,
//     checkIn: Date,
//     checkOut: Date,
//     adultCount: number,
//     childCount: number,
//     hotelId?: string
//   ) => {
//     setDestination(destination);
//     setCheckIn(checkIn);
//     setCheckOut(checkOut);
//     setAdultCount(adultCount);
//     setChildCount(childCount);
//     if (hotelId) {
//       setHotelId(hotelId);
//     }

//     sessionStorage.setItem("destination", destination);
//     sessionStorage.setItem("checkIn", checkIn.toISOString());
//     sessionStorage.setItem("checkOut", checkOut.toISOString());
//     sessionStorage.setItem("adultCount", adultCount.toString());
//     sessionStorage.setItem("childCount", childCount.toString());

//     if (hotelId) {
//       sessionStorage.setItem("hotelId", hotelId);
//     }
//   };

//   return (
//     <SearchContext.Provider
//       value={{
//         destination,
//         checkIn,
//         checkOut,
//         adultCount,
//         childCount,
//         hotelId,
//         saveSearchValues,
//       }}
//     >
//       {children}
//     </SearchContext.Provider>
//   );
// };

// export const useSearchContext = () => {
//   const context = useContext(SearchContext);
//   return context as SearchContext;
// };

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type { SearchType } from "../utils/type";

// Kiểu dữ liệu chuyến bay
// export type SearchType = {
//   status: string;
//   scheduledDeparture: string;
//   scheduledArrival: string;
//   departureAirport: string;
//   arrivalAirport: string;
//   aircraftCode: string;
// };

type FlightSearchContextType = {
  flightParams: SearchType;
  saveFlightParams: (params: SearchType) => void;
  setFlightParams: React.Dispatch<React.SetStateAction<SearchType>>;
};

// Khởi tạo context
const FlightSearchContext = createContext<FlightSearchContextType | undefined>(
  undefined
);

// Provider
export const FlightSearchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [flightParams, setFlightParams] = useState<SearchType>(() => {
    const stored = sessionStorage.getItem("flightParams");
    return stored
      ? JSON.parse(stored)
      : {
          status: "",
          scheduledDeparture: "",
          scheduledArrival: "",
          departureAirport: "",
          arrivalAirport: "",
          aircraftCode: "",
        };
  });

  // Lưu vào sessionStorage mỗi khi flightParams thay đổi
  useEffect(() => {
    sessionStorage.setItem("flightParams", JSON.stringify(flightParams));
  }, [flightParams]);

  // Hàm saveFlightParams dùng useCallback để giữ reference ổn định
  const saveFlightParams = useCallback((params: SearchType) => {
    setFlightParams(params);
  }, []);

  // Tối ưu value truyền xuống bằng useMemo
  const value = useMemo(
    () => ({
      flightParams,
      setFlightParams,
      saveFlightParams,
    }),
    [flightParams, saveFlightParams]
  );

  return (
    <FlightSearchContext.Provider value={value}>
      {children}
    </FlightSearchContext.Provider>
  );
};

// Hook sử dụng context
export const useFlightSearchContext = () => {
  const context = useContext(FlightSearchContext);
  if (!context) {
    throw new Error(
      "useFlightSearchContext must be used within a FlightSearchProvider"
    );
  }
  return context;
};
