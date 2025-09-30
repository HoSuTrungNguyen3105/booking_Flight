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
import InputTextField from "../Input/InputTextField";
import SelectDropdown from "../Dropdown/SelectDropdown";
import DateTimePickerComponent from "../DayPicker";
import Android12Switch from "../Switch/Switch";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import BaseModal from "../Modal/BaseModal";
import { DateFormatEnum, formatDateKR } from "../../hooks/format";
import {
  useGetAllCode,
  useGetFlightByIDData,
} from "../../components/Api/useGetApi";
import {
  useCreateFlight,
  useFlightUpdate,
} from "../../components/Api/usePostApi";
import type { DataFlight } from "../../utils/type";
import { useToast } from "../../context/ToastContext";

export type FlightFormData = Omit<DataFlight, "meals">;

type FlightFormMode = "create" | "update";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flightId?: number;
  onUpdate: () => void;
  onCancel: () => void;
  mode: FlightFormMode;
}

const FlightUpdateModal = ({
  flightId,
  open,
  mode,
  onClose,
  onSuccess,
}: IModalStatisticalDataLearningProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const { getFlightByIdData, refetchGetFlightData, loadingFlightData } =
    useGetFlightByIDData({
      id: mode === "update" && flightId ? flightId : undefined,
    });

  const stepTopRef = useRef<HTMLDivElement | null>(null);

  const { refetchCreateFlightData } = useCreateFlight();

  const { refetchUpdateFlightId } = useFlightUpdate({ id: flightId });
  const { getAllCode } = useGetAllCode();
  const createDefaultFormData = (): FlightFormData => ({
    flightNo: "",
    flightType: "",
    departureAirport: "",
    arrivalAirport: "",
    status: "scheduled",
    aircraftCode: "",
    scheduledDeparture: 0,
    scheduledArrival: 0,
    priceEconomy: 0,
    priceBusiness: 0,
    priceFirst: 0,
    gateId: "",
    terminal: "",
    isCancelled: false,
    delayMinutes: 0,
    cancellationReason: "",
    delayReason: "",
  });

  const mapFlightToFormData = (
    data?: Partial<FlightFormData>
  ): FlightFormData => {
    if (!data) return createDefaultFormData();

    return {
      flightNo: data.flightNo || "",
      flightType: data.flightType || "",
      departureAirport: data.departureAirport || "",
      arrivalAirport: data.arrivalAirport || "",
      status: data.status || "scheduled",
      aircraftCode: data.aircraftCode || "",
      scheduledDeparture: data.scheduledDeparture
        ? Number(data.scheduledDeparture)
        : 0,
      scheduledArrival: data.scheduledArrival
        ? Number(data.scheduledArrival)
        : 0,
      priceEconomy: data.priceEconomy || 0,
      priceBusiness: data.priceBusiness || 0,
      priceFirst: data.priceFirst || 0,
      gateId: data.gateId || "",
      terminal: data.terminal || "",
      isCancelled: data.isCancelled || false,
      delayMinutes: data.delayMinutes || 0,
      seats: data.seats || [],
    };
  };

  useEffect(() => {
    if (mode === "update" && getFlightByIdData?.data) {
      setFormData(mapFlightToFormData(getFlightByIdData.data));
    }
  }, [getFlightByIdData?.data, mode]);

  // Hàm refetch toàn bộ data
  const handleRefetchAllData = useCallback(async () => {
    try {
      if (mode === "update" && flightId) {
        // Refetch flight data
        await refetchGetFlightData();
      }
    } catch (error) {
      console.error("Error refetching data:", error);
    }
  }, [mode, flightId, refetchGetFlightData]);

  const [formData, setFormData] = useState<FlightFormData>(
    mode === "update"
      ? mapFlightToFormData(getFlightByIdData?.data)
      : createDefaultFormData()
  );

  const toast = useToast();

  const handleSave = useCallback(async () => {
    try {
      if (mode === "update" && flightId) {
        const updateData = {
          flightNo: formData.flightNo,
          flightType: formData.flightType,
          departureAirport: formData.departureAirport,
          arrivalAirport: formData.arrivalAirport,
          status: formData.status,
          aircraftCode: formData.aircraftCode,
          actualDeparture: formData.actualDeparture,
          actualArrival: formData.actualArrival,
          priceEconomy: formData.priceEconomy,
          priceBusiness: formData.priceBusiness,
          priceFirst: formData.priceFirst,
          gateId: formData.gateId,
          terminal: formData.terminal,
          isCancelled: formData.isCancelled,
          delayMinutes: formData.delayMinutes,
          ...(formData.isCancelled && {
            cancellationReason: formData.cancellationReason,
          }),
          ...(formData.delayMinutes && {
            delayReason: formData.delayReason,
          }),
        };

        console.log("res", updateData);

        const response = await refetchUpdateFlightId(updateData);

        if (response?.resultCode === "00") {
          onSuccess();
          onClose();
        } else {
          toast(response?.resultMessage || "Update flight failed", "error");
        }
      } else if (mode === "create") {
        const createData = {
          flightNo: formData.flightNo,
          flightType: formData.flightType,
          departureAirport: formData.departureAirport,
          arrivalAirport: formData.arrivalAirport,
          status: formData.status,
          aircraftCode: formData.aircraftCode,
          scheduledDeparture: formData.scheduledDeparture,
          scheduledArrival: formData.scheduledArrival,
          priceEconomy: formData.priceEconomy,
          priceBusiness: formData.priceBusiness,
          priceFirst: formData.priceFirst,
          // gateId: "",
          terminal: formData.terminal,
        };

        const response = await refetchCreateFlightData(createData);

        if (response?.resultCode === "00") {
          toast(response?.resultMessage as string, "success");
          onSuccess();
          onClose();
        } else {
          toast(response?.resultMessage as string, "error");
        }
      }
    } catch (error) {
      console.error("Error saving flight:", error);
    }
  }, [
    formData,
    mode,
    flightId,
    refetchUpdateFlightId,
    refetchCreateFlightData,
    onSuccess,
  ]);

  useEffect(() => {
    if (mode === "update" && getFlightByIdData?.data) {
      setFormData(mapFlightToFormData(getFlightByIdData.data));
    }
  }, [getFlightByIdData?.data, mode]);

  useEffect(() => {
    if (!open) {
      setFormData(
        mode === "update"
          ? mapFlightToFormData(getFlightByIdData?.data)
          : createDefaultFormData()
      );
      setActiveStep(0);
    }
  }, [open, mode, getFlightByIdData]);

  const optionAirportCode = (getAllCode?.data?.airport ?? []).map(
    (item, index) => ({
      value: item.code,
      label: item.code,
    })
  );

  const optionAircraftCode = (getAllCode?.data?.aircraft ?? []).map(
    (item, index) => ({
      value: item.code,
      label: item.code,
    })
  );

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
    { value: "ON_TIME", label: "Đang bay" },
    { value: "LANDED", label: "Đã hạ cánh" },
    { value: "ARRIVED", label: "Đã đến" },
    { value: "delayed", label: "Bị trễ" },
    { value: "cancelled", label: "Bị hủy" },
  ];

  const steps =
    mode === "update"
      ? [
          "Thông tin cơ bản",
          "Thời gian bay",
          "Seat",
          "Giá vé & Dung lượng",
          "Cổng & Trạng thái",
        ]
      : [
          "Thông tin cơ bản",
          "Thời gian bay",
          "Giá vé & Dung lượng",
          "Cổng & Trạng thái",
        ];

  const handleInputChange = <K extends keyof FlightFormData>(
    field: K,
    value: FlightFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    handleSave();
  };

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
              value={formData.flightType || ""}
              onChange={(e) => handleInputChange("flightType", e as string)}
            />
          </FormControl>
        </Grid>

        <Grid size={12}>
          <SelectDropdown
            options={optionAirportCode}
            value={formData.departureAirport}
            onChange={(e) => handleInputChange("departureAirport", e as string)}
            //startIcon={<FlightTakeoff color="primary" />}
          />
        </Grid>

        <Grid size={12}>
          <SelectDropdown
            options={optionAirportCode}
            value={formData.arrivalAirport}
            onChange={(e) => handleInputChange("arrivalAirport", e as string)}
            // startIcon={<FlightLand color="primary" />}
          />
        </Grid>

        <Grid size={12}>
          <FormControl fullWidth>
            <SelectDropdown
              options={optionAircraftCode}
              value={formData.aircraftCode}
              onChange={(e) => handleInputChange("aircraftCode", e as string)}
            />
          </FormControl>
        </Grid>

        {/* TO_DO */}

        <Grid size={12}>
          <InputTextField
            value={formData.terminal}
            onChange={(e) => handleInputChange("terminal", e as string)}
          />
        </Grid>
      </Grid>
    ),
    [formData, handleInputChange]
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
      </Grid>
    ),
    [formData, handleInputChange]
  );

  const renderGateStatus = useCallback(
    () => (
      <Grid container spacing={3}>
        <Grid size={12}>
          <InputTextField
            name="Cổng"
            value={formData.gateId}
            onChange={(e) => handleInputChange("gateId", e)}
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
                    label={`Time: ${formatDateKR(
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

export default memo(FlightUpdateModal);
