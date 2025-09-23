import { Chair, StarHalfSharp, Wc, Window } from "@mui/icons-material";
import { Box, Card, styled, Typography, useMediaQuery } from "@mui/material";
import React, { memo, useCallback } from "react";
import theme from "../../scss/theme";

type LegendItemProps = {
  color: string;
  label: string;
  icon?: React.ReactNode;
};

// ✅ Đưa styled component ra ngoài để tối ưu
const BookingCard = styled(Card)(({ theme }) => ({
  height: "5rem",
  marginBottom: theme.spacing(2),
  paddingTop: "8px",
  borderRadius: "12px",
}));

const LegendItemSection = () => {
  // const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderColorForLegendItem = useCallback(() => {
    return [
      { color: "#f5f5f5", label: "Available" },
      { color: "#d3d3d3", label: "Booked" },
      {
        color: "#f9a825",
        label: "VIP",
        icon: (
          <StarHalfSharp
            sx={{ color: theme.palette.primary.main, fontSize: 16 }}
          />
        ),
      },
      {
        color: "#d3d3d3",
        label: "Economy",
        icon: (
          <Chair sx={{ color: theme.palette.primary.main, fontSize: 16 }} />
        ),
      },
      {
        color: "#e3f2fd",
        label: "Window",
        icon: (
          <Window sx={{ color: theme.palette.primary.main, fontSize: 16 }} />
        ),
      },
      {
        color: "#fff3e0",
        label: "Restroom",
        icon: <Wc sx={{ color: theme.palette.primary.main, fontSize: 16 }} />,
      },
    ];
  }, [theme.palette.primary.main]);

  const renderLegendItem = useCallback(
    ({ color, label, icon }: LegendItemProps) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Box
          sx={{
            width: "20px",
            height: "20px",
            backgroundColor: color,
            borderRadius: "4px",
            border: "1px solid #ccc",
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
            color: theme.palette.primary.main,
            fontSize: isMobile ? "0.75rem" : "0.875rem",
          }}
        >
          {label}
        </Typography>
      </Box>
    ),
    [theme.palette.primary.main, isMobile]
  );

  return (
    <BookingCard>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          justifyContent: "center",
        }}
      >
        {renderColorForLegendItem().map((item, index) => (
          <React.Fragment key={index}>{renderLegendItem(item)}</React.Fragment>
        ))}
      </Box>
    </BookingCard>
  );
};

export default memo(LegendItemSection);
