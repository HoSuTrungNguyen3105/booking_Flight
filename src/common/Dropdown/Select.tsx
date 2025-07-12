import {
  Box,
  Typography,
  MenuItem,
  Select,
  Modal,
  type SelectChangeEvent,
} from "@mui/material";
import { useMemo, useState } from "react";
import { ArrowBack, ArrowDownward } from "@mui/icons-material";
import {
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import DataTable from "../DataGrid/index.tsx";
import { Button, ButtonGroup } from "@mui/material";
import type { DropdownOption } from "./MultiDropdown";
import { Dropdown } from "./Dropdown";
import SearchLayout, {
  type TabItem,
} from "../../components/Layout/SearchLayout.tsx";

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
    type: "guest",
    icon: "/image.jpg",
    description: "Không đăng nhập",
  },
];

const typeList = ["admin", "user", "guest"] as const;
const statusList = ["완료", "미완료", "진행중"] as const;

const initialData: RowData[] = Array.from({ length: 25 }).map((_, i) => ({
  id: i + 1,
  avatar: "/image.jpg",
  type: typeList[Math.floor(Math.random() * typeList.length)],
  status: statusList[Math.floor(Math.random() * typeList.length)],
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
  const [activeTab, setActiveTab] = useState(0);

  const tabs: TabItem[] = [
    {
      label: "Tổng quan",
      value: "overview",
      content: <div>Nội dung tổng quan</div>,
    },
    {
      label: "Chi tiết",
      value: "details",
      content: <div>Nội dung chi tiết</div>,
    },
    {
      label: "Lịch sử",
      value: "history",
      content: <div>Lịch sử thay đổi</div>,
    },
  ];
  const [selectedValues, setSelectedValues] = useState<DropdownOption[]>([]); // ✅ default là mảng rỗng

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
    return <DataTable rows={data} columns={columns} />;
  }, [data, columns]);

  return (
    <>
      <Box sx={{ width: "100%", p: 2 }}>
        <SearchLayout
          title="Thông tin chuyến bay"
          description="Chọn tab để xem nội dung tương ứng"
          tabs={tabs}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />
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
                key={size}
                onClick={() =>
                  setPaginationModel((prev) => ({ ...prev, pageSize: size }))
                }
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

      {/* Dropdown Section */}
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
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            p: 3,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 24,
            width: 350,
            maxWidth: "90%",
            mx: "auto",
            mt: "20vh",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Vai trò được chọn
          </Typography>
          <Typography mt={1} color="text.secondary">
            {modalType?.label} - {modalType?.description}
          </Typography>
          <Box textAlign="right" mt={2}>
            <Button
              onClick={() => setModalOpen(false)}
              variant="outlined"
              size="small"
            >
              Đóng
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

// import { Box, Typography, Button } from "@mui/material";
// import Arrow from "./../../svgs/celery-svg.svg"; // path theo dự án bạn
// import { useNavigate } from "react-router-dom";
// import type { GridRowDef } from "../DataGrid";
// import { useMemo, useState } from "react";
// import type { GridColDef } from "@mui/x-data-grid";
// const generateRandomCheckTime = (): string => {
//   const hours = Math.floor(Math.random() * 24) + 1;
//   return `${hours}시간 전`;
// };

// // Hàm sinh trạng thái giả
// const generateRandomStatus = (): string => {
//   const statuses = ["점검완료", "점검필요"];
//   return statuses[Math.floor(Math.random() * statuses.length)];
// };

// // Dữ liệu giả
// const DUMMY_ROWS: GridRowDef[] = Array.from({ length: 20 }, (_, index) => ({
//   id: (index + 1).toString(),
//   checkTime: generateRandomCheckTime(),
//   itemScope: "RAG",
//   situation: `데이터 오염 점검 : ${index + 1}`,
//   status: "자동",
//   reviewStatus: "기본 항목",
//   value: generateRandomStatus(),
//   inspectorId: "ID_HONG",
// }));

// const DataGridWithSelectModal = () => {
//   const navigate = useNavigate();
//   const [link, setLink] = useState<string[]>([]);
//   const [isComplete, setIsComplete] = useState(true);

//   // Hàm xử lý sắp xếp và phân trang
//   // const {
//   //   sortedData,
//   //   sortModel,
//   //   onSortModelChange,
//   //   currentPage,
//   //   paginatedData,
//   //   totalPages,
//   //   totalElements,
//   //   pageSize,
//   //   onPageChange,
//   // } = useSorting({
//   //   data: DUMMY_ROWS,
//   // });

//   const inspectionData = {
//     TITLE: "25.6.13 오전 1:30 - 데이터, 모델, AI 서비스 범위 점검 정보",
//     status: "미완료",
//     time: "25.6.13 오전 1:30",
//     inspector: "ID_HONG",
//     dataStatus: ["데이터  19/30", "데이터 1/30", "데이터: 0/30"],
//     completeTime: "25.6.13 오전 2:30",
//     text: "데이터 오염 점검의 의미: ... 데이터 오염 점검 오류시 아래와 같은 문제가 발생할 수 있습니다.",
//     content: "데이터 오염 점검의 의미 ....",
//     checkTime: "자동 배정",
//     itemStatusLeft: "모델 20/30, AI 서비스 10/10, 모델 20/30",
//     itemStatusRight: "AI RED 10/15, 총 자동 점검 60/60, 기타 10/15",
//     detail1: ["해당 파일 확인하기", "점검하기", "문제 해결하기"],
//     detail2: [],
//   };

//   // Các cột của bảng
//   const columns: GridColDef[] = useMemo(
//     () => [
//       { field: "id", headerName: "데이터 이름", flex: 1 },
//       { field: "itemScope", headerName: "데이터 형택", flex: 1 },
//       { field: "situation", headerName: "데이터 정보", flex: 1 },
//       { field: "reviewStatus", headerName: "상태", flex: 1 },
//       { field: "inspectorId", headerName: "검토자", flex: 1 },
//       {
//         field: "value",
//         headerName: "검토 결과",
//         flex: 1,
//         renderCell: ({ value }) => {
//           const StatusChip = ({ status }: { status: string }) => {
//             const colorMap: Record<string, string> = {
//               점검완료: "#567B7A",
//               점검필요: "#B46674",
//             };

//             if (colorMap[status]?.length === 0 || status === "점검필요") {
//               setIsComplete(false);
//             }

//             return (
//               <Typography
//                 variant="body1"
//                 sx={{ color: colorMap[status] || "black" }}
//               >
//                 {status}
//               </Typography>
//             );
//           };

//           return <StatusChip status={value} />;
//         },
//       },
//     ],
//     []
//   );

//   return (
//     <Box>
//       {/* Header */}
//       <Box sx={{ padding: "8px", border: `1px solid black` }}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Box sx={{ display: "flex", padding: "3px", alignItems: "center" }}>
//             <Box
//               component="img"
//               src={Arrow}
//               alt="Arrow Icon"
//               onClick={() => navigate(-1)}
//               sx={{
//                 width: "24px",
//                 height: "24px",
//                 transform: "rotate(270deg)",
//                 transition: "transform 0.3s ease",
//               }}
//             />
//             <Typography variant="body1" sx={{ ml: 1 }}>
//               {inspectionData.TITLE}
//             </Typography>
//           </Box>

//           <Button disabled={isComplete} variant="contained">
//             <Typography variant="button">최종 점검 완료</Typography>
//           </Button>
//         </Box>
//       </Box>

//       {/* Details */}
//       <Box
//         border="1px solid #E0E0E0"
//         sx={{ backgroundColor: "white", borderRadius: "2px", mb: "8px" }}
//       >
//         <Typography variant="body1" padding="12px">
//           Details
//         </Typography>
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           padding="14px 16px"
//           borderTop={1}
//           borderColor="#E0E0E0"
//         >
//           <Box sx={{ flex: 1, display: "flex", gap: 2 }}>
//             <Box
//               sx={{ display: "flex", flexDirection: "column", paddingRight: 2 }}
//             >
//               <Typography variant="body1" color="error" sx={{ mb: 0.5 }}>
//                 검사 상태
//               </Typography>
//               <Typography variant="body1">{inspectionData.status}</Typography>
//             </Box>

//             <Box
//               sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
//             >
//               <Typography variant="body1" color="error" sx={{ mb: 0.5 }}>
//                 시작 시간
//               </Typography>
//               <Typography variant="body1">{inspectionData.time}</Typography>
//             </Box>
//           </Box>
//         </Box>

//         {/* Content */}
//         <Box display="flex" width="100%" paddingRight="24px">
//           <Box sx={{ width: "1px", backgroundColor: "gray", mx: 2 }} />
//           <Box
//             sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
//           >
//             <Typography variant="body1" color="error" sx={{ mb: 0.5 }}>
//               최종 점검 내용
//             </Typography>
//             <Typography
//               variant="body1"
//               sx={{
//                 wordBreak: "break-word",
//                 overflowWrap: "break-word",
//                 maxWidth: "100%",
//               }}
//             >
//               {inspectionData.content}
//             </Typography>
//           </Box>
//         </Box>

//         {/* 항목 구분 */}
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           padding="14px 16px"
//           borderTop={1}
//           borderColor="#E0E0E0"
//           paddingRight="24px"
//         >
//           <Box sx={{ width: "1px", backgroundColor: "gray", mx: 2 }} />
//           <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//             <Typography variant="body1" color="error" sx={{ mb: 0.5 }}>
//               항목 구분
//             </Typography>
//             {inspectionData.dataStatus.map((item: string, idx: number) => (
//               <Typography key={idx} variant="body1">
//                 {item}
//               </Typography>
//             ))}
//           </Box>
//         </Box>

//         {/* 항목 상세 설명 */}
//         <Box display="flex" width="100%" paddingRight="24px">
//           <Box sx={{ width: "1px", backgroundColor: "gray", mx: 2 }} />
//           <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//             <Typography variant="body1" color="error" sx={{ mb: 0.5 }}>
//               항목 상세 설명
//             </Typography>
//             <Typography variant="body1">데이터 오류 점검의 의미</Typography>
//             <Typography variant="body1">
//               데이터 오류 점검 오류시 아래와 같은 문제가 발생할 수 있습니다.
//             </Typography>
//             {inspectionData.detail1.map((item: string, idx: number) => (
//               <Box key={idx} sx={{ mb: 0.2 }}>
//                 <Typography variant="body2">
//                   {idx + 1}. {item.length > 0 ? item : "N/A"}
//                 </Typography>
//               </Box>
//             ))}
//           </Box>
//         </Box>

//         {/* 다음 가이드 */}
//         <Box display="flex" width="100%" paddingRight="24px">
//           <Box sx={{ width: "1px", backgroundColor: "wheat", mx: 2 }} />
//           <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//             <Typography variant="body1" color="black" sx={{ mb: 0.5 }}>
//               다음 가이드를 참고하세요.
//             </Typography>
//             {inspectionData.dataStatus.map((item: string, idx: number) => (
//               <Typography key={idx} variant="body1">
//                 {item}
//               </Typography>
//             ))}
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default DataGridWithSelectModal;
