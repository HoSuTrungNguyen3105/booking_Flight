import { Box, Button, Stack, Typography, FormControl } from "@mui/material";
import { memo, useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import type { CreateSeatDto } from "../../../../context/Api/usePostApi";
import InputTextField from "../../../../common/Input/InputTextField";
import BaseModal from "../../../../common/Modal/BaseModal";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onChange: (data: CreateSeatDto) => void;
  flightId: number;
  loading: boolean;
}

const CreateSeatModal = ({
  open,
  onClose,
  flightId,
  onSuccess,
  onChange,
}: IModalStatisticalDataLearningProps) => {
  const [newSeat, setNewSeat] = useState<CreateSeatDto>({
    seatNumber: 0,
    seatRow: "",
    flightId,
    isBooked: false,
  });

  const handleSave = useCallback(() => {
    if (!newSeat.seatRow || !newSeat.seatNumber) {
      // alert("Please enter seat row and seat number");
      return;
    }
    onChange(newSeat);
    onSuccess();
  }, [newSeat, onChange, onSuccess]);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Create seat
        </Button>
      </Box>
    );
  }, [handleSave, onClose]);

  const renderContent = useCallback(() => {
    return (
      <Box
        sx={{
          width: "28rem",
          pt: 2,
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {" "}
        <Typography variant="h6" gutterBottom>
          Seat Information {flightId}
        </Typography>
        <Stack spacing={3}>
          {/* Seat Row */}
          <FormControl fullWidth>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Seat Row (A-F)
            </Typography>
            <InputTextField
              value={newSeat.seatRow}
              // onChange={(e) => setNewSeat({ ...newSeat, seatRow: e as string })}
              onChange={(e) =>
                setNewSeat({ ...newSeat, seatRow: e.toUpperCase() })
              }
              placeholder="Enter seat row, e.g., A"
            />
          </FormControl>

          {/* Seat Number */}
          <FormControl fullWidth>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Seat Number
            </Typography>
            <InputTextField
              type="number"
              value={String(newSeat.seatNumber)}
              onChange={(e) =>
                setNewSeat({
                  ...newSeat,
                  seatNumber: parseInt(e) || 1,
                })
              }
              placeholder="Enter seat number"
            />
          </FormControl>
        </Stack>
      </Box>
    );
  }, [newSeat, flightId]);

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
