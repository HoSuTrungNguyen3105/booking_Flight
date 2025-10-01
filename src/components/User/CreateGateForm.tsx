import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  FormControl,
  Alert,
  Chip,
  Divider,
  FormHelperText,
  Fade,
  Card,
  CardContent,
  LinearProgress,
  type Theme,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  AirportShuttle as GateIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import SelectDropdown, {
  type ActionType,
} from "../../common/Dropdown/SelectDropdown";
import InputTextField from "../../common/Input/InputTextField";
import theme from "../../scss/theme";
import {
  useFindAllGateStatuses,
  useFindTerminalIDStatuses,
} from "../Api/useGetApi";
import BaseModal from "../../common/Modal/BaseModal";
import { Loading } from "../../common/Loading/Loading";
import { useCreateGate, type CreateGateProps } from "../Api/usePostApi";
import type { UpdateGateProps } from "../Admin/TerminalContainer";

type IGateModalProps = {
  terminalId: string;
  mode: "create" | "update";
  open: boolean;
  data: UpdateGateProps;
  onClose: () => void;
  onSuccess: () => void;
};

const CreateGateForm = ({
  mode,
  terminalId,
  open,
  onClose,
  data,
  onSuccess,
}: IGateModalProps) => {
  const [formData, setFormData] = useState<CreateGateProps>({
    code: "",
    terminalId: "",
    status: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateGateProps, string>>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { dataGateStatuses } = useFindAllGateStatuses();
  const { dataTerminalIDStatuses } = useFindTerminalIDStatuses();
  const terminalOptions: ActionType[] = (
    dataTerminalIDStatuses?.list ?? []
  ).map((t) => ({
    value: t.value,
    label: t.label,
    color: "#880e4f",
  }));

  const gateStatusOptions: ActionType[] =
    (dataGateStatuses?.data || []).map((status) => {
      switch (status) {
        case "AVAILABLE":
          return {
            value: status,
            label: "Khả dụng",
            color: theme.palette.info.light,
          };
        case "OCCUPIED":
          return {
            value: status,
            label: "Đang sử dụng",
            color: theme.palette.warning.main,
            disabled: mode !== "update",
          };
        case "MAINTENANCE":
          return {
            value: status,
            label: "Bảo trì",
            color: theme.palette.info.main,
            disabled: mode !== "update",
          };
        case "CLOSED":
          return {
            value: status,
            label: "Đã đóng",
            color: theme.palette.error.main,
            disabled: mode !== "update",
          };
        default:
          return {
            value: status,
            label: status,
            color: theme.palette.grey[500],
          };
      }
    }) ?? [];

  // Dùng cho SelectDropdown (trả về value trực tiếp)
  const handleSelectChange =
    (field: keyof CreateGateProps) => (value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateGateProps, string>> = {};

    if (!formData.code.trim()) {
      //newErrors.code = "Mã cổng là bắt buộc";
    } else if (!/^[A-Z0-9]{2,5}$/.test(formData.code)) {
      //newErrors.code =
      //"Mã cổng phải gồm 2-5 ký tự chữ in hoa hoặc số (ví dụ: A12, B34)";
    }

    if (!formData.terminalId) {
      //  newErrors.terminalId = "Vui lòng chọn terminal";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { refetchCreateGate } = useCreateGate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const submitData = {
        ...formData,
        terminalId: terminalId,
      };
      const res = await refetchCreateGate(submitData);
      if (res?.resultCode === "00") {
        onClose();
      }
      setIsSubmitted(true);
      setTimeout(() => {
        setFormData({
          code: "",
          terminalId: "",
          status: "",
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Lỗi khi tạo cổng:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      code: "",
      terminalId: "",
      status: "",
    });
    setErrors({});
  };

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Grid size={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={isSubmitting}
              startIcon={<CloseIcon />}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Đặt lại
            </Button>
            <Button
              // type="submit"
              onClick={handleSubmit}
              variant="contained"
              startIcon={!isSubmitting ? <AddIcon /> : <Loading />}
              disabled={isSubmitting}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {isSubmitting ? "Đang xử lý..." : "Tạo Cổng"}
            </Button>
          </Box>
        </Grid>
      </Box>
    );
  }, [handleSubmit, isSubmitting, handleReset]);

  const renderContent = useCallback(() => {
    const renderRows = () => {
      return (
        <Box component="form" onSubmit={handleSubmit}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Grid container spacing={3}>
              <Grid size={6}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Code
                </Typography>
                {mode === "update" ? (
                  <FormControl fullWidth>
                    <InputTextField
                      value={formData.code}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, code: value }))
                      }
                      error={!!errors.code}
                      disabled={isSubmitting}
                      placeholder="Nhập mã cổng"
                    />
                    {errors.code && (
                      <FormHelperText error>{errors.code}</FormHelperText>
                    )}
                  </FormControl>
                ) : (
                  <FormControl fullWidth>
                    <InputTextField
                      value={formData.code}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, code: value }))
                      }
                      error={!!errors.code}
                      disabled={isSubmitting}
                      placeholder="Nhập mã cổng"
                    />
                    {errors.code && (
                      <FormHelperText error>{errors.code}</FormHelperText>
                    )}
                  </FormControl>
                )}
              </Grid>

              {/* Terminal */}
              <Grid size={6}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Terminal ID
                </Typography>
                {mode === "update" ? (
                  <FormControl fullWidth error={!!errors.terminalId}>
                    <SelectDropdown
                      value={formData.terminalId}
                      options={terminalOptions}
                      onChange={handleSelectChange("terminalId")}
                      error={!!errors.terminalId}
                      disabled={isSubmitting}
                    />
                    <FormHelperText>
                      {errors.terminalId || "Chọn terminal mà cổng thuộc về"}
                    </FormHelperText>
                  </FormControl>
                ) : (
                  <InputTextField value={terminalId} readOnly></InputTextField>
                )}
              </Grid>

              {/* Status */}
              <Grid size={6}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Status
                </Typography>
                <FormControl fullWidth>
                  <SelectDropdown
                    value={formData.status}
                    onChange={handleSelectChange("status")}
                    options={gateStatusOptions}
                    disabled={isSubmitting}
                  />
                  <FormHelperText>Trạng thái hoạt động của cổng</FormHelperText>
                </FormControl>
              </Grid>

              {/* Progress */}
              {isSubmitting && (
                <Grid size={12}>
                  <LinearProgress sx={{ borderRadius: 1 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    mt={1}
                  >
                    Đang xử lý, vui lòng chờ...
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Box>
      );
    };

    return (
      <>
        <Divider sx={{ mb: 2, marginTop: 0, marginBottom: "22px" }} />
        {renderRows()}
      </>
    );
  }, [
    formData,
    errors,
    isSubmitting,
    terminalOptions,
    gateStatusOptions,
    handleSelectChange,
    handleReset,
    handleSubmit,
  ]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Tạo Cổng Mới"
      subtitle="Thêm cổng mới vào hệ thống quản lý sân bay"
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default CreateGateForm;
