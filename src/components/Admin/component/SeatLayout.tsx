import React, { useCallback, useMemo, useState } from "react";
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
import ReviewsIcon from "@mui/icons-material/Reviews";
import { useGetAllInfoFlightByIDData } from "../../Api/useGetApi";
import DetailSection, { type IDetailItem } from "../../../common/DetailSection";
import ButtonSeat from "./ButtonSeat";
import type { Seat } from "../../../utils/type";
import { Chair, LocalAirport, RestartAlt } from "@mui/icons-material";
import { useSeatUpdateByIds, type SeatUpdateProps } from "../../Api/usePostApi";
import SeatManagementModal from "../../User/SeatManagementModal";

type FlightIdProps = {
  id: number;
};

type AircraftSeatTypeProps = "ALL" | "VIP" | "ECONOMY" | "WINDOW";

const SeatLayout: React.FC<FlightIdProps> = ({ id }) => {
  const { getAllInfoFlightByIdData } = useGetAllInfoFlightByIDData({ id });
  const { refetchUpdateSeatByIds } = useSeatUpdateByIds();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  // State để quản lý số ghế tối đa có thể chọn
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

  const [seatOptions, setSeatOptions] = useState({
    available: !!getAllInfoFlightByIdData?.data?.seats?.some(
      (seat) => seat.isAvailable
    ),
    isBooked: !!getAllInfoFlightByIdData?.data?.seats?.some(
      (seat) => seat.isBooked
    ),
    premiumOnly: !!getAllInfoFlightByIdData?.data?.seats?.some(
      (seat) => seat.type === "BUSINESS" || seat.type === "FIRST"
    ),
    handicapAccessible: !!getAllInfoFlightByIdData?.data?.seats?.some(
      (seat) => seat.isHandicapAccessible
    ),
    lavatory: !!getAllInfoFlightByIdData?.data?.seats?.some(
      (seat) => seat.isNearLavatory
    ),
    exitRow: !!getAllInfoFlightByIdData?.data?.seats?.some(
      (seat) => seat.isExitRow
    ),
    upperDeck: !!getAllInfoFlightByIdData?.data?.seats?.some(
      (seat) => seat.isUpperDeck
    ),
    wing: !!getAllInfoFlightByIdData?.data?.seats?.some((seat) => seat.isWing),
  });
  const [filter, setFilter] = useState<AircraftSeatTypeProps>("ALL");
  // const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]); // Thay đổi từ number[] sang Seat[]
  const [message, setMessage] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateSeat, setUpdateSeat] = useState<SeatUpdateProps>({
    seatIds: [],
    type: "ECONOMY",
    isAvailable: false,
  });
  const handleOpenUpdateModal = useCallback(() => {
    if (selectedSeats.length === 0) {
      setMessage("Please select at least one seat to update.");
      return;
    }

    // Lấy thông tin từ ghế đầu tiên
    const firstSeat = selectedSeats[0];

    // Cập nhật state updateSeat với thông tin từ ghế được chọn
    setUpdateSeat({
      seatIds: selectedSeats.map((seat) => seat.id),
      type: firstSeat.type,
    });

    setIsUpdateModalOpen(true);
  }, [selectedSeats]);

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleResetSelections = () => {
    setSelectedSeats([]);
    setUpdateSeat({
      seatIds: [],
      type: "ECONOMY",
    });
    setMessage("");
  };

  const handleUpdateSeatsByIds = useCallback(async () => {
    const res = await refetchUpdateSeatByIds(updateSeat);
  }, [refetchUpdateSeatByIds]);

  const seatOptionList = [
    { name: "available", label: "Available" },
    { name: "isBooked", label: "Occupied" },
    { name: "premiumOnly", label: "Premium Only" },
    {
      name: "handicapAccessible",
      label: "Handicap Accessible",
      icon: <AccessibilityNewIcon />,
    },
    { name: "lavatory", label: "Lavatory", icon: <WcIcon /> },
    { name: "exitRow", label: "Exit Row" },
    { name: "upperDeck", label: "Upper Deck" },
    { name: "wing", label: "Wing" },
  ];

  const filteredSeats = useMemo(() => {
    if (filter === "ALL") return getAllInfoFlightByIdData?.data?.seats;
    if (filter === "WINDOW")
      return getAllInfoFlightByIdData?.data?.seats?.filter((s) => s.isBooked);
    return getAllInfoFlightByIdData?.data?.seats?.filter(
      (s) => s.type === filter
    );
  }, [getAllInfoFlightByIdData, filter]);

  const handleSelectSeat = (seat: Seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);

      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }

      if (maxSelectSeats === 1) {
        return [seat];
      } else {
        if (prev.length < maxSelectSeats) {
          return [...prev, seat];
        } else {
          return prev;
        }
      }
    });
  };

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
              <>
                <Typography variant="h6" gutterBottom>
                  Seat Options
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <FormGroup row>
                    {seatOptionList.map((opt) => (
                      <FormControlLabel
                        key={opt.name}
                        control={
                          <Checkbox
                            checked={
                              seatOptions[opt.name as keyof typeof seatOptions]
                            }
                            onChange={(e) =>
                              setSeatOptions((prev) => ({
                                ...prev,
                                [opt.name]: e.target.checked,
                              }))
                            }
                            icon={opt.icon}
                            checkedIcon={opt.icon}
                          />
                        }
                        label={opt.label}
                      />
                    ))}
                  </FormGroup>
                </Box>
              </>
            )}
            <Typography>selectedSeats : {selectedSeats.length}</Typography>
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

        {/* Create Alert Section */}

        <Box sx={{ width: { xs: "100%", md: "320px" } }}>
          <Card
            sx={{
              padding: { xs: "16px", sm: "20px" },
              borderRadius: "12px",
              // boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
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

                    const typeColor = getTypeColor(seat.type || "ECONOMY");

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
                  onUpdate={() => {}}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              Create Seat Alert
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create Aircraft Change Alert
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<ReviewsIcon />}>
            Create Alert
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SeatLayout;
