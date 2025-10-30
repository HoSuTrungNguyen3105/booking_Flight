import React, { memo } from "react";
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
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DetailSection from "../../../../../common/CustomRender/DetailSection";
import ButtonSeat from "../../Seat/ButtonSeat";
import type { Seat } from "../../../../../utils/type";
import { Chair, LocalAirport, RestartAlt } from "@mui/icons-material";
import SeatManagementModal from "../../Seat/SeatManagementModal";
import CreateSeat from "../../Seat/SeatCreatePage";
import InfoAndUpdateSeatModal from "../../Seat/InfoAndUpdateSeatModal";
import _ from "lodash";
import LegendItem from "../../Seat/LegendItem";
import {
  useSeatInFlightDetail,
  type AircraftSeatTypeProps,
} from "../hooks/useSeatInFlightDetail";

type FlightWithSeatLayoutProps = {
  id: number;
  onReturn: () => void;
};

const FlightWithSeatLayout: React.FC<FlightWithSeatLayoutProps> = ({
  id,
  onReturn,
}) => {
  const {
    detail,
    setMaxSelectSeats,
    getTypeColor,
    handleSelectSeat,
    setSelectedSeats,
    seatCount,
    filteredSeats,
    handleResetSelections,
    handleCloseModal,
    handleDeleteSeatInFlight,
    isUpdateModalOpen,
    setFilter,
    openSeatModal,
    createSeat,
    setCreateSeat,
    updateSeat,
    handleOpenUpdateModal,
    selectedSeat,
    refetchGetAllInfoFlightData,
    getAllInfoFlightByIdData,
    selectedSeats,
    maxSelectSeats,
    filter,
    setOpenSeatModal,
    setSelectedSeat,
  } = useSeatInFlightDetail({
    id,
  });

  if (createSeat) {
    return (
      <CreateSeat
        flightId={id}
        onSuccess={() => {
          setCreateSeat(false);
          refetchGetAllInfoFlightData();
        }}
        loading={false}
      />
    );
  }

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
          <Button onClick={onReturn} variant="contained">
            {" "}
            Return
          </Button>
          <Chip
            icon={<FlightTakeoffIcon />}
            label={getAllInfoFlightByIdData?.data?.aircraft?.model ?? "Unknown"}
            color="primary"
            variant="outlined"
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <LocalAirport sx={{ fontSize: 28 }} />
            {[
              { key: "ALL", label: "All Seats" },
              { key: "VIP", label: "VIP" },
              { key: "ECONOMY", label: "Economy" },
              { key: "FIRST", label: "First" },
              { key: "BUSINESS", label: "BUSINESS" },
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

            <Typography>Select Multi seat</Typography>

            <Button
              variant={maxSelectSeats > 1 ? "contained" : "outlined"}
              onClick={() => setMaxSelectSeats(50)}
            >
              Multiple
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
                                gap: 1,
                                padding: "4px 8px",
                                borderRadius: "4px",
                                backgroundColor: `${typeColor}10`,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  backgroundColor: typeColor,
                                }}
                              />
                              <Typography variant="body2">
                                {seat.seatRow}
                                {seat.seatNumber} - {seat.type}
                              </Typography>
                              {seat.isBooked && (
                                <Chip
                                  label="Booked"
                                  size="small"
                                  color="error"
                                  sx={{ height: 20, fontSize: "0.7rem" }}
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
                      {/*                         
                        {updateSeat.seatIds} */}
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
                  "Unknown Model"}{" "}
                — Seat Map
              </Typography>

              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDeleteSeatInFlight(id)}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 2,
                }}
              >
                Delete all seats
              </Button>
            </Box>

            <LegendItem />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                mt: 1,
                bgcolor: "#fafafa",
                borderRadius: 2,
                height: "27rem",
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
                  width: "80%",
                  height: "20px",
                  borderTopLeftRadius: "50%",
                  borderTopRightRadius: "50%",
                  bgcolor: "#e0e0e0",
                  mb: 1,
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
                      mb: 0.8,
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
        <SeatManagementModal
          open={isUpdateModalOpen}
          selectedSeats={updateSeat}
          onSuccess={handleCloseModal}
          onClose={handleCloseModal}
        />
      )}

      {selectedSeat && (
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
      )}
    </Box>
  );
};

export default memo(FlightWithSeatLayout);
