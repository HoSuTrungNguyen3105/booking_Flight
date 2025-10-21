import { Box, Button, Grid } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import BaseModal from "../../../../../common/Modal/BaseModal";

interface IRequestLeaveActionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAirport: "update" | "create";
  formEditData?: { gateId?: string; flightId?: number };
}

const GateAssignmentModal = ({
  open,
  onClose,
  onSuccess,
  editingAirport,
  formEditData,
}: IRequestLeaveActionModalProps) => {
  //const {}=useUpdateAirportById(formEditData.code || '')
  const [formData, setFormData] = useState({
    gateId: "",
    flightId: 0,
  });

  useEffect(() => {
    if (open) {
      if (editingAirport === "update" && formEditData) {
        setFormData({
          flightId: formEditData.flightId || 0,
          gateId: formEditData.gateId || "",
          //   code: formEditData.code,
          //   name: formEditData.name,
          //   city: formEditData.city,
          //   country: formEditData.country,
        });
      } else {
        setFormData({
          flightId: 0,
          gateId: "",
          //   code: "",
          //   name: "",
          //   city: "",
          //   country: "",
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
            !formData.gateId || !formData.flightId
            // !formData.code ||
            // !formData.name ||
            // !formData.city ||
            // !formData.country
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
            {/* <InputTextField
              placeholder="Mã sân bay (IATA)"
              value={formData.flightId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  code: e.toUpperCase(),
                })
              }
              disabled={editingAirport === "update"}
            /> */}
          </Grid>
          <Grid size={6}>
            {/* <InputNumber
              placeholder="Quốc gia"
              value={formData.flightId}
              onChange={(e) => setFormData({ ...formData, country: e })}
            /> */}
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

export default memo(GateAssignmentModal);
