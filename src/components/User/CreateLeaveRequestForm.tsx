import React, { useCallback, useState } from "react";
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
  IconButton,
} from "@mui/material";
import {
  Person,
  CalendarToday,
  Calculate,
  Description,
  Send,
  RestartAlt,
  X,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import {
  getUserIdByEmail,
  LeaveType,
  type CreateLeaveRequestDto,
} from "../Api/usePostApi";
import DateTimePickerComponent from "../../common/DayPicker/date-range-picker";
import InputTextField from "../../common/Input/InputTextField";
import InputTextArea from "../../common/Input/InputTextArea";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import { useWatch } from "react-hook-form";
import { useToast } from "../../context/ToastContext";

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
    date: number | null
  ) => {
    if (date) {
      // const timestamp = date.getTime();
      handleInputChange(field, date);

      // Auto-calculate days if both dates are selected
      if (field === "startDate" && formData.endDate) {
        calculateDays(date, formData.endDate);
      } else if (field === "endDate" && formData.startDate) {
        calculateDays(formData.startDate, date);
      }
    }
  };

  const calculateDays = (start: number, end: number) => {
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    handleInputChange("days", daysDiff > 0 ? daysDiff : 0);
  };

  // const validateForm = (): boolean => {
  //   const newErrors: Partial<Record<keyof CreateLeaveRequestDto, string>> = {};

  //   if (!formData.employeeId) {
  //     newErrors.employeeId = "Vui lòng chọn nhân viên";
  //   }

  //   if (!formData.startDate) {
  //     newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
  //   }

  //   if (!formData.endDate) {
  //     newErrors.endDate = "Vui lòng chọn ngày kết thúc";
  //   }

  //   if (
  //     formData.startDate &&
  //     formData.endDate &&
  //     formData.startDate > formData.endDate
  //   ) {
  //     newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
  //   }

  //   if (!formData.days || formData.days <= 0) {
  //     newErrors.days = "Số ngày nghỉ không hợp lệ";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

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
    if (1) {
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

  const [emailEmployee, setEmailEmployee] = useState("");
  const [userId, setUserId] = useState<number | undefined>();
  const { refetchUserEmailData } = getUserIdByEmail();
  // const email = useWatch({ control, name: "email" });
  const toast = useToast();
  const handleSubmitEmailValue = useCallback(async () => {
    if (!emailEmployee) return;
    const res = await refetchUserEmailData({ email: emailEmployee });
    if (res?.resultCode === "00") {
      setUserId(res?.data?.userId);
    } else {
      toast(
        (res?.resultMessage as string) || "Error while connect to server",
        "info"
      );
    }
  }, [emailEmployee, refetchUserEmailData]);

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
                {/* <InputTextField
                  value={emailEmployee}
                  onChange={(e) => handleInputChange("employeeId", e)}
                /> */}

                <InputTextField
                  type="email"
                  value={emailEmployee}
                  onChange={(e) => setEmailEmployee(e)}
                  disabled={loading}
                />

                {userId && (
                  <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                    action={
                      <IconButton size="small" onClick={() => setUserId(0)}>
                        <X />
                      </IconButton>
                    }
                  >
                    <Typography variant="body2">
                      <strong>UserID tìm thấy:</strong> {userId}
                    </Typography>
                  </Alert>
                )}

                <Button
                  onClick={handleSubmitEmailValue}
                  variant="contained"
                  sx={{ mt: 1 }}
                >
                  Find User
                </Button>
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
                <SelectDropdown
                  value={formData.leaveType}
                  options={leaveTypes}
                  onChange={(e) => handleInputChange("leaveType", e)}
                />
              </FormControl>
            </Grid>

            <Grid size={12}>
              <DateTimePickerComponent
                value={formData.startDate ?? null}
                language="vn"
                onChange={(val) => handleDateChange("startDate", val)}
              />
            </Grid>

            <Grid size={12}>
              <DateTimePickerComponent
                value={formData.endDate ?? null}
                language="vn"
                onChange={(val) => handleDateChange("endDate", val)}
              />{" "}
            </Grid>

            <Grid size={12}>
              <InputTextField
                type="number"
                value={String(formData.days)}
                onChange={(e) => handleInputChange("days", Number(e))}
                error={!!errors.days}
              />
            </Grid>

            <Grid size={12}>
              <InputTextArea
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e)}
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
