import { memo } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  Button,
  IconButton,
  Card,
  Stack,
  alpha,
} from "@mui/material";
import _ from "lodash";
import {
  ArrowBack,
  Chair,
  Flight,
  LocalAirport,
  RestartAlt,
} from "@mui/icons-material";
import type { AircraftSeatTypeProps } from "../Admin/component/Flight/hooks/useSeatInFlightDetail";
import DetailSection from "../../common/CustomRender/DetailSection";
import theme from "../../scss/theme";
import { useChooseSeatToBooking } from "./useChooseSeatToBooking";
// import LegendItem from "../Admin/component/Seat/ButtonSeat/LegendItem";
import ButtonSeat from "../Admin/component/Seat/ButtonSeat";
import ChooseSeatModal from "./ChooseSeatModal";
import { useLocation, useNavigate } from "react-router-dom";
import type { Seat } from "../../utils/type";

// type FlightWithSeatLayoutProps = {
//   id: number;
// };

const PassengerChooseSeat = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const navigate = useNavigate();
  const {
    detail,
    getTypeColor,
    handleSelectSeat,
    seatCount,
    filteredSeats,
    handleResetSelections,
    handleCloseModal,
    isUpdateModalOpen,
    setFilter,
    openSeatModal,
    updateSeat,
    handleOpenUpdateModal,
    getAllInfoFlightByIdData,
    selectedSeats,
    filter,
  } = useChooseSeatToBooking({
    id,
  });

  const handleNavigateBooking = (seat: Seat) => {
    navigate("/payment", {
      state: {
        seat,
      },
    });
  };

  return (
    <Box
      sx={{
        maxWidth: "100%",
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.02
        )} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        p: 2,
      }}
    >
      {/* Header Section - Improved */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outlined"
            startIcon={<ArrowBack />}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Back to Flights
          </Button>

          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LocalAirport
              sx={{
                fontSize: 32,
                color: "primary.main",
                transform: "rotate(45deg)",
              }}
            />
            <Typography variant="h6" fontWeight={700} color="primary.main">
              Seat Selection
            </Typography>
          </Box> */}
        </Box>

        {/* Filter Chips - Improved */}
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          {[
            { key: "ALL", label: "All Seats" },
            { key: "VIP", label: "VIP" },
            { key: "ECONOMY", label: "Economy" },
            { key: "FIRST", label: "First Class" },
            { key: "BUSINESS", label: "Business" },
          ].map((item) => (
            <Chip
              key={item.key}
              label={item.label}
              onClick={() => setFilter(item.key as AircraftSeatTypeProps)}
              variant={filter === item.key ? "filled" : "outlined"}
              color={filter === item.key ? "primary" : "default"}
              sx={{
                fontWeight: filter === item.key ? 700 : 500,
                px: 1,
                py: 2,
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 2,
                },
                ...(filter === item.key && {
                  backgroundColor: "primary.main",
                  color: "white",
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                }),
              }}
            />
          ))}
        </Box> */}
      </Box>

      <Grid container spacing={3}>
        {/* Left Panel - Selection & Details */}
        <Grid size={6}>
          <DetailSection mode="row" data={detail} />

          {/* Selection Card - Improved */}
          {selectedSeats.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  position: "sticky",
                  top: 20,
                  background: `linear-gradient(145deg, #ffffff 0%, ${alpha(
                    theme.palette.primary.light,
                    0.05
                  )} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, color: "primary.main" }}
                  >
                    Your Selection
                  </Typography>
                  <Chip
                    label={selectedSeats.length}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>

                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  {selectedSeats.map((seat) => {
                    const typeColor = getTypeColor(seat.type || "ECONOMY");

                    return (
                      <Box
                        key={seat.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: seat.isBooked
                            ? `${theme.palette.error.light}15`
                            : `${typeColor}08`,
                          border: `2px solid ${
                            seat.isBooked
                              ? alpha(theme.palette.error.main, 0.2)
                              : alpha(typeColor, 0.3)
                          }`,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              backgroundColor: seat.isBooked
                                ? theme.palette.error.main
                                : typeColor,
                              boxShadow: `0 2px 8px ${alpha(
                                seat.isBooked
                                  ? theme.palette.error.main
                                  : typeColor,
                                0.4
                              )}`,
                            }}
                          />
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              {seat.seatRow}
                              {seat.seatNumber}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {seat.type}
                            </Typography>
                          </Box>
                        </Box>

                        {seat.isBooked && (
                          <Chip
                            label="Already Booked"
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              color: theme.palette.error.dark,
                              bgcolor: `${theme.palette.error.light}30`,
                              border: `1px solid ${alpha(
                                theme.palette.error.main,
                                0.3
                              )}`,
                            }}
                          />
                        )}
                        <Button
                          onClick={() => handleNavigateBooking(seat)}
                          variant="outlined"
                        >
                          {" "}
                          Booking
                        </Button>
                      </Box>
                    );
                  })}
                </Stack>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <IconButton
                    onClick={handleResetSelections}
                    aria-label="Reset selections"
                    color="error"
                    size="medium"
                    sx={{
                      borderRadius: 2,
                      bgcolor: `${theme.palette.error.light}15`,
                      "&:hover": {
                        bgcolor: `${theme.palette.error.light}25`,
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <RestartAlt />
                  </IconButton>
                </Box>

                <Divider
                  sx={{
                    my: 2,
                    borderColor: alpha(theme.palette.primary.main, 0.1),
                  }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleOpenUpdateModal}
                  disabled={selectedSeats.length === 0}
                  startIcon={<Flight />}
                  sx={{
                    py: 1.5,
                    fontSize: "16px",
                    fontWeight: 700,
                    borderRadius: 3,
                    textTransform: "none",
                    boxShadow: `0 4px 16px ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 6px 20px ${alpha(
                        theme.palette.primary.main,
                        0.4
                      )}`,
                    },
                    transition: "all 0.3s ease-in-out",
                    "&:disabled": {
                      bgcolor: "grey.300",
                      color: "grey.500",
                    },
                  }}
                >
                  Continue to Booking ({selectedSeats.length}{" "}
                  {selectedSeats.length === 1 ? "Seat" : "Seats"})
                </Button>
              </Card>
            </Box>
          )}
        </Grid>

        {/* Right Panel - Seat Map */}
        <Grid size={6}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              p: 2,
              borderRadius: 3,
              bgcolor: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h5" fontWeight={800} color="primary.main">
              {getAllInfoFlightByIdData?.data?.aircraft?.model ||
                "Unknown Model"}{" "}
              — Seat Map
            </Typography>
          </Box>

          {/* Seat Map Container - Improved */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "white",
              borderRadius: 3,
              height: "60vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.5),
              },
            }}
          >
            {/* Aircraft Nose */}
            <Box
              sx={{
                width: "50%",
                height: "40px",
                borderTopLeftRadius: "50%",
                borderTopRightRadius: "50%",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                mb: 1,
                position: "relative",
                "&::after": {
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "20px",
                },
              }}
            />

            {/* Seat Rows */}
            {Array.from({ length: seatCount }, (_, rowIndex) => {
              const row = rowIndex + 1;

              return (
                <Box
                  key={row}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 0.5,
                    position: "relative",
                  }}
                >
                  {/* Row Number */}
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      left: 10,
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    {row}
                  </Typography>

                  {/* Left Side Seats */}
                  {["A", "B", "C"].map((col) => {
                    const seat = filteredSeats?.find(
                      (s) => s.seatNumber === row && s.seatRow === col
                    );
                    return seat ? (
                      <ButtonSeat
                        key={col}
                        seat={seat}
                        selectedSeats={selectedSeats}
                        handleSelectSeat={handleSelectSeat}
                      />
                    ) : (
                      <Box key={col} sx={{ width: 42, height: 42, m: "4px" }} />
                    );
                  })}

                  {/* Aisle */}
                  <Box
                    sx={{
                      width: 80,
                      height: 4,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: 2,
                      mx: 1,
                    }}
                  />

                  {/* Right Side Seats */}
                  {["D", "E", "F"].map((col) => {
                    const seat = filteredSeats?.find(
                      (s) => s.seatNumber === row && s.seatRow === col
                    );
                    return seat ? (
                      <ButtonSeat
                        key={col}
                        seat={seat}
                        selectedSeats={selectedSeats}
                        handleSelectSeat={handleSelectSeat}
                      />
                    ) : (
                      <Box key={col} sx={{ width: 42, height: 42, m: "4px" }} />
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        </Grid>
        {/* <LegendItem /> */}
      </Grid>

      {isUpdateModalOpen && (
        <ChooseSeatModal
          open={openSeatModal}
          selectedSeats={updateSeat}
          onSuccess={handleCloseModal}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
};

export default memo(PassengerChooseSeat);
