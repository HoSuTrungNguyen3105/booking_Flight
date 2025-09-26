import { memo, useCallback, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Card,
  Grid,
  CardContent,
  Chip,
  Tooltip,
} from "@mui/material";
import { Add, Delete, Edit, ViewList } from "@mui/icons-material";
import InputTextField from "../../../common/Input/InputTextField";
import {
  useCreateAircraftBatchFlight,
  useDeleteAircraftFlight,
} from "../../Api/usePostApi";
import { useToast } from "../../../context/ToastContext";
import type { Aircraft } from "../../../utils/type";
import { useGetAircraftCode } from "../../Api/useGetApi";
import DialogConfirm from "../../../common/Modal/DialogConfirm";
import DeleteIcon from "../../../svgs/delete-2-svgrepo.svg";

type AircraftError = {
  code: string;
  errorCode: string;
  errorMessage: string;
};

const AircraftBatchCreator = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([
    { code: "", model: "", range: 0 },
  ]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { refetchCreateAircraftBatchFlightData } =
    useCreateAircraftBatchFlight();

  const [errors, setErrors] = useState<Record<number, string>>({});

  const addAircraft = () => {
    setAircrafts([...aircrafts, { code: "", model: "", range: 0 }]);
  };

  const { getAircraftCodeData, refetchGetAircraftCodeData } =
    useGetAircraftCode();
  const [aircraftCodeState, setAircraftCodeState] = useState<string>("");
  const [pageDetail, setPageDetail] = useState(false);
  const [toggleOpenModal, setToggleOpenModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>("");

  const { refetchDeleteAircraftFlight, loadingDeleteAircraftFlight } =
    useDeleteAircraftFlight(selectedCode);

  const handleViewSeats = (code: string) => {
    setAircraftCodeState(code);
    setPageDetail(true);
  };

  const handleDeleteAircraft = useCallback(async () => {
    setToggleOpenModal(false);
    if (!selectedCode) return;

    try {
      await refetchDeleteAircraftFlight();
      await refetchGetAircraftCodeData();
    } catch (error) {
      console.error("Lỗi khi xóa máy bay:", error);
    }
  }, [refetchDeleteAircraftFlight, selectedCode]);

  const removeAircraft = (index: number) => {
    if (aircrafts.length > 1) {
      setAircrafts(aircrafts.filter((_, i) => i !== index));
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const updateAircraft = (
    index: number,
    field: keyof Aircraft,
    value: string | number
  ) => {
    const updated = [...aircrafts];
    if (field === "range") {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value as string;
    }
    setAircrafts(updated);
  };

  const getAircraftType = (model: string) => {
    const match = model.match(/^[A-Za-z]+/);
    return match ? match[0] : "Other";
  };

  const getRangeColor = (range: number) => {
    if (range >= 10000) return "success";
    if (range >= 5000) return "warning";
    return "error";
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await refetchCreateAircraftBatchFlightData(aircrafts);

      if (response?.resultCode === "00") {
        toast(response?.resultMessage);
        // setAircrafts([{ code: "", model: "", range: 0 }]);
        refetchGetAircraftCodeData();
        const errorMap: Record<number, string> = {};
        response.list?.forEach((res: AircraftError, idx: number) => {
          if (res.errorCode !== "00") {
            errorMap[idx] = res.errorMessage;
          }
        });
        setErrors(errorMap);

        if (Object.keys(errorMap).length === 0) {
          setAircrafts([{ code: "", model: "", range: 0 }]);
        }
      } else {
        toast(response?.resultMessage || "Error while create");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%" }}>
      {getAircraftCodeData?.list?.map((aircraft: any) => (
        <Grid size={6} key={aircraft.code}>
          <Card
            sx={{
              borderRadius: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Stack spacing={2}>
                {/* Header với mã máy bay */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Chip
                    label={aircraft.code}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
                  />
                  <Chip
                    label={getAircraftType(aircraft.model)}
                    variant="outlined"
                    size="small"
                    color="secondary"
                  />
                </Stack>

                {/* Thông tin model */}
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  {aircraft.model}
                </Typography>

                {/* Thông tin chi tiết */}
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Tầm bay:
                    </Typography>
                    <Chip
                      label={`${aircraft.range} km`}
                      color={getRangeColor(aircraft.range)}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={1} mt={2}>
                  <Tooltip title="Xóa máy bay">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedCode(aircraft.code);
                        setToggleOpenModal(true);
                      }}
                    >
                      <Delete fontSize="small" />
                    </Button>
                  </Tooltip>

                  <Tooltip title="Chỉnh sửa">
                    <Button size="small" color="warning">
                      <Edit fontSize="small" />
                    </Button>
                  </Tooltip>

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ViewList />}
                    onClick={() => handleViewSeats(aircraft.code)}
                    sx={{
                      flex: 1,
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {aircrafts.map((aircraft, index) => (
        <Box
          key={index}
          sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Aircraft No.{index + 1}</Typography>
            {aircrafts.length > 1 && (
              <Button
                variant="text"
                endIcon={<Delete />}
                onClick={() => removeAircraft(index)}
              />
            )}
          </Box>
          <Box sx={{ display: "grid", gap: 2 }}>
            <Box>
              <InputTextField
                clearable
                value={aircraft.code}
                onChange={(e) => updateAircraft(index, "code", e)}
                placeholder="e.g., B738"
              />
              {errors[index] && (
                <Typography color="error" variant="caption">
                  {errors[index]}
                </Typography>
              )}
            </Box>
            <InputTextField
              clearable
              value={aircraft.model}
              onChange={(e) => updateAircraft(index, "model", e)}
              placeholder="e.g., Boeing 737-800"
            />
            <InputTextField
              value={String(aircraft.range)}
              onChange={(e) => updateAircraft(index, "range", e)}
              placeholder="e.g., 5600"
            />
          </Box>
        </Box>
      ))}

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button variant="outlined" startIcon={<Add />} onClick={addAircraft}>
          Add Aircraft
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ flexGrow: 1 }}
        >
          {loading ? "Creating..." : "Create Batch Aircraft"}
        </Button>
      </Box>
      <DialogConfirm
        icon={DeleteIcon}
        cancelLabel="Hủy"
        open={toggleOpenModal}
        onClose={() => setToggleOpenModal(false)}
        onConfirm={handleDeleteAircraft}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa máy bay ${selectedCode} không? Hành động này không thể hoàn tác.`}
        confirmLabel={
          loadingDeleteAircraftFlight ? "Đang xóa..." : "Xác nhận xóa"
        }
      />
    </Box>
  );
};

export default memo(AircraftBatchCreator);
