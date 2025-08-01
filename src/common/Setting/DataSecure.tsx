import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import type { GridRowDef } from "../DataGrid";
import TableInfo from "../Dropdown/TableInfo";
import type { ContentBlock } from "../Dropdown/type";
import { Box, Typography } from "@mui/material";
import TableSection from "./TableSection";
import DetailedInformationModal from "./hooks/DetailedInformationModal";
import { FileUpload } from "../FileUploader";
import DetailDataSystemModal from "./hooks/DetailDataSystem";
import type { GridRowParams } from "@mui/x-data-grid";
import type { IDetailItem } from "../Dropdown/DetailSection";
import DetailSection from "../Dropdown/DetailSection";
import { Button } from "../Button/Button";
import InputField from "../Input/InputField";
import type { MenuData } from "../BreadCrumb/BreadcrumbV2";
import Breadcrumb from "../BreadCrumb/BreadcrumbV2";
import InputTextField from "../Input/InputTextField";
// import DetailDataSystemModal from "./hooks/DetailDataSystemModal";
// FIX: Update the import path or create the missing file if necessary

// Interface định nghĩa cấu trúc dữ liệu
export interface IDataHistoryProps extends GridRowDef {
  collectionMethod: string;
  dataId: string;
  database: string;
  creationUser: string;
  name?: string[];
}
export const customLabels: Record<keyof Detail, string> = {
  TITLE: "제목", // Tiêu đề
  status: "상태", // Trạng thái
  time: "시간", // Thời gian
  inspection: "검사", // Kiểm tra
  datStatus: "DAT 상태", // Tình trạng DAT
  computerTime: "컴퓨터 시간", // Giờ máy tính
  checklist: "체크리스트", // Danh sách kiểm tra
  itemsStatus: "항목 상태", // Trạng thái mục
  itemsScope: "항목 범위", // Phạm vi mục
};
export interface Detail {
  TITLE: string;
  status: string;
  time: string;
  inspection: string;
  datStatus: string;
  computerTime: string;
  checklist: string;
  itemsStatus: string;
  itemsScope: string;
}

const DataSecure = () => {
  // State management
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSubfile, setOpenSubefile] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IDataHistoryProps | null>(
    null
  );
  const [subfileList, setSubfileList] = useState<GridRowDef[]>([]);
  const [dataHistory, setDataHistory] = useState<GridRowDef[]>([]);
  const [relatedItems, setRelatedItems] = useState<GridRowDef[]>([]);
  const openModal = (row: GridRowDef) => {
    setSelectedRow(row as IDataHistoryProps);
    setOpen(true);
  };
  const openModalSubfile = (row: GridRowDef) => {
    setSelectedRow(row as IDataHistoryProps);
    setOpenSubefile(true);
  };
  const handleRowClick = (params: GridRowParams) => {
    const row = params.row as IDataHistoryProps;
    setSelectedRow(row);
    setOpenSubefile(true);
  };
  const closeModal = () => {
    setOpen(false);
  };
  const closeModalSubfile = () => {
    setOpenSubefile(false);
  };
  // Inspection data state
  const [inspectionData, setInspectionData] = useState<Detail>({
    //DataDetail
    TITLE: "25.6.13 2:21 1:30 - TITLE, AL 서비스 범위 점검 정보",
    status: "미완료",
    time: "25.6.13 2:21 1:30",
    inspection: "ID_HONG",
    datStatus: "20/30",
    computerTime: "25.6.13 2:21 2:30",
    checklist: "시뮬레이션 파일",
    itemsStatus: "10/15",
    itemsScope: "AL RED",
  });
  const randomFileNames = [
    "report1.csv",
    "data_final.json",
    "graph.png",
    "summary.docx",
    "export.xlsx",
    "image01.jpg",
  ];
  type InputFieldValue = { id: number; value: string };
  const [fieldsValue, setFieldsValue] = useState<InputFieldValue[]>([
    { id: Date.now(), value: "" },
  ]);
  const [value, setValue] = useState("");
  const handleChange = (id: number, value: string) => {
    setFieldsValue((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value } : f))
    );
  };
  const handleSubmit = () => {
    setFieldsValue((prev) => [...prev, { id: Date.now(), value: "" }]);
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showInputs, setShowInputs] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Mở hộp thoại chọn file
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setShowInputs(true); // Hiện các InputField
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };
  const renderFilesAndButton = () => {
    return (
      <Box display="flex" flexDirection="column" minHeight="20vh">
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          점검 설명
        </Typography>
        <Box display="flex" flexDirection="row" width="100%">
          {showInputs && files.length > 0 && (
            <Box display="flex" flexDirection="column" gap={1} flex={1} mr={2}>
              {files.map((item, i) => (
                <InputField key={i} value={item.name} />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    );
  };
  const renderButtonAddFile = useCallback(() => {
    return (
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        minHeight="30vh"
        pr={2}
      >
        <Button onClick={handleAddClick} label="Tải tệp" />

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.png,.pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>
    );
  }, [handleAddClick, handleFileChange]);

  const detailData: IDetailItem[] = [
    {
      title: "Demo",
      description: "None",
    },
    {
      title: "Demo",
      description: "None",
    },
    {
      title: "Demo",
      description: "None",
    },
    {
      title: "Demo",
      description: "None",
    },
    {
      title: "Demo",
      description: "None",
    },
    // {
    //   title: "Demo",
    //   description: "None",
    // },
    // {
    //   title: "Demo",
    //   description: "None",
    // },
    // {
    //   title: "Demo",
    //   description: "",
    // },

    // {
    //   title: "Demo",
    //   description: renderFilesAndButton(),
    //   size: 5,
    // },
    // {
    //   title: "Demo",
    //   description: renderButtonAddFile(),
    //   size: 1,
    // },
  ];

  function getRandomFiles(count: number) {
    const shuffled = [...randomFileNames].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Column definitions for tables
  const columnSubfileList = useMemo(
    () => [
      { field: "fileName", headerName: "파일 이름", flex: 1 },
      { field: "type", headerName: "파일 경로", flex: 1 },
      { field: "uploadTime", headerName: "수정 날짜", flex: 1 },
      { field: "uploader", headerName: "유형", flex: 1 },
      { field: "fileSize", headerName: "Size", flex: 1 },
      { field: "name", headerName: "Size", flex: 1 },
    ],
    []
  );
  const dataBread: MenuData[] = [
    { label: "Home", url: "/" },
    { label: "Message", url: "/profile" },
    { label: "Admin", url: "/profile" },
    { label: "Adv", url: "/profile" },
    { label: "Adv", url: "/profile" },
    { label: "Adv", url: "/profile" },
    { label: "Adv", url: "/profile" },
  ];
  const columnCheckItem = useMemo(
    () => [
      { field: "directoryType", headerName: "파일 이름", flex: 1 },
      { field: "checkItemName", headerName: "파일 경로", flex: 1 },
      { field: "checkItemSize", headerName: "수정 날짜", flex: 1 },
      { field: "checkItemResult", headerName: "유형", flex: 1 },
      { field: "workTemplate", headerName: "Size", flex: 1 },
    ],
    []
  );

  const columnDataHistory = useMemo(
    () => [
      { field: "collectionDate", headerName: "수집 일자", flex: 1 },
      { field: "sequence", headerName: "순서", flex: 1 },
      { field: "collectionMethod", headerName: "수집 방법", flex: 1 },
      { field: "dataId", headerName: "데이터 ID", flex: 1 },
      { field: "database", headerName: "데이터베이스", flex: 1 },
      { field: "creationUser", headerName: "생성문서사용자", flex: 1 },
    ],
    []
  );
  const numberOfFile = {
    name: ["dkdkdkdk.tsx", "dkdkdkdk.tsx", "dkdkdkdk.tsx"],
  };
  // Mock data generation
  const rowsSubfileList = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        fileName: i % 2 === 0 ? "FigmaSetup.zip" : "FigmaSetup.json",
        fileSize: `${2 + (i % 4)}MB`,
        uploadTime: `25.6.13 ${Math.floor(i / 2) + 1}:${
          i % 2 === 0 ? "30" : "55"
        }`,
        uploader: "픽셀 문서",
        type: `/directoryJ/directory${i % 3}`,
        name: getRandomFiles(2 + (i % 3)), // 2-4 file random
      })),
    []
  );

  const rowsDataHistory = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: String(i + 1),
        collectionDate: "2025-07-24",
        sequence: String(i + 1),
        collectionMethod: i % 2 === 0 ? "API 연동" : "수동 업로드",
        dataId: "DATA-001",
        database: "기상 정보",
        creationUser: "2025-07-23 / 홍길동",
      })),
    []
  );

  const rowsCheckItems = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: String(i + 1),
        directoryType: "온도 범위 설정",
        checkItemName: "오차율",
        checkItemSize: i % 2 === 0 ? "소형" : "대형",
        checkItemResult: "완료",
        workTemplate: "2027-01-24",
      })),
    []
  );
  const [valuePw, setValuePw] = useState("wdwdmwdwdmwdmwdwmdwkdk");
  return (
    <Box minHeight={"50vh"}>
      <Typography>
        <Breadcrumb data={dataBread} maxLength={3} limitWidth={120} />
      </Typography>
      <InputTextField
        type="password"
        canCopy
        value={valuePw}
        realease3phrase
        showEyeIcon
        onChange={setValuePw}
      />
      <Box overflow={"auto"} minHeight={"50vh"}>
        {/* <TableInfo title="Table" description="" content={mappedContent} /> */}
        <DetailSection data={detailData} />
        <Box borderTop={1} paddingTop={2} borderColor={"grey.200"}>
          <Box
            bgcolor={"white"}
            px={"16px"}
            py={"12px"}
            border={1}
            borderColor={"grey.200"}
          >
            <Typography>Name of Function</Typography>
          </Box>
          <TableSection
            rows={rowsCheckItems}
            columns={columnCheckItem}
            setRows={setRelatedItems}
            isLoading={false}
            nextRowClick={true}
            largeThan
          />
        </Box>
        <Box borderTop={1} borderColor={"grey.200"}>
          <Box
            bgcolor={"white"}
            px={"16px"}
            py={"12px"}
            border={1}
            borderColor={"grey.200"}
          >
            <Typography>Name of Function</Typography>
          </Box>
          <TableSection
            rows={rowsSubfileList}
            columns={columnSubfileList}
            handleRowClick={openModalSubfile}
            setRows={setSubfileList}
            isLoading={false}
            nextRowClick={true}
            largeThan
          />
        </Box>
        <Box borderTop={1} borderColor={"grey.200"}>
          <Box
            bgcolor={"white"}
            px={"16px"}
            py={"12px"}
            border={1}
            borderColor={"grey.200"}
          >
            <Typography>Name of Function</Typography>
          </Box>
          <TableSection
            rows={rowsDataHistory}
            columns={columnDataHistory}
            handleRowClick={openModal}
            setRows={setDataHistory}
            isLoading={false}
            nextRowClick={true}
            largeThan
          />
          {open && (
            <DetailedInformationModal
              onSuccess={() => {}}
              onClose={closeModal}
              selectedRows={selectedRow}
              detailData={inspectionData}
              open={open}
            />
          )}

          <DetailDataSystemModal
            onSuccess={() => {}}
            onClose={closeModalSubfile}
            selectedRows={selectedRow}
            // files={numberOfFile}
            detailData={inspectionData}
            open={openSubfile}
          />
        </Box>
      </Box>
    </Box>
    /* JSX for component */
  );
};
export default DataSecure;
