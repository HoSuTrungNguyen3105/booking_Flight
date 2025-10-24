import {
  Box,
  Button,
  Typography,
  FormControl,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import BaseModal from "../../../../common/Modal/BaseModal";
import InputTextField from "../../../../common/Input/InputTextField";
import SelectDropdown from "../../../../common/Dropdown/SelectDropdown";
import Android12Switch from "../../../../common/Switch/Switch";
import type { SeatTypeValue } from "../../../../utils/type";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedSeats?: { seatIds: number[] };
}

const SeatManagementModal = ({
  open,
  onClose,
  selectedSeats,
}: IModalStatisticalDataLearningProps) => {
  const [type, setType] = useState<SeatTypeValue>("ECONOMY");
  const [position, setPosition] = useState("WINDOW");
  const [seatRow, setSeatRow] = useState("");
  const [seatNumber, setSeatNumber] = useState(1);
  const [price, setPrice] = useState<number | undefined>();
  const [isBooked, setIsBooked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isExitRow, setIsExitRow] = useState(false);
  const [isExtraLegroom, setIsExtraLegroom] = useState(false);
  const [note, setNote] = useState("");
  // const { refetchUpdateSeatByIds } = useSeatUpdateByIds();
  // dropdown options
  const seatTypeOptions = useCallback(
    () => [
      { value: "ECONOMY", label: "Economy" },
      { value: "BUSINESS", label: "Business" },
      { value: "FIRST", label: "First" },
      { value: "VIP", label: "Vip" },
    ],
    []
  );

  const seatPositionOptions = useCallback(
    () => [
      { value: "WINDOW", label: "Window" },
      { value: "MIDDLE", label: "Middle" },
      { value: "AISLE", label: "Aisle" },
    ],
    []
  );

  const handleUpdate = async () => {
    // const res = await refetchUpdateSeatByIds({
    //   // seatIds: selectedSeats?.seatIds || [],
    //   // type: type as SeatTypeValue,
    //   // price,
    //   // isBooked,
    //   // isAvailable,
    //   // isExitRow,
    //   // isExtraLegroom,
    //   // note,
    // });
    // console.log("res", res);
    // if (res?.resultCode === "00") {
    //   onSuccess();
    //   onClose();
    // }
  };

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Box>
    );
  }, [onClose, handleUpdate]);

  const renderContent = useCallback(() => {
    return (
      <Box sx={{ width: "40rem", pt: 2, maxHeight: "300px" }}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Updating seats: {selectedSeats?.seatIds?.join(", ")}
        </Typography>

        {/* Type */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <SelectDropdown
            options={seatTypeOptions()}
            value={type}
            onChange={(val) => setType(val as SeatTypeValue)}
          />
        </FormControl>

        {/* Position */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <SelectDropdown
            options={seatPositionOptions()}
            value={position}
            onChange={(val) => setPosition(val as string)}
          />
        </FormControl>

        {/* Row */}
        <InputTextField
          value={seatRow}
          onChange={(val) => setSeatRow(val as string)}
          sx={{ mb: 2 }}
        />

        {/* Number */}
        <InputTextField
          type="number"
          value={String(seatNumber)}
          onChange={(val) => setSeatNumber(Number(val) || 1)}
          sx={{ mb: 2 }}
        />

        {/* Price */}
        <InputTextField
          type="number"
          value={price !== undefined ? String(price) : ""}
          onChange={(val) => setPrice(Number(val) || undefined)}
          sx={{ mb: 2 }}
        />

        {/* Switches */}
        <FormControlLabel
          control={
            <Switch
              checked={isBooked}
              onChange={(e) => setIsBooked(e.target.checked)}
            />
          }
          label="Booked"
        />
        <FormControlLabel
          control={
            <Switch
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
          }
          label="Available"
        />

        <Android12Switch
          checked={isExitRow}
          onChange={(e) => setIsExitRow(e.target.checked)}
        />

        <FormControlLabel
          control={
            <Switch
              checked={isExtraLegroom}
              onChange={(e) => setIsExtraLegroom(e.target.checked)}
            />
          }
          label="Extra Legroom"
        />

        {/* Note */}
        <InputTextField
          value={note}
          onChange={(val) => setNote(val as string)}
          sx={{ mb: 2 }}
        />
      </Box>
    );
  }, [
    selectedSeats,
    type,
    position,
    seatRow,
    seatNumber,
    price,
    isBooked,
    isAvailable,
    isExitRow,
    isExtraLegroom,
    note,
    seatTypeOptions,
    seatPositionOptions,
  ]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Update Seats"
      Icon={AddIcon}
      maxWidth="xl"
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(SeatManagementModal);
