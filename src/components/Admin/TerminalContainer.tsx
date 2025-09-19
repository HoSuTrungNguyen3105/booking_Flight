import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  styled,
  Stack,
} from "@mui/material";
import { LocalParking, DirectionsWalk } from "@mui/icons-material";
import TabPanel, { type ITabItem } from "../../common/Setting/TabPanel";

// Định nghĩa types
interface TerminalSection {
  id: string;
  name: string;
  gates: string[];
  facilities: string[];
  color: string;
}

interface AirportGate {
  id: string;
  terminal: string;
  status: "available" | "occupied" | "maintenance";
  flight?: string;
  destination?: string;
}

// Dữ liệu mẫu cho sân bay
const terminalSections: TerminalSection[] = [
  {
    id: "A",
    name: "Terminal A - Quốc tế",
    gates: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"],
    facilities: ["Nhà hàng", "Quầy miễn thuế", "Phòng chờ VIP", "Đổi ngoại tệ"],
    color: "#1976d2",
  },
  {
    id: "B",
    name: "Terminal B - Nội địa",
    gates: ["B1", "B2", "B3", "B4", "B5", "B6"],
    facilities: ["Quán cà phê", "Cửa hàng lưu niệm", "Wi-Fi miễn phí", "ATM"],
    color: "#2e7d32",
  },
  {
    id: "C",
    name: "Terminal C - Hạng thương ...",
    gates: ["C1", "C2", "C3", "C4"],
    facilities: [
      "Phòng chờ hạng nhất",
      "Dịch vụ spa",
      "Nhà hàng cao cấp",
      "Dịch vụ đặc biệt",
    ],
    color: "#ed8702",
  },
  {
    id: "D",
    name: "Terminal D - Hạng thương gia",
    gates: ["D1", "D2", "D3", "D4"],
    facilities: [
      "Phòng chờ hạng nhất",
      "Dịch vụ spa",
      "Nhà hàng cao cấp",
      "Dịch vụ đặc biệt",
    ],
    color: "#ed6c02",
  },
];

const airportGates: AirportGate[] = [
  {
    id: "A1",
    terminal: "A",
    status: "occupied",
    flight: "VN 123",
    destination: "Bangkok",
  },
  {
    id: "A2",
    terminal: "A",
    status: "available",
    flight: "VN 456",
    destination: "Singapore",
  },
  { id: "A3", terminal: "A", status: "maintenance" },
  { id: "A4", terminal: "A", status: "available" },
  {
    id: "A5",
    terminal: "A",
    status: "occupied",
    flight: "QF 789",
    destination: "Sydney",
  },
  { id: "A6", terminal: "A", status: "available" },
  {
    id: "A7",
    terminal: "A",
    status: "occupied",
    flight: "JL 012",
    destination: "Tokyo",
  },
  { id: "A8", terminal: "A", status: "available" },
  {
    id: "B1",
    terminal: "B",
    status: "occupied",
    flight: "VN 345",
    destination: "Hồ Chí Minh",
  },
  { id: "B2", terminal: "B", status: "available" },
  {
    id: "B3",
    terminal: "B",
    status: "occupied",
    flight: "VN 678",
    destination: "Đà Nẵng",
  },
  { id: "B4", terminal: "B", status: "maintenance" },
  { id: "B5", terminal: "B", status: "available" },
  {
    id: "B6",
    terminal: "B",
    status: "occupied",
    flight: "VJ 901",
    destination: "Nha Trang",
  },
  {
    id: "D1",
    terminal: "D",
    status: "occupied",
    flight: "EK 123",
    destination: "Dubai",
  },
  { id: "D2", terminal: "D", status: "available" },
  {
    id: "D3",
    terminal: "D",
    status: "occupied",
    flight: "SQ 456",
    destination: "London",
  },
  { id: "D4", terminal: "D", status: "maintenance" },
];

const tabs: ITabItem[] = [
  { label: "Tất cả", value: "all", description: "Hiển thị toàn bộ terminal" },
  { label: "Khu A", value: "A", description: "Chỉ hiển thị khu A" },
  { label: "Khu B", value: "B", description: "Chỉ hiển thị khu B" },
  { label: "Khu C", value: "C", description: "Chỉ hiển thị khu C" },
  { label: "Khu D", value: "D", description: "Chỉ hiển thị khu D" },
];

// Styled components
const TerminalContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const GateBox = styled(Box)<{ status: string }>(({ theme, status }) => {
  let backgroundColor = theme.palette.grey[300];
  let color = theme.palette.text.primary;

  if (status === "occupied") {
    backgroundColor = theme.palette.primary.main;
    color = theme.palette.primary.contrastText;
  } else if (status === "maintenance") {
    backgroundColor = theme.palette.warning.main;
    color = theme.palette.warning.contrastText;
  }

  return {
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    textAlign: "center",
    cursor: "pointer",
    backgroundColor,
    color,
    fontWeight: "bold",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      opacity: 0.8,
    },
  };
});

const FacilityChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.grey[100],
  border: `1px solid ${theme.palette.grey[300]}`,
}));

// Main component
const AirportDiagram: React.FC = () => {
  const [selectedTerminal, setSelectedTerminal] = useState<string>("all");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeTab, setActiveTab] = useState(0);

  const getGateStatusText = (status: string) => {
    switch (status) {
      case "occupied":
        return "Đã có chuyến bay";
      case "available":
        return "Có sẵn";
      case "maintenance":
        return "Bảo trì";
      default:
        return status;
    }
  };

  return (
    <>
      <Stack sx={{ mb: 1 }}>
        <TabPanel
          activeTab={activeTab}
          onChangeTab={(idx) => {
            setActiveTab(idx);
            setSelectedTerminal(tabs[idx].value);
          }}
          tabs={tabs}
        />
      </Stack>

      <Box sx={{ p: "8px" }}>
        <Typography variant="h6" gutterBottom>
          Chú thích
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "primary.main",
                mr: 1,
                borderRadius: 1,
              }}
            />
            <Typography variant="body2">Đã có chuyến bay</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "grey.300",
                mr: 1,
                borderRadius: 1,
              }}
            />
            <Typography variant="body2">Có sẵn</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "warning.main",
                mr: 1,
                borderRadius: 1,
              }}
            />
            <Typography variant="body2">Đang bảo trì</Typography>
          </Box>
        </Box>
      </Box>

      {/* Terminal sections */}
      {terminalSections
        .filter((t) => selectedTerminal === "all" || t.id === selectedTerminal)
        .map((terminal) => (
          <TerminalContainer
            key={terminal.id}
            elevation={2}
            sx={{ borderLeftColor: terminal.color }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: terminal.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  mr: 2,
                }}
              >
                {terminal.id}
              </Box>
              <Typography variant="h5" component="h2" color={terminal.color}>
                {terminal.name}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={12} sx={{ md: 8 }}>
                <Typography variant="h6" gutterBottom>
                  Cổng ({terminal.gates.length} cổng)
                </Typography>
                <Grid container spacing={1}>
                  {terminal.gates.map((gate) => {
                    const gateInfo = airportGates.find((g) => g.id === gate);
                    return (
                      <Grid size={6} sx={{ sm: 4, md: 4 }} key={gate}>
                        <GateBox status={gateInfo?.status || "available"}>
                          <Typography variant="body2" fontWeight="bold">
                            {gate}
                          </Typography>
                          {gateInfo?.flight && (
                            <Typography variant="caption" display="block">
                              {gateInfo.flight}
                            </Typography>
                          )}
                          {gateInfo?.destination && (
                            <Typography variant="caption" display="block">
                              {gateInfo.destination}
                            </Typography>
                          )}
                          <Typography variant="caption" display="block">
                            {getGateStatusText(gateInfo?.status || "available")}
                          </Typography>
                        </GateBox>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>

              <Grid size={12} sx={{ md: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Tiện nghi
                </Typography>
                <Box>
                  {terminal.facilities.map((facility) => (
                    <FacilityChip
                      key={facility}
                      label={facility}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Chỉ dẫn
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Chip
                    icon={<DirectionsWalk />}
                    label="5 phút đi bộ từ quầy check-in"
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    icon={<LocalParking />}
                    label="Bãi đỗ xe gần nhất: P2"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          </TerminalContainer>
        ))}
    </>
  );
};

export default AirportDiagram;
