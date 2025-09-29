import { Box, Button, Grid } from "@mui/material";
import { memo, useCallback } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import BaseModal from "../../../common/Modal/BaseModal";
import type { Airport } from "../../../utils/type";
import InputTextField from "../../../common/Input/InputTextField";

interface IRequestLeaveActionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  formData: Airport;
  setFormData: React.Dispatch<React.SetStateAction<Airport>>;
  editingAirport: "update" | "create";
}

const AirportManageModal = ({
  open,
  onClose,
  formData,
  setFormData,
  onSuccess,
  editingAirport,
}: IRequestLeaveActionModalProps) => {
  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
        <Button
          onClick={onSuccess}
          variant="contained"
          disabled={
            !formData.code ||
            !formData.name ||
            !formData.city ||
            !formData.country
          }
        >
          {editingAirport === "update" ? "Cập nhật" : "Tạo mới"}
        </Button>
      </Box>
    );
  }, [onClose]);

  const renderContent = useCallback(() => {
    return (
      <Box sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <InputTextField
              placeholder="Mã sân bay (IATA)"
              value={formData.code}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  code: e.toUpperCase(),
                })
              }
              disabled={editingAirport === "update"}
            />
          </Grid>
          <Grid size={12}>
            <InputTextField
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e })}
            />
          </Grid>
          <Grid size={12} sx={{ sm: 6 }}>
            <InputTextField
              placeholder="Thành phố"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e })}
            />
          </Grid>
          <Grid size={12} sx={{ sm: 6 }}>
            <InputTextField
              placeholder="Quốc gia"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e })}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }, [formData, setFormData]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={
        editingAirport === "update" ? "Chỉnh sửa Sân bay" : "Thêm Sân bay Mới"
      }
      Icon={PrivacyTipIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(AirportManageModal);
