import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { useGetAircraftCode } from "../Api/useGetApi";
import { useState } from "react";
import AircarftDetail from "./AircarftDetail";

const AircraftPage = () => {
  const { getAircraftCodeData } = useGetAircraftCode();
  const [aircraftCodeState, setAircraftCodeState] = useState<number>(0);
  //   const { refetchGetSeatByAircraftCodeData } =
  //     useGetSeatByAircraftCode(aircraftCodeState);
  const [pageDetail, setPageDetail] = useState(false);
  const handleViewSeats = (code: number) => {
    setAircraftCodeState(code); // gán mã máy bay
    setPageDetail(true);
    // refetchGetSeatByAircraftCodeData(); // gọi API
  };

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
                  ✈️ {aircraft.model}
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
    </Box>
  );
};

export default AircraftPage;
