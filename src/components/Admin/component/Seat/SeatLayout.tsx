import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Button,
  IconButton,
  Card,
  Stack,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import WcIcon from "@mui/icons-material/Wc";
import { useGetAllInfoFlightByIDData } from "../../../Api/useGetApi";
import DetailSection, {
  type IDetailItem,
} from "../../../../common/DetailSection";
import ButtonSeat from "./ButtonSeat";
import type { Seat } from "../../../../utils/type";
import { Chair, LocalAirport, RestartAlt } from "@mui/icons-material";
import { type SeatUpdateProps } from "../../../Api/usePostApi";
import SeatManagementModal from "../../../User/SeatManagementModal";
import CreateSeat from "../../../User/CreateSeat";
import InfoAndUpdateSeatModal from "../../modal/InfoAndUpdateSeatModal";
import { useToast } from "../../../../context/ToastContext";

type FlightIdProps = {
  id: number;
  onReturn: () => void;
};

type AircraftSeatTypeProps = "ALL" | "VIP" | "ECONOMY" | "FIRST" | "BUSINESS";

const SeatLayout: React.FC<FlightIdProps> = ({ id, onReturn }) => {
  const { getAllInfoFlightByIdData, refetchGetAllInfoFlightData } =
    useGetAllInfoFlightByIDData({ id });
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [maxSelectSeats, setMaxSelectSeats] = useState<number>(1);
  const detail: IDetailItem[] = [
    {
      title: "Flight No",
      description: getAllInfoFlightByIdData?.data?.flightNo,
      size: 12,
    },
    {
      title: "Aircraft",
      description: getAllInfoFlightByIdData?.data?.aircraft?.model,
      size: 12,
    },
    {
      title: "Aircraft Code",
      description: getAllInfoFlightByIdData?.data?.aircraftCode,
      size: 12,
    },
    {
      title: "Arrival Airport",
      description: getAllInfoFlightByIdData?.data?.arrivalAirport,
      size: 12,
    },
    {
      title: "Departure Airport",
      description: getAllInfoFlightByIdData?.data?.departureAirport,
      size: 12,
    },
    {
      title: "City",
      description: getAllInfoFlightByIdData?.data?.arrivalAirportRel?.city,
      size: 12,
    },
    {
      title: "Flight ID",
      description: getAllInfoFlightByIdData?.data?.flightId,
      size: 12,
    },
    {
      title: "Status",
      description: getAllInfoFlightByIdData?.data?.status,
      size: 12,
    },
    {
      title: "Flight Type",
      description: getAllInfoFlightByIdData?.data?.flightType,
      size: 12,
    },
    {
      title: "Seats",
      description: getAllInfoFlightByIdData?.data?.seats?.length,
      size: 12,
    },
  ];

  const [filter, setFilter] = useState<AircraftSeatTypeProps>("ALL");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [createSeat, setCreateSeat] = useState(false);
  const [openSeatModal, setOpenSeatModal] = useState(false);

  const [updateSeat, setUpdateSeat] = useState<{ seatIds: number[] }>({
    seatIds: [],
    // type: "ECONOMY",
    // isAvailable: false,
  });
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const toast = useToast();
  const handleOpenUpdateModal = useCallback(() => {
    if (selectedSeats.length === 0) {
      toast("Please select at least one seat to update.");
      return;
    }
    setUpdateSeat({
      seatIds: selectedSeats.map((seat) => seat.id),
    });

    setIsUpdateModalOpen(true);
  }, [selectedSeats]);

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleResetSelections = () => {
    // setSelectedSeats([]);
    // setUpdateSeat({
    //   seatIds: [],
    //   type: "ECONOMY",
    // });
  };

  const filteredSeats = useMemo(() => {
    if (filter === "ALL") return getAllInfoFlightByIdData?.data?.seats;
    if (filter === "FIRST")
      return getAllInfoFlightByIdData?.data?.seats?.filter(
        (s) => s.type === "FIRST"
      );
    if (filter === "BUSINESS")
      return getAllInfoFlightByIdData?.data?.seats?.filter(
        (s) => s.type === "BUSINESS"
      );
    if (filter === "VIP")
      return getAllInfoFlightByIdData?.data?.seats?.filter(
        (s) => s.type === "VIP"
      );
    if (filter === "ECONOMY")
      return getAllInfoFlightByIdData?.data?.seats?.filter(
        (s) => s.type === "ECONOMY"
      );
    return getAllInfoFlightByIdData?.data?.seats?.filter(
      (s) => s.type === filter
    );
  }, [getAllInfoFlightByIdData, filter]);

  const handleSelectSeat = (seat: Seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }
      if (maxSelectSeats === 1) return [seat];
      if (prev.length < maxSelectSeats) return [...prev, seat];
      return prev;
    });
  };

  useEffect(() => {
    if (selectedSeats.length === 1) {
      setSelectedSeat(selectedSeats[0]);
      setOpenSeatModal(true);
    } else {
      setSelectedSeat(null);
      setOpenSeatModal(false);
    }
  }, [selectedSeats]);

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
      <Box sx={{ borderRadius: 2, p: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Scale
          </Typography>
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
              { key: "WINDOW", label: "Window" },
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

        <Grid container spacing={4}>
          {/* Info + Options */}
          <Grid size={6}>
            <Typography>Select one seat</Typography>
            <Button variant="contained" onClick={() => setCreateSeat(true)}>
              Create Seat
            </Button>
            {/* {(!getAllInfoFlightByIdData?.data?.seats ||
              getAllInfoFlightByIdData.data.seats.length === 0) && (
              <Button variant="contained" onClick={() => setCreateSeat(true)}>
                Create Seat
              </Button>
            )} */}

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
                  setSelectedSeat(null);
                }}
              />
            )}

            <DetailSection mode="row" data={detail} />

            {selectedSeats.length > 0 && (
              <>
                <Box sx={{ width: { xs: "100%", md: "320px" } }}>
                  <Card
                    sx={{
                      padding: { xs: "16px", sm: "20px" },
                      borderRadius: "12px",
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
                            const getTypeColor = (type: string) => {
                              switch (type) {
                                case "FIRST":
                                  return "#ff9800";
                                case "BUSINESS":
                                  return "#2196f3";
                                default:
                                  return "#4caf50";
                              }
                            };

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
                        <SeatManagementModal
                          open={isUpdateModalOpen}
                          selectedSeats={updateSeat}
                          onSuccess={handleCloseModal}
                          onClose={handleCloseModal}
                        />
                        {updateSeat.seatIds}
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
              </>
            )}
          </Grid>

          {/* Seat Map */}
          <Grid size={6}>
            <Typography variant="h6" gutterBottom>
              {getAllInfoFlightByIdData?.data?.aircraft?.model} Seat Map
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 1,
                height: "30rem", // hoặc "100%", hoặc "calc(100vh - 200px)" tuỳ layout
                overflowY: "auto", // 👈 Cho phép cuộn dọc
                scrollbarWidth: "thin",
              }}
            >
              {Array.from({ length: 40 }, (_, rowIndex) => {
                const row = rowIndex + 1;

                return (
                  <Box
                    key={row}
                    sx={{ display: "flex", justifyContent: "center", mb: 1 }}
                  >
                    {/* 3 ghế bên trái */}
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
                          sx={{ width: 42, height: 42, margin: "4px" }}
                        />
                      );
                    })}

                    {/* Lối đi */}
                    <Box sx={{ width: 40 }} />

                    {/* 3 ghế bên phải */}
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
                          sx={{ width: 42, height: 42, margin: "4px" }}
                        />
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
      </Box>
    </Box>
  );
};

export default SeatLayout;
