import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Chip,
  Divider,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import {
  Add as AddIcon,
  AirportShuttle as GateIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import SelectDropdown, {
  type ActionType,
} from "../../common/Dropdown/SelectDropdown";
import InputTextField from "../../common/Input/InputTextField";

// Types và enums (đã có từ trước)
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
  { value: "T1", label: "Terminal 1" },
  { value: "T2", label: "Terminal 2" },
  { value: "T3", label: "Terminal 3" },
  { value: "T4", label: "Terminal 4" },
];

//   {terminalOptions.map((terminal) => (
//                     <MenuItem key={terminal.id} value={terminal.id}>
//                       {terminal.name} ({terminal.id})
//                     </MenuItem>
//                   ))}

// Component chính
const CreateGateForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateGateReq>({
    code: "",
    terminalId: "",
    status: GateStatus.AVAILABLE,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateGateReq, string>>
  >({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const gateStatusOptions: ActionType[] = [
    {
      value: "AVAILABLE",
      label: "Khả dụng",
      // description: "Cổng sẵn sàng đón chuyến",
      color: "success",
    },
    {
      value: "OCCUPIED",
      label: "Đang sử dụng",
      // description: "Cổng đang có chuyến bay",
      color: "warning",
    },
    {
      value: "MAINTENANCE",
      label: "Bảo trì",
      // description: "Cổng đang bảo trì",
      color: "info",
    },
    {
      value: "CLOSED",
      label: "Đã đóng",
      // description: "Cổng tạm thời đóng cửa",
      color: "error",
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
      newErrors.code = "Mã cổng phải gồm 2-5 ký tự chữ in hoa hoặc số";
    }

    if (!formData.terminalId) {
      newErrors.terminalId = "Terminal là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      // Giả lập gửi dữ liệu
      const submitData = {
        ...formData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      console.log("Dữ liệu gửi đi:", submitData);
      setIsSubmitted(true);

      // Reset form sau 2 giây
      setTimeout(() => {
        setFormData({
          code: "",
          terminalId: "",
          status: GateStatus.AVAILABLE,
        });
        setIsSubmitted(false);
      }, 2000);
    }
  };

  const getStatusColor = (status: GateStatus) => {
    switch (status) {
      case GateStatus.AVAILABLE:
        return "success";
      case GateStatus.OCCUPIED:
        return "warning";
      case GateStatus.MAINTENANCE:
        return "info";
      case GateStatus.CLOSED:
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: GateStatus) => {
    switch (status) {
      case GateStatus.AVAILABLE:
        return "Khả dụng";
      case GateStatus.OCCUPIED:
        return "Đang sử dụng";
      case GateStatus.MAINTENANCE:
        return "Bảo trì";
      case GateStatus.CLOSED:
        return "Đã đóng";
      default:
        return status;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <GateIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Tạo Cổng Mới
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
          Tạo cổng mới cho hệ thống sân bay. Mã cổng phải là duy nhất và tuân
          theo quy ước đặt tên.
        </Alert>

        {isSubmitted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Cổng đã được tạo thành công! Đang chuyển hướng...
          </Alert>
        )}

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={7} sx={{ sm: 6 }}>
              <FormControl fullWidth>
                <InputTextField
                  value={formData.code}
                  onChange={handleChange("code")}
                  error={!!errors.code}
                  startIcon={<Typography variant="body2">GATE</Typography>}
                />
              </FormControl>
            </Grid>

            <Grid size={6} sx={{ sm: 6 }}>
              <FormControl fullWidth>
                <SelectDropdown
                  value={formData.terminalId}
                  options={terminalOptions}
                  defaultValue={"Select"}
                  onChange={handleChange("terminalId")}
                />
              </FormControl>
            </Grid>

            <Grid size={6} sx={{ sm: 6 }}>
              <FormControl fullWidth>
                <SelectDropdown
                  value={formData.status}
                  onChange={handleChange("status")}
                  defaultValue={GateStatus.AVAILABLE}
                  options={gateStatusOptions}
                />
                <FormHelperText>
                  Trạng thái mặc định là "Khả dụng"
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button variant="outlined" color="secondary">
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  size="large"
                >
                  Tạo Cổng
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateGateForm;
