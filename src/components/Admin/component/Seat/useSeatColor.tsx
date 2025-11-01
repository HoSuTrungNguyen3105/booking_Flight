import { useMemo, useState } from "react";
import {
  Accessibility,
  AirlineSeatLegroomExtra,
  Chair,
  StarBorder,
  Wc,
  WorkOutline,
} from "@mui/icons-material";
import theme from "../../../../scss/theme";
import type { SeatFeatures } from "./SeatManagementModal";
import { useFindAllSeatTypes } from "../../../../context/Api/useGetApi";

// 🎨 Hook xác định màu sắc/icon cho từng loại ghế
export const useSeatColor = () => {
  const [seat] = useState<SeatFeatures | null>(null);
  const { dataSeatTypes } = useFindAllSeatTypes();

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

  // ✅ Nếu chưa có seat hay dữ liệu, vẫn return default màu sắc
  const { backgroundColor, textColor, borderColor, icon } = useMemo(() => {
    if (!seat) {
      return {
        backgroundColor: "#fff",
        textColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        icon: null,
      };
    }

    // ✅ Ưu tiên kiểm tra các flag
    if (seat.isExitRow) {
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
    }

    if (seat.isUpperDeck) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.upperDeck,
        borderColor: seatColors.upperDeck,
        icon: <Chair sx={{ fontSize: 14, color: seatColors.upperDeck }} />,
      };
    }

    if (seat.isWing) {
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
    }

    if (seat.isExtraLegroom) {
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
    }

    if (seat.isAvailable) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.available,
        borderColor: seatColors.available,
        icon: null,
      };
    }

    if (seat.isHandicapAccessible) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.handicap,
        borderColor: seatColors.handicap,
        icon: (
          <Accessibility sx={{ fontSize: 14, color: seatColors.handicap }} />
        ),
      };
    }

    if (seat.isNearLavatory) {
      return {
        backgroundColor: "#fff",
        textColor: seatColors.lavatory,
        borderColor: seatColors.lavatory,
        icon: <Wc sx={{ fontSize: 14, color: seatColors.lavatory }} />,
      };
    }

    // ✅ Cuối cùng là loại ghế theo seat type
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
      default: // ECONOMY
        return {
          backgroundColor: "#fff",
          textColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          icon: null,
        };
    }
  }, [seat, dataSeatTypes]);

  return {
    backgroundColor,
    textColor,
    borderColor,
    icon,
  } as const;
};
