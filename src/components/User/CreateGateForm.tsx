import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  FormControl,
  Alert,
  Chip,
  Divider,
  InputAdornment,
  FormHelperText,
  IconButton,
  Tooltip,
  Fade,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  type Theme,
} from "@mui/material";
import {
  Add as AddIcon,
  AirportShuttle as GateIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  HelpOutline as HelpIcon,
} from "@mui/icons-material";
import SelectDropdown, {
  type ActionType,
} from "../../common/Dropdown/SelectDropdown";
import InputTextField from "../../common/Input/InputTextField";
import ChipInput from "../../common/ChipInput";
import theme from "../../scss/theme";

// Types và enums
export enum GateStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  MAINTENANCE = "MAINTENANCE",
  CLOSED = "CLOSED",
}

export type CreateGateReq = {
  code: string;
  terminalId: string;
  status?: GateStatus;
  createdAt?: number;
  updatedAt?: number;
};

// Giả lập dữ liệu terminal
const terminalOptions = [
  { value: "T1", label: "Terminal 1 (Quốc nội)" },
  { value: "T2", label: "Terminal 2 (Quốc tế)" },
  { value: "T3", label: "Terminal 3 (Hạng thương gia)" },
  { value: "T4", label: "Terminal 4 (Hạng nhất)" },
];
type GateProps = {
  gateId?: number;
};
const CreateGateForm: React.FC = ({ gateId }: GateProps) => {
  const [formData, setFormData] = useState<CreateGateReq>({
    code: "",
    terminalId: "",
    status: GateStatus.AVAILABLE,
  });

  const [phones, setPhones] = useState<string[]>([]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateGateReq, string>>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gateStatusOptions: ActionType[] = [
    {
      value: "AVAILABLE",
      label: "Khả dụng",
      // description: "Cổng sẵn sàng đón chuyến",
      color: theme.palette.info.light,
      icon: <CheckCircleIcon fontSize="small" />,
    },
    {
      value: "OCCUPIED",
      label: "Đang sử dụng",
      color: theme.palette.warning.main,
    },
    {
      value: "MAINTENANCE",
      label: "Bảo trì",
      color: theme.palette.info.main,
    },
    {
      value: "CLOSED",
      label: "Đã đóng",
      color: theme.palette.error.main,
    },
  ];

  const handleChange =
    (field: keyof CreateGateReq) => (value: string | number) => {
      setFormData({
        ...formData,
        [field]: value,
      });

      // Xóa lỗi khi người dùng bắt đầu nhập
      if (errors[field]) {
        setErrors({
          ...errors,
          [field]: "",
        });
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateGateReq, string>> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Mã cổng là bắt buộc";
    } else if (!/^[A-Z0-9]{2,5}$/.test(formData.code)) {
      newErrors.code =
        "Mã cổng phải gồm 2-5 ký tự chữ in hoa hoặc số (ví dụ: A12, B34)";
    }

    if (!formData.terminalId) {
      newErrors.terminalId = "Vui lòng chọn terminal";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const submitData = {
        ...formData,
        // createdAt: Date.now(),
        // updatedAt: Date.now(),
      };

      console.log("Dữ liệu gửi đi:", submitData);
      setIsSubmitted(true);

      // Reset form sau 3 giây
      setTimeout(() => {
        setFormData({
          code: "",
          terminalId: "",
          status: GateStatus.AVAILABLE,
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
      status: GateStatus.AVAILABLE,
    });
    setErrors({});
  };

  type StatusColor = {
    bg: string;
    border: string;
    chip: "success" | "info" | "warning" | "error" | "default";
  };

  const getStatusColor = (status: GateStatus, theme: Theme): StatusColor => {
    switch (status) {
      case GateStatus.AVAILABLE:
        return {
          bg: theme.palette.success.light,
          border: theme.palette.success.main,
          chip: "success",
        };
      case GateStatus.OCCUPIED:
        return {
          bg: theme.palette.warning.light,
          border: theme.palette.warning.main,
          chip: "warning",
        };
      case GateStatus.MAINTENANCE:
        return {
          bg: theme.palette.info.light,
          border: theme.palette.info.main,
          chip: "info",
        };
      case GateStatus.CLOSED:
        return {
          bg: theme.palette.error.light,
          border: theme.palette.error.main,
          chip: "error",
        };
      default:
        return {
          bg: theme.palette.grey[100],
          border: theme.palette.grey[300],
          chip: "default",
        };
    }
  };

  const statusColor = getStatusColor(formData.status as GateStatus, theme);

  return (
    <Box sx={{ maxWidth: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <Box
          sx={{
            p: "8px",
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GateIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="600"
            color="primary"
          >
            Tạo Cổng Mới
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thêm cổng mới vào hệ thống quản lý sân bay
          </Typography>
        </Box>
      </Box>

      <Alert
        severity="info"
        sx={(theme) => ({
          mb: 3,
          borderRadius: 2,
          alignItems: "center",
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.text.primary,
        })}
        icon={<InfoIcon color="primary" />}
      >
        <Typography variant="body2">
          Mã cổng phải là duy nhất và tuân theo quy ước đặt tên. Ví dụ:{" "}
          <strong>A12, B34, C56</strong>
        </Typography>
      </Alert>

      {isSubmitted && (
        <Fade in={isSubmitted}>
          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<CheckCircleIcon />}
          >
            <Typography variant="body1" fontWeight="500">
              Cổng đã được tạo thành công!
            </Typography>
            <Typography variant="body2">
              Đang chuyển hướng về danh sách cổng...
            </Typography>
          </Alert>
        </Fade>
      )}

      <Divider sx={{ mb: 4 }} />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <ChipInput
            name="phones"
            label="Số điện thoại"
            value={phones}
            onChange={setPhones}
          />
          <Grid size={6}>
            <FormControl fullWidth>
              <InputTextField
                value={formData.code}
                onChange={handleChange("code")}
                error={!!errors.code}
                disabled={isSubmitting}
              />
            </FormControl>
          </Grid>

          {/* Terminal */}
          <Grid size={6}>
            <FormControl fullWidth error={!!errors.terminalId}>
              <SelectDropdown
                value={formData.terminalId}
                options={terminalOptions}
                onChange={handleChange("terminalId")}
                error={!!errors.terminalId}
                disabled={isSubmitting}
              />
              <FormHelperText>Chọn terminal mà cổng thuộc về</FormHelperText>
            </FormControl>
          </Grid>

          <Grid size={6}>
            <FormControl fullWidth>
              <SelectDropdown
                value={formData.status}
                onChange={handleChange("status")}
                options={gateStatusOptions}
                disabled={isSubmitting}
              />
              <FormHelperText>Trạng thái hoạt động của cổng</FormHelperText>
            </FormControl>
          </Grid>

          <Grid size={12}>
            <Card
              variant="outlined"
              sx={{
                bgcolor: statusColor.bg,
                borderColor: statusColor.border,
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Chip
                    // label={statusInfo.text}
                    color={statusColor.chip}
                    variant="filled"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Progress Bar khi submitting */}
          {isSubmitting && (
            <Grid size={12}>
              <LinearProgress sx={{ borderRadius: 1 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                mt={1}
              >
                Đang tạo cổng...
              </Typography>
            </Grid>
          )}

          {/* Action Buttons */}
          <Grid size={12}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
                disabled={isSubmitting}
                startIcon={<CloseIcon />}
                size="large"
              >
                Đặt lại
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={isSubmitting ? undefined : <AddIcon />}
                size="large"
                disabled={isSubmitting}
                sx={{
                  minWidth: 120,
                  background: "linear-gradient(45deg, #1976d2, #2196f3)",
                }}
              >
                {isSubmitting ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">Đang xử lý...</Typography>
                  </Box>
                ) : (
                  "Tạo Cổng"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* Quick Help */}
      <Box
        sx={{ mt: 4, pt: 2, borderTop: "1px dashed", borderColor: "divider" }}
      >
        <Typography
          variant="subtitle2"
          fontWeight="500"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <HelpIcon fontSize="small" /> Hướng dẫn nhanh
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Mã cổng nên bắt đầu bằng chữ cái in hoa theo sau là số
          <br />
          • Mỗi terminal có thể có nhiều cổng với mã khác nhau
          <br />• Cổng "Khả dụng" sẽ hiển thị cho nhân viên mặt đất
        </Typography>
      </Box>
    </Box>
  );
};

export default CreateGateForm;
