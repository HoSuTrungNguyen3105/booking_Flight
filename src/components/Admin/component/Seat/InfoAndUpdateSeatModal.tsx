import { Box, Button, Grid, FormControlLabel } from "@mui/material";
import { memo, useCallback } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import BaseModal from "../../../../common/Modal/BaseModal";
import InputTextField from "../../../../common/Input/InputTextField";
import type { Seat } from "../../../../utils/type";
import {
  useSeatUpdateByIds,
  type SeatTypeValue,
} from "../../../Api/usePostApi";
import Android12Switch from "../../../../common/Switch/Switch";

interface ISeatModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  formData: Seat;
  setFormData: React.Dispatch<React.SetStateAction<Seat | null>>;
  //editingMode: "update" | "info";
}

const InfoAndUpdateSeatModal = ({
  open,
  onClose,
  formData,
  setFormData,
  onSuccess,
}: ISeatModalProps) => {
  const { refetchUpdateSeatByIds } = useSeatUpdateByIds();
  const handleUpdate = async () => {
    const seatId = formData?.id;
    const seatIds = seatId ? [seatId] : [];

    const res = await refetchUpdateSeatByIds({
      seatIds,
      data: {
        type: formData.type as SeatTypeValue,
        price: formData.price,
        isBooked: formData.isBooked,
        isAvailable: formData.isAvailable,
        isExitRow: formData.isExitRow,
        isExtraLegroom: formData.isExtraLegroom,
        note: formData.note,
      },
    });
    console.log("res", res);
    console.log("formData", formData);

    if (res?.resultCode === "00") {
      onSuccess();
      onClose();
    }
  };
  const handleCheckbox =
    (key: keyof Seat) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [key]: e.target.checked,
      });
    };

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={onClose}>
          Đóng
        </Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          disabled={!formData.seatNumber || !formData.seatRow}
        >
          Cập nhật
        </Button>
      </Box>
    );
  }, [onClose, onSuccess, formData]);

  const renderContent = useCallback(() => {
    return (
      <Box sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <InputTextField
            placeholder="ID Số ghế"
            disabled
            value={formData.id.toString()}
          />
          <Grid size={6}>
            <InputTextField
              placeholder="Số ghế"
              value={formData.seatNumber.toString()}
              onChange={(e) =>
                setFormData({ ...formData, seatNumber: Number(e) })
              }
            />
          </Grid>
          <Grid size={6}>
            <InputTextField
              placeholder="Hàng ghế"
              value={formData.seatRow}
              onChange={(e) => setFormData({ ...formData, seatRow: e })}
            />
          </Grid>
          <Grid size={6}>
            <InputTextField
              placeholder="Loại ghế"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e as SeatTypeValue })
              }
            />
          </Grid>
          <Grid size={6}>
            <InputTextField
              placeholder="Giá"
              type="number"
              value={formData.price != null ? formData.price.toString() : ""}
              onChange={(e) => setFormData({ ...formData, price: Number(e) })}
            />
          </Grid>
          <Grid size={6}>
            <InputTextField
              placeholder="Ghi chú"
              value={formData.note ?? ""}
              onChange={(e) => setFormData({ ...formData, note: e })}
            />
          </Grid>

          {/* Các option switch */}
          <Grid size={12}>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <Android12Switch
                color="#f44336"
                checked={formData.isBooked}
                onChange={handleCheckbox("isBooked")}
                label="Đã đặt"
              />
              <Android12Switch
                color="#4caf50"
                checked={formData.isAvailable}
                onChange={handleCheckbox("isAvailable")}
                label="Có sẵn"
              />
              <Android12Switch
                color="#ff9800"
                checked={formData.isExitRow}
                onChange={handleCheckbox("isExitRow")}
                label="Ghế hàng thoát hiểm"
              />
              <Android12Switch
                color="#2196f3"
                checked={formData.isExtraLegroom}
                onChange={handleCheckbox("isExtraLegroom")}
                label="Ghế rộng chân"
              />
              <Android12Switch
                color="#9c27b0"
                checked={formData.isHandicapAccessible}
                onChange={handleCheckbox("isHandicapAccessible")}
                label="Dành cho người khuyết tật"
              />
              <Android12Switch
                color="#795548"
                checked={formData.isNearLavatory}
                onChange={handleCheckbox("isNearLavatory")}
                label="Gần toilet"
              />
              <Android12Switch
                color="#4caf50"
                checked={formData.isUpperDeck}
                onChange={handleCheckbox("isUpperDeck")}
                label="Tầng trên"
              />
              <Android12Switch
                color="#607d8b"
                checked={formData.isWing}
                onChange={handleCheckbox("isWing")}
                label="Gần cánh"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }, [formData, setFormData]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={"Chỉnh sửa Ghế"}
      Icon={PrivacyTipIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(InfoAndUpdateSeatModal);
