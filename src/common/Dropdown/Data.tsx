import {
  Box,
  Typography,
  MenuItem,
  type SelectChangeEvent,
  Select,
} from "@mui/material";
import { useMemo, useState } from "react";
import { ArrowBack, ArrowDownward } from "@mui/icons-material";
import {
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import DataTable from "../DataGrid/index.tsx";
import { ButtonGroup } from "@mui/material";
import type { DropdownOption } from "./MultiDropdown";
import { Dropdown } from "./Dropdown";
import { Button } from "../Button/Button.tsx";
import Modal from "../Modal/Modal.tsx";
import { useNavigate } from "react-router-dom";

interface OptionType {
  label: string;
  value: string;
  type: "admin" | "user" | "sys_guest";
  icon?: string;
  description?: string;
}

interface RowData {
  id: number;
  avatar: string;
  type: string;
  status: string;
}

const optionsDropdown: DropdownOption[] = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Python", value: "py" },
  { label: "Java", value: "java" },
];

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
    type: "sys_guest",
    icon: "/image.jpg",
    description: "Không đăng nhập",
  },
];

const typeList = ["admin", "user", "sys_guest"] as const;
const statusList = ["완료", "미완료", "진행중"] as const;

const initialData: RowData[] = Array.from({ length: 25 }).map((_, i) => ({
  id: i + 1,
  avatar: "/image.jpg",
  type: typeList[Math.floor(Math.random() * typeList.length)],
  status: statusList[Math.floor(Math.random() * typeList.length)],
}));

export default function DataGridInTab() {
  const [data, setData] = useState<RowData[]>(initialData);
  const [selectOpen, setSelectOpen] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<OptionType | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [selectedValues, setSelectedValues] = useState<DropdownOption[]>([]); // ✅ default là mảng rỗng
  const [onOpenModal, setOnOpenModal] = useState(false);
  const HandleOpenModal = () => {
    setOnOpenModal(true);
  };
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
  const navigate = useNavigate();

  const CustomSelectIcon = () =>
    selectOpen !== null ? <ArrowBack /> : <ArrowDownward />;

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "avatar",
      headerName: "Ảnh",
      flex: 1,
      minWidth: 150,
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
      flex: 1,
      minWidth: 150,
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
                  {/* <CustomSelectIcon /> */}
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
      flex: 1,
      minWidth: 150,
    },
    {
      field: "status",
      headerName: "상태",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => {
        let bgColor = "";
        let textColor = "#000";

        switch (params.value) {
          case "진행중":
            bgColor = "#FFF36C"; // Yellow
            break;
          case "미완료":
            bgColor = "#E1BEE7"; // Light purple/pink
            break;
          case "완료":
            bgColor = "#D6ECE7"; // Light blue
            break;
          default:
            bgColor = "#E0E0E0"; // Grey
        }

        return (
          <Box display="flex" padding={1.2}>
            <Typography
              sx={{
                display: "flex",
                backgroundColor: bgColor,
                padding: "4px 12px",
                borderRadius: "3px",
                color: textColor,
                width: "70px", // hoặc width: 64
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
  ];

  const renderGridData = useMemo(() => {
    return (
      <Box>
        <Button label="Submit" onClick={HandleOpenModal} />
        <DataTable
          onRowSelect={(row) =>
            navigate("/admin/profile", {
              state: { id: row.id },
            })
          }
          rows={data}
          columns={columns}
        />
        <Modal open={onOpenModal} contentArea={<></>} />
      </Box>
    );
  }, [data, columns]);

  return (
    <>
      <Box sx={{ width: "100%", p: 2 }}>
        {renderGridData}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
          px={1}
        >
          <Typography variant="body2" color="text.secondary">
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
                label={size}
                key={size}
                onClick={() =>
                  setPaginationModel((prev) => ({ ...prev, pageSize: size }))
                }
                // variant={
                //   paginationModel.pageSize === size ? "contained" : "outlined"
                // }
              ></Button>
            ))}
          </ButtonGroup>
        </Box>
      </Box>
      <Box
        mt={4}
        px={3}
        py={5}
        borderTop="2px solid #eee"
        bgcolor="#f9f9f9"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Lọc theo Framework
        </Typography>
        <Dropdown
          label="Chọn Framework"
          placeholder="Chọn nhiều cái"
          options={optionsDropdown}
          value={selectedValues}
          onChange={(event, newValue) =>
            setSelectedValues(newValue as DropdownOption[])
          }
          multiple
          disableCloseOnSelect
          status="confirmed"
        />
      </Box>

      {/* Modal */}
      <Modal
        open={onOpenModal}
        handleClose={() => setModalOpen(false)}
        contentArea={
          <Box sx={{ bgcolor: "grey" }}>
            <Typography variant="h6" fontWeight="bold">
              Vai trò được chọn
            </Typography>
            <Typography mt={1} color="text.secondary">
              {modalType?.label} - {modalType?.description}
            </Typography>
            <Box textAlign="right" mt={2}>
              <Button
                label="Đóng"
                onClick={() => setModalOpen(false)}
                size="small"
              ></Button>
            </Box>
          </Box>
        }
      />
    </>
  );
}
