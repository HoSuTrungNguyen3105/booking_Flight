import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import { Add, Edit, Delete, LocationOn, Schedule } from "@mui/icons-material";

interface Facility {
  id: string;
  name: string;
  type: string;
  description?: string;
  location?: string;
  openingHours?: string;
  terminal: {
    id: string;
    name: string;
  };
}

interface FacilityManagementProps {
  terminalId?: string;
}

const FacilityManagement: React.FC<FacilityManagementProps> = ({
  terminalId,
}) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "RESTAURANT",
    description: "",
    location: "",
    openingHours: "",
    terminalId: terminalId || "",
  });

  useEffect(() => {
    fetchFacilities();
  }, [terminalId, tabValue]);

  useEffect(() => {
    // 🚀 Thay vì fetch từ API, dùng mock data
    const mockFacilities: Facility[] = [
      {
        id: "1",
        name: "Highlands Coffee",
        type: "RESTAURANT",
        description: "Quán cà phê nổi tiếng tại sân bay",
        location: "Tầng 2, gần cổng số 5",
        openingHours: "06:00-22:00",
        terminal: { id: "T1", name: "Terminal 1" },
      },
      {
        id: "2",
        name: "Duty Free Shop",
        type: "SHOP",
        description: "Cửa hàng miễn thuế với nhiều sản phẩm",
        location: "Tầng 1, khu A",
        openingHours: "08:00-21:00",
        terminal: { id: "T2", name: "Terminal 2" },
      },
      {
        id: "3",
        name: "Lotus Lounge",
        type: "LOUNGE",
        description: "Phòng chờ hạng thương gia",
        location: "Tầng 3, gần gate 12",
        openingHours: "05:00-23:59",
        terminal: { id: "T1", name: "Terminal 1" },
      },
      {
        id: "4",
        name: "Vietcombank ATM",
        type: "ATM",
        location: "Sảnh đến quốc tế",
        terminal: { id: "T2", name: "Terminal 2" },
      },
      {
        id: "5",
        name: "Free Airport Wi-Fi",
        type: "WIFI",
        description: "Dịch vụ Wi-Fi miễn phí toàn sân bay",
        terminal: { id: "T1", name: "Terminal 1" },
      },
    ];

    setFacilities(mockFacilities);
  }, [terminalId, tabValue]);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:3000/facilities";
      if (terminalId) {
        url += `/terminal/${terminalId}`;
      } else if (tabValue > 0) {
        const types = ["RESTAURANT", "SHOP", "LOUNGE", "ATM", "WIFI"];
        url += `/type/${types[tabValue - 1]}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setFacilities(data);
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingFacility
        ? `http://localhost:3000/facilities/${editingFacility.id}`
        : "http://localhost:3000/facilities";

      const method = editingFacility ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Facility ${
            editingFacility ? "updated" : "created"
          } successfully!`,
        });
        setDialogOpen(false);
        fetchFacilities();
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error saving facility" });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      try {
        await fetch(`http://localhost:3000/facilities/${id}`, {
          method: "DELETE",
        });
        setMessage({ type: "success", text: "Facility deleted successfully!" });
        fetchFacilities();
      } catch (error) {
        setMessage({ type: "error", text: "Error deleting facility" });
      }
    }
  };

  const facilityTypes = {
    RESTAURANT: { label: "Nhà hàng", color: "primary" },
    SHOP: { label: "Cửa hàng", color: "secondary" },
    LOUNGE: { label: "Phòng chờ", color: "success" },
    ATM: { label: "ATM", color: "warning" },
    WIFI: { label: "Wi-Fi", color: "info" },
  };

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5">
            Quản lý Tiện nghi {terminalId && `- Terminal ${terminalId}`}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingFacility(null);
              setFormData({
                name: "",
                type: "RESTAURANT",
                description: "",
                location: "",
                openingHours: "",
                terminalId: terminalId || "",
              });
              setDialogOpen(true);
            }}
          >
            Thêm tiện nghi
          </Button>
        </Box>

        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        {!terminalId && (
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
          >
            <Tab label="Tất cả" />
            <Tab label="Nhà hàng" />
            <Tab label="Cửa hàng" />
            <Tab label="Phòng chờ" />
            <Tab label="ATM" />
            <Tab label="Wi-Fi" />
          </Tabs>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {facilities.map((facility) => (
            <Grid size={6} key={facility.id}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                    mb={2}
                  >
                    <Typography variant="h6">{facility.name}</Typography>
                    <Chip
                      label={
                        facilityTypes[
                          facility.type as keyof typeof facilityTypes
                        ]?.label
                      }
                      color={
                        facilityTypes[
                          facility.type as keyof typeof facilityTypes
                        ]?.color as any
                      }
                      size="small"
                    />
                  </Box>

                  {facility.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {facility.description}
                    </Typography>
                  )}

                  <Box sx={{ mb: 2 }}>
                    {facility.location && (
                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationOn
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {facility.location}
                        </Typography>
                      </Box>
                    )}
                    {facility.openingHours && (
                      <Box display="flex" alignItems="center">
                        <Schedule
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {facility.openingHours}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Terminal: {facility.terminal.name}
                  </Typography>

                  <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingFacility(facility);
                        setFormData({
                          name: facility.name,
                          type: facility.type,
                          description: facility.description || "",
                          location: facility.location || "",
                          openingHours: facility.openingHours || "",
                          terminalId: facility.terminal.id,
                        });
                        setDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(facility.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingFacility ? "Chỉnh sửa tiện nghi" : "Thêm tiện nghi mới"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Tên tiện nghi"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Loại tiện nghi</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  label="Loại tiện nghi"
                >
                  {Object.entries(facilityTypes).map(([value, { label }]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Mô tả"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Vị trí"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Giờ mở cửa"
                value={formData.openingHours}
                onChange={(e) =>
                  setFormData({ ...formData, openingHours: e.target.value })
                }
                placeholder="VD: 06:00-22:00"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingFacility ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacilityManagement;
