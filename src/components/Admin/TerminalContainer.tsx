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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";
import TabPanel, { type ITabItem } from "../../common/Setting/TabPanel";
import { useGetTerminalData } from "../Api/usePostApi";
import type { Terminal } from "../../utils/type";

interface AirportGate {
  id: string;
  terminal: string;
  status: "available" | "occupied" | "maintenance";
  flight?: string;
  destination?: string;
}

interface Facility {
  id: string;
  name: string;
  type: string;
  terminalId: string;
  location?: string;
  openingHours?: string;
}

const tabs: ITabItem[] = [
  { label: "Tất cả", value: "all", description: "Hiển thị toàn bộ terminal" },
  { label: "Khu A", value: "A", description: "Chỉ hiển thị khu A" },
  { label: "Khu B", value: "B", description: "Chỉ hiển thị khu B" },
  { label: "Khu C", value: "C", description: "Chỉ hiển thị khu C" },
];

// Styled components
const TerminalContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  position: "relative",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[4],
    transform: "translateY(-2px)",
  },
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
    position: "relative",
    "&:hover": {
      opacity: 0.8,
      transform: "scale(1.05)",
    },
  };
});

const EditOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: "50%",
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  opacity: 0,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
}));

const AirportDiagram: React.FC = () => {
  const [selectedTerminal, setSelectedTerminal] = useState<string>("all");
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "terminal" | "gate" | "facility"
  >("terminal");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "available",
    type: "",
    location: "",
    openingHours: "",
    flight: "",
    destination: "",
  });

  const getTerminalColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      DOMESTIC: "#1976d2",
      INTERNATIONAL: "#2e7d32",
      BUSINESS: "#ed6c02",
      CARGO: "#757575",
    };
    return colorMap[type] || "#9c27b0";
  };

  const getGateStatusText = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      AVAILABLE: "Có sẵn",
      OCCUPIED: "Đã có chuyến bay",
      MAINTENANCE: "Đang bảo trì",
      CLOSED: "Đã đóng",
    };
    return statusMap[status] || status;
  };

  const handleFacilityClick = (facility: Facility) => {
    setDialogType("facility");
    setEditingItem(facility);
    // setFormData({
    //   name: facility.name,
    //   type: facility.type,
    //   code: facility.id
    //   // description: facility.description || '',
    //   location: facility.location || '',
    //   openingHours: facility.openingHours || '',
    //   // terminalId: facility.terminalId
    // });
    setDialogOpen(true);
  };

  const { getTerminalData } = useGetTerminalData();
  const handleTerminalClick = (terminal: Terminal) => {
    setDialogType("terminal");
    setEditingItem(terminal);
    setFormData({
      name: terminal.name,
      code: terminal.id,
      status: "available",
      type: "",
      location: "",
      openingHours: "",
      flight: "",
      destination: "",
    });
    setDialogOpen(true);
  };

  const [form, setForm] = useState({
    name: "",
    type: "LOUNGE",
    description: "",
    terminalId: "",
    location: "",
    openingHours: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGateClick = (gate: AirportGate) => {
    setDialogType("gate");
    setEditingItem(gate);
    setFormData({
      name: "",
      code: gate.id,
      status: gate.status,
      type: "",
      location: "",
      openingHours: "",
      flight: gate.flight || "",
      destination: gate.destination || "",
    });
    setDialogOpen(true);
  };

  const handleAddNew = (type: "gate" | "facility", terminalId: string) => {
    setDialogType(type);
    setEditingItem({ terminal: terminalId });
    setFormData({
      name: "",
      code: "",
      status: "available",
      type: "",
      location: "",
      openingHours: "",
      flight: "",
      destination: "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (dialogType === "gate") {
        // const res = await
      } else if (dialogType === "facility") {
        // const res = await
      } else if (dialogType === "terminal") {
        // const res = await
      }

      if (true) {
        setDialogOpen(false);
        window.location.reload(); // Temporary solution
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // const getGateStatusText = (status: string) => {
  //   switch (status) {
  //     case "occupied":
  //       return "Đã có chuyến bay";
  //     case "available":
  //       return "Có sẵn";
  //     case "maintenance":
  //       return "Bảo trì";
  //     default:
  //       return status;
  //   }
  // };

  const renderDialogContent = () => {
    switch (dialogType) {
      case "terminal":
        return (
          <>
            <TextField
              fullWidth
              label="Tên Terminal"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mã Terminal"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              margin="normal"
            />
          </>
        );

      case "gate":
        return (
          <>
            <TextField
              fullWidth
              label="Mã Gate"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                label="Trạng thái"
              >
                <MenuItem value="available">Có sẵn</MenuItem>
                <MenuItem value="occupied">Đã có chuyến bay</MenuItem>
                <MenuItem value="maintenance">Bảo trì</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Chuyến bay"
              value={formData.flight}
              onChange={(e) =>
                setFormData({ ...formData, flight: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Điểm đến"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              margin="normal"
            />
          </>
        );

      case "facility":
        return (
          <>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              select
              label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="LOUNGE">Lounge</MenuItem>
              <MenuItem value="RESTAURANT">Restaurant</MenuItem>
              <MenuItem value="SHOP">Shop</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>

            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />

            <TextField
              label="Terminal ID"
              name="terminalId"
              value={form.terminalId}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Opening Hours"
              name="openingHours"
              value={form.openingHours}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="06:00 - 23:00"
            />
            {/* <TextField
              fullWidth
              label="Tên tiện nghi"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Loại tiện nghi</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                label="Loại tiện nghi"
              >
                <MenuItem value="RESTAURANT">Nhà hàng</MenuItem>
                <MenuItem value="SHOP">Cửa hàng</MenuItem>
                <MenuItem value="LOUNGE">Phòng chờ</MenuItem>
                <MenuItem value="ATM">ATM</MenuItem>
                <MenuItem value="WIFI">Wi-Fi</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Vị trí"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Giờ mở cửa"
              value={formData.openingHours}
              onChange={(e) =>
                setFormData({ ...formData, openingHours: e.target.value })
              }
              margin="normal"
              placeholder="VD: 06:00-22:00"
            /> */}
          </>
        );
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
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
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
        <Alert severity="info">
          Click vào terminal, gate hoặc tiện nghi để chỉnh sửa. Click nút "+" để
          thêm mới.
        </Alert>
      </Box>

      {getTerminalData?.list
        ?.filter((t) => selectedTerminal === "all" || t.id === selectedTerminal)
        .map((terminal) => (
          <TerminalContainer
            key={terminal.id}
            elevation={2}
            sx={{ borderLeft: `4px solid ${getTerminalColor(terminal.type)}` }}
            onClick={() => handleTerminalClick(terminal)}
          >
            <EditOverlay
              sx={{ opacity: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                handleTerminalClick(terminal);
              }}
            >
              <Edit fontSize="small" />
            </EditOverlay>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: getTerminalColor(terminal.type),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  mr: 2,
                }}
              >
                {terminal.code} {/* Sửa từ terminal.id thành terminal.code */}
              </Box>
              <Typography
                variant="h5"
                component="h2"
                color={getTerminalColor(terminal.type)}
              >
                {terminal.name} ({terminal.code}) - {terminal.airport.name}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {terminal.description} • {terminal.type} •{" "}
                {terminal.airport.city}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={8}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">
                    Cổng ({terminal.gates.length} cổng)
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddNew("gate", terminal.id);
                    }}
                  >
                    <Add />
                  </IconButton>
                </Box>

                {terminal.gates.length > 0 ? (
                  <Grid container spacing={1}>
                    {terminal.gates.map((gate) => (
                      <Grid size={4} key={gate.id}>
                        <GateBox
                          status={gate.status}
                          onClick={(e) => {
                            e.stopPropagation();
                            // handleGateClick(gate);
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {gate.code} {/* Sửa từ gate.id thành gate.code */}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {getGateStatusText(gate.status)}
                          </Typography>
                          {/* Hiển thị thông tin flight assignment nếu có */}
                          {/* {gate. && gate.assignments.length > 0 && (
                      <Typography variant="caption" display="block">
                        {gate.assignments[0].flight?.flightNumber}
                      </Typography>
                    )} */}
                        </GateBox>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "grey.50",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Chưa có cổng nào. Click nút + để thêm cổng mới.
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid size={4}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">
                    Tiện nghi ({terminal.facilities.length})
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddNew("facility", terminal.id);
                    }}
                  >
                    <Add />
                  </IconButton>
                </Box>

                {terminal.facilities.length > 0 ? (
                  <Box sx={{ mb: 2 }}>
                    {terminal.facilities.map((facility) => (
                      <Chip
                        key={facility.id}
                        label={
                          <Box>
                            <Typography variant="body2">
                              {facility.name}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {facility.type}
                            </Typography>
                          </Box>
                        }
                        size="small"
                        variant="outlined"
                        sx={{ m: 0.5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFacilityClick(facility);
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "grey.50",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Chưa có tiện nghi nào. Click nút + để thêm tiện nghi mới.
                    </Typography>
                  </Box>
                )}

                {/* Hiển thị thông tin airport */}
                <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Thông tin sân bay:
                  </Typography>
                  <Typography variant="body2">
                    {terminal.airport.name} ({terminal.airport.code})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {terminal.airport.city}, {terminal.airport.city}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </TerminalContainer>
        ))}

      {/* Dialog for Create/Update */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingItem?.id
            ? `Chỉnh sửa ${dialogType}`
            : `Thêm mới ${dialogType}`}
        </DialogTitle>
        <DialogContent>{renderDialogContent()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingItem?.id ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AirportDiagram;
