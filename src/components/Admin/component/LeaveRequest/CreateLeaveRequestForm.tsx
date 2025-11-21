import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  Chip,
  FormControl,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Send, RestartAlt } from "@mui/icons-material";
import DateTimePickerComponent from "../../../../common/DayPicker";
import InputTextField from "../../../../common/Input/InputTextField";
import InputTextArea from "../../../../common/Input/InputTextArea";
import SelectDropdown from "../../../../common/Dropdown/SelectDropdown";
import { DateFormatEnum, formatDateKR } from "../../../../hooks/format";
import {
  LeaveType,
  useCreateLeaveRequest,
  type CreateLeaveRequestDto,
} from "../../../../context/Api/RequestApi";

interface CreateLeaveRequestFormProps {
  employees: number;
  loading?: boolean;
  onSuccess: () => void;
}

const CreateLeaveRequestForm: React.FC<CreateLeaveRequestFormProps> = ({
  employees,
  loading = false,
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const { refetchGetLeaveRequest } = useCreateLeaveRequest();
  const [formData, setFormData] = useState<CreateLeaveRequestDto>({
    employeeId: employees,
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

  const steps = ["ID nhân viên", "Thông tin nghỉ phép", "Xác nhận"];

  const handleInputChange = (
    field: keyof CreateLeaveRequestDto,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      calculateDays(formData.startDate, formData.endDate);
    } else {
      handleInputChange("days", 0);
    }
  }, [formData.startDate, formData.endDate]);

  const handleDateChange = (
    field: "startDate" | "endDate",
    date: number | null
  ) => {
    handleInputChange(field, date);
  };

  const calculateDays = (start: number, end: number) => {
    if (end <= start) {
      handleInputChange("days", end === start ? 1 : 0);
      if (end < start) {
        setErrors((prev) => ({
          ...prev,
          endDate: "End date cannot be before start date",
        }));
      }
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const timeDiff = endDate.getTime() - startDate.getTime();

    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    handleInputChange("days", daysDiff);
    setErrors((prev) => ({ ...prev, endDate: "" }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof CreateLeaveRequestDto, string>> = {};

    if (step === 0) {
      if (!formData.employeeId) {
        newErrors.employeeId = "Vui lòng chọn nhân viên";
      }
    } else if (step === 1) {
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

  const handleSubmit = useCallback(async () => {
    const res = await refetchGetLeaveRequest(formData);
    console.log("res", res);
    if (res?.resultCode === "00") {
      onSuccess();
    }
  }, [formData, onSuccess]);

  const handleReset = () => {
    setFormData({
      employeeId: employees,
      leaveType: LeaveType.ANNUAL,
      startDate: 0,
      endDate: 0,
      days: 0,
      reason: "",
    });
    setErrors({});
    setActiveStep(0);
  };

  const [userId] = useState<number | undefined>();

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={12}>
              <FormControl fullWidth error={!!errors.employeeId}>
                <InputTextField
                  type="text"
                  value={String(employees)}
                  disabled={true}
                />
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid size={12}>
              <FormControl fullWidth error={!!errors.leaveType}>
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
                // onChange={(e) => handleInputChange("days", Number(e))}
                error={!!errors.days}
                readOnly
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
        // const employee = getSelectedEmployee();
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Vui lòng kiểm tra kỹ thông tin trước khi gửi yêu cầu
            </Alert>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Thông tin đơn xin nghỉ phép {userId}
                </Typography>

                <Grid container spacing={2}>
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
                      {formatDateKR(
                        DateFormatEnum.MM_DD_YYYY,
                        formData.startDate
                      )}{" "}
                      -{" "}
                      {formatDateKR(
                        DateFormatEnum.MM_DD_YYYY,
                        formData.endDate
                      )}{" "}
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
