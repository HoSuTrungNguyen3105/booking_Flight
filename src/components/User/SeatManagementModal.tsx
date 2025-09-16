import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  TextField,
  FormControl,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import type { UserData } from "../../utils/type";
import { useDeleteUserById } from "../Api/usePostApi";
import BaseModal from "../../common/Modal/BaseModal";
import InputTextField from "../../common/Input/InputTextField";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserData;
}

const SeatManagementModal = ({
  open,
  onClose,
  onSuccess,
  user,
}: IModalStatisticalDataLearningProps) => {
  const { refetchDeleteUser } = useDeleteUserById();
  const [inputId, setInputId] = useState<string>("");

  const onDeleteOnChange = useCallback(async () => {
    if (String(user?.id) === inputId) {
      await refetchDeleteUser({ id: Number(inputId) });
      onSuccess();
      onClose();
    }
  }, [user?.id, inputId, onSuccess, onClose, refetchDeleteUser]);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="outlined" color="error" onClick={onDeleteOnChange}>
          Delete
        </Button>
      </Box>
    );
  }, [user?.id, inputId]);

  const renderContent = useCallback(() => {
    return (
      <>
        <Box sx={{ pt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
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
      </>
    );
  }, [user?.id, inputId]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Delete"
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(SeatManagementModal);
