import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import TableSection from "../../../common/Setting/TableSection";

const AirportManagement: React.FC = () => {
  const { getAirportInfo } = useGetAllAirportInfo();
  const [airports, setAirports] = useState<AirportCodeProps[]>([]);
  const rowAirportsGrid = useMemo(
    () =>
      getAirportInfo?.list?.map((item) => ({
        ...item,
        id: item.code,
      })) || [],
    [getAirportInfo]
  );
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

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Mã sân bay",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color="primary"
          variant="filled"
          sx={{ fontWeight: "bold", color: "white" }}
        />
      ),
    },
    { field: "name", headerName: "Tên sân bay", flex: 2 },
    { field: "city", headerName: "Thành phố", flex: 1 },
    {
      field: "country",
      headerName: "Quốc gia",
      flex: 1.5,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2">
            {getCountryFlag(params.value)}
          </Typography>
          <Typography variant="body1">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "terminalCount",
      headerName: "Số terminal",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={params.value > 0 ? "secondary" : "default"}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      flex: 1.5,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="caption">
            Tạo: {new Date(params.value as string).toLocaleDateString("vi-VN")}
          </Typography>
          {params.row.updatedAt && (
            <Typography variant="caption" color="text.secondary">
              Sửa: {new Date(params.row.updatedAt).toLocaleDateString("vi-VN")}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              color="primary"
              onClick={() => handleEdit(params.row)}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.code)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleSave = () => {
    if (editingAirport) {
      setAirports((prev) =>
        prev.map((a) =>
          a.code === editingAirport.code
            ? {
                ...a,
                ...formData,
              }
            : a
        )
      );
    } else {
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

      <TableSection
        rows={rowAirportsGrid}
        columns={columns}
        setRows={() => {}}
        isLoading={false}
        largeThan
        nextRowClick
      />
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
