import type { Seat } from "../../../../../utils/type";
import {
  Accessibility,
  AirlineSeatLegroomExtra,
  FamilyRestroom,
  MeetingRoom,
  Notes,
  Paid,
  Stairs,
  WindowOutlined,
} from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";

interface SeatManagementProps {
  seat: Seat;
  selectedSeats: Seat[];
}

export const useSeatManagement = ({
  seat,
  selectedSeats,
}: SeatManagementProps) => {
  const isSelected = selectedSeats.some((s) => s.id === seat.id);

  const tooltipTitle = (
    <Box sx={{ minWidth: 200 }}>
      <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
        {seat.seatRow}
        {seat.seatNumber} - {seat.type}
      </Typography>
      <Stack spacing={0.5}>
        {[
          seat.isWing && (
            <Box
              key="wing"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <WindowOutlined fontSize="small" />
              <Typography variant="caption">Window Seat</Typography>
            </Box>
          ),
          seat.isNearLavatory && (
            <Box
              key="lavatory"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <FamilyRestroom fontSize="small" />
              <Typography variant="caption">Near Restroom Seat</Typography>
            </Box>
          ),
          seat.isExitRow && (
            <Box
              key="exit"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <MeetingRoom fontSize="small" />
              <Typography variant="caption">Exit Row</Typography>
            </Box>
          ),
          seat.isExtraLegroom && (
            <Box
              key="legroom"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <AirlineSeatLegroomExtra fontSize="small" />
              <Typography variant="caption">Extra Legroom</Typography>
            </Box>
          ),
          seat.isUpperDeck && (
            <Box
              key="upper"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Stairs fontSize="small" />
              <Typography variant="caption">Upper Deck</Typography>
            </Box>
          ),
          seat.isHandicapAccessible && (
            <Box
              key="handicap"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Accessibility fontSize="small" />
              <Typography variant="caption">Handicap Accessible</Typography>
            </Box>
          ),
          seat.price && (
            <Box
              key="price"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Paid fontSize="small" />
              <Typography variant="caption">
                ${seat.price?.toFixed(2)}
              </Typography>
            </Box>
          ),
          seat.note && (
            <Box
              key="note"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Notes fontSize="small" />
              <Typography variant="caption">{seat.note}</Typography>
            </Box>
          ),
          isSelected ? (
            <Box
              key="selected"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "success.main",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                }}
              />
              <Typography variant="caption" fontWeight="bold">
                Selected
              </Typography>
            </Box>
          ) : (
            <Box
              key="click"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "primary.main",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                }}
              />
              <Typography variant="caption">Click to select</Typography>
            </Box>
          ),
        ].filter(Boolean)}
      </Stack>
    </Box>
  );

  return {
    isSelected,
    tooltipTitle,
  } as const;
};
