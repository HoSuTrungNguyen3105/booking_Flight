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

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserData;
  flightId: number;
}

const CreateSeatModal = ({
  open,
  onClose,
  flightId,
  onSuccess,
  user,
}: IModalStatisticalDataLearningProps) => {
  const { refetchSeatCreate } = useSeatCreate();
  const [createFormOpen, setCreateFormOpen] = useState(false);

  const [newSeat, setNewSeat] = useState<CreateSeatDto>({
    seatNumber: 0,
    seatRow: "",
    flightId: flightId,
    isBooked: false,
  });

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
  }, [user?.id, onSuccess]);
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
      <>
        <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <InputTextField
            type="number"
            value={String(newSeat.seatNumber)}
            onChange={(e) =>
              setNewSeat({ ...newSeat, seatNumber: parseInt(e) || 1 })
            }
          />

          <FormControl fullWidth>
            <SelectDropdown
              value={newSeat.seatRow}
              options={columnActions}
              onChange={(e) => setNewSeat({ ...newSeat, seatRow: e as string })}
            ></SelectDropdown>
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
      </>
    );
  }, [user?.id]);

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
