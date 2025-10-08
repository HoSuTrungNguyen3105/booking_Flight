import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  AirplanemodeActive as AircraftIcon,
  Edit as EditIcon,
  Delete,
} from "@mui/icons-material";
import { useGetAircraftCode } from "../Api/useGetApi";
import { memo, useCallback, useState } from "react";
import AircarftDetail from "./AircraftDetail";
import { useDeleteAircraftFlight } from "../Api/usePostApi";
import DialogConfirm from "../../common/Modal/DialogConfirm";
import DeleteIcon from "../../svgs/delete-2-svgrepo.svg";
import type { Aircraft } from "../../utils/type";
import AircraftBatchCreator from "../Admin/component/AircraftBatchCreator";

const AircraftPage = () => {
  const { getAircraftCodeData, refetchGetAircraftCodeData } =
    useGetAircraftCode();
  const [aircraftCodeState, setAircraftCodeState] = useState<string>("");
  const [pageDetail, setPageDetail] = useState(false);
  const [createBatchMode, setCreateBatchMode] = useState(false);
  const handleCreateBatch = useCallback(() => {
    setCreateBatchMode(true);
  }, [setCreateBatchMode]);
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

  if (pageDetail) {
    return <AircarftDetail aircraft={aircraftCodeState} />;
  }

  if (loadingDeleteAircraftFlight) {
    return (
      <Box p={3}>
        <LinearProgress />
      </Box>
    );
  }

  const getRangeColor = (range: number) => {
    if (range >= 10000) return "success";
    if (range >= 5000) return "warning";
    return "error";
  };

  const getAircraftType = (model: string) => {
    if (model.toLowerCase().includes("boeing")) return "Boeing";
    if (model.toLowerCase().includes("airbus")) return "Airbus";
    return "Other";
  };
  if (createBatchMode) {
    return <AircraftBatchCreator onSuccess={() => setCreateBatchMode(false)} />;
  }

  return (
    <Box p={3}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <AircraftIcon sx={{ fontSize: 32, color: "primary.main" }} />
        <Typography variant="h4" fontWeight="bold" color="primary">
          Quản lý Máy bay
        </Typography>
        <Chip
          label={`${getAircraftCodeData?.list?.length || 0} máy bay`}
          color="primary"
          variant="outlined"
        />
        <Button onClick={handleCreateBatch}>Create Aircraft Batch</Button>
      </Stack>
      {getAircraftCodeData?.list?.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Chưa có dữ liệu máy bay. Hãy thêm máy bay mới.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {getAircraftCodeData?.list?.map((aircraft: Aircraft) => (
            <Grid size={6} key={aircraft.code}>
              <Card
                sx={{
                  borderRadius: 3,
                  // boxShadow: 2,
                  // "&:hover": {
                  //   boxShadow: 6,
                  //   transform: "translateY(-4px)",
                  //   transition: "all 0.3s ease-in-out",
                  // },
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
                        label={getAircraftType(aircraft.model || "")}
                        variant="outlined"
                        size="small"
                        color="secondary"
                      />
                    </Stack>

                    {/* Thông tin model */}
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      color="text.primary"
                    >
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
                          color={getRangeColor(aircraft.range || 0)}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>

                      {aircraft.flights?.map((flight) => (
                        <Stack
                          key={flight.flightNo}
                          direction="column"
                          spacing={0.5}
                          sx={{
                            border: "1px solid #eee",
                            borderRadius: 2,
                            p: 1,
                            backgroundColor: "grey.50",
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Mã chuyến:
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {flight.flightNo}
                            </Typography>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>

                    {/* Actions */}
                    <Stack direction="row" spacing={1} mt={2}>
                      <Tooltip title="Xóa máy bay">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedCode(aircraft.code);
                            setToggleOpenModal(true);
                          }}
                          sx={{
                            bgcolor: "error.light",
                            "&:hover": { bgcolor: "error.main" },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          color="warning"
                          sx={{
                            bgcolor: "warning.light",
                            "&:hover": { bgcolor: "warning.main" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ViewIcon />}
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
        </Grid>
      )}

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

export default memo(AircraftPage);
