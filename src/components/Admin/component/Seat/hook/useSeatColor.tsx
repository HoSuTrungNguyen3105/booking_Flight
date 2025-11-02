import { useMemo } from "react";
import {
  Accessibility,
  AirlineSeatLegroomExtra,
  Chair,
  StarBorder,
  Wc,
  WorkOutline,
} from "@mui/icons-material";
import theme from "../../../../../scss/theme";
import type { SeatFeatures } from "../modal/SeatManagementModal";
import { useFindAllSeatTypes } from "../../../../../context/Api/useGetApi";
import type { Seat } from "../../../../../utils/type";
type SeatColorOptionProps = {
  seatFeature?: keyof SeatFeatures;
  seat?: Seat;
  selectedSeats?: Seat[];
};
export const useSeatColor = ({
  selectedSeats,
  seat,
  seatFeature,
}: SeatColorOptionProps) => {
  const { dataSeatTypes } = useFindAllSeatTypes();
  const isSelected = selectedSeats?.some((s) => s.id === seat?.id);

  const seatColors = {
    available: "#4caf50",
    occupied: "#1e1e1e",
    blocked: "#9e9e9e",
    exitRow: "#f44336",
    upperDeck: "#2196f3",
    wing: "#ff9800",
    handicap: "#9c27b0",
    lavatory: "#00bcd4",
    extraLegroom: "#f44336",
  };

  const { backgroundColor, textColor, borderColor, icon } = useMemo(() => {
    // Xử lý trực tiếp dựa trên seatFeature, không cần mock seat
    if (!isSelected) {
      return {
        backgroundColor: "#fff",
        textColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        icon: null,
      };
    }

    switch (seatFeature) {
      case "isExitRow":
        return {
          backgroundColor: "#fff",
          textColor: seatColors.exitRow,
          borderColor: seatColors.exitRow,
          icon: (
            <AirlineSeatLegroomExtra
              sx={{ fontSize: 16, color: seatColors.exitRow }}
            />
          ),
        };

      case "isUpperDeck":
        return {
          backgroundColor: "#fff",
          textColor: seatColors.upperDeck,
          borderColor: seatColors.upperDeck,
          icon: <Chair sx={{ fontSize: 14, color: seatColors.upperDeck }} />,
        };

      case "isWing":
        return {
          backgroundColor: "#fff",
          textColor: seatColors.wing,
          borderColor: seatColors.wing,
          icon: (
            <AirlineSeatLegroomExtra
              sx={{ fontSize: 14, color: seatColors.wing }}
            />
          ),
        };

      case "isExtraLegroom":
        return {
          backgroundColor: "#fff",
          textColor: seatColors.extraLegroom,
          borderColor: seatColors.extraLegroom,
          icon: (
            <AirlineSeatLegroomExtra
              sx={{ fontSize: 14, color: seatColors.extraLegroom }}
            />
          ),
        };

      case "isAvailable":
        return {
          backgroundColor: "#fff",
          textColor: seatColors.available,
          borderColor: seatColors.available,
          icon: null,
        };

      case "isHandicapAccessible":
        return {
          backgroundColor: "#fff",
          textColor: seatColors.handicap,
          borderColor: seatColors.handicap,
          icon: (
            <Accessibility sx={{ fontSize: 14, color: seatColors.handicap }} />
          ),
        };

      case "isNearLavatory":
        return {
          backgroundColor: "#fff",
          textColor: seatColors.lavatory,
          borderColor: seatColors.lavatory,
          icon: <Wc sx={{ fontSize: 14, color: seatColors.lavatory }} />,
        };

      case "isBooked":
        return {
          backgroundColor: seatColors.occupied,
          textColor: "#fff",
          borderColor: seatColors.occupied,
          icon: null,
        };

      default:
        // Xử lý seat types nếu có
        const seatTypeString = dataSeatTypes?.data?.join(",") || "";
        switch (seatTypeString) {
          case "VIP":
            return {
              backgroundColor: "#fff",
              textColor: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              icon: (
                <StarBorder
                  sx={{ fontSize: 16, color: theme.palette.primary.main }}
                />
              ),
            };
          case "BUSINESS":
            return {
              backgroundColor: "#fff",
              textColor: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              icon: (
                <WorkOutline
                  sx={{ fontSize: 16, color: theme.palette.primary.main }}
                />
              ),
            };
          case "ECONOMY":
            return {
              backgroundColor: "#fff",
              textColor: theme.palette.primary.dark,
              borderColor: theme.palette.primary.main,
              icon: (
                <WorkOutline
                  sx={{ fontSize: 16, color: theme.palette.primary.main }}
                />
              ),
            };
          default:
            return {
              backgroundColor: "#fff",
              textColor: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              icon: null,
            };
        }
    }
  }, [seatFeature, dataSeatTypes]);

  return {
    backgroundColor,
    textColor,
    borderColor,
    icon,
  } as const;
};
