import { Box, Button, Typography, FormControl, MenuItem } from "@mui/material";
import { memo, useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import BaseModal from "../../common/Modal/BaseModal";
import InputTextField from "../../common/Input/InputTextField";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import type { SeatUpdateProps } from "../Api/usePostApi";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedSeats?: SeatUpdateProps;
  onUpdate: (data: SeatUpdateProps) => void;
}

const SeatManagementModal = ({
  open,
  onClose,
  onSuccess,
  selectedSeats,
}: IModalStatisticalDataLearningProps) => {
  const [seatType, setSeatType] = useState("ECONOMY");
  const [seatRow, setSeatRow] = useState("");
  const [seatNumber, setSeatNumber] = useState(1);

  const handleTypeChange = (value: string | number) => {
    setSeatType(value as string);
  };

  const handleSeatRowChange = (value: string | number) => {
    setSeatRow(value as string);
  };

  const handleSeatNumberChange = (value: string | number) => {
    setSeatNumber(Number(value) || 1);
  };

  const renderTypeSeatOptions = useCallback(() => {
    return [
      { value: "ECONOMY", label: "Economy" },
      { value: "BUSINESS", label: "Business" },
      { value: "VIP", label: "VIP" },
    ];
  }, []);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary">
          Update
        </Button>
      </Box>
    );
  }, [onClose]);

  const renderContent = useCallback(() => {
    return (
      <>
        <Box sx={{ pt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography>{selectedSeats?.seatIds}</Typography>
            <SelectDropdown
              options={renderTypeSeatOptions()}
              value={seatType}
              onChange={handleTypeChange}
            />
          </FormControl>

          <InputTextField
            value={seatRow}
            onChange={handleSeatRowChange}
            sx={{ mb: 2 }}
          />

          <InputTextField
            type="number"
            value={String(seatNumber)}
            onChange={handleSeatNumberChange}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" color="text.secondary"></Typography>
        </Box>
      </>
    );
  }, [selectedSeats, seatType, seatRow, seatNumber, renderTypeSeatOptions]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Update Seats"
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(SeatManagementModal);
