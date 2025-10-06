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
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      ></Box>
    </Box>
  );
};

export default memo(SeatBooking);
