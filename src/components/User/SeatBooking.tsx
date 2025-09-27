import React, { useState, useCallback, useMemo, memo } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  Chip,
  Card,
  Divider,
  useTheme,
  useMediaQuery,
  type SelectChangeEvent,
} from "@mui/material";
import {
  Chair,
  StarBorder,
  Wc,
  Flight,
  Window as WindowIcon,
  RestartAlt,
  LocalAirport,
  WorkOutline,
} from "@mui/icons-material";
import type { Seat } from "../../utils/type";
import {
  useGetSeatByFlightId,
  useSeatCreate,
  useSeatUpdateByIds,
  type CreateSeatDto,
  type SeatTypeValue,
  type SeatUpdateProps,
} from "../Api/usePostApi";
import LegendItemSection from "./LegendItem";
import CreateSeat from "./CreateSeat";
import SeatManagementModal from "./SeatManagementModal";

type AircraftSeatTypeProps = "ALL" | "VIP" | "ECONOMY" | "WINDOW";

type AircraftSeatProps = {
  // seats: Seat[];
  flightId: number;
  onSuccess: () => void;
  loadingFlightData: boolean;
};

const SeatBooking: React.FC<AircraftSeatProps> = ({
  // seats,
  flightId,
  onSuccess,
  loadingFlightData,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]); // Thay đổi từ number[] sang Seat[]
  const [message, setMessage] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [filter, setFilter] = useState<AircraftSeatTypeProps>("ALL");
  const { refetchSeatCreate } = useSeatCreate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const { dataGetSeatByFlightId } = useGetSeatByFlightId({ id: flightId });
  const [newSeat, setNewSeat] = useState<CreateSeatDto>({
    seatNumber: 0,
    seatRow: "",
    flightId: flightId,
    isBooked: false,
  });

  const [updateSeat, setUpdateSeat] = useState<SeatUpdateProps>({
    seatIds: [],
    type: "ECONOMY",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Sửa hàm handleSelectSeat để cập nhật selectedSeats và updateSeat
  const handleSelectSeat = useCallback((seat: Seat) => {
    if (seat.isBooked) return;

    setSelectedSeats((prev) => {
      const isAlreadySelected = prev.some((s) => s.id === seat.id);

      if (isAlreadySelected) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });

    // Cập nhật updateSeat state với thông tin từ ghế được chọn
    setUpdateSeat((prev) => {
      // Nếu đây là ghế đầu tiên được chọn, set tất cả thông tin
      if (prev.seatIds.length === 0) {
        return {
          seatIds: [seat.id],
          type: seat.type,
          seatRow: seat.seatRow,
          seatNumber: seat.seatNumber,
        };
      } else {
        // Nếu đã có ghế được chọn, chỉ cập nhật seatIds
        const isAlreadyInIds = prev.seatIds.includes(seat.id);
        return {
          ...prev,
          seatIds: isAlreadyInIds
            ? prev.seatIds.filter((id) => id !== seat.id)
            : [...prev.seatIds, seat.id],
        };
      }
    });
  }, []);

  const handleResetSelections = () => {
    setSelectedSeats([]);
    setUpdateSeat({
      seatIds: [],
      type: "ECONOMY",
    });
    setMessage("");
  };

  const handleFilterChange = (newFilter: AircraftSeatTypeProps) => {
    setFilter(newFilter);
  };

  const columns = ["A", "B", "C", "D", "E", "F"];
  const rows = Array.from({ length: 40 }, (_, i) => i + 1);
  const { refetchUpdateSeatByIds } = useSeatUpdateByIds();

  // Show snackbar notification
  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle create single seat
  const handleCreateSingleSeat = async () => {
    try {
      const createSeatDto: CreateSeatDto = {
        flightId: newSeat.flightId,
        seatRow: newSeat.seatRow,
        seatNumber: newSeat.seatNumber,
        isBooked: newSeat.isBooked,
      };

      const response = await refetchSeatCreate(createSeatDto);

      if (response?.resultCode === "00") {
        showSnackbar(response.resultMessage);
        setCreateFormOpen(false);
        await onSuccess();
      } else {
        showSnackbar(response?.resultMessage as string, "error");
      }
    } catch (error) {
      console.error("Error creating seat:", error);
      showSnackbar("An error occurred while creating the seat", "error");
    }
  };

  const handleUpdateSeatByIds = async () => {
    try {
      if (updateSeat.seatIds.length === 0) {
        showSnackbar("Please select at least one seat to update", "error");
        return;
      }

      const response = await refetchUpdateSeatByIds(updateSeat);

      if (response?.resultCode === "00") {
        showSnackbar(response.resultMessage);
        setSelectedSeats([]);
        setUpdateSeat({
          seatIds: [],
          type: "ECONOMY",
        });
        await onSuccess();
      } else {
        showSnackbar(response?.resultMessage as string, "error");
      }
    } catch (error) {
      console.error("Error updating seats:", error);
      showSnackbar("An error occurred while updating the seats", "error");
    }
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setUpdateSeat((prev) => ({
      ...prev,
      type: event.target.value as SeatTypeValue,
    }));
  };

  // Handle generate all seats
  const handleGenerateAllSeats = async () => {
    try {
      const createSeatDto: CreateSeatDto = {
        flightId: flightId,
      };

      const response = await refetchSeatCreate(createSeatDto);

      if (response?.resultCode === "00") {
        showSnackbar(response.resultMessage);
        await onSuccess();
      } else {
        showSnackbar(response?.resultMessage as string, "error");
      }
    } catch (error) {
      console.error("Error generating seats:", error);
      showSnackbar("An error occurred while generating seats", "error");
    }
  };

  const resetSeatToGetData = async () => {
    await onSuccess();
    setSelectedSeats([]);
    setUpdateSeat({
      seatIds: [],
      type: "ECONOMY",
    });
    setMessage("");
  };

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

  const renderSeatButton = useCallback(
    (seat: Seat) => {
      const isSelected = selectedSeats.some((s) => s.id === seat.id);
      const isBooked = seat.isBooked;

      let backgroundColor = "#f5f5f5";
      let textColor = theme.palette.primary.main;
      let borderColor = "#ccc";
      let icon = null;

      if (isBooked) {
        backgroundColor = "#bdbdbd";
        textColor = theme.palette.primary.main;
        borderColor = "#a9a9a9";
      } else if (isSelected) {
        backgroundColor = theme.palette.primary.main;
        textColor = theme.palette.primary.contrastText;
        borderColor = theme.palette.primary.main;
      } else if (seat.type === "VIP") {
        backgroundColor = theme.palette.primary.light + "20";
        borderColor = theme.palette.primary.main;
        icon = (
          <StarBorder
            sx={{ color: theme.palette.primary.main, fontSize: 16 }}
          />
        );
      } else if (seat.type === "BUSINESS") {
        backgroundColor = theme.palette.primary.light + "15";
        borderColor = theme.palette.primary.main;
        icon = (
          <WorkOutline
            sx={{ color: theme.palette.primary.main, fontSize: 16 }}
          />
        );
      } else if (seat.type === "ECONOMY") {
        backgroundColor = theme.palette.primary.light + "10";
        borderColor = theme.palette.primary.main;
        icon = (
          <Chair sx={{ color: theme.palette.primary.main, fontSize: 16 }} />
        );
      }

      return (
        <Tooltip
          key={seat.id}
          title={
            <Box>
              <Typography sx={{ color: theme.palette.primary.main }}>
                Seat: {seat.seatNumber}
                {seat.seatRow}
              </Typography>
              <Typography sx={{ color: theme.palette.primary.main }}>
                Type: {seat.type}
              </Typography>
              {seat.isWindow && (
                <Typography sx={{ color: theme.palette.primary.main }}>
                  Window Seat
                </Typography>
              )}
              {seat.nearRestroom && (
                <Typography sx={{ color: theme.palette.primary.main }}>
                  Near Restroom
                </Typography>
              )}
            </Box>
          }
          arrow
        >
          <Button
            onClick={() => !isBooked && handleSelectSeat(seat)}
            disabled={isBooked}
            aria-label={`Seat ${seat.seatNumber}${seat.seatRow}, ${
              seat.isBooked ? "Booked" : seat.type
            }, ${seat.isWindow ? "Window" : ""}`}
            sx={{
              width: { xs: "36px", sm: "42px", md: "45px" },
              height: { xs: "36px", sm: "42px", md: "45px" },
              minWidth: "unset",
              borderRadius: "6px",
              margin: "2px",
              fontSize: { xs: "10px", sm: "12px" },
              fontWeight: 600,
              position: "relative",
              backgroundColor,
              color: textColor,
              border: `2px solid ${borderColor}`,
              cursor: isBooked ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: isSelected
                ? `0px 0px 8px ${theme.palette.primary.main}80`
                : "0px 1px 3px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: isBooked
                  ? "#bdbdbd"
                  : isSelected
                  ? theme.palette.primary.dark
                  : theme.palette.primary.light + "30",
                color: isSelected
                  ? theme.palette.primary.contrastText
                  : theme.palette.primary.main,
                transform: isBooked ? "none" : "scale(1.05)",
                boxShadow: isBooked ? "none" : "0px 2px 6px rgba(0,0,0,0.15)",
              },
              "&:focus": {
                outline: `2px solid ${theme.palette.primary.main}`,
              },
            }}
          >
            <Stack alignItems="center" spacing={0.2}>
              {icon}
              <Box>
                {seat.seatNumber}
                {seat.seatRow}
              </Box>
              {seat.nearRestroom && (
                <Wc
                  sx={{
                    fontSize: 10,
                    color: theme.palette.primary.main,
                    position: "absolute",
                    top: 2,
                    right: 2,
                  }}
                />
              )}
            </Stack>
          </Button>
        </Tooltip>
      );
    },
    [selectedSeats, handleSelectSeat, theme]
  );

  const restroomRows = [1, 15, 30];
  const filteredSeats = useMemo(() => {
    if (filter === "ALL") return dataGetSeatByFlightId?.list;
    if (filter === "WINDOW")
      return dataGetSeatByFlightId?.list?.filter((s) => s.isWindow);
    return dataGetSeatByFlightId?.list?.filter((s) => s.type === filter);
  }, [dataGetSeatByFlightId, filter]);

  if (!dataGetSeatByFlightId || dataGetSeatByFlightId.list?.length === 0) {
    return (
      <CreateSeat
        flightId={flightId}
        onChange={handleGenerateAllSeats}
        loading={loadingFlightData}
      />
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "100%",
        backgroundColor: "#f8f9fa",
        minHeight: "90vh",
        justifyContent: "space-around",
      }}
    >
      <Box
        sx={{
          background: theme.palette.primary.main,
          borderRadius: "8px",
          padding: { xs: "16px", sm: "24px" },
          color: "white",
          marginBottom: "24px",
        }}
      >
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

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          {/* Aircraft Layout */}
          {/* <LegendItemSection /> */}
          <Card
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: { xs: "12px", sm: "16px" },
              maxHeight: { xs: "400px", sm: "500px" },
              overflowY: "auto",
              background: "linear-gradient(180deg, #fafafa 0%, #e8f4fd 100%)",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1976d2",
                fontWeight: "bold",
                mb: 1,
                gap: 1,
              }}
            >
              <Flight sx={{ transform: "rotate(90deg)", fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight="600">
                Aircraft Nose
              </Typography>
            </Box>

            {/* Column Headers */}

            <Box
              display="flex"
              gap={1}
              sx={{ mx: 0.5, justifyContent: "center" }}
            >
              {/* Left Seats Columns */}
              {columns.slice(0, 3).map((col) => (
                <Typography
                  key={col}
                  textAlign="center"
                  fontWeight="700"
                  sx={{
                    fontSize: { xs: "12px", sm: "14px" },
                    color: theme.palette.primary.dark,
                    minWidth: 45,
                  }}
                >
                  {col}
                </Typography>
              ))}

              {/* Row Number Spacer */}
              <Box sx={{ width: 18 }} />
              <Box sx={{ width: 28 }} />
              {/* Right Seats Columns */}
              {columns.slice(3).map((col) => (
                <Typography
                  key={col}
                  textAlign="center"
                  fontWeight="700"
                  sx={{
                    fontSize: { xs: "12px", sm: "14px" },
                    color: theme.palette.primary.dark,
                    minWidth: 45,
                  }}
                >
                  {col}
                </Typography>
              ))}

              {/* Right Window Spacer */}
            </Box>
            {/* Seat Rows */}
            {rows.map((row) => (
              <Box
                key={row}
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={1}
                sx={{
                  backgroundColor: restroomRows.includes(row)
                    ? "#fff8e1"
                    : "transparent",
                  borderRadius: "4px",
                  padding: "4px 0",
                }}
              >
                {/* Window Indicator (Left) */}
                <Box
                  sx={{ width: 28, display: "flex", justifyContent: "center" }}
                >
                  <WindowIcon sx={{ fontSize: 18, color: "#90caf9" }} />
                </Box>

                {/* Left Seats */}
                <Box display="flex" gap={1} sx={{ mx: 0.5 }}>
                  {columns.slice(0, 3).map((col) => {
                    const seat = filteredSeats?.find(
                      (s) => s.seatNumber === row && s.seatRow === col
                    );
                    return seat ? (
                      renderSeatButton(seat)
                    ) : (
                      <Box key={col} width={45} />
                    );
                  })}
                </Box>

                {/* Row Number */}
                <Box
                  width={40}
                  textAlign="center"
                  sx={{
                    backgroundColor: "#e3f2fd",
                    borderRadius: "4px",
                    py: 0.5,
                    mx: 0.5,
                  }}
                >
                  <Typography fontWeight="600">{row}</Typography>
                </Box>

                {/* Right Seats */}
                <Box display="flex" gap={1} sx={{ mx: 0.5 }}>
                  {columns.slice(3).map((col) => {
                    const seat = filteredSeats?.find(
                      (s) => s.seatNumber === row && s.seatRow === col
                    );
                    return seat ? (
                      renderSeatButton(seat)
                    ) : (
                      <Box key={col} width={45} />
                    );
                  })}
                </Box>

                {/* Window Indicator (Right) */}
                <Box
                  sx={{ width: 28, display: "flex", justifyContent: "center" }}
                >
                  <WindowIcon sx={{ fontSize: 18, color: "#90caf9" }} />
                </Box>
              </Box>
            ))}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1976d2",
                fontWeight: "bold",
                mt: 1,
                gap: 1,
              }}
            >
              <Flight sx={{ transform: "rotate(-90deg)", fontSize: 20 }} />
              <Typography variant="subtitle1" fontWeight="600">
                Aircraft Tail
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* Sidebar - Selected Seats */}
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
      </Box>
    </Box>
  );
};

export default memo(SeatBooking);
