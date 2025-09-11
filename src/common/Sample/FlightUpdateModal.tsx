import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  FlightTakeoff,
  FlightLand,
  AttachMoney,
  AirplaneTicket,
  Cancel,
  CheckCircle,
  Edit,
  Save,
  Close,
} from "@mui/icons-material";
import type { Flight } from "../Setting/type";
import InputTextField from "../Input/InputTextField";
import SelectDropdown from "../Dropdown/SelectDropdown";
import DateTimePickerComponent from "../DayPicker/date-range-picker";
import SingleDateRangePickerComponent from "../DayPicker/date-range-field";
import Android12Switch from "../Switch/Switch";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import BaseModal from "../Modal/BaseModal";
import SeatBooking from "../../components/User/SeatBooking";
import { DateFormatEnum, formatDateKR } from "../../hooks/format";
import { useGetFlightByIDData } from "../../components/Api/useGetApi";
import { useFlightUpdate } from "../../components/Api/usePostApi";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flightId: number;
  onUpdate: () => void;
  onCancel: () => void;
}

const FlightUpdateModal = ({
  flightId,
  open,
  onClose,
  onSuccess,
  onUpdate,
}: IModalStatisticalDataLearningProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const { getFlightByIdData, refetchGetFlightData } = useGetFlightByIDData({
    id: flightId,
  });

  // Helper function
  const createFlightFormData = (data?: Partial<Flight>) => {
    return {
      flightNo: data?.flightNo,
      flightType: data?.flightType,
      departureAirport: data?.departureAirport,
      arrivalAirport: data?.arrivalAirport,
      status: data?.status,
      aircraftCode: data?.aircraftCode,
      scheduledDeparture: data?.scheduledDeparture,
      scheduledArrival: data?.scheduledArrival,
      actualDeparture: data?.actualDeparture,
      actualArrival: data?.actualArrival,
      priceEconomy: data?.priceEconomy ?? 0,
      priceBusiness: data?.priceBusiness ?? 0,
      priceFirst: data?.priceFirst ?? 0,
      maxCapacity: data?.maxCapacity ?? 180,
      gate: data?.gate ?? "",
      terminal: data?.terminal ?? "",
      isCancelled: data?.isCancelled ?? false,
      delayMinutes: data?.delayMinutes ?? 0,
    };
  };

  const [formData, setFormData] = useState(() =>
    createFlightFormData(getFlightByIdData?.data)
  );

  //   const [formData, setFormData] = useState({
  //     // ...getFlightByIdData?.data,
  //     ...Object.fromEntries(
  //     Object.entries(getFlightByIdData?.data || {}).filter(
  //       ([_, value]) => value !== null && value !== undefined
  //     )
  //   )
  //   });

  //   useEffect(() => {
  //     if (getFlightByIdData?.data) {
  //       setFormData({
  //         flightNo: getFlightByIdData.data.flightNo || "",
  //         flightType: getFlightByIdData.data.flightType || "oneway",
  //         departureAirport: getFlightByIdData.data.departureAirport || "",
  //         arrivalAirport: getFlightByIdData.data.arrivalAirport || "",
  //         status: getFlightByIdData.data.status || "scheduled",
  //         aircraftCode: getFlightByIdData.data.aircraftCode || "",
  //         scheduledDeparture: getFlightByIdData.data.scheduledDeparture,
  //         scheduledArrival: getFlightByIdData.data.scheduledArrival || null,
  //         actualDeparture: getFlightByIdData.data.actualDeparture || null,
  //         actualArrival: getFlightByIdData.data.actualArrival || null,
  //         priceEconomy: getFlightByIdData.data.priceEconomy || 0,
  //         priceBusiness: getFlightByIdData.data.priceBusiness || 0,
  //         priceFirst: getFlightByIdData.data.priceFirst || 0,
  //         maxCapacity: getFlightByIdData.data.maxCapacity || 180,
  //         gate: getFlightByIdData.data.gate || "",
  //         terminal: getFlightByIdData.data.terminal || "",
  //         isCancelled: getFlightByIdData.data.isCancelled || false,
  //         delayMinutes: getFlightByIdData.data.delayMinutes || 0,
  //       });
  //     }
  //   }, [getFlightByIdData?.data]);

  const { refetchUpdateFlightId } = useFlightUpdate({ id: flightId });
  const handleUpdate = useCallback(async () => {
    const response = await refetchUpdateFlightId();
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (response?.resultCode === "00") {
      await refetchGetFlightData();
    }
  }, []);
  const optionWay = [
    {
      value: "oneway",
      label: "Một chiều",
    },
    { value: "roundtrip", label: "Khứ hồi" },
  ];

  const flightStatuses = [
    { value: "scheduled", label: "Theo lịch" },
    { value: "BOARDING", label: "Đang lên máy bay" },
    { value: "DEPARTED", label: "Đã khởi hành" },
    { value: "IN_AIR", label: "Đang bay" },
    { value: "LANDED", label: "Đã hạ cánh" },
    { value: "ARRIVED", label: "Đã đến" },
    { value: "DELAYED", label: "Bị trễ" },
  ];

  const steps = [
    "Thông tin cơ bản",
    "Thời gian bay",
    "Seat",
    "Giá vé & Dung lượng",
    "Cổng & Trạng thái",
  ];

  const handleInputChange = <K extends keyof Flight>(
    field: K,
    value: Flight[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    handleUpdate();
  };

  const stepTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (stepTopRef.current) {
      stepTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeStep]);

  const renderBasicInfo = useCallback(
    () => (
      <Grid container spacing={3}>
        <Grid size={12}>
          <InputTextField
            value={formData.flightNo}
            onChange={(e) => handleInputChange("flightNo", e)}
            startIcon={<AirplaneTicket color="primary" />}
          />
        </Grid>

        <Grid size={12}>
          <FormControl fullWidth>
            <SelectDropdown
              options={optionWay}
              value={formData.flightType}
              onChange={(e) => handleInputChange("flightType", e as string)}
            />
          </FormControl>
        </Grid>

        <Grid size={12}>
          <InputTextField
            value={formData.departureAirport}
            onChange={(e) => handleInputChange("departureAirport", e)}
            startIcon={<FlightTakeoff color="primary" />}
          />
        </Grid>

        <Grid size={12}>
          <InputTextField
            value={formData.arrivalAirport}
            onChange={(e) => handleInputChange("arrivalAirport", e)}
            startIcon={<FlightLand color="primary" />}
          />
        </Grid>

        <Grid size={12}>
          <FormControl fullWidth>
            <InputTextField
              value={formData.aircraftCode}
              onChange={(e) => handleInputChange("aircraftCode", e)}
            />
          </FormControl>
        </Grid>

        <Grid size={12}>
          <FormControl fullWidth>
            <SelectDropdown
              options={flightStatuses}
              value={formData?.status}
              onChange={(e) => handleInputChange("status", e as string)}
            />
          </FormControl>
        </Grid>
      </Grid>
    ),
    [handleInputChange]
  );

  const renderTimeInfo = useCallback(
    () => (
      <Grid container spacing={3}>
        <Grid size={12}>
          <SingleDateRangePickerComponent
            value={[
              formData.scheduledDeparture as number,
              formData?.scheduledArrival as number,
            ]}
            onChange={(range) => {
              handleInputChange("scheduledDeparture", range[0]);
              handleInputChange("scheduledArrival", range[1]);
            }}
            language="en"
          />
        </Grid>

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

        <Grid size={12}>
          <InputTextField
            type="number"
            value={String(formData.delayMinutes)}
            onChange={(e) => handleInputChange("delayMinutes", parseInt(e))}
          />
        </Grid>
      </Grid>
    ),
    [, handleInputChange]
  );

  const renderPriceCapacity = useCallback(
    () => (
      <Grid container spacing={3}>
        <Grid size={12}>
          <InputTextField
            type="number"
            value={String(formData.priceEconomy)}
            onChange={(e) => handleInputChange("priceEconomy", parseInt(e))}
            startIcon={<AttachMoney />}
            endIcon={<InputAdornment position="end">USD</InputAdornment>}
          />
        </Grid>

        <Grid size={12}>
          <InputTextField
            type="number"
            name="Giá vé Thương gia"
            value={String(formData.priceBusiness)}
            onChange={(e) => handleInputChange("priceBusiness", parseInt(e))}
            startIcon={<AttachMoney />}
            endIcon={<InputAdornment position="end">USD</InputAdornment>}
          />
        </Grid>

        <Grid size={12}>
          <InputTextField
            type="number"
            name="Giá vé Thương gia"
            value={String(formData.priceFirst)}
            onChange={(e) => handleInputChange("priceFirst", parseInt(e))}
            startIcon={<AttachMoney />}
            endIcon={<Typography>USD</Typography>}
          />
        </Grid>

        <Grid size={12}>
          <InputTextField
            type="number"
            name="Giá vé Thương gia"
            value={String(formData.maxCapacity)}
            onChange={(e) => handleInputChange("maxCapacity", parseInt(e))}
            endIcon={<Typography>Hành khách</Typography>}
          />
        </Grid>
      </Grid>
    ),
    [, handleInputChange]
  );

  const renderGateStatus = useCallback(
    () => (
      <Grid container spacing={3}>
        <Grid size={12}>
          <InputTextField
            name="Cổng"
            value={formData.gate}
            onChange={(e) => handleInputChange("gate", e)}
            placeholder="Ví dụ: A12"
          />
        </Grid>

        <Grid size={12}>
          <InputTextField
            name="Nhà ga"
            value={formData.terminal}
            onChange={(e) => handleInputChange("terminal", e)}
          />
        </Grid>

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
                    <Typography color="error">Chuyến bay đã bị hủy</Typography>
                  </>
                ) : (
                  <>
                    <CheckCircle color="success" sx={{ mr: 1 }} />
                    <Typography color="success.main">
                      Chuyến bay đang hoạt động
                    </Typography>
                  </>
                )}
              </Box>
            }
          />
        </Grid>
      </Grid>
    ),
    [, handleInputChange]
  );

  const renderSeatBooking = useCallback(() => {
    return <SeatBooking code="2" />;
  }, []);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>

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
          />
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<Save />}
          >
            {formData ? "Cập nhật" : "Tạo mới"}
          </Button>
        )}
      </Box>
    );
  }, [handleSubmit, steps.length, , activeStep, onClose]);

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
            {activeStep === 2 && renderSeatBooking()}
            {activeStep === 3 && renderPriceCapacity()}
            {activeStep === 4 && renderGateStatus()}
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
                    label={`Time: ${formatDateKR(
                      DateFormatEnum.MMMM_D_YYYY_HH_MM_SS,
                      formData.scheduledDeparture
                    )}`}
                    size="small"
                    color="info"
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
        formData
          ? `Cập nhật ${flightId} Chuyến bay`
          : `${flightId}Tạo Chuyến bay Mới`
      }
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
      maxWidth="lg"
      sx={{ maxHeight: "600px", maxWidth: "lg", width: "lg" }}
    />
  );
};

export default memo(FlightUpdateModal);
