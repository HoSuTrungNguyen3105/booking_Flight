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
import { Activity, memo, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import BaseModal from "../../../../common/Modal/BaseModal";
import { DateFormatEnum, formatDate } from "../../../../hooks/format";
import type { DataFlight } from "../../../../utils/type";
import { useFlightCreateAndUpdate } from "./hooks/useFlightCreateAndUpdate";
import InputNumber from "../../../../common/Input/InputNumber";
import DetailSection, {
  type IDetailItem,
} from "../../../../common/AdditionalCustomFC/DetailSection";

export type FlightFormData = Omit<
  DataFlight,
  | "meals"
  | "_count"
  | "flightStatuses"
  | "aircraft"
  | "departureAirportRel"
  | "arrivalAirportRel"
>;

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

  const flight_tab1: IDetailItem[] = [
    {
      title: "Flight Number",
      description: (
        <InputTextField
          value={formData.flightNo}
          placeholder="Nhập mã chuyến bay"
          onChange={(e) => handleInputChange("flightNo", e)}
          startIcon={<AirplaneTicket color="primary" />}
        />
      ),
      size: 12,
    },
    {
      title: "Flight Type",
      description: (
        <SelectDropdown
          options={optionWay}
          placeholder="Chọn loại chuyến bay"
          value={formData.flightType || ""}
          onChange={(e) => handleInputChange("flightType", e as string)}
        />
      ),
      size: 12,
    },
    {
      title: "Flight Aircraft Code",
      description: (
        <SelectDropdown
          options={optionAircraftCode}
          placeholder="Chọn loại Aircraft Code chuyến bay"
          value={formData.aircraftCode || ""}
          onChange={(e) => handleInputChange("aircraftCode", e as string)}
        />
      ),
      size: 12,
    },
    {
      title: "Arrival Airport",
      description: (
        <SelectDropdown
          options={optionAirportCode}
          placeholder="Sân bay đến"
          value={formData.arrivalAirport}
          onChange={(e) => handleInputChange("arrivalAirport", e as string)}
        />
      ),
      size: 12,
    },
    {
      title: "Departure Airport",
      description: (
        <SelectDropdown
          options={optionAirportCode}
          placeholder="Sân bay khởi hành"
          value={formData.departureAirport}
          onChange={(e) => handleInputChange("departureAirport", e as string)}
        />
      ),
      size: 12,
    },
    {
      title: "Is Domestic",
      description: (
        <Android12Switch
          checked={formData.isDomestic}
          onChange={(e) => handleInputChange("isDomestic", e.target.checked)}
        />
      ),
      size: 12,
    },
    {
      title: "Cancelled Status",
      description: (
        <Activity mode={formData.isCancelled ? "visible" : "hidden"}>
          <Cancel color="error" />
          <Typography color="error.main" fontWeight="500">
            Chuyến bay đã bị hủy
          </Typography>
        </Activity>
      ),
      size: 12,
    },
    {
      title: "Active Status",
      description: (
        <Activity mode={!formData.isCancelled ? "visible" : "hidden"}>
          <CheckCircle color="success" />
          <Typography color="success.main" fontWeight="500">
            Chuyến bay đang hoạt động
          </Typography>
        </Activity>
      ),
      size: 12,
    },
  ];

  const renderBasicInfo = useCallback(() => {
    return <DetailSection data={flight_tab1} title="row" />;
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
      <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
        <Grid container spacing={3}>
          {/* Cổng khởi hành */}
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

          {/* Thời gian trễ */}
          <Grid size={6}>
            <Typography sx={{ mb: 1, fontWeight: 500 }}>
              Thời gian trễ (phút)
            </Typography>
            <InputTextField
              type="number"
              value={String(formData.delayMinutes ?? 0)}
              onChange={(e) => handleInputChange("delayMinutes", parseInt(e))}
              placeholder="Nhập số phút delay (nếu có)"
            />
          </Grid>

          {/* Chỉ hiển thị khi ở mode update */}
          <Activity mode={mode === "update" ? "visible" : "hidden"}>
            <Grid size={12}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  bgcolor: formData.isCancelled
                    ? "error.light"
                    : "success.light",
                }}
              >
                {/* Trạng thái chuyến bay */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Activity
                      mode={formData.isCancelled ? "visible" : "hidden"}
                    >
                      <Cancel color="error" />
                      <Typography color="error.main" fontWeight={500}>
                        Chuyến bay đã bị hủy
                      </Typography>
                    </Activity>
                    <Activity
                      mode={!formData.isCancelled ? "visible" : "hidden"}
                    >
                      <CheckCircle color="success" />
                      <Typography color="success.main" fontWeight={500}>
                        Chuyến bay đang hoạt động
                      </Typography>
                    </Activity>
                  </Box>

                  <Android12Switch
                    checked={formData.isCancelled}
                    onChange={(e) =>
                      handleInputChange("isCancelled", e.target.checked)
                    }
                  />
                </Box>

                {/* Lý do hủy chuyến */}
                <Activity mode={formData.isCancelled ? "visible" : "hidden"}>
                  <Box>
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
                  </Box>
                </Activity>
              </Box>
              {/* Lý do delay */}
              <Activity
                mode={
                  formData.delayMinutes && formData.delayMinutes > 0
                    ? "visible"
                    : "hidden"
                }
              >
                <Box>
                  <Typography sx={{ mt: 1, fontWeight: 500 }}>
                    Lý do delay
                  </Typography>
                  <InputTextField
                    value={formData.delayReason || ""}
                    onChange={(e) =>
                      handleInputChange("delayReason", e as string)
                    }
                    placeholder="Nhập lý do delay"
                  />
                </Box>
              </Activity>
            </Grid>
          </Activity>
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

        <Activity mode={mode === "update" ? "visible" : "hidden"}>
          <Button
            onClick={handleRefetchAllData}
            variant="outlined"
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
        </Activity>

        <Activity mode={activeStep > 0 ? "visible" : "hidden"}>
          <Button
            onClick={() => setActiveStep((prev) => prev - 1)}
            variant="outlined"
          >
            Quay lại
          </Button>
        </Activity>

        <Activity mode={activeStep < steps.length - 1 ? "visible" : "hidden"}>
          <Button
            onClick={() => setActiveStep((prev) => prev + 1)}
            variant="contained"
            size="medium"
          >
            Tiếp theo
          </Button>
        </Activity>

        <Activity mode={activeStep < steps.length - 1 ? "hidden" : "visible"}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<Save />}
          >
            {mode === "update" ? "Update" : "Create"}
          </Button>
        </Activity>
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
            <Activity mode={activeStep === 0 ? "visible" : "hidden"}>
              {renderBasicInfo()}
            </Activity>
            <Activity mode={activeStep === 1 ? "visible" : "hidden"}>
              {renderTimeInfo()}
            </Activity>
            <Activity mode={activeStep === 2 ? "visible" : "hidden"}>
              <Activity mode={mode === "create" ? "visible" : "hidden"}>
                {renderPriceCapacity()}{" "}
              </Activity>
              <Activity mode={mode === "update" ? "visible" : "hidden"}>
                {renderGateStatus()}{" "}
              </Activity>
            </Activity>
            <Activity mode={activeStep === 3 ? "visible" : "hidden"}>
              {/* <Activity mode={mode === "create" ? "visible" : "hidden"}>
                {renderGateStatus()}{" "}
              </Activity> */}
              <Activity mode={mode === "update" ? "visible" : "hidden"}>
                {renderPriceCapacity()}{" "}
              </Activity>
            </Activity>

            {/* {(() => {
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
            })()} */}
          </Box>

          {formData && (
            <Card sx={{ mt: 2, bgcolor: "grey.50" }}>
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
