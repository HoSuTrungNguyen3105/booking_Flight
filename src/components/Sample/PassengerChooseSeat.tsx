import { memo } from "react";
import { Box, Typography, Grid, Button, alpha } from "@mui/material";
import _ from "lodash";
import { ArrowBack } from "@mui/icons-material";
import theme from "../../scss/theme";
import { useChooseSeatToBooking } from "../Employee/hooks/useChooseSeatToBooking";
import BookingSeatButton from "./BookingSeatButton";
import { useLocation } from "react-router-dom";
import { string } from "prop-types";
import { useExit } from "../../context/use[custom]/useExit";
import SeatSelect from "./SeatSelect";
import type { DataFlight } from "../../utils/type";

const PassengerChooseSeat = () => {
  const location = useLocation();
  const { id } = location.state || { id: string };
  const {
    handleSelectSeat,
    seatCount,
    filteredSeats,
    flightData,
    selectedSeats,
  } = useChooseSeatToBooking({
    id,
  });

  const exit = useExit();

  return (
    <Box
      sx={{
        maxWidth: "100%",
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.03
        )} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Button
          onClick={exit}
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Back to Flights
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid size={6}>
          <Box
            sx={{
              width: "100%",
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              overflow: "hidden",
            }}
          >
            {/* Scrollable Seat Area */}
            <Box
              sx={{
                height: "68vh",
                overflowY: "auto",
                px: 3,
                py: 2,
                position: "relative",
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.3),
                  borderRadius: "4px",
                },
              }}
            >
              {/* Nose */}
              <Box
                sx={{
                  width: "55%",
                  height: 45,
                  mx: "auto",
                  borderTopLeftRadius: "50%",
                  borderTopRightRadius: "50%",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  mb: 2,
                }}
              />

              {/* Seat Rows */}
              {Array.from({ length: seatCount }, (_, i) => {
                const row = i + 1;

                return (
                  <Box
                    key={row}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 1.2,
                      position: "relative",
                    }}
                  >
                    {/* Row number */}
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        left: 6,
                        fontWeight: 600,
                        color: "text.secondary",
                      }}
                    >
                      {row}
                    </Typography>

                    {/* Left seats */}
                    {["A", "B", "C"].map((col) => {
                      const seat = filteredSeats?.find(
                        (s) => s.seatNumber === row && s.seatRow === col
                      );
                      return seat ? (
                        <BookingSeatButton
                          key={col}
                          seat={seat}
                          selectedSeats={selectedSeats}
                          handleSelectSeat={handleSelectSeat}
                        />
                      ) : (
                        <Box
                          key={col}
                          sx={{ width: 42, height: 42, m: "4px" }}
                        />
                      );
                    })}

                    {/* Aisle */}
                    <Box
                      sx={{
                        width: 85,
                        height: 6,
                        mx: 2,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                      }}
                    />

                    {/* Right seats */}
                    {["D", "E", "F"].map((col) => {
                      const seat = filteredSeats?.find(
                        (s) => s.seatNumber === row && s.seatRow === col
                      );
                      return seat ? (
                        <BookingSeatButton
                          key={col}
                          seat={seat}
                          selectedSeats={selectedSeats}
                          handleSelectSeat={handleSelectSeat}
                        />
                      ) : (
                        <Box
                          key={col}
                          sx={{ width: 42, height: 42, m: "4px" }}
                        />
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Grid>

        {/* Bottom Info Section */}
        <Grid size={6}>
          <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
            <SeatSelect
              flight={flightData as DataFlight}
              selectedSeats={selectedSeats}
              onSeatTypeChange={(type) =>
                console.log("Type ghế đổi thành:", type)
              }
            />
          </Box>
        </Grid>
        {/* </Grid> */}
      </Grid>
    </Box>
  );
};

export default memo(PassengerChooseSeat);
