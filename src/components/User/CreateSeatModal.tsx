import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  TextField,
  FormControl,
  Icon,
  FormControlLabel,
  Checkbox,
  Paper,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import type { UserData } from "../../utils/type";
import {
  useDeleteUserById,
  useSeatCreate,
  type CreateSeatDto,
} from "../Api/usePostApi";
import BaseModal from "../../common/Modal/BaseModal";
import InputTextField from "../../common/Input/InputTextField";
import SelectDropdown, {
  type ActionType,
} from "../../common/Dropdown/SelectDropdown";
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
  const { refetchSeatCreate } = useSeatCreate();
  const [createFormOpen, setCreateFormOpen] = useState(false);

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
  const columnActions: ActionType[] = [
    {
      value: "A",
      label: "Action A",
      color: "primary",
    },
    {
      value: "B",
      label: "Action B",
      disabled: false,
    },
    {
      value: "C",
      label: "Action C",
      color: "secondary",
    },
    {
      value: "D",
      label: "Action D",
      disabled: true,
    },
    {
      value: "E",
      label: "Action E",
    },
    {
      value: "F",
      label: "Action F",
      color: "error",
    },
  ];

  const renderContent = useCallback(() => {
    return (
      <Box sx={{ width: "20rem", pt: 2 }}>
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
            <SelectDropdown
              value={newSeat.seatRow}
              options={columnActions}
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
