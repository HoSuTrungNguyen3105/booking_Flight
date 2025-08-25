import React, { useMemo, useState } from "react";
import type { TabItem } from "../../../components/Layout/SearchLayout";
import SearchLayout from "../../../components/Layout/SearchLayout";
import InspectionSection from "../../Dropdown/InspectionSection";
import type { GridColDef } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { DateFormatEnum, formatDateKR } from "../../../hooks/format";
import { useNavigate } from "react-router-dom";
import type { GridRowDef } from "../../DataGrid";
const columnsSubfileList: GridColDef[] = [
  { field: "fileName", headerName: "파일 이름", flex: 1 },
  { field: "type", headerName: "파일 경로", flex: 1 },
  {
    field: "createDate",
    headerName: "수정 날짜",
    flex: 1,
    renderCell: ({ value }) => (
      <Typography variant="body2">
        {formatDateKR(DateFormatEnum.MMMM_D_YYYY, value)}
      </Typography>
    ),
  },
  {
    field: "uploaderId",
    headerName: "유형",
    flex: 1,
  },
  {
    field: "fileSize",
    headerName: "Size",
    flex: 1,
    renderCell: ({ value }) => (
      <Typography variant="body2">{value || "-"}MB</Typography>
    ),
  },
];
// dữ liệu mẫu
const rowsSubfileList = [
  {
    id: 1,
    fileName: "document1.pdf",
    type: "/documents/projectA/",
    createDate: "2025-08-01",
    uploaderId: "admin01",
    fileSize: 12,
  },
  {
    id: 2,
    fileName: "image.png",
    type: "/images/uploads/",
    createDate: "2025-08-05",
    uploaderId: "user02",
    fileSize: 4.5,
  },
  {
    id: 3,
    fileName: "report.xlsx",
    type: "/reports/2025/",
    createDate: "2025-08-10",
    uploaderId: "manager03",
    fileSize: 1.2,
  },
  {
    id: 4,
    fileName: "video.mp4",
    type: "/videos/events/",
    createDate: "2025-08-12",
    uploaderId: "staff04",
    fileSize: 150,
  },
];

const SecurityManage = () => {
  const [tabX, setTab] = useState(0);
  const navigate = useNavigate();
  const onRowSelect = (rowData: GridRowDef) => {
    navigate(`/admin/data-secure`, {
      state: { data: rowData, type: tabX },
    });
  };
  const tabs: TabItem[] = [
    {
      label: "Security",
      value: "auto",
      content: (
        <InspectionSection
          onRowClick={onRowSelect}
          handleAction={() => {}}
          columns={columnsSubfileList}
          tabs={[]}
          rows={rowsSubfileList}
          loading={false}
          onSearch={() => {}}
        />
      ),
    },
    {
      label: "InspectionSection",
      value: "auto",
      // content: <InspectionSection />,
      content: (
        <InspectionSection
          onRowClick={onRowSelect}
          handleAction={() => {}}
          columns={columnsSubfileList}
          tabs={[]}
          rows={[]}
          loading={false}
          onSearch={() => {}}
        />
      ),
    },
  ];

  return (
    <div>
      <SearchLayout
        onChangeTab={setTab}
        activeTab={tabX}
        title="Layout"
        tabs={tabs}
      />
    </div>
  );
};

export default SecurityManage;

// import { GridColDef } from "@mui/x-data-grid";
// import { Typography } from "@mui/material";

// // config mô tả cột
// const columnConfigs = [
//   { field: "fileName", headerName: "파일 이름" },
//   { field: "type", headerName: "파일 경로" },
//   {
//     field: "createDate",
//     headerName: "수정 날짜",
//     renderCell: (value: any) => (
//       <Typography variant="body2">
//         {formatDateKR(DateFormatEnum.MMMM_D_YYYY, value)}
//       </Typography>
//     ),
//   },
//   { field: "uploaderId", headerName: "유형" },
//   {
//     field: "fileSize",
//     headerName: "Size",
//     renderCell: (value: any) => (
//       <Typography variant="body2">{value || "-"}MB</Typography>
//     ),
//   },
// ];

// // sinh ra mảng GridColDef bằng map
// const columnsSubfileList: GridColDef[] = columnConfigs.map((col) => ({
//   field: col.field,
//   headerName: col.headerName,
//   flex: 1,
//   ...(col.renderCell
//     ? {
//         renderCell: ({ value }) => col.renderCell(value),
//       }
//     : {}),
// }));
