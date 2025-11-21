import { useMemo } from "react";
import type {
  SeatFeatureOption,
  SeatFeatures,
} from "../modal/SeatManagementModal";

export const useSeatFeatures = () => {
  const seatColors: Record<keyof SeatFeatures, string> = useMemo(
    () => ({
      isAvailable: "#4caf50",
      isBooked: "#1e1e1e",
      isExitRow: "#f44336",
      isUpperDeck: "#2196f3",
      isWing: "#ff9800",
      isHandicapAccessible: "#9c27b0",
      isNearLavatory: "#00bcd4",
      isExtraLegroom: "#ff5722",
    }),
    []
  );

  const seatFeatureOptions: SeatFeatureOption[] = useMemo(
    () => [
      { value: "isBooked", label: "Booked" },
      { value: "isAvailable", label: "Available" },
      { value: "isExitRow", label: "Exit Row" },
      { value: "isExtraLegroom", label: "Extra Legroom" },
      { value: "isHandicapAccessible", label: "Handicap Accessible" },
      { value: "isNearLavatory", label: "Near Lavatory" },
      { value: "isUpperDeck", label: "Upper Deck" },
      { value: "isWing", label: "Wing Area" },
    ],
    []
  );

  return {
    seatColors,
    seatFeatureOptions,
  };
};
