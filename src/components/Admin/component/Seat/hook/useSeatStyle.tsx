import { StarBorder, WorkOutline, Chair } from "@mui/icons-material";
import React, { type JSX } from "react";
import type { SeatFeatures } from "../modal/SeatManagementModal";
import theme from "../../../../../scss/theme";
import type { SeatTypeValue } from "../../../../../utils/type";

export const useSeatStyle = (seat: SeatFeatures, isSelected: boolean) => {
  //   const baseStyle = {
  //     backgroundColor: "#fff",
  //     textColor: theme.palette.primary.main,
  //     borderColor: theme.palette.primary.main,
  //   };

  //   const getSeatStyle = React.useMemo(() => {
  //     let icon: JSX.Element;

  //     switch (seat.type) {
  //       case "VIP":
  //         icon = <StarBorder sx={{ fontSize: 16, color: baseStyle.textColor }} />;
  //         break;
  //       case "BUSINESS":
  //         icon = <WorkOutline sx={{ fontSize: 16, color: baseStyle.textColor }} />;
  //         break;
  //       default: // ECONOMY
  //         icon = <Chair sx={{ fontSize: 16, color: baseStyle.textColor }} />;
  //         break;
  //     }

  //     return {
  //       ...baseStyle,
  //       icon,
  //     };
  //   }, [seat.type, isSelected, theme]);

  //   return getSeatStyle;
  const icons: Record<SeatTypeValue, JSX.Element> = {
    VIP: (
      <StarBorder sx={{ fontSize: 16, color: theme.palette.primary.main }} />
    ),
    BUSINESS: (
      <WorkOutline sx={{ fontSize: 16, color: theme.palette.primary.main }} />
    ),
    ECONOMY: <Chair sx={{ fontSize: 16, color: theme.palette.primary.main }} />,
    FIRST: <Chair sx={{ fontSize: 16, color: theme.palette.primary.main }} />,
  };

  return React.useMemo(
    () => ({
      backgroundColor: "#fff",
      textColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      icon: icons[seat.type] ?? icons.ECONOMY,
    }),
    [seat.type, isSelected, theme]
  );
};
