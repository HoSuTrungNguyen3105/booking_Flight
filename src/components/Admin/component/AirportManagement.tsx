import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  IconButton,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useGetAllAirportInfo } from "../../Api/useGetApi";
import type { Airport } from "../../../utils/type";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import TableSection from "../../../common/Setting/TableSection";
import AirportManageModal from "../modal/AirportManageModal";
import AirportBatchCreator from "./AirportBatchCreator";

const AirportManagement: React.FC = () => {
  const { getAirportInfo, refetchGetAirportInfo } = useGetAllAirportInfo();
  const [airports, setAirports] = useState<Airport[]>([]);
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
  const [changePageBtchCreate, setChangePageBtchCreate] = useState(false);
  const handleChangePageBtchCreate = () => {
    setChangePageBtchCreate(true);
  };
  const [editingAirport, setEditingAirport] = useState<"update" | "create">(
    "create"
  );
  const [formData, setFormData] = useState<Airport>({
    code: "",
    name: "",
    city: "",
    country: "",
    createdAt: "",
    updatedAt: "",
  });

  const handleCreate = () => {
    setEditingAirport("create");
    setFormData({ code: "", name: "", city: "", country: "" });
    setOpenDialog(true);
  };

  const handleEdit = (airport: Airport) => {
    setEditingAirport("update");
    setFormData({
      code: airport.code,
      name: airport.name,
      city: airport.city,
      country: airport.country,
      createdAt: airport.createdAt,
      updatedAt: airport.updatedAt,
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
    { field: "name", headerName: "Tên sân bay", flex: 1 },
    { field: "city", headerName: "Thành phố", flex: 1 },
    {
      field: "country",
      headerName: "Quốc gia",
      flex: 1,
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

  const handleDelete = (code: string) => {
    setAirports((prev) => prev.filter((a) => a.code !== code));
  };

  const countryFlags: Record<string, string> = {
    Vietnam: "🇻🇳",
    ThaiLan: "🇹🇭",
    Singapore: "🇸🇬",
    Japan: "🇯🇵",
    Korea: "🇰🇷",
  };

  const getCountryFlag = (country?: string): string => {
    if (!country) return "🏳️";

    const key = country.trim().toLowerCase();
    return countryFlags[key] ?? "🏳️";
  };

  if (changePageBtchCreate) {
    return (
      <AirportBatchCreator
        onClose={() => {
          refetchGetAirportInfo(), setChangePageBtchCreate(false);
        }}
      />
    );
  }

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
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleChangePageBtchCreate}
          sx={{ borderRadius: 2 }}
        >
          Create Batch
        </Button>
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
      <AirportManageModal
        onSuccess={() => {}}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        editingAirport={editingAirport}
        formEditData={formData}
        // setFormData={setFormData}
      />
    </Box>
  );
};

export default AirportManagement;
