import { Box, Button, Grid } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import BaseModal from "../../../common/Modal/BaseModal";
import type { Airport, CreateAirportReq } from "../../../utils/type";
import InputTextField from "../../../common/Input/InputTextField";

interface IRequestLeaveActionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAirport: "update" | "create";
  formEditData?: Airport;
}

const AirportManageModal = ({
  open,
  onClose,
  onSuccess,
  editingAirport,
  formEditData,
}: IRequestLeaveActionModalProps) => {
  const [formData, setFormData] = useState<CreateAirportReq>({
    code: "",
    name: "",
    city: "",
    country: "",
  });

  // Khi mở modal và mode là update → set dữ liệu từ formEditData
  useEffect(() => {
    if (open) {
      if (editingAirport === "update" && formEditData) {
        setFormData({
          code: formEditData.code,
          name: formEditData.name,
          city: formEditData.city,
          country: formEditData.country,
        });
      } else {
        // reset khi tạo mới
        setFormData({
          code: "",
          name: "",
          city: "",
          country: "",
        });
      }
    }
  }, [open, editingAirport, formEditData]);

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
  }, [onClose, onSuccess, formData, editingAirport]);

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
          <Grid size={6}>
            <InputTextField
              placeholder="Thành phố"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e })}
            />
          </Grid>
          <Grid size={6}>
            <InputTextField
              placeholder="Quốc gia"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e })}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }, [formData, editingAirport]);

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
