import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { GridRowDef } from "../DataGrid";
import { Box, Typography } from "@mui/material";
import TableSection from "./TableSection";
import type { GridColDef } from "@mui/x-data-grid";
import AddUserModal from "./hooks/AddUserModal";
import theme from "../../scss/theme";
import { useFindPassengerById } from "../../components/Api/usePostApi";
import type { Passenger } from "../../utils/type";
import DetailSection, { type IDetailItem } from "../DetailSection";
import { DateFormatEnum, formatDateKR } from "../../hooks/format";

type DataSecureProps = {
  passenger: string;
};
const DataSecure = ({ passenger }: DataSecureProps) => {
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Passenger | null>(null); // có thể replace `any` bằng Passenger type
  const [openUserModal, setOpenUserModal] = useState(false);

  const { dataPassengerById, refetchPassengerById } = useFindPassengerById();
  useEffect(() => {
    const fetchPassenger = async () => {
      try {
        setLoading(true);
        const res = await refetchPassengerById({ id: passenger });
        if (res?.resultCode === "00") {
          setData(res.data as Passenger); // lưu dữ liệu vào state
        } else {
          console.error(res?.resultMessage);
        }
      } catch (err) {
        console.error("Fetch passenger error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (passenger) {
      fetchPassenger();
    }
  }, [passenger, refetchPassengerById]);

  const [subfileList, setSubfileList] = useState<GridRowDef[]>([]);
  const [dataHistory, setDataHistory] = useState<GridRowDef[]>([]);
  const [relatedItems, setRelatedItems] = useState<GridRowDef[]>([]);
  const openModal = (row: GridRowDef) => {
    // setSelectedRow(row as IDataHistoryProps);
    setOpen(true);
  };

  const openModalSubfile = (row: GridRowDef) => {
    // setSelectedRow(row as IDataHistoryProps);
    setOpenUserModal(true);
  };

  const closeModalSubfile = () => {
    setOpenUserModal(false);
  };

  const randomFileNames = [
    "report1.csv",
    "data_final.json",
    "graph.png",
    "summary.docx",
    "export.xlsx",
    "image01.jpg",
  ];
  type InputFieldValue = { id: number; value: string };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showInputs, setShowInputs] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setShowInputs(true); // Hiện các InputField
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  function getRandomFiles(count: number) {
    const shuffled = [...randomFileNames].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const columnBookingList: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Booking ID",
        flex: 1,
      },
      {
        field: "bookingTime",
        headerName: "Booking Time",
        flex: 1,
        renderCell: ({ value }) => (
          <Typography variant="body2">
            {formatDateKR(DateFormatEnum.MMMM_D_YYYY, value)}
          </Typography>
        ),
      },
      {
        field: "flightNo",
        headerName: "Flight No",
        flex: 1,
        // valueGetter: (params) => params.row.flight?.flightNo || "-",
      },
      {
        field: "flightType",
        headerName: "Flight Type",
        flex: 1,
        // valueGetter: (params) => params.row.flight?.flightType || "-",
      },
      {
        field: "departureAirport",
        headerName: "Departure",
        flex: 1,
        // valueGetter: (params) => params.row.flight?.departureAirport || "-",
      },
      {
        field: "arrivalAirport",
        headerName: "Arrival",
        flex: 1,
        // valueGetter: (params) => params.row.flight?.arrivalAirport || "-",
      },
      {
        field: "mealCount",
        headerName: "Meal Orders",
        flex: 1,
        // valueGetter: (params) => params.row.mealOrders?.length || 0,
      },
    ],
    []
  );
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

  // Mock data generation
  // const rowsSubfileList = useMemo(
  //   () =>
  //     Array.from({ length: 100 }, (_, i) => ({
  //       id: i + 1,
  //       fileName: i % 2 === 0 ? "FigmaSetup.zip" : "FigmaSetup.json",
  //       fileSize: `${2 + (i % 4)}MB`,
  //       uploadTime: `25.6.13 ${Math.floor(i / 2) + 1}:${
  //         i % 2 === 0 ? "30" : "55"
  //       }`,
  //       uploader: "픽셀 문서",
  //       type: `/directoryJ/directory${i % 3}`,
  //       name: getRandomFiles(2 + (i % 3)), // 2-4 file random
  //     })),
  //   []
  // );
  const rowData = useMemo(
    () =>
      dataPassengerById?.data?.bookings.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [dataPassengerById]
  );
  const detailData: IDetailItem[] = [
    {
      title: "Họ và tên",
      description: data?.fullName || "None",
    },
    {
      title: "Email",
      description: data?.email || "None",
    },
    {
      title: "Số điện thoại",
      description: data?.phone || "None",
    },
    {
      title: "Passport",
      description: data?.passport || "None",
    },
    {
      title: "Lần đăng nhập cuối",
      description: data?.lastLoginDate
        ? formatDateKR(DateFormatEnum.MMMM_D_YYYY, data.lastLoginDate)
        : "None",
    },
    {
      title: "Tài khoản khóa",
      description: data?.accountLockYn === "Y" ? "Đã khóa" : "Hoạt động",
    },
    {
      title: "Email xác thực",
      description:
        data?.isEmailVerified === "Y" ? "Đã xác thực" : "Chưa xác thực",
    },
  ];

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

  const renderDataSection = useCallback(
    (
      name: string,
      columns: GridColDef[],
      rows: GridRowDef[],
      isLoading: boolean,
      handleRowClick?: (row: GridRowDef) => void
    ) => {
      return (
        <Box borderTop={1} borderColor={theme.palette.grey[200]}>
          <Box
            bgcolor="white"
            px="16px"
            py="12px"
            border={1}
            borderTop={0}
            borderBottom={0}
          >
            <Typography variant="subtitle1" sx={{ gap: "10px" }}>
              {name}
            </Typography>
          </Box>
          <Box sx={{ padding: "8px" }}>
            <TableSection
              setRows={setDataHistory}
              rows={rows}
              columns={columns}
              isLoading={isLoading}
              handleRowClick={handleRowClick}
            />
          </Box>
        </Box>
      );
    },
    []
  );

  return (
    <Box minHeight={"50vh"}>
      <Box overflow={"auto"} minHeight={"50vh"}>
        <DetailSection data={detailData} />
        <Box borderTop={1} paddingTop={2} borderColor={"grey.200"}>
          {JSON.stringify(rowData)}
          {renderDataSection(
            "하위 파일 목록",
            columnBookingList,
            rowData,
            isLoading
          )}
          {renderDataSection(
            "데이터 이력",
            columnDataHistory,
            rowsDataHistory,
            isLoading,
            openModalSubfile
          )}
          {renderDataSection(
            "연관 점검 항목",
            columnCheckItem,
            rowsCheckItems,
            isLoading,
            openModal
          )}
          {/* {open && (
            <DetailedInformationModal
              open={open}
              onSuccess={() => {}}
              onClose={closeModalSubfile}
              selectedRows={selectedRow}
              // files={numberOfFile}
              detailData={inspectionData}
            />
          )} */}
          <AddUserModal
            onSuccess={() => {}}
            onClose={closeModalSubfile}
            open={openUserModal}
          />
        </Box>
      </Box>
    </Box>
  );
};
export default DataSecure;
