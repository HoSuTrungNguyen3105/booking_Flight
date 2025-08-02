import { Box, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useClientPagination from "../../../context/use[custom]/useClientPagination";
import type { GridColDef } from "@mui/x-data-grid";
import type { GridRowDef } from "../../DataGrid";

const dummyRows = Array.from({ length: 20 }, (_, index) => {
  const id = index + 1;
  const today = new Date();
  const inspectionDate = new Date(today);
  inspectionDate.setDate(today.getDate() - index);

  // Random status selection
  const statusOptions = ["INPROGRESS", "COMPLETED", "INCOMPLETE"];
  const inspectionStatus =
    statusOptions[Math.floor(Math.random() * statusOptions.length)];

  // Random review status
  const reviewCount = Math.floor(Math.random() * 5);
  const reviewStatus = reviewCount > 0 ? `${reviewCount}건` : "없음";

  // Random scope
  const scopeOptions = [
    "전체",
    "네트워크",
    "서버",
    "애플리케이션",
    "데이터베이스",
  ];
  const itemScope =
    scopeOptions[Math.floor(Math.random() * scopeOptions.length)];

  // Random situation
  const situationOptions = ["수동", "배치"];
  const inspectionStartType =
    situationOptions[Math.floor(Math.random() * situationOptions.length)];

  // Random inspector
  const inspectors = ["김점검", "이검사", "박확인", "최감독", "정관리"];
  const lastInspector =
    inspectors[Math.floor(Math.random() * inspectors.length)];

  return {
    id,
    inspectionTime: inspectionDate.toLocaleString("ko-KR"),
    itemScope,
    inspectionStartType,
    reviewStatus,
    inspectionStatus,
    lastInspector,
  };
});

const statusColorMapper = {
  INPROGRESS: "#FFF7DB",
  COMPLETED: "#DEEFFE",
  INCOMPLETE: "#F4E7EB",
};

const statusTextMapper = {
  INPROGRESS: "진행중",
  COMPLETED: "완료",
  INCOMPLETE: "미완료",
};
type IInspectionPerformanceHistoryItem = GridRowDef;

export const useInspectionPerformanceHistory = () => {
  const dataTableViewRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const [rows, setRows] = useState(dummyRows);
  const [openCheckNow, setOpenCheckNow] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<IInspectionPerformanceHistoryItem | null>(null);
  const [selectedItemDetailRow, setSelectedItemDetailRow] =
    useState<IInspectionPerformanceHistoryItem | null>(null);

  // TODO: Replace with useServerPagination
  const {
    currentPage,
    sortModel,
    totalPages,
    totalElements,
    paginatedData,
    pageSize,
    onSortModelChange,
    onPageChange,
    onPageSizeChange,
  } = useClientPagination({
    data: rows,
    initialSortField: "inspectionTime",
    initialSortDirection: "asc",
  });

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "inspectionTime",
        headerName: "점검 시간",
        flex: 1,
      },
      {
        field: "itemScope",
        headerName: "항목 범위",
        flex: 1,
      },
      {
        field: "inspectionStartType",
        headerName: "점검 시작",
        flex: 1,
      },
      {
        field: "reviewStatus",
        headerName: "검토 필요 항목",
        flex: 1,
        // renderCell: ({ row }) => (
        //   <Box bgcolor={statusColorMapper[row.inspectionStatus]}>
        //     {statusTextMapper[row.inspectionStatus]}
        //   </Box>
        // ),
      },
      {
        field: "inspectionStatus",
        headerName: "상태",
        flex: 1,
        // renderCell: ({ row }) => (
        //   <Box bgcolor={statusColorMapper[row.status]}>
        //     {statusTextMapper[row.status] ?? ''}
        //   </Box>
        // ),
      },
      {
        field: "lastInspector",
        headerName: "최종 점검자",
        flex: 1,
      },
    ],
    []
  );

  const handleSearch = useCallback(() => {}, []);

  const handleRowClick = useCallback(
    (row: IInspectionPerformanceHistoryItem) => {
      setSelectedRow(row);
    },
    []
  );

  useEffect(() => {
    if (!dataTableViewRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height =
          entry.contentRect.top ||
          entry.target.getBoundingClientRect().top ||
          0;
        const heightWidthPadding = 16;
        setHeaderHeight(height + heightWidthPadding);
      }
    });

    resizeObserver.observe(dataTableViewRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {}, []);

  return {
    dataTableViewRef,
    headerHeight,
    loading: false,
    totalCount: totalElements,
    totalPages: totalPages,
    selectedRow,
    setSelectedRow,
    selectedItemDetailRow,
    setSelectedItemDetailRow,
    rows: paginatedData,
    columns,
    pageInfo: {
      page: currentPage,
      size: pageSize,
    },
    sortModel,
    onSortModelChange,
    onPageChange,
    onPageSizeChange,
    onRowClick: handleRowClick,
    onSearch: handleSearch,
    openCheckNow,
    toggleOpenCheckNow: () => setOpenCheckNow((prev) => !prev),
  } as const;
};
