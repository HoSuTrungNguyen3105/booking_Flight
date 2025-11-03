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
} from "@mui/material";
import _ from "lodash";
import { Chair, LocalAirport, RestartAlt } from "@mui/icons-material";
import type { AircraftSeatTypeProps } from "../Admin/component/Flight/hooks/useSeatInFlightDetail";
import DetailSection from "../../common/CustomRender/DetailSection";
import theme from "../../scss/theme";
import { useChooseSeatToBooking } from "./useChooseSeatToBooking";
import LegendItem from "../Admin/component/Seat/ButtonSeat/LegendItem";
import ButtonSeat from "../Admin/component/Seat/ButtonSeat";
import ChooseSeatModal from "./ChooseSeatModal";
import { useLocation, useNavigate } from "react-router-dom";

// type FlightWithSeatLayoutProps = {
//   id: number;
// };

const PassengerChooseSeat = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const navigate = useNavigate();
  const {
    detail,
    setMaxSelectSeats,
    getTypeColor,
    handleSelectSeat,
    // setSelectedSeats,
    seatCount,
    filteredSeats,
    handleResetSelections,
    handleCloseModal,
    isUpdateModalOpen,
    setFilter,
    openSeatModal,
    setCreateSeat,
    updateSeat,
    handleOpenUpdateModal,
    // selectedSeat,
    // refetchGetAllInfoFlightData,
    getAllInfoFlightByIdData,
    selectedSeats,
    maxSelectSeats,
    filter,
    // setOpenSeatModal,
    // setSelectedSeat,
  } = useChooseSeatToBooking({
    id,
  });

  return (
    <Box sx={{ maxWidth: "100%" }}>
      <Box sx={{ p: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Button onClick={() => navigate(-1)} variant="contained">
            {" "}
            Return
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <LocalAirport sx={{ fontSize: 28 }} />
            {[
              { key: "ALL", label: "All Seats" },
              { key: "VIP", label: "VIP" },
              { key: "ECONOMY", label: "Economy" },
              { key: "FIRST", label: "First" },
              { key: "BUSINESS", label: "Business" },
            ].map((item) => (
              <Chip
                key={item.key}
                label={item.label}
                onClick={() => setFilter(item.key as AircraftSeatTypeProps)}
                variant={filter === item.key ? "filled" : "outlined"}
                color={filter === item.key ? "primary" : "default"}
                sx={{
                  fontWeight: filter === item.key ? "600" : "400",
                  ...(filter === item.key && {
                    backgroundColor: "primary.main",
                    color: "white",
                  }),
                }}
              />
            ))}
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={6} gap={1}>
            <Typography>Select one seat</Typography>
            <Button variant="contained" onClick={() => setCreateSeat(true)}>
              Create Seat
            </Button>

            <Button
              variant={maxSelectSeats === 1 ? "contained" : "outlined"}
              onClick={() => setMaxSelectSeats(1)}
            >
              Single
            </Button>

            <DetailSection mode="row" data={detail} />

            {selectedSeats.length > 0 && (
              <Box sx={{ pt: 1, width: { xs: "100%", md: "320px" } }}>
                <Card
                  sx={{
                    padding: { xs: "16px", sm: "20px" },
                    borderRadius: 1,
                    position: "sticky",
                    top: 20,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "700", mb: 2 }}>
                    Your Selection
                  </Typography>

                  {selectedSeats.length > 0 ? (
                    <Box>
                      <Stack spacing={1} sx={{ mb: 2 }}>
                        {selectedSeats.map((seat) => {
                          const typeColor = getTypeColor(
                            seat.type || "ECONOMY"
                          );

                          return (
                            <Box
                              key={seat.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1.5,
                                p: "6px 10px",
                                borderRadius: 2,
                                backgroundColor: seat.isBooked
                                  ? `${theme.palette.error.light}22`
                                  : `${typeColor}10`,
                                border: `1px solid ${
                                  seat.isBooked
                                    ? theme.palette.error.light
                                    : `${typeColor}40`
                                }`,
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                  backgroundColor: seat.isBooked
                                    ? `${theme.palette.error.light}33`
                                    : `${typeColor}22`,
                                  transform: "translateY(-1px)",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor: seat.isBooked
                                      ? theme.palette.error.main
                                      : typeColor,
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: seat.isBooked ? 600 : 500,
                                    color: seat.isBooked
                                      ? theme.palette.error.dark
                                      : theme.palette.text.primary,
                                  }}
                                >
                                  {seat.seatRow}
                                  {seat.seatNumber} — {seat.type}
                                </Typography>
                              </Box>

                              {/* Status chip */}
                              {seat.isBooked && (
                                <Chip
                                  label="Booked"
                                  size="small"
                                  sx={{
                                    height: 22,
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    color: theme.palette.error.dark,
                                    bgcolor: `${theme.palette.error.light}99`,
                                    "& .MuiChip-label": {
                                      px: 1,
                                    },
                                  }}
                                />
                              )}
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
                          size="small"
                        >
                          <RestartAlt />
                        </IconButton>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleOpenUpdateModal}
                        disabled={selectedSeats.length === 0}
                        sx={{
                          py: 1.5,
                          fontSize: "16px",
                          fontWeight: 600,
                          borderRadius: "8px",
                        }}
                      >
                        Update
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 3 }}>
                      <Chair sx={{ fontSize: 48, color: "#e0e0e0", mb: 1 }} />
                      <Typography color="textSecondary">
                        No seats selected yet. Choose your seats from the map.
                      </Typography>
                    </Box>
                  )}
                </Card>
              </Box>
            )}
          </Grid>

          <Grid size={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                {getAllInfoFlightByIdData?.data?.aircraft?.model ||
                  " Unknown Model"}{" "}
                — Seat Map
              </Typography>
            </Box>

            <LegendItem />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // gap: 1,
                // mt: 1,
                bgcolor: "#fafafa",
                borderRadius: 2,
                height: "53vh",
                overflowY: "auto",
                position: "relative",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#bdbdbd",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#9e9e9e",
                },
              }}
            >
              {/* phần đầu máy bay */}
              <Box
                sx={{
                  width: "60%",
                  height: "20%",
                  borderTopLeftRadius: "50%",
                  borderTopRightRadius: "50%",
                  bgcolor: "#e0e0e0",
                  mb: 0.5,
                }}
              />

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
                    }}
                  >
                    {/* Cột trái */}
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
                        <Box
                          key={col}
                          sx={{ width: 42, height: 42, m: "4px" }}
                        />
                      );
                    })}

                    {/* Lối đi */}
                    <Box sx={{ width: 60 }} />

                    {/* Cột phải */}
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
                        <Box
                          key={col}
                          sx={{ width: 42, height: 42, m: "4px" }}
                        />
                      );
                    })}
                  </Box>
                );
              })}

              {/* phần đuôi máy bay */}
              <Box
                sx={{
                  width: "60%",
                  height: "20px",
                  borderBottomLeftRadius: "50%",
                  borderBottomRightRadius: "50%",
                  bgcolor: "#e0e0e0",
                  mt: 1,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {isUpdateModalOpen && (
        <ChooseSeatModal
          open={openSeatModal}
          selectedSeats={updateSeat}
          onSuccess={handleCloseModal}
          onClose={handleCloseModal}
        />
      )}

      {/* {selectedSeat && (
        <InfoAndUpdateSeatModal
          open={openSeatModal}
          onClose={() => setOpenSeatModal(false)}
          formData={selectedSeat}
          setFormData={(s) => {
            setSelectedSeat(s as Seat);
          }}
          onSuccess={() => {
            setOpenSeatModal(false);
            refetchGetAllInfoFlightData();
            setSelectedSeats([]);
          }}
        />
      )} */}
    </Box>
  );
};

export default memo(PassengerChooseSeat);
