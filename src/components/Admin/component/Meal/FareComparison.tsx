import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
} from "@mui/material";
import { Check, FlightTakeoff, FlightLand } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

// Types
interface FareFeature {
  name: string;
  departureValue: string | React.ReactNode;
  returnValue: string | React.ReactNode;
}

export interface FlightInfo {
  route: string;
  class: string;
  note?: string;
}

const FareComparison: React.FC = () => {
  const location = useLocation();
  const flight = location.state.flight as FlightInfo[];

  const departureFlight: FlightInfo = {
    route: flight[0]?.route ?? "",
    class: flight[0]?.class ?? "",
    note: flight[0]?.note ?? "",
  };

  const returnFlight: FlightInfo = {
    route: flight[1]?.route ?? "",
    class: flight[1]?.class ?? "",
    note: flight[1]?.note ?? "",
  };

  const fareFeatures: FareFeature[] = [
    {
      name: "Hành lý xách tay",
      departureValue: "1 kiện, 7kg mỗi kiện",
      returnValue: "1 kiện, 7kg mỗi kiện",
    },
    {
      name: "Hành lý ký gửi",
      departureValue: "2 kiện, 23kg mỗi kiện",
      returnValue: "2 kiện, 23kg mỗi kiện",
    },
    {
      name: "Chỗ ngồi",
      departureValue: (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Check sx={{ fontSize: 16, color: "green" }} />
            <Typography variant="body2">Miễn phí</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Check sx={{ fontSize: 16, color: "green" }} />
            <Typography variant="body2">
              Chỗ ngồi có khu vực để chân rộng hơn miễn phí
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Check sx={{ fontSize: 16, color: "green" }} />
            <Typography variant="body2">Chỗ ngồi trả phí miễn phí</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Check sx={{ fontSize: 16, color: "green" }} />
            <Typography variant="body2">
              Chỗ ngồi thông thường miễn phí
            </Typography>
          </Box>
        </Box>
      ),
      returnValue: (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Check sx={{ fontSize: 16, color: "green" }} />
            <Typography variant="body2">Miễn phí</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Check sx={{ fontSize: 16, color: "green" }} />
            <Typography variant="body2">
              Chỗ ngồi thông thường miễn phí
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      name: "Status Points",
      departureValue: "70",
      returnValue: "33",
    },
    {
      name: "Asia Miles",
      departureValue: "A7.000",
      returnValue: "A3.300",
    },
    {
      name: "Nâng hạng ghế với Asia Miles",
      departureValue: "Có sẵn",
      returnValue: "Có sẵn",
    },
    {
      name: "Trạng thái chờ chuyến bay sớm hơn",
      departureValue: "Có sẵn",
      returnValue: "Có sẵn",
    },
    {
      name: "Thời gian lưu trú tối thiểu",
      departureValue: "Không có yêu cầu",
      returnValue: "Không có yêu cầu",
    },
    {
      name: "Thời gian lưu trú tối đa",
      departureValue: "Không có yêu cầu",
      returnValue: "Chuyến đi phải bắt đầu trước: thứ ba, tháng 11 17, 2026",
    },
  ];

  const FeatureRow: React.FC<{ feature: FareFeature }> = ({ feature }) => (
    <TableRow>
      <TableCell
        component="th"
        scope="row"
        sx={{
          backgroundColor: "grey.50",
          borderRight: "1px solid",
          borderRightColor: "grey.200",
          width: "30%",
        }}
      >
        <Typography variant="body2" fontWeight="medium">
          {feature.name}
        </Typography>
      </TableCell>
      <TableCell sx={{ width: "35%", p: 2 }}>
        {typeof feature.departureValue === "string" ? (
          <Typography variant="body2">{feature.departureValue}</Typography>
        ) : (
          feature.departureValue
        )}
      </TableCell>
      <TableCell sx={{ width: "35%", p: 2 }}>
        {typeof feature.returnValue === "string" ? (
          <Typography variant="body2">{feature.returnValue}</Typography>
        ) : (
          feature.returnValue
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ maxWidth: 1000, margin: "0 auto", p: 2 }}>
      {/* Header */}
      <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
        So sánh hạng vé
      </Typography>

      <Grid container spacing={3}>
        {/* Departure Flight */}
        <Grid size={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <FlightTakeoff color="primary" />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {departureFlight.route}
                </Typography>
                <Typography variant="body1" color="primary" fontWeight="medium">
                  {departureFlight.class}
                </Typography>
                {departureFlight.note && (
                  <Typography variant="body2" color="text.secondary">
                    {departureFlight.note}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Selection Checkbox */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Checkbox defaultChecked color="primary" />
              <Typography variant="body2">Chọn hạng vé này</Typography>
            </Box>

            {/* Price */}
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                backgroundColor: "primary.light",
                borderRadius: 1,
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="white">
                USD 1,250.00
              </Typography>
              <Typography variant="body2" color="white">
                Mỗi hành khách
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <FlightLand color="primary" />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {returnFlight.route}
                </Typography>
                <Typography variant="body1" color="primary" fontWeight="medium">
                  {returnFlight.class}
                </Typography>
              </Box>
            </Box>

            {/* Selection Checkbox */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Checkbox defaultChecked color="primary" />
              <Typography variant="body2">Chọn hạng vé này</Typography>
            </Box>

            {/* Price */}
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                backgroundColor: "primary.light",
                borderRadius: 1,
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="white">
                USD 980.00
              </Typography>
              <Typography variant="body2" color="white">
                Mỗi hành khách
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Features Comparison Table */}
      <Paper sx={{ mt: 3 }}>
        <TableContainer>
          <Table>
            <TableBody>
              {fareFeatures.map((feature, index) => (
                <FeatureRow key={index} feature={feature} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Chip
          label="Tổng cộng: USD 2,230.00"
          color="primary"
          variant="filled"
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
        <Chip
          label="Tiếp tục với lựa chọn hiện tại"
          color="primary"
          variant="filled"
          sx={{
            fontSize: "1rem",
            padding: "12px 24px",
            "& .MuiChip-label": { padding: "8px 16px" },
          }}
        />
      </Box>
    </Box>
  );
};

export default FareComparison;
