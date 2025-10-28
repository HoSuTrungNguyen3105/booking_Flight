import {
  Box,
  Typography,
  Button,
  Grid,
  FormControl,
  FormControlLabel,
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
import { memo, useCallback, useState } from "react";
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
  onUpdate: () => void;
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
    formData,
    handleSubmit,
    optionAirportCode,
    optionAircraftCode,
    handleRefetchAllData,
    handleInputChange,
    optionWay,
    stepTopRef,
    activeStep,
    setActiveStep,
    steps,
  } = useFlightCreateAndUpdate({
    mode,
    onClose,
    onSuccess,
    flightId,
  });

  const [hasTerminal, setHasTerminal] = useState(false);

  const renderBasicInfo = useCallback(
    () => (
      <Grid container spacing={3}>
        <Grid size={12}>
          <InputTextField
            value={formData.flightNo}
            placeholder="Flight No"
            onChange={(e) => handleInputChange("flightNo", e)}
            startIcon={<AirplaneTicket color="primary" />}
          />
        </Grid>

        <Grid size={12}>
          <FormControl fullWidth>
            <SelectDropdown
              options={optionWay}
              placeholder="Flight Type"
              value={formData.flightType || ""}
              onChange={(e) => handleInputChange("flightType", e as string)}
            />
          </FormControl>
        </Grid>

        <Grid size={12}>
          <FormRow label="Departure Airport">
            <SelectDropdown
              options={optionAirportCode}
              placeholder="Departure Airport"
              value={formData.departureAirport}
              onChange={(e) =>
                handleInputChange("departureAirport", e as string)
              }
              //startIcon={<FlightTakeoff color="primary" />}
            />
          </FormRow>
        </Grid>

        <Grid size={12}>
          <FormRow label="Arrival Airport">
            <SelectDropdown
              options={optionAirportCode}
              placeholder="Arrival Airport"
              value={formData.arrivalAirport}
              onChange={(e) => handleInputChange("arrivalAirport", e as string)}
              // startIcon={<FlightLand color="primary" />}
            />
          </FormRow>
        </Grid>

        <Grid size={12}>
          <FormRow label="aircraftCode">
            <SelectDropdown
              options={optionAircraftCode}
              placeholder="Aircraft Code"
              value={formData.aircraftCode}
              onChange={(e) => handleInputChange("aircraftCode", e as string)}
            />
          </FormRow>
        </Grid>

        <Button variant="contained" onClick={() => setHasTerminal(true)}>
          Has Terminal
        </Button>

        {/* TO_DO */}
        {hasTerminal && (
          <Grid size={12}>
            <InputTextField
              value={formData.terminal}
              placeholder="Terminal"
              onChange={(e) => handleInputChange("terminal", e as string)}
            />
          </Grid>
        )}
      </Grid>
    ),
    [formData, hasTerminal, handleInputChange]
  );

  const renderTimeInfo = useCallback(
    () => (
      <Grid container spacing={3}>
        <Grid size={12}>
          <DateTimePickerComponent
            value={formData.scheduledDeparture as number}
            onChange={(e) => handleInputChange("scheduledDeparture", e)}
            language="en"
          />
        </Grid>

        <Grid size={12}>
          <DateTimePickerComponent
            value={formData.scheduledArrival as number}
            onChange={(e) => handleInputChange("scheduledArrival", e)}
            language="en"
          />
        </Grid>

        {mode === "update" && (
          <>
            <Grid size={12}>
              <DateTimePickerComponent
                value={formData.actualDeparture as number}
                onChange={(e) => handleInputChange("actualDeparture", e)}
                language="en"
              />
            </Grid>

            <Grid size={12}>
              <DateTimePickerComponent
                value={formData.actualArrival as number}
                onChange={(e) => handleInputChange("actualArrival", e)}
                language="en"
              />
            </Grid>
          </>
        )}
      </Grid>
    ),
    [formData, handleInputChange]
  );

  const renderPriceCapacity = useCallback(
    () => (
      <Grid container spacing={3}>
        <Grid size={12}>
          <Typography>Giá vé Phổ thông</Typography>
          <InputNumber
            placeholder="Price Economy"
            value={formData.priceEconomy}
            onChange={(e) => handleInputChange("priceEconomy", Number(e))}
            startIcon={<AttachMoney />}
            endIcon={<InputAdornment position="end">USD</InputAdornment>}
          />
        </Grid>

        <Grid size={12}>
          <InputNumber
            placeholder="Price Business"
            value={formData.priceBusiness}
            onChange={(e) => handleInputChange("priceBusiness", Number(e))}
            startIcon={<AttachMoney />}
            endIcon={<InputAdornment position="end">USD</InputAdornment>}
          />
        </Grid>

        <Grid size={12}>
          <InputNumber
            placeholder="Price First"
            value={formData.priceFirst}
            onChange={(e) => handleInputChange("priceFirst", Number(e))}
            startIcon={<AttachMoney />}
            endIcon={<Typography>USD</Typography>}
          />
        </Grid>
      </Grid>
    ),
    [formData, handleInputChange]
  );

  const renderGateStatus = useCallback(
    () => (
      <Grid container spacing={3}>
        <Grid size={12}>
          <InputTextField
            value={formData.gateId}
            onChange={(e) => handleInputChange("gateId", e)}
            placeholder="Ví dụ: A12"
          />
        </Grid>

        <Grid size={12}>
          <InputTextField
            value={formData.terminal}
            onChange={(e) => handleInputChange("terminal", e)}
          />
        </Grid>

        {mode === "update" && (
          <Grid size={12}>
            <FormControlLabel
              control={
                <Android12Switch
                  label="Enable Feature"
                  checked={formData.isCancelled}
                  onChange={(e) =>
                    handleInputChange("isCancelled", e.target.checked)
                  }
                />
              }
              label={
                <Box display="flex" alignItems="center">
                  {formData.isCancelled ? (
                    <>
                      <Cancel color="error" sx={{ mr: 1 }} />
                      <Typography color="error">
                        Chuyến bay đã bị hủy
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CheckCircle color="success" sx={{ mr: 1 }} />
                      <Typography color="success.main">
                        Chuyến bay đang hoạt động
                      </Typography>
                    </>
                  )}
                  <Grid size={12}>
                    <InputTextField
                      type="number"
                      value={String(formData.delayMinutes)}
                      onChange={(e) =>
                        handleInputChange("delayMinutes", parseInt(e))
                      }
                    />
                  </Grid>
                  {formData.isCancelled === true && (
                    <>
                      <Cancel color="error" sx={{ mr: 1 }} />
                      <InputTextField
                        value={formData.cancellationReason}
                        placeholder="Chuyến bay đã bị hủy"
                      />
                    </>
                  )}
                  {formData?.delayMinutes !== undefined &&
                    formData.delayMinutes !== null &&
                    formData.delayMinutes > 0 && (
                      <>
                        <Cancel color="error" sx={{ mr: 1 }} />
                        <InputTextField
                          value={formData?.delayReason || ""}
                          placeholder="Chuyến bay bị delay"
                        />
                      </>
                    )}
                </Box>
              }
            />
          </Grid>
        )}
      </Grid>
    ),
    [handleInputChange]
  );

  // const renderSeatBooking = useCallback(() => {
  //   return (
  //     <SeatBooking
  //       flightId={flightId as number}
  //       onSuccess={handleRefetchAllData}
  //       seats={(formData.seats as Seat[]) ?? []}
  //       loadingFlightData={loadingFlightData}
  //     />
  //   );
  // }, [formData.seats]);

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
            {activeStep === 0 && renderBasicInfo()}
            {activeStep === 1 && renderTimeInfo()}

            {/* {mode === "update" && activeStep === 2 && renderSeatBooking()} */}
            {mode === "create" && activeStep === 2 && renderPriceCapacity()}

            {mode === "update" && activeStep === 3 && renderPriceCapacity()}
            {mode === "create" && activeStep === 3 && renderGateStatus()}

            {mode === "update" && activeStep === 4 && renderGateStatus()}
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
