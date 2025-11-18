import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import theme from "../../scss/theme";
import type { FlightByDay } from "../../utils/type";

interface TimeSelectCardProps {
  day: FlightByDay; // 1 ngày duy nhất (không phải array)
  selected?: boolean; // tuỳ chọn highlight khi đang chọn
  onSelect?: (day: FlightByDay) => void;
}

const TimeSelectCard: React.FC<TimeSelectCardProps> = ({
  day,
  onSelect,
  selected = false,
}) => {
  return (
    <Card
      onClick={() => onSelect?.(day)}
      sx={{
        minWidth: "200px",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: selected
          ? "0 10px 30px rgba(106,13,173,0.14)"
          : "0 4px 12px rgba(0,0,0,0.06)",
        transition: "all 0.22s ease-in-out",
        cursor: "pointer",
        border: selected
          ? `1px solid ${theme.palette.primary.main}`
          : "1px solid transparent",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 1.5, textAlign: "center" }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: "uppercase" }}
        >
          {day?.day && day?.year ? `${day.day}-${day.year}` : "null"}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {day?.date || "null"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TimeSelectCard;
