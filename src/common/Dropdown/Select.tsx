import {
  Box,
  Typography,
  MenuItem,
  Select,
  Modal,
  type SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { ArrowBack, ArrowDownward } from "@mui/icons-material";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import { StyledPagination } from "../CustomRender/Pagination";
import { Button, ButtonGroup } from "@mui/material";

interface OptionType {
  label: string;
  value: string;
  type: "admin" | "user" | "guest";
  icon?: string;
  description?: string;
}

interface RowData {
  id: number;
  avatar: string;
  type: string;
}

const options: OptionType[] = [
  {
    label: "Quản trị viên",
    value: "admin",
    type: "admin",
    icon: "/image.jpg",
    description: "Toàn quyền hệ thống",
  },
  {
    label: "Người dùng",
    value: "user",
    type: "user",
    icon: "/image.jpg",
    description: "Tài khoản thông thường",
  },
  {
    label: "Khách",
    value: "guest",
    type: "guest",
    icon: "/image.jpg",
    description: "Không đăng nhập",
  },
];

const typeList = ["admin", "user", "guest"] as const;

const initialData: RowData[] = Array.from({ length: 25 }).map((_, i) => ({
  id: i + 1,
  avatar: "/image.jpg",
  type: typeList[Math.floor(Math.random() * typeList.length)],
}));

export default function DataGridWithSelectModal() {
  const [data, setData] = useState<RowData[]>(initialData);
  const [selectOpen, setSelectOpen] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<OptionType | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const handleChange = (rowId: number) => (e: SelectChangeEvent<string>) => {
    const selected = options.find((o) => o.value === e.target.value);
    if (!selected) return;

    setData((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, type: selected.value } : row
      )
    );

    setModalType(selected);
    setModalOpen(true);
  };

  const CustomSelectIcon = () =>
    selectOpen !== null ? <ArrowBack /> : <ArrowDownward />;

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    {
      field: "avatar",
      headerName: "Ảnh",
      width: 80,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="avatar"
          width={30}
          height={30}
          style={{ borderRadius: "50%" }}
        />
      ),
    },
    {
      field: "typeSelect",
      headerName: "Chọn loại",
      width: 200,
      renderCell: (params) => {
        const row = params.row as RowData;
        return (
          <Select
            value={row.type}
            onChange={handleChange(row.id)}
            onOpen={() => setSelectOpen(row.id)}
            onClose={() => setSelectOpen(null)}
            size="small"
            IconComponent={() => null}
            renderValue={() => {
              const selected = options.find((o) => o.value === row.type);
              return (
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">
                    {selected?.label ?? "Chọn vai trò"}
                  </Typography>
                  <CustomSelectIcon />
                </Box>
              );
            }}
            sx={{
              minWidth: 160,
              "& .MuiSelect-select": {
                padding: "4px 28px 4px 8px",
                display: "flex",
                alignItems: "center",
              },
              "& fieldset": {
                border: "none",
              },
              "& .MuiInputBase-root": {
                borderRadius: 0,
              },
            }}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                <Box display="flex" alignItems="center" gap={1}>
                  <img
                    src={opt.icon}
                    alt=""
                    width={20}
                    height={20}
                    style={{ borderRadius: "50%" }}
                  />
                  <Typography>{opt.label}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "type",
      headerName: "Loại",
      width: 130,
    },
  ];

  return (
    <>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          key={paginationModel.page} // Tránh lỗi re-render
          rows={data}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20, 50]}
          paginationMode="client"
          slots={{
            pagination: (props) => <StyledPagination {...props} />,
          }}
          sx={{
            "& .MuiDataGrid-footerContainer": {
              justifyContent: "center",
              paddingY: 2,
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                margin: 0,
              },
          }}
          // sx={{
          //   "& .MuiDataGrid-footerContainer": {
          //     justifyContent: "center",
          //     paddingY: 2,
          //   },
          // }}
        />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography>
            Hiển thị {paginationModel.page * paginationModel.pageSize + 1}–
            {Math.min(
              (paginationModel.page + 1) * paginationModel.pageSize,
              data.length
            )}{" "}
            trên {data.length} bản ghi
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography>
            Hiển thị {paginationModel.page * paginationModel.pageSize + 1}–
            {Math.min(
              (paginationModel.page + 1) * paginationModel.pageSize,
              data.length
            )}{" "}
            trên {data.length} bản ghi
          </Typography>

          <ButtonGroup size="small" variant="outlined">
            {[5, 10, 25].map((size) => (
              <Button
                key={size}
                onClick={() => {
                  setPaginationModel((prev) => ({ ...prev, pageSize: size }));
                }}
                variant={
                  paginationModel.pageSize === size ? "contained" : "outlined"
                }
              >
                {size}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </Box>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            p: 3,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 24,
            width: 300,
            mx: "auto",
            mt: "20vh",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Vai trò được chọn:
          </Typography>
          <Typography mt={1}>
            {modalType?.label} - {modalType?.description}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
