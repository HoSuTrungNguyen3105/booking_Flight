import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useGetAllAirportInfo } from "../../../Api/useGetApi";
import type { Airport } from "../../../../utils/type";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import TableSection from "../../../../common/CustomRender/TableSection";
import AirportManageModal from "./AirportManageModal";
import AirportBatchCreator from "./AirportBatchCreator";
import DialogConfirm from "../../../../common/Modal/DialogConfirm";
import { useDeleteAirportById } from "../../../Api/usePostApi";

const AirportManagement: React.FC = () => {
  const { getAirportInfo, refetchGetAirportInfo } = useGetAllAirportInfo();
  // const [airports, setAirports] = useState<Airport[]>([]);
  const rowAirportsGrid = useMemo(
    () =>
      getAirportInfo?.list?.map((item) => ({
        ...item,
        id: item.code,
      })) || [],
    [getAirportInfo]
  );

  // Quản lý create/update/bulk modal
  const [toggleOpenModal, setToggleOpenModal] = useState({
    create: false,
    createBulk: false,
    update: false,
  });

  const { refetchDeleteAirport } = useDeleteAirportById();

  // Quản lý dialog confirm delete
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

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
    // createdAt: 0,
    // updatedAt: 0,
  });

  //   const handleCreate = (type: keyof typeof toggleOpenModal) => {
  //     setEditingAirport("create");
  //     setFormData({ code: "", name: "", city: "", country: "" });
  //     setToggleOpenModal((prev) => ({
  //     ...prev,
  //     [type]: true,
  //   }));
  //   };

  //   const handleClose = (type: keyof typeof toggleOpenModal) => {
  //   setToggleOpenModal((prev) => ({
  //     ...prev,
  //     [type]: false,
  //   }));
  // };

  const handleOpen = (type: keyof typeof toggleOpenModal) => {
    setToggleOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleClose = (type: keyof typeof toggleOpenModal) => {
    setToggleOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleCreate = () => {
    setEditingAirport("create");
    setFormData({ code: "", name: "", city: "", country: "" });
    handleOpen("create");
  };

  const handleEdit = (airport: Airport) => {
    setEditingAirport("update");
    setFormData(airport);
    handleOpen("update");
  };

  // const handleEdit = (airport: Airport , type: keyof typeof toggleOpenModal) => {
  //   setEditingAirport("update");
  //   setFormData({
  //     code: airport.code,
  //     name: airport.name,
  //     city: airport.city,
  //     country: airport.country,
  //     createdAt: airport.createdAt,
  //     updatedAt: airport.updatedAt,
  //   });
  //   setToggleOpenModal((prev) => ({
  //   ...prev,
  //   [type]: true,
  // }));
  // };

  const handleOpenDeleteClick = (code: string) => {
    console.log("row", code);
    setSelectedCode(code);
    setOpenConfirm(true);
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
          {/* <Typography variant="body2">
            {getCountryFlag(params.value)}
          </Typography> */}
          <Typography variant="body1">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      flex: 1,
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
              onClick={() => handleOpenDeleteClick(params.row.code)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // const handleDelete = useCallback( async(code: string) => {
  //   // setAirports((prev) => prev.filter((a) => a.code !== code));
  //   const res = await refetchDeleteAirport
  // },[])

  const handleConfirmDelete = async () => {
    if (selectedCode) {
      const res = await refetchDeleteAirport({ code: selectedCode });
      console.log("Deleting airport:", res);
      setOpenConfirm(false);
      refetchGetAirportInfo();
    }
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
          justifyContent: "flex-start",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          <LocationIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
          Quản lý Sân bay
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "start", gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleChangePageBtchCreate}
        >
          Create Batch
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
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
        onSuccess={() => refetchGetAirportInfo()}
        open={toggleOpenModal.create || toggleOpenModal.update}
        onClose={() => {
          handleClose("create");
          handleClose("update");
        }}
        editingAirport={editingAirport}
        formEditData={formData}
        // setFormData={setFormData}
      />

      <DialogConfirm
        cancelLabel="Hủy"
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa sân bay ${selectedCode} không? Hành động này không thể hoàn tác.`}
        confirmLabel="Xác nhận xóa"
      />
    </Box>
  );
};

export default AirportManagement;
