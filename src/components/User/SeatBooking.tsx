import React, { useState, useCallback, useMemo } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  type SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import {
  Chair,
  StarBorder,
  StarHalfSharp,
  Wc,
  Flight,
  Window as WindowIcon,
  RestartAlt,
  LocalAirport,
  WorkOutline,
  Add,
} from "@mui/icons-material";
import type { Seat } from "../../utils/type";
import DialogConfirm from "../../common/Modal/DialogConfirm";
import InputTextField from "../../common/Input/InputTextField";
import {
  useGetSeatByFlightId,
  useSeatCreate,
  useSeatUpdateByIds,
  type CreateSeatDto,
  type SeatTypeValue,
  type SeatUpdateProps,
} from "../Api/usePostApi";
import { Loading } from "../../common/Loading/Loading";

type AircraftSeatTypeProps = "ALL" | "VIP" | "ECONOMY" | "WINDOW";

type LegendItemProps = {
  color: string;
  label: string;
  icon?: React.ReactNode;
};

type AircraftSeatProps = {
  seats: Seat[];
  flightId: number;
  onSuccess: () => void;
  loadingFlightData: boolean;
};

const SeatBooking: React.FC<AircraftSeatProps> = ({
  seats,
  flightId,
  onSuccess,
  loadingFlightData,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [filter, setFilter] = useState<AircraftSeatTypeProps>("ALL");
  // const [columns, setColumns] = useState(["A", "B", "C", "D", "E", "F"]);
  const { refetchSeatCreate } = useSeatCreate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [createFormOpen, setCreateFormOpen] = useState(false);

  const [newSeat, setNewSeat] = useState<CreateSeatDto>({
    seatNumber: 0,
    seatRow: "",
    flightId: flightId,
    isBooked: false,
  });

  const [updateSeat, setUpdateSeat] = useState<SeatUpdateProps>({
    seatNumber: 0,
    seatRow: "",
    seatIds: selectedSeats,
    type: "ECONOMY", // String value
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSelectSeat = useCallback(
    (seatId: number) => {
      const seat = seats.find((s) => s.id === seatId);
      if (!seat || seat.isBooked) return;

      setSelectedSeats((prev) =>
        prev.includes(seatId)
          ? prev.filter((id) => id !== seatId)
          : [...prev, seatId]
      );
    },
    [seats]
  );

  const handleResetSelections = () => {
    setSelectedSeats([]);
    setMessage("");
  };

  // const { refetchGetSeatByFlightId } = useGetSeatByFlightId({ id: flightId });

  const handleOpenModal = () => {
    if (selectedSeats.length === 0) {
      setMessage("Please select at least one seat.");
      return;
    }
    setOpenModal(true);
  };

  // Handle filter change
  const handleFilterChange = (newFilter: AircraftSeatTypeProps) => {
    setFilter(newFilter);
  };

  const columns = ["A", "B", "C", "D", "E", "F"];
  const rows = Array.from({ length: 40 }, (_, i) => i + 1); //todo
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
        onSuccess(); // Refresh seats data
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
      if (selectedSeats.length === 0) {
        showSnackbar("Please select at least one seat to update", "error");
        return;
      }

      const updateData = {
        seatIds: selectedSeats,
        type: updateSeat.type,
        seatRow: updateSeat.seatRow,
        seatNumber: updateSeat.seatNumber,
      };

      const response = await refetchUpdateSeatByIds(updateData);

      if (response?.resultCode === "00") {
        showSnackbar(response.resultMessage);
        setOpenModal(false);
        setSelectedSeats([]);
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
        onSuccess(); // Refresh seats data
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
    setMessage("");
  };

  const handleOpenUpdateModal = () => {
    if (selectedSeats.length === 0) {
      setMessage("Please select at least one seat to update.");
      return;
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setUpdateSeat({
      seatNumber: 1,
      seatRow: "",
      seatIds: [],
      type: "ECONOMY",
    });
  };

  const handleConfirmUpdate = () => {
    if (selectedSeats.length === 0) {
      setMessage("Please select at least one seat.");
      return;
    }
    setMessage(
      `UPDATE successful! Seats: ${selectedSeats
        .map((id) => {
          const seat = seats.find((s) => s.id === id);
          return `${seat?.seatNumber}${seat?.seatRow}`;
        })
        .join(", ")}`
    );
    setSelectedSeats([]);
    setOpenModal(false);
  };

  const LegendItem = ({ color, label, icon }: LegendItemProps) => (
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
        sx={{ color: "#555", fontSize: isMobile ? "0.75rem" : "0.875rem" }}
      >
        {label}
      </Typography>
    </Box>
  );

  const renderSeatButton = useCallback(
    (seat: Seat) => {
      const isSelected = selectedSeats.includes(seat.id);
      const isBooked = seat.isBooked;

      let backgroundColor = "#f5f5f5";
      let textColor = "#212121";
      let borderColor = "#ccc";
      let icon = null;

      if (isBooked) {
        backgroundColor = "#bdbdbd";
        textColor = "#757575";
        borderColor = "#a9a9a9";
      } else if (isSelected) {
        backgroundColor = "#4caf50";
        textColor = "white";
        borderColor = "#4caf50";
      } else if (seat.type === "VIP") {
        backgroundColor = "#ffebee";
        borderColor = "#c62828";
        icon = <StarBorder sx={{ color: "#c62828", fontSize: 16 }} />;
      } else if (seat.type === "BUSINESS") {
        backgroundColor = "#e3f2fd";
        borderColor = "#1565c0";
        icon = <WorkOutline sx={{ color: "#1565c0", fontSize: 16 }} />; // icon khác Star
      } else if (seat.type === "ECONOMY") {
        backgroundColor = "#e3f2fd";
        borderColor = "#29b6f6";
        icon = <Chair sx={{ color: "#29b6f6", fontSize: 16 }} />;
      }

      return (
        <Tooltip
          key={seat.id}
          title={
            <Box>
              <Typography>
                Seat: {seat.seatNumber}
                {seat.seatRow}
              </Typography>
              <Typography>Type: {seat.type}</Typography>
              {seat.isWindow && <Typography>Window Seat</Typography>}
              {seat.nearRestroom && <Typography>Near Restroom</Typography>}
            </Box>
          }
          arrow
        >
          <Button
            onClick={() => !isBooked && handleSelectSeat(seat.id)}
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
                ? "0px 0px 8px rgba(76, 175, 80, 0.7)"
                : "0px 1px 3px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: isBooked
                  ? "#bdbdbd"
                  : isSelected
                  ? "#388e3c"
                  : "#e0e0e0",
                transform: isBooked ? "none" : "scale(1.05)",
                boxShadow: isBooked ? "none" : "0px 2px 6px rgba(0,0,0,0.15)",
              },
              "&:focus": {
                outline: "2px solid #1976d2",
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
                    color: "#ff9800",
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
    [selectedSeats, handleSelectSeat]
  );

  const restroomRows = [1, 15, 30];
  const [typeState, setTypeState] = useState("");
  const filteredSeats = useMemo(() => {
    if (filter === "ALL") return seats;
    if (filter === "WINDOW") return seats.filter((s) => s.isWindow);
    return seats.filter((s) => s.type === filter);
  }, [seats, filter]);

  if (loadingFlightData) {
    return <Loading />;
  }

  if (!seats || seats.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" mb={2}>
          No Seats Configured
        </Typography>
        <Typography variant="body1" mb={3}>
          You haven't created any seats yet. Would you like to create individual
          seats or generate a complete aircraft layout?
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateFormOpen(true)}
            sx={{ mb: 2 }}
            startIcon={<Add />}
          >
            Create Individual Seat
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={handleGenerateAllSeats}
            sx={{ mb: 2 }}
          >
            Generate All Seats (A-F × 1-40)
          </Button>
          <Button onClick={resetSeatToGetData}>Reset</Button>
        </Box>

        <Dialog
          open={createFormOpen}
          onClose={() => setCreateFormOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Seat</DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <InputTextField
                type="number"
                value={String(newSeat.seatNumber)}
                onChange={(e) =>
                  setNewSeat({ ...newSeat, seatNumber: parseInt(e) || 1 })
                }
              />

              <FormControl fullWidth>
                <InputLabel>Seat Row</InputLabel>
                <Select
                  value={newSeat.seatRow}
                  label="Seat Row"
                  onChange={(e) =>
                    setNewSeat({ ...newSeat, seatRow: e.target.value })
                  }
                >
                  {["A", "B", "C", "D", "E", "F"].map((col) => (
                    <MenuItem key={col} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={newSeat.isBooked}
                    onChange={(e) =>
                      setNewSeat({ ...newSeat, isBooked: e.target.checked })
                    }
                  />
                }
                label="Booked"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateFormOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSingleSeat} variant="contained">
              Create Seat
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: { xs: "12px", sm: "20px", md: "24px" },
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
          borderRadius: "12px",
          padding: { xs: "16px", sm: "24px" },
          color: "white",
          marginBottom: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <LocalAirport sx={{ fontSize: 28 }} />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          {/* Filter Controls */}
          <Card
            sx={{
              padding: { xs: "12px", sm: "16px" },
              marginBottom: "16px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "600", mb: 1 }}>
              Filter by:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
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
          </Card>

          {/* Legend */}
          <Card
            sx={{
              padding: { xs: "12px", sm: "16px" },
              marginBottom: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "600", mb: 1 }}>
              Seat Legend:
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <LegendItem color="#4caf50" label="Selected" />
              <LegendItem color="#f5f5f5" label="Available" />
              <LegendItem color="#d3d3d3" label="Booked" />
              <LegendItem
                color="#f9a825"
                label="VIP"
                icon={<StarHalfSharp />}
              />
              <LegendItem
                color="#29b6f6"
                label="Economy"
                icon={<Chair sx={{ color: "#29b6f6", fontSize: 16 }} />}
              />
              <LegendItem
                color="#e3f2fd"
                label="Window"
                icon={<WindowIcon />}
              />
              <LegendItem
                color="#fff3e0"
                label="Restroom"
                icon={<Wc sx={{ color: "#ff9800", fontSize: 16 }} />}
              />
            </Box>
          </Card>

          {/* Aircraft Layout */}
          <Card
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: { xs: "12px", sm: "16px" },
              maxHeight: { xs: "400px", sm: "500px" },
              overflowY: "auto",
              background: "linear-gradient(180deg, #fafafa 0%, #e8f4fd 100%)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
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
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: "#f5f9ff",
                padding: "8px 0",
                display: "grid",
                gridTemplateColumns: "28px repeat(6, 1fr) 28px",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: "2px solid #e0e0e0",
                mb: 1,
              }}
            >
              <Box /> {/* Empty for window */}
              {columns.map((col) => (
                <Typography
                  key={col}
                  textAlign="center"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "14px", sm: "16px" },
                    color: "#1565c0",
                  }}
                >
                  {col}
                </Typography>
              ))}
              <Box /> {/* Empty for window */}
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
                    const seat = filteredSeats.find(
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
                    const seat = filteredSeats.find(
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
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              position: "sticky",
              top: 20,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "700", mb: 2 }}>
              Your Selection ({selectedSeats})
            </Typography>

            {selectedSeats.length > 0 ? (
              <Box>
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {selectedSeats.map((id) => {
                    const seat = seats.find((s) => s.id === id);
                    if (!seat) return null;

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
                        key={id}
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
                    fontWeight: "600",
                    borderRadius: "8px",
                    background:
                      "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1565c0 0%, #083c86 100%)",
                    },
                  }}
                >
                  Update
                </Button>
                {/* Modal for updating seats */}
                <Dialog open={openModal} onClose={handleCloseModal}>
                  <DialogTitle>Update Selected Seats</DialogTitle>
                  <DialogContent>
                    <Box sx={{ pt: 2 }}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Seat Type</InputLabel>
                        <Select
                          value={updateSeat.type || "ECONOMY"} // ← Direct string value
                          onChange={handleTypeChange}
                        >
                          <MenuItem value="ECONOMY">Economy</MenuItem>
                          <MenuItem value="BUSINESS">Business</MenuItem>
                          <MenuItem value="VIP"> VIP</MenuItem>
                        </Select>
                      </FormControl>

                      <InputTextField
                        value={newSeat.seatRow}
                        onChange={(e) => setNewSeat({ ...newSeat, seatRow: e })}
                        sx={{ mb: 2 }}
                      />

                      <InputTextField
                        type="number"
                        value={String(newSeat.seatNumber)}
                        onChange={(e) =>
                          setNewSeat({
                            ...newSeat,
                            seatNumber: parseInt(e) || 1,
                          })
                        }
                        sx={{ mb: 2 }}
                      />

                      <Typography variant="body2" color="text.secondary">
                        Updating {selectedSeats.length} selected seats
                      </Typography>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleUpdateSeatByIds} variant="contained">
                      Update Seats
                    </Button>
                  </DialogActions>
                </Dialog>
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

      {/* <DialogConfirm
        icon="warning"
        cancelLabel="Cancel"
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmUpdate}
        title="Confirm update Seats"
        message={`Are you sure you want to update seats: ${selectedSeats
          .map((id) => {
            const seat = seats.find((s) => s.id === id);
            return `${seat?.seatNumber}${seat?.seatRow}`;
          })
          .join(", ")}?`}
        confirmLabel="Update Now"
      /> */}
    </Box>
  );
};

export default React.memo(SeatBooking);
