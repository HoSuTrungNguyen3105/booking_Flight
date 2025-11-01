import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
} from "@mui/material";
import {
  AttachMoney,
  AirplaneTicket,
  Cancel,
  CheckCircle,
  Save,
  Refresh,
} from "@mui/icons-material";
import InputTextField from "../../../../common/Input/InputTextField";
import SelectDropdown from "../../../../common/Dropdown/SelectDropdown";
import DateTimePickerComponent from "../../../../common/DayPicker";
import Android12Switch from "../../../../common/Switch/Switch";
import { memo, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import BaseModal from "../../../../common/Modal/BaseModal";
import { DateFormatEnum, formatDate } from "../../../../hooks/format";
import type { DataFlight } from "../../../../utils/type";
import FormRow from "../../../../common/CustomRender/FormRow";
import { useFlightCreateAndUpdate } from "./hooks/useFlightCreateAndUpdate";
import InputNumber from "../../../../common/Input/InputNumber";

export type FlightFormData = Omit<DataFlight, "meals">;

export type FlightFormMode = "create" | "update";

interface IModalFlightManageProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flightId?: number;
  onCancel: () => void;
  mode: FlightFormMode;
}

const FlightManagementModal = ({
  flightId,
  open,
  mode,
  onClose,
  onSuccess,
}: IModalFlightManageProps) => {
  const {
    steps,
    formData,
    handleSubmit,
    optionAirportCode,
    optionAircraftCode,
    handleRefetchAllData,
    handleInputChange,
    optionWay,
    stepTopRef,
    activeStep,
    optionAllGateCode,
    setActiveStep,
  } = useFlightCreateAndUpdate({
    mode,
    onClose,
    onSuccess,
    flightId,
  });

  // const [hasTerminal, setHasTerminal] = useState(false);

  const renderBasicInfo = useCallback(() => {
    const fieldSpacing = 2;

    return (
      <Grid container spacing={fieldSpacing}>
        {/* Flight Number */}
        <Grid size={12}>
          <FormRow label="Flight No">
            <InputTextField
              value={formData.flightNo}
              placeholder="Nhập mã chuyến bay"
              onChange={(e) => handleInputChange("flightNo", e)}
              startIcon={<AirplaneTicket color="primary" />}
            />
          </FormRow>
        </Grid>

        {/* Flight Type */}
        <Grid size={12}>
          <FormRow label="Flight Type">
            <SelectDropdown
              options={optionWay}
              placeholder="Chọn loại chuyến bay"
              value={formData.flightType || ""}
              onChange={(e) => handleInputChange("flightType", e as string)}
            />
          </FormRow>
        </Grid>

        {/* Departure Airport */}
        <Grid size={12}>
          <FormRow label="Departure Airport">
            <SelectDropdown
              options={optionAirportCode}
              placeholder="Sân bay khởi hành"
              value={formData.departureAirport}
              onChange={(e) =>
                handleInputChange("departureAirport", e as string)
              }
            />
          </FormRow>
        </Grid>

        {/* Arrival Airport */}
        <Grid size={12}>
          <FormRow label="Arrival Airport">
            <SelectDropdown
              options={optionAirportCode}
              placeholder="Sân bay đến"
              value={formData.arrivalAirport}
              onChange={(e) => handleInputChange("arrivalAirport", e as string)}
            />
          </FormRow>
        </Grid>

        {/* Aircraft Code */}
        <Grid size={12}>
          <FormRow label="Aircraft Code">
            <SelectDropdown
              options={optionAircraftCode}
              placeholder="Chọn máy bay"
              value={formData.aircraftCode}
              onChange={(e) => handleInputChange("aircraftCode", e as string)}
            />
          </FormRow>
        </Grid>

        <Grid size={6}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 2,
              bgcolor: formData.isDomestic ? "error.light" : "success.light",
            }}
          >
            <Box
              display="flex"
              sx={{ width: "30rem" }}
              alignItems="center"
              gap={1}
            >
              {formData.isDomestic ? (
                <>
                  <Cancel color="error" />
                  <Typography color="error.main" fontWeight="500">
                    Chuyến bay đã bị hủy
                  </Typography>
                </>
              ) : (
                <>
                  <CheckCircle color="success" />
                  <Typography color="success.main" fontWeight="500">
                    Chuyến bay đang hoạt động
                  </Typography>
                </>
              )}
            </Box>

            <Android12Switch
              checked={formData.isDomestic}
              onChange={(e) =>
                handleInputChange("isDomestic", e.target.checked)
              }
            />
          </Box>
        </Grid>
      </Grid>
    );
  }, [formData, handleInputChange]);

  const renderTimeInfo = useCallback(() => {
    const timeFields: { key: keyof FlightFormData; label: string }[] = [
      { key: "scheduledDeparture", label: "Giờ khởi hành dự kiến" },
      { key: "scheduledArrival", label: "Giờ đến dự kiến" },
      ...(mode === "update"
        ? ([
            { key: "actualDeparture", label: "Giờ khởi hành thực tế" },
            { key: "actualArrival", label: "Giờ đến thực tế" },
          ] as Array<{ key: keyof FlightFormData; label: string }>)
        : []),
    ];

    return (
      <Grid container spacing={3}>
        {timeFields.map(({ key, label }) => (
          <Grid size={12} key={key}>
            <Typography sx={{ mb: 1, fontWeight: 500 }}>{label}</Typography>
            <DateTimePickerComponent
              value={formData[key] as number}
              onChange={(value) => handleInputChange(key, value)}
              language="en"
            />
          </Grid>
        ))}
      </Grid>
    );
  }, [formData, handleInputChange, mode]);

  const renderPriceCapacity = useCallback(() => {
    const priceFields: { key: keyof FlightFormData; label: string }[] = [
      { key: "priceEconomy", label: "Giá vé Phổ thông" },
      { key: "priceBusiness", label: "Giá vé Thương gia" },
      { key: "priceFirst", label: "Giá vé Hạng nhất" },
    ];

    return (
      <Grid container spacing={3}>
        {priceFields.map(({ key, label }) => (
          <Grid size={12} key={key}>
            <Typography sx={{ mb: 1, fontWeight: 500 }}>{label}</Typography>
            <InputNumber
              placeholder={label}
              value={formData[key] as number}
              onChange={(e) => handleInputChange(key, Number(e))}
              startIcon={<AttachMoney />}
              endIcon={<InputAdornment position="end">USD</InputAdornment>}
            />
          </Grid>
        ))}
      </Grid>
    );
  }, [formData, handleInputChange]);

  const renderGateStatus = useCallback(
    () => (
      <Box sx={{ width: "42rem", mx: "auto" }}>
        <Grid container spacing={3}>
          {/* Gate selection */}
          <Grid size={6}>
            <Typography sx={{ mb: 1, fontWeight: 500 }}>
              Cổng khởi hành
            </Typography>
            <SelectDropdown
              options={optionAllGateCode}
              placeholder="Chọn Gate Code"
              value={formData.gateId}
              onChange={(e) => handleInputChange("gateId", e as string)}
            />
          </Grid>

          {mode === "update" && (
            <>
              {/* Trạng thái chuyến bay */}
              <Grid size={6}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: formData.isCancelled
                      ? "error.light"
                      : "success.light",
                  }}
                >
                  <Box
                    display="flex"
                    sx={{ width: "30rem" }}
                    alignItems="center"
                    gap={1}
                  >
                    {formData.isCancelled ? (
                      <>
                        <Cancel color="error" />
                        <Typography color="error.main" fontWeight="500">
                          Chuyến bay đã bị hủy
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CheckCircle color="success" />
                        <Typography color="success.main" fontWeight="500">
                          Chuyến bay đang hoạt động
                        </Typography>
                      </>
                    )}
                  </Box>

                  <Android12Switch
                    checked={formData.isCancelled}
                    onChange={(e) =>
                      handleInputChange("isCancelled", e.target.checked)
                    }
                  />
                </Box>
              </Grid>

              {/* Delay input */}
              <Grid size={6}>
                <Typography sx={{ mb: 1, fontWeight: 500 }}>
                  Thời gian trễ (phút)
                </Typography>
                <InputTextField
                  type="number"
                  value={String(formData.delayMinutes ?? 0)}
                  onChange={(e) =>
                    handleInputChange("delayMinutes", parseInt(e))
                  }
                  placeholder="Nhập số phút delay (nếu có)"
                />
              </Grid>

              {/* Lý do hủy chuyến */}
              {formData.isCancelled && (
                <Grid size={6}>
                  <Typography sx={{ mb: 1, fontWeight: 500 }}>
                    Lý do hủy chuyến
                  </Typography>
                  <InputTextField
                    value={formData.cancellationReason}
                    onChange={(e) =>
                      handleInputChange("cancellationReason", e as string)
                    }
                    placeholder="Nhập lý do hủy chuyến"
                  />
                </Grid>
              )}

              {/* Lý do delay */}
              {formData.delayMinutes && formData.delayMinutes > 0 && (
                <Grid size={12}>
                  <Typography sx={{ mb: 1, fontWeight: 500 }}>
                    Lý do delay
                  </Typography>
                  <InputTextField
                    value={formData.delayReason || ""}
                    onChange={(e) =>
                      handleInputChange("delayReason", e as string)
                    }
                    placeholder="Nhập lý do delay"
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Box>
    ),
    [formData, handleInputChange, mode, optionAllGateCode]
  );

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>

        {mode === "update" && (
          <Button
            onClick={handleRefetchAllData}
            variant="outlined"
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
        )}

        {activeStep > 0 && (
          <Button
            onClick={() => setActiveStep((prev) => prev - 1)}
            variant="outlined"
          >
            Quay lại
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button
            onClick={() => setActiveStep((prev) => prev + 1)}
            variant="contained"
            size="medium"
          >
            Tiếp theo
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<Save />}
          >
            {mode === "update" ? "Update" : "Create"}
          </Button>
        )}
      </Box>
    );
  }, [handleSubmit, steps.length, mode, activeStep, onClose]);

  const renderContent = useCallback(() => {
    const renderRows = () => {
      return (
        <Box ref={stepTopRef} sx={{ maxHeight: "25rem" }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: "400px" }}>
            {(() => {
              switch (activeStep) {
                case 0:
                  return renderBasicInfo();

                case 1:
                  return renderTimeInfo();

                case 2:
                  if (mode === "create") return renderPriceCapacity();

                  if (mode === "update") return renderGateStatus();
                  return null;
                case 3:
                  if (mode === "update") return renderPriceCapacity();

                  if (mode === "create") return renderGateStatus();
                  return null;
                default:
                  return null;
              }
            })()}
          </Box>

          {formData && (
            <Card sx={{ mt: 3, bgcolor: "grey.50" }}>
              <CardContent>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Information of this flight:
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip label={`Số hiệu: ${formData.flightNo}`} size="small" />
                  <Chip
                    label={`From: ${formData.departureAirport}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`To: ${formData.arrivalAirport}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`Time: ${formatDate(
                      DateFormatEnum.MMMM_D_YYYY_HH_MM_SS,
                      formData.scheduledDeparture
                    )}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      );
    };

    return <>{renderRows()}</>;
  }, [activeStep, steps, formData]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={
        mode === "update"
          ? `Cập nhật chuyến bay #${flightId}`
          : "Tạo chuyến bay mới"
      }
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
      maxWidth="lg"
      sx={{ maxHeight: "600px", maxWidth: "lg", width: "lg" }}
    />
  );
};

export default memo(FlightManagementModal);
