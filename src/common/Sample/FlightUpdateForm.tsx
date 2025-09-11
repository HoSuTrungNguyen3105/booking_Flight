import React, { useState } from "react";
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
  Schedule,
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
type FlightProps = {
  flight: Flight;
  onUpdate: () => void;
  onCancel: () => void;
};
const FlightUpdateForm = ({ flight, onUpdate, onCancel }: FlightProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    flightNo: flight?.flightNo || "",
    flightType: flight?.flightType || "oneway",
    departureAirport: flight?.departureAirport || "",
    arrivalAirport: flight?.arrivalAirport || "",
    status: flight?.status || "scheduled",
    aircraftCode: flight?.aircraftCode || "",
    scheduledDeparture: flight?.scheduledDeparture,
    scheduledArrival: flight?.scheduledArrival || Date.now() + 3600000,
    actualDeparture: flight?.actualDeparture || null,
    actualArrival: flight?.actualArrival || null,
    priceEconomy: flight?.priceEconomy || 0,
    priceBusiness: flight?.priceBusiness || 0,
    priceFirst: flight?.priceFirst || 0,
    maxCapacity: flight?.maxCapacity || 180,
    gate: flight?.gate || "",
    terminal: flight?.terminal || "",
    isCancelled: flight?.isCancelled || false,
    delayMinutes: flight?.delayMinutes || 0,
  });

  const optionWay = [
    {
      value: "oneway",
      label: "Một chiều",
    },
    { value: "roundtrip", label: "Khứ hồi" },
  ];

  const flightStatuses = [
    { value: "SCHEDULED", label: "Theo lịch" },
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
    onUpdate();
  };

  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString("vi-VN");
  };

  const parseDateTime = (dateString: number) => {
    return new Date(dateString).getTime();
  };

  const renderBasicInfo = () => (
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
          <InputLabel>Loại chuyến bay</InputLabel>
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
        <InputTextField
          value={formData.aircraftCode}
          onChange={(e) => handleInputChange("aircraftCode", e)}
        />
      </Grid>

      <Grid size={12}>
        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <SelectDropdown
            options={flightStatuses}
            value={formData.status}
            onChange={(e) => handleInputChange("status", e as string)}
          />
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderTimeInfo = () => (
    <Grid container spacing={3}>
      <Grid size={12}>
        <InputLabel>Trạng thái</InputLabel>
        <SingleDateRangePickerComponent
          value={[formData.scheduledDeparture, formData.scheduledArrival]}
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
  );

  const renderPriceCapacity = () => (
    <Grid container spacing={3}>
      <Grid size={12}>
        <InputTextField
          type="number"
          value={String(formData.priceEconomy)}
          onChange={(e) => handleInputChange("priceEconomy", parseInt(e))}
          startIcon={<InputAdornment position="start">$</InputAdornment>}
          endIcon={<InputAdornment position="end">USD</InputAdornment>}
        />
      </Grid>

      <Grid size={12}>
        {/* <TextField
          fullWidth
          label="Giá vé Thương gia"
          type="number"
          value={formData.priceBusiness}
          onChange={(e) =>
            handleInputChange("priceBusiness", parseFloat(e.target.value))
          }
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: <InputAdornment position="end">USD</InputAdornment>,
          }}
        /> */}
        <InputTextField
          type="number"
          name="Giá vé Thương gia"
          value={String(formData.priceBusiness)}
          onChange={(e) => handleInputChange("priceBusiness", parseInt(e))}
          startIcon={<InputAdornment position="start">$</InputAdornment>}
          endIcon={<InputAdornment position="end">USD</InputAdornment>}
        />
      </Grid>

      <Grid size={12}>
        <InputTextField
          type="number"
          name="Giá vé Thương gia"
          value={String(formData.priceFirst)}
          onChange={(e) => handleInputChange("priceFirst", parseInt(e))}
          startIcon={<Typography>$</Typography>}
          endIcon={<Typography>USD</Typography>}
        />
        {/* <TextField
          fullWidth
          label="Giá vé Hạng nhất"
          type="number"
          value={formData.priceFirst}
          onChange={(e) =>
            handleInputChange("priceFirst", parseFloat(e.target.value))
          }
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: <InputAdornment position="end">USD</InputAdornment>,
          }}
        /> */}
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
  );

  const renderGateStatus = () => (
    <Grid container spacing={3}>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Cổng"
          value={formData.gate}
          onChange={(e) => handleInputChange("gate", e.target.value)}
          placeholder="Ví dụ: A12"
        />
      </Grid>

      <Grid size={12}>
        <TextField
          fullWidth
          label="Nhà ga"
          value={formData.terminal}
          onChange={(e) => handleInputChange("terminal", e.target.value)}
          placeholder="Ví dụ: T1"
        />
      </Grid>

      <Grid size={12}>
        <FormControlLabel
          control={
            <Android12Switch
              checked={formData.isCancelled}
              onChange={(e) =>
                handleInputChange("isCancelled", e.target.checked)
              }
              color="error"
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
  );

  return (
    <Dialog open maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Edit color="primary" sx={{ mr: 2 }} />
          <Typography variant="h5" component="span">
            {flight ? "Cập nhật Chuyến bay" : "Tạo Chuyến bay Mới"}
          </Typography>
          <IconButton onClick={onCancel} sx={{ ml: "auto" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
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
          {activeStep === 2 && renderPriceCapacity()}
          {activeStep === 3 && renderGateStatus()}
        </Box>

        {flight && (
          <Card sx={{ mt: 3, bgcolor: "grey.50" }}>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Thông tin hiện tại:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip label={`Số hiệu: ${flight.flightNo}`} size="small" />
                <Chip
                  label={`Từ: ${flight.departureAirport}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Đến: ${flight.arrivalAirport}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Khởi hành: ${flight.scheduledDeparture}`}
                  size="small"
                  color="info"
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined">
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
          >
            Tiếp theo
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<Save />}
            size="large"
          >
            {flight ? "Cập nhật" : "Tạo mới"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FlightUpdateForm;
