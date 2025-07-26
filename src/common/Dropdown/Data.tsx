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
import OrderButton from "../Button/OrderButton.tsx";
import CSelect, { type ActionType } from "./CSelect.tsx";
import Pagination from "../DataGrid/Pagination.tsx";

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
  const handleOrderChange = (direction: "up" | "down", rowIndex: number) => {
    if (direction === "up" && rowIndex > 0) {
      setData((prev) => {
        const newData = [...prev];
        [newData[rowIndex - 1], newData[rowIndex]] = [
          newData[rowIndex],
          newData[rowIndex - 1],
        ];
        return newData;
      });
    } else if (direction === "down" && rowIndex < data.length - 1) {
      setData((prev) => {
        const newData = [...prev];
        [newData[rowIndex + 1], newData[rowIndex]] = [
          newData[rowIndex],
          newData[rowIndex + 1],
        ];
        return newData;
      });
    }
  };
  const [selectedValues, setSelectedValues] = useState<DropdownOption[]>([]); // ✅ default là mảng rỗng
  const [onOpenModal, setOnOpenModal] = useState(false);
  const HandleOpenModal = () => {
    setOnOpenModal(true);
  };
  // const handleChange = (rowId: number) => (e: SelectChangeEvent<string>) => {
  //   const selected = options.find((o) => o.value === e.target.value);
  //   if (!selected) return;

  //   // setData((prev) =>
  //   //   prev.map((row) =>
  //   //     row.id === rowId ? { ...row, type: selected.value } : row
  //   //   )
  //   // );

  //   // setModalType(selected);
  //   setModalOpen(true);
  // };
  const [selectedValue, setSelectedValue] = useState<string | number>("");

  const handleChange = (val: string | number) => {
    console.log("Giá trị đã chọn:", val);
    setSelectedValue(val);
  };

  const options: ActionType[] = [
    { value: 10, label: "10 sản phẩm" },
    { value: 15, label: "15 sản phẩm" },
    { value: 20, label: "20 sản phẩm" },
  ];
  // const CustomSelectIcon = () =>
  //   selectOpen !== null ? <ArrowBack /> : <ArrowDownward />;

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "avatar",
      headerName: "Ảnh + Tên",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <img
          src={params.value} // = avatar
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
      flex: 1,
      renderCell: () => {
        return (
          <CSelect
            value={selectedValue}
            onChange={handleChange}
            options={options}
            // onChange={handleChange(row.id)}
          />
        );
      },
    },
    {
      field: "type",
      headerName: "Loại",
      flex: 1,
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);

        return (
          <Box onClick={(e) => e.stopPropagation()}>
            <OrderButton
              disabled={{
                up: rowIndex === 0,
                down: rowIndex === data.length - 1,
              }}
              onClick={(direction) => handleOrderChange(direction, rowIndex)}
            />
          </Box>
        );
      },
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
      <Box
        display={"flex"}
        flexDirection="column"
        margin={"8px"}
        height={"350px"}
        gap={2}
      >
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
          <DataTable rows={data} columns={columns} loading={false} />
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <Pagination
            currentPage={paginationModel.page + 1}
            pageSize={paginationModel.pageSize}
            totalPage={Math.ceil(data.length / paginationModel.pageSize)}
            totalResult={data.length}
            onPageChange={(page) =>
              setPaginationModel((prev) => ({ ...prev, page }))
            }
            onPageSizeChange={(pageSize) =>
              setPaginationModel((prev) => ({ ...prev, pageSize }))
            }
          />
        </Box>
      </Box>
    );
  }, [data, columns]);

  return (
    <>
      <Box sx={{ width: "100%", p: 2 }}>{renderGridData}</Box>
    </>
  );
}
