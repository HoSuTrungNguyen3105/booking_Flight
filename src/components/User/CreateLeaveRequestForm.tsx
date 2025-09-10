import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  useTheme,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Person,
  CalendarToday,
  Calculate,
  Description,
  Send,
  RestartAlt,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import { LeaveType, type CreateLeaveRequestDto } from "../Api/usePostApi";

interface CreateLeaveRequestFormProps {
  //   onSubmit: (data: CreateLeaveRequestDto) => void;
  employees: Array<{ id: number; name: string; email: string }>;
  loading?: boolean;
}

const CreateLeaveRequestForm: React.FC<CreateLeaveRequestFormProps> = ({
  //   onSubmit,
  employees,
  loading = false,
}) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CreateLeaveRequestDto>({
    employeeId: 0,
    leaveType: LeaveType.ANNUAL,
    startDate: 0,
    endDate: 0,
    days: 0,
    reason: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateLeaveRequestDto, string>>
  >({});

  const leaveTypes = [
    { value: "ANNUAL", label: "Nghỉ phép năm", color: "primary" },
    { value: "SICK", label: "Nghỉ ốm", color: "secondary" },
    { value: "UNPAID", label: "Nghỉ không lương", color: "warning" },
  ];

  const steps = ["Chọn nhân viên", "Thông tin nghỉ phép", "Xác nhận"];

  const handleInputChange = (
    field: keyof CreateLeaveRequestDto,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDateChange = (
    field: "startDate" | "endDate",
    date: Date | null
  ) => {
    if (date) {
      const timestamp = date.getTime();
      handleInputChange(field, timestamp);

      // Auto-calculate days if both dates are selected
      if (field === "startDate" && formData.endDate) {
        calculateDays(timestamp, formData.endDate);
      } else if (field === "endDate" && formData.startDate) {
        calculateDays(formData.startDate, timestamp);
      }
    }
  };

  const calculateDays = (start: number, end: number) => {
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    handleInputChange("days", daysDiff > 0 ? daysDiff : 0);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateLeaveRequestDto, string>> = {};

    if (!formData.employeeId) {
      newErrors.employeeId = "Vui lòng chọn nhân viên";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate > formData.endDate
    ) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if (!formData.days || formData.days <= 0) {
      newErrors.days = "Số ngày nghỉ không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof CreateLeaveRequestDto, string>> = {};

    if (step === 0) {
      // Chỉ validate employeeId ở step 0
      if (!formData.employeeId) {
        newErrors.employeeId = "Vui lòng chọn nhân viên";
      }
    } else if (step === 1) {
      // Validate các field ở step 1
      if (!formData.startDate) {
        newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
      }

      if (!formData.endDate) {
        newErrors.endDate = "Vui lòng chọn ngày kết thúc";
      }

      if (
        formData.startDate &&
        formData.endDate &&
        formData.startDate > formData.endDate
      ) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }

      if (!formData.days || formData.days <= 0) {
        newErrors.days = "Số ngày nghỉ không hợp lệ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      //onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      employeeId: 0,
      leaveType: LeaveType.ANNUAL,
      startDate: 0,
      endDate: 0,
      days: 0,
      reason: "",
    });
    setErrors({});
    setActiveStep(0);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("vi-VN");
  };

  const getSelectedEmployee = () => {
    return employees.find((emp) => emp.id === formData.employeeId);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={12}>
              <FormControl fullWidth error={!!errors.employeeId}>
                <InputLabel>Nhân viên</InputLabel>
                <Select
                  value={formData.employeeId}
                  onChange={(e) =>
                    handleInputChange("employeeId", Number(e.target.value))
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  }
                  label="Nhân viên"
                >
                  <MenuItem value={0}>
                    <em>Chọn nhân viên</em>
                  </MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.email}
                    </MenuItem>
                  ))}
                </Select>
                {errors.employeeId && (
                  <Typography variant="caption" color="error">
                    {errors.employeeId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid size={12}>
              <FormControl fullWidth error={!!errors.leaveType}>
                <InputLabel>Loại nghỉ phép</InputLabel>
                <Select
                  value={formData.leaveType}
                  onChange={(e) =>
                    handleInputChange("leaveType", e.target.value)
                  }
                  label="Loại nghỉ phép"
                >
                  {leaveTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Chip
                        label={type.label}
                        size="small"
                        color={type.color as any}
                        variant="outlined"
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={vi}
              >
                <DatePicker
                  label="Ngày bắt đầu"
                  value={
                    formData.startDate ? new Date(formData.startDate) : null
                  }
                  onChange={(date) => handleDateChange("startDate", date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDate,
                      helperText: errors.startDate,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday color="action" />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={12}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={vi}
              >
                <DatePicker
                  label="Ngày kết thúc"
                  value={formData.endDate ? new Date(formData.endDate) : null}
                  onChange={(date) => handleDateChange("endDate", date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday color="action" />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Số ngày nghỉ"
                type="number"
                value={formData.days}
                onChange={(e) =>
                  handleInputChange("days", Number(e.target.value))
                }
                error={!!errors.days}
                helperText={errors.days}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Calculate color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">ngày</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Lý do nghỉ phép"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Mô tả lý do xin nghỉ phép..."
              />
            </Grid>
          </Grid>
        );

      case 2:
        const employee = getSelectedEmployee();
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Vui lòng kiểm tra kỹ thông tin trước khi gửi yêu cầu
            </Alert>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Thông tin đơn xin nghỉ phép
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Typography variant="body2" color="text.secondary">
                      Nhân viên:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {employee?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {employee?.email}
                    </Typography>
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="body2" color="text.secondary">
                      Loại nghỉ phép:
                    </Typography>
                    <Chip
                      label={
                        leaveTypes.find((t) => t.value === formData.leaveType)
                          ?.label
                      }
                      color={
                        leaveTypes.find((t) => t.value === formData.leaveType)
                          ?.color as any
                      }
                      size="small"
                    />
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="body2" color="text.secondary">
                      Thời gian nghỉ:
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(formData.startDate)} -{" "}
                      {formatDate(formData.endDate)}
                    </Typography>
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="body2" color="text.secondary">
                      Tổng số ngày:
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="primary"
                    >
                      {formData.days} ngày
                    </Typography>
                  </Grid>

                  {formData.reason && (
                    <Grid size={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Lý do:
                      </Typography>
                      <Typography variant="body1" fontStyle="italic">
                        {formData.reason}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          📝 Tạo đơn xin nghỉ phép
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Điền đầy đủ thông tin để gửi yêu cầu nghỉ phép
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent(activeStep)}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<RestartAlt />}
        >
          Quay lại
        </Button>

        <Box>
          <Button
            onClick={handleReset}
            variant="outlined"
            sx={{ mr: 2 }}
            disabled={loading}
          >
            Làm mới
          </Button>

          <Button
            onClick={handleNext}
            variant="contained"
            disabled={loading}
            endIcon={activeStep === steps.length - 1 ? <Send /> : null}
          >
            {activeStep === steps.length - 1 ? "Gửi yêu cầu" : "Tiếp theo"}
          </Button>
        </Box>
      </Box>

      {loading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Đang gửi yêu cầu...
        </Alert>
      )}
    </Paper>
  );
};

export default CreateLeaveRequestForm;
