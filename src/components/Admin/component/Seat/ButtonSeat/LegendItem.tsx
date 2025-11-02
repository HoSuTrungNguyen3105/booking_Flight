import { Box, Card, styled, Typography, useMediaQuery } from "@mui/material";
import { memo, useMemo } from "react";
import theme from "../../../../../scss/theme";
import { useSeatColor } from "../hook/useSeatColor";
import type { SeatFeatures } from "../modal/SeatManagementModal";

export interface SeatFeatureOption {
  value: keyof SeatFeatures;
  label: string;
}

const BookingCard = styled(Card)(() => ({
  height: "auto",
  marginBottom: theme.spacing(2),
  padding: "12px",
  borderRadius: 8,
}));

const LegendItemSection = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  return (
    <BookingCard>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
        }}
      >
        {seatFeatureOptions.map((option) => {
          const { backgroundColor, borderColor, textColor, icon } =
            useSeatColor({ seatFeature: option.value });

          return (
            <Box
              key={option.value}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                minWidth: "120px",
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor,
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {icon}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                }}
              >
                {option.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </BookingCard>
  );
};

export default memo(LegendItemSection);
