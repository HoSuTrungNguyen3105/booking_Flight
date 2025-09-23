import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { useGetAircraftCode } from "../Api/useGetApi";
import { memo, useCallback, useState } from "react";
import AircarftDetail from "./AircraftDetail";
import { useDeleteAircraftFlight } from "../Api/usePostApi";
import DialogConfirm from "../../common/Modal/DialogConfirm";

const AircraftPage = () => {
  const { getAircraftCodeData, refetchGetAircraftCodeData } =
    useGetAircraftCode();
  const [aircraftCodeState, setAircraftCodeState] = useState<string>("");
  const [pageDetail, setPageDetail] = useState(false);

  const [toggleOpenModal, setToggleOpenModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>(""); // Lưu code đang muốn xóa

  const { refetchDeleteAircraftFlight } = useDeleteAircraftFlight(selectedCode);

  const handleViewSeats = (code: string) => {
    setAircraftCodeState(code);
    setPageDetail(true);
  };

  const handleDeleteAircraft = useCallback(async () => {
    setToggleOpenModal(false);
    if (!selectedCode) return;

    await refetchDeleteAircraftFlight();
    await refetchGetAircraftCodeData();
  }, [refetchDeleteAircraftFlight, selectedCode]);

  if (pageDetail) {
    return <AircarftDetail aircraft={aircraftCodeState} />;
  }

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3} fontWeight="bold">
        Quản lý Máy bay
      </Typography>

      <Grid container spacing={3}>
        {getAircraftCodeData?.list?.map((aircraft: any) => (
          <Grid size={12} key={aircraft.code}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
                transition: "0.2s",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {aircraft.model}
                </Typography>
                <Typography color="text.secondary">
                  Mã: {aircraft.code}
                </Typography>
                <Typography color="text.secondary">
                  Tầm bay: {aircraft.range} km
                </Typography>

                <Box
                  mt={2}
                  display="flex"
                  justifyContent="space-between"
                  gap={1}
                >
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => {
                      setSelectedCode(aircraft.code);
                      setToggleOpenModal(true);
                    }}
                  >
                    Delete
                  </Button>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleViewSeats(aircraft.code)}
                  >
                    Chi tiết
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <DialogConfirm
        icon="warning"
        cancelLabel="Exit"
        open={toggleOpenModal}
        onClose={() => setToggleOpenModal(false)}
        onConfirm={handleDeleteAircraft}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn thực hiện hành động này không?"
        confirmLabel="Xác nhận"
      />
    </Box>
  );
};

export default memo(AircraftPage);
