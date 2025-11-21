import { Box, Button, Typography, FormControl } from "@mui/material";
import { memo, useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import BaseModal from "../../../../../common/Modal/BaseModal";
import SelectDropdown from "../../../../../common/Dropdown/SelectDropdown";
import type { Seat } from "../../../../../utils/type";
import { useSeatUpdateByIds } from "../../../../../context/Api/usePostApi";
import { getMessage, ResponseCode } from "../../../../../utils/response";
import { useToast } from "../../../../../context/ToastContext";
import { useSeatFeatures } from "../hook/useSeatFeature";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedSeats?: { seatIds: number[] };
}

export type SeatFeatureOption = {
  value: keyof SeatFeatures;
  label: string;
};

export type SeatFeatures = Pick<
  Seat,
  | "isBooked"
  | "isWing"
  | "isAvailable"
  | "isExitRow"
  | "isNearLavatory"
  | "isHandicapAccessible"
  | "isUpperDeck"
  | "isExtraLegroom"
>;

const SeatManagementModal = ({
  open,
  onClose,
  onSuccess,
  selectedSeats,
}: IModalStatisticalDataLearningProps) => {
  const [position, setPosition] = useState("WINDOW");
  const toast = useToast();
  const { refetchUpdateSeatByIds } = useSeatUpdateByIds();
  const { seatFeatureOptions } = useSeatFeatures();

  const handleUpdate = async () => {
    const updateData: Partial<SeatFeatures> = {
      [position]: true,
    };
    const res = await refetchUpdateSeatByIds({
      seatIds: selectedSeats?.seatIds || [],
      data: updateData,
    });
    if (res?.resultCode === ResponseCode.SUCCESS) {
      toast(res.resultMessage, "success");
      onSuccess();
      onClose();
    } else {
      toast(
        res?.resultMessage || getMessage(res?.resultCode as string),
        "error"
      );
    }
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

        {/* <FormControl fullWidth sx={{ mb: 2 }}>
          <SelectDropdown
            options={seatTypeOptions}
            value={type}
            onChange={(val) => setType(val as SeatTypeValue)}
          />
        </FormControl> */}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <SelectDropdown
            options={seatFeatureOptions}
            value={position}
            onChange={(val) => setPosition(val as string)}
          />
        </FormControl>
      </Box>
    );
  }, [selectedSeats, position, seatFeatureOptions]);

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
