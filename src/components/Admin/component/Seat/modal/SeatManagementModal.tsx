import { Box, Button, Typography, FormControl } from "@mui/material";
import { memo, useCallback, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import BaseModal from "../../../../../common/Modal/BaseModal";
import SelectDropdown from "../../../../../common/Dropdown/SelectDropdown";
// import Android12Switch from "../../../../common/Switch/Switch";
import type { Seat, SeatTypeValue } from "../../../../../utils/type";
import { useSeatUpdateByIds } from "../../../../../context/Api/usePostApi";
import { getMessage, ResponseCode } from "../../../../../utils/response";
import { useToast } from "../../../../../context/ToastContext";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedSeats?: { seatIds: number[] };
}

type SeatFeatureOption = {
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
  | "type"
>;

const SeatManagementModal = ({
  open,
  onClose,
  onSuccess,
  selectedSeats,
}: IModalStatisticalDataLearningProps) => {
  const seatTypeOptions = useMemo(
    () => [
      { value: "ECONOMY", label: "Economy" },
      { value: "BUSINESS", label: "Business" },
      { value: "FIRST", label: "First" },
      { value: "VIP", label: "Vip" },
    ],
    []
  );

  const seatFeatureOptions: SeatFeatureOption[] = useMemo(
    () => [
      { value: "isBooked", label: "Booked" },
      { value: "isAvailable", label: "Available" },
      { value: "isExitRow", label: "Exit Row" },
      { value: "isExtraLegroom", label: "Extra Legroom" },
      { value: "isHandicapAccessible", label: "Handicap Accessible" },
      { value: "isNearLavatory", label: "Near Lavatory" },
      { value: "isUpperDeck", label: "Upper Deck" },
      { value: "isWing", label: "Wing Area" },
    ],
    []
  );

  const [type, setType] = useState<SeatTypeValue>("ECONOMY");
  const [position, setPosition] = useState("WINDOW");
  const toast = useToast();
  const { refetchUpdateSeatByIds } = useSeatUpdateByIds();

  const handleUpdate = async () => {
    const updateData: Partial<SeatFeatures> = {
      type,
      [position]: true, // gán động key (ví dụ: isWing: true)
    };
    const res = await refetchUpdateSeatByIds({
      seatIds: selectedSeats?.seatIds || [],
      data:
        // type: type as SeatTypeValue,
        updateData,
      // ...seatFeatureOptions,
      // price,
      // isBooked,
      // isAvailable,
      // isExitRow,
      // isExtraLegroom,
      // note,
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

        <FormControl fullWidth sx={{ mb: 2 }}>
          <SelectDropdown
            options={seatTypeOptions}
            value={type}
            onChange={(val) => setType(val as SeatTypeValue)}
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <SelectDropdown
            options={seatFeatureOptions}
            value={position}
            onChange={(val) => setPosition(val as string)}
          />
        </FormControl>
      </Box>
    );
  }, [selectedSeats, type, position, seatTypeOptions, seatFeatureOptions]);

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
