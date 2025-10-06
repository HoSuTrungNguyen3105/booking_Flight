import {
  Box,
  Button,
  Stack,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { type CreateSeatDto } from "../Api/usePostApi";
import BaseModal from "../../common/Modal/BaseModal";
import InputTextField from "../../common/Input/InputTextField";
import { Loading } from "../../common/Loading/Loading";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flightId: number;
  loading: boolean;
}

const CreateSeatModal = ({
  open,
  onClose,
  flightId,
  onSuccess,
  loading,
}: IModalStatisticalDataLearningProps) => {
  const [newSeat, setNewSeat] = useState<CreateSeatDto>({
    seatNumber: 0,
    seatRow: "",
    flightId: flightId,
    isBooked: false,
  });

  if (loading) {
    return <Loading />;
  }

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="outlined" color="error" onClick={onSuccess}>
          Delete
        </Button>
      </Box>
    );
  }, [onSuccess]);

  const renderContent = useCallback(() => {
    return (
      <Box sx={{ width: "30rem", pt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Seat Information
        </Typography>

        <Stack spacing={3}>
          {/* Seat Number */}
          <FormControl fullWidth>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Seat Number
            </Typography>
            <InputTextField
              type="number"
              value={String(newSeat.seatNumber)}
              onChange={(e) =>
                setNewSeat({ ...newSeat, seatNumber: parseInt(e) || 1 })
              }
              placeholder="Enter seat number"
            />
          </FormControl>

          {/* Seat Row */}
          <FormControl fullWidth>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Seat Row
            </Typography>
            <InputTextField
              disabled
              value={newSeat.seatRow}
              onChange={(e) => setNewSeat({ ...newSeat, seatRow: e as string })}
            />
          </FormControl>

          {/* Status */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Seat Status
            </Typography>
            <Stack direction="row" spacing={2}>
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
            </Stack>
          </Box>
        </Stack>
      </Box>
    );
  }, [newSeat]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Create New Seat"
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(CreateSeatModal);
