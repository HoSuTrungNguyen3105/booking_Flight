import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useGetAllAirportInfo } from "../../Api/useGetApi";
import type { AirportCodeProps } from "../../../utils/type";

const AirportManagement: React.FC = () => {
  const { getAirportInfo } = useGetAllAirportInfo();
  const [airports, setAirports] = useState<AirportCodeProps[]>([]);
  useEffect(() => {
    if (getAirportInfo?.list) {
      setAirports(getAirportInfo.list);
    }
  }, [getAirportInfo]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAirport, setEditingAirport] = useState<AirportCodeProps | null>(
    null
  );
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    city: "",
    country: "",
  });

  const handleCreate = () => {
    setEditingAirport(null);
    setFormData({ code: "", name: "", city: "", country: "" });
    setOpenDialog(true);
  };

  const handleEdit = (airport: AirportCodeProps) => {
    setEditingAirport(airport);
    setFormData({
      code: airport.code,
      name: airport.name,
      city: airport.city,
      country: airport.country,
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editingAirport) {
      // Update logic
      setAirports((prev) =>
        prev.map((a) =>
          a.code === editingAirport.code
            ? {
                ...a,
                ...formData,
                // updatedAt: new Date().toISOString().split("T")[0],
              }
            : a
        )
      );
    } else {
      // Create logic
      //   const newAirport: Airport = {
      //     ...formData,
      //     terminalCount: 0,
      //     // createdAt: new Date().toTimeString(),
      //   };
      //   setAirports((prev) => [...prev, newAirport]);
    }
    setOpenDialog(false);
  };

  const handleDelete = (code: string) => {
    setAirports((prev) => prev.filter((a) => a.code !== code));
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      Vietnam: "🇻🇳",
      "Thai Lan": "🇹🇭",
      Singapore: "🇸🇬",
      Japan: "🇯🇵",
      Korea: "🇰🇷",
    };
    return flags[country] || "🏳️";
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          <LocationIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
          Quản lý Sân bay
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{ borderRadius: 2 }}
        >
          Thêm Sân bay
        </Button>
      </Box>

      <Card elevation={3}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="airport table">
            <TableHead sx={{ bgcolor: "primary.main" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Mã sân bay
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Tên sân bay
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Thành phố
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Quốc gia
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Số terminal
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Ngày tạo
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {airports.map((airport) => (
                <TableRow key={airport.code} hover>
                  <TableCell>
                    <Chip
                      label={airport.code}
                      color="primary"
                      variant="filled"
                      sx={{ fontWeight: "bold", color: "white" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {airport.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{airport.city}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2">
                        {getCountryFlag(airport.country)}
                      </Typography>
                      <Typography variant="body1">{airport.country}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {/* <Chip
                      label={airport.terminalCount}
                      color={
                        airport.terminalCount > 0 ? "secondary" : "default"
                      }
                    /> */}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="caption">
                        Tạo:{" "}
                        {new Date(airport.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </Typography>
                      {airport.updatedAt && (
                        <Typography variant="caption" color="text.secondary">
                          Sửa:{" "}
                          {new Date(airport.updatedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(airport)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(airport.code)}
                          size="small"
                          //   disabled={airport.terminalCount > 0}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAirport ? "Chỉnh sửa Sân bay" : "Thêm Sân bay Mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Mã sân bay (IATA)"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  required
                  disabled={!!editingAirport}
                  inputProps={{ maxLength: 3 }}
                  helperText="3 ký tự viết hoa"
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Tên sân bay"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid size={12} sx={{ sm: 6 }}>
                <TextField
                  fullWidth
                  label="Thành phố"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid size={12} sx={{ sm: 6 }}>
                <TextField
                  fullWidth
                  label="Quốc gia"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              !formData.code ||
              !formData.name ||
              !formData.city ||
              !formData.country
            }
          >
            {editingAirport ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AirportManagement;
