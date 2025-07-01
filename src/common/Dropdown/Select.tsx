// import {
//   Box,
//   MenuItem,
//   Select,
//   Typography,
//   type SelectChangeEvent,
// } from "@mui/material";
// import { useState } from "react";
// import Modal from "../Modal/Modal";
// import { ArrowBack, ArrowDownward } from "@mui/icons-material";

// interface OptionType {
//   label: string;
//   value: string;
//   type: "admin" | "user" | "guest";
//   icon?: string;
//   description?: string;
// }

// const options: OptionType[] = [
//   {
//     label: "Quản trị viên",
//     value: "admin",
//     type: "admin",
//     icon: "./public/image.jpg",
//     description: "Toàn quyền hệ thống",
//   },
//   {
//     label: "Người dùng",
//     value: "user",
//     type: "user",
//     icon: "./public/image.jpg",
//     description: "Tài khoản thông thường",
//   },
//   {
//     label: "Khách",
//     value: "guest",
//     type: "guest",
//     icon: "./public/image.jpg",
//     description: "Không đăng nhập",
//   },
// ];

// const renderMenuItem = (option: OptionType) => (
//   <Box display="flex" alignItems="center" gap={1}>
//     {option.icon && (
//       <img src={option.icon} alt="" width={20} style={{ borderRadius: 4 }} />
//     )}
//     <Box>
//       <Typography fontWeight="bold">{option.label}</Typography>
//       <Typography variant="caption">{option.description}</Typography>
//     </Box>
//   </Box>
// );

// export default function SelectWithModal() {
//   const [value, setValue] = useState("");
//   const [open, setOpen] = useState(false);
//   const CustomSelectIcon = () => {
//     return open ? <ArrowBack /> : <ArrowDownward />;
//   };
//   const handleChangeSelect = (event: SelectChangeEvent<string>) => {
//     setValue(event.target.value);
//   };
//   const [selectedValue, setSelectedValue] = useState<string>("");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState<OptionType | null>(null);

//   const handleChange = (e: SelectChangeEvent<string>) => {
//     const selected = options.find((o) => o.value === e.target.value);
//     if (selected) {
//       setSelectedValue(selected.value);
//       setModalType(selected);
//       setModalOpen(true); // Mở modal tương ứng
//     }
//   };

//   return (
//     <>
//       <Select
//         value={value}
//         onChange={handleChange}
//         displayEmpty
//         fullWidth
//         size="small"
//         onOpen={() => setOpen(true)}
//         onClose={() => setOpen(false)}
//         IconComponent={CustomSelectIcon} // ✅ thay icon gốc ở đây
//         renderValue={() => (value ? value : "Chọn một mục")}
//         sx={{
//           ".MuiSelect-icon": {
//             right: 8,
//             top: "calc(50% - 12px)",
//           },
//         }}
//       >
//         <MenuItem value="admin">Admin</MenuItem>
//         <MenuItem value="user">User</MenuItem>
//         <MenuItem value="guest">Guest</MenuItem>
//       </Select>

//       <Modal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={() => {
//           console.log("Đã xác nhận role:", modalType?.value);
//           setModalOpen(false);
//         }}
//         confirmText="Xác nhận"
//         title={
//           <Typography fontWeight="bold">
//             {modalType?.label ?? "Thông tin"}
//           </Typography>
//         }
//       >
//         <Typography variant="body2" mb={1}>
//           Đây là modal cho vai trò:{" "}
//           <strong>{modalType?.type.toUpperCase()}</strong>
//         </Typography>
//         <Typography variant="body1">
//           {modalType?.description ?? "Không có mô tả"}
//         </Typography>
//       </Modal>
//     </>
//   );
// }
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { ArrowBack, ArrowDownward } from "@mui/icons-material";
import Modal from "../Modal/Modal";
import CSelect from "./CSelect";

interface OptionType {
  label: string;
  value: string;
  type: "admin" | "user" | "guest";
  icon?: string;
  description?: string;
}
interface ActionType {
  type: "add" | "edit" | "delete";
  payload?: any;
  onClick?: () => void;
}
interface OptionDropdown {
  label: string;
  icon?: string;
  action: ActionType;
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

const renderMenuItem = (option: OptionType) => (
  <Box display="flex" alignItems="center">
    <Typography fontWeight="bold">{option.label}</Typography>
  </Box>
);

interface RowData {
  id: number;
  avatar: string;
  type: string;
}

const initialData: RowData[] = [
  { id: 1, avatar: "./public/image.jpg", type: "admin" },
  { id: 2, avatar: "./public/image.jpg", type: "user" },
  { id: 3, avatar: "./public/image.jpg", type: "guest" },
];

export default function TableWithSelectModal() {
  const [data, setData] = useState(initialData);
  const [selectOpen, setSelectOpen] = useState<number | null>(null);
  const [modalOpen1, setModalOpen1] = useState(false);
  const [nodalOpen2, setModalOpen2] = useState(false);
  const [modalOpen3, setModalOpen3] = useState(false);
  const [modalType, setModalType] = useState<OptionType | null>(null);
  const valueOptiondrpp: OptionDropdown[] = [
    {
      label: "kkk",
      action: {
        type: "add",
        payload: null, // ✅ hoặc giá trị phù hợp
        // onClick: () => handleChange(),
      },
    },
  ];

  const handleChange = (rowId: number) => (e: SelectChangeEvent<string>) => {
    const selected = options.find((o) => o.value === e.target.value);
    if (selected) {
      setData((prev) =>
        prev.map((row) =>
          row.id === rowId ? { ...row, type: selected.value } : row
        )
      );
      setModalType(selected);
      setModalOpen1(true);
    }
  };

  const CustomSelectIcon = () => {
    return selectOpen !== null ? <ArrowBack /> : <ArrowDownward />;
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell sx={{ padding: 0 }}>
                {/* <CSelect value={row.type} /> */}
              </TableCell>
              <TableCell>Loại</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <img
                    src={row.avatar}
                    alt="avatar"
                    width={40}
                    style={{ borderRadius: "50%" }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    border: "none",
                    padding: 0,
                  }}
                >
                  <Select
                    value={row.type}
                    onChange={handleChange(row.id)}
                    onOpen={() => setSelectOpen(row.id)}
                    onClose={() => setSelectOpen(null)}
                    variant="standard"
                    disableUnderline
                    size="small"
                    displayEmpty
                    IconComponent={() => null}
                    renderValue={() => {
                      const selected = options.find(
                        (o) => o.value === row.type
                      );
                      return (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="start"
                          width="100%"
                        >
                          <Typography variant="body2">
                            {selected ? selected.label : "Chọn vai trò"}
                          </Typography>
                          <CustomSelectIcon />{" "}
                        </Box>
                      );
                    }}
                    sx={{
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        paddingRight: "24px !important",
                      },
                      "& svg": {
                        right: 0,
                      },
                      ".MuiOutlinedInput-notchedOutline": {
                        border: "none", // ✅ Nếu lỡ xài 'outlined'
                      },
                      "& fieldset": {
                        border: "none", // ✅ Thêm chắc chắn
                      },
                      "& .MuiInputBase-root MuiInput-root": {
                        borderRadius: 0, // ✅ Bỏ bo góc
                      },
                      border: "none", // ✅ Trực tiếp
                      padding: 0,
                      minWidth: 180,
                      ".MuiSelect-select": {
                        padding: "4px 28px 4px 8px", // top/right/bottom/left
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "white", // ✅ Bỏ nền
                        gap: 6, // khoảng cách giữa icon và text
                      },
                      ".MuiSelect-icon": {
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 18, // icon nhỏ hơn nếu cần
                      },
                    }}
                  >
                    {options.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {renderMenuItem(opt)}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{row.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <Modal
        open={modalOpen1}
        onClose={() => setModalOpen1(false)}
        onSubmit={() => {
          console.log("Chọn role:", modalType?.value);
          setModalOpen1(false);
        }}
        title={
          <Typography fontWeight="bold">
            {modalType?.label ?? "Thông tin"}
          </Typography>
        }
        confirmText="Xác nhận"
      >
        <Typography variant="body2" mb={1}>
          Đây là modal cho vai trò:{" "}
          <strong>{modalType?.type.toUpperCase()}</strong>
        </Typography>
        <Typography variant="body1">
          {modalType?.description ?? "Không có mô tả"}
        </Typography>
      </Modal> */}
      <Modal
        open={modalOpen1}
        handleClose={() => setModalOpen1(false)}
        handleSubmit={() => {
          console.log("Chọn role:", modalType?.value);
          setModalOpen1(false);
        }}
        title={
          <Typography fontWeight="bold">
            {modalType?.label ?? "Thông tin"}
          </Typography>
        }
        submitLabel="Xác nhận"
        contentArea={
          <Box>
            <Typography variant="body2" mb={1}>
              Đây là modal cho vai trò:{" "}
              <strong>{modalType?.type.toUpperCase()}</strong>
            </Typography>
            <Typography variant="body1">
              {modalType?.description ?? "Không có mô tả"}
            </Typography>
          </Box>
        }
      ></Modal>
    </>
  );
}
