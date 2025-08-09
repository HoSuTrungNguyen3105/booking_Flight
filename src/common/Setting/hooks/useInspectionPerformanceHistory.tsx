import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import useClientPagination from "../../../context/use[custom]/useClientPagination";
import type { GridColDef } from "@mui/x-data-grid";
import type { GridRowDef } from "../../DataGrid";
import { UserRole, type UserData } from "../../../utils/type";
import CSelect from "../../Dropdown/CSelect";
import { useAuth } from "../../../context/AuthContext";
import theme from "../../../scss/theme";
import { useGetUserList } from "../../../components/Api/useGetApi";

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
  const { fetchUser, loadingUser, refetchUser } = useGetUserList();

  // const [rows, setRows] = useState(dummyRows);
  const [openCheckNow, setOpenCheckNow] = useState(false);
  const [selectedRow, setSelectedRow] = useState<UserData | null>(null);
  const [selectedItemDetailRow, setSelectedItemDetailRow] =
    useState<IInspectionPerformanceHistoryItem | null>(null);

  const { user } = useAuth();

  const rows = fetchUser?.list ?? [];

  // const rows = [
  //   {
  //     id: 1,
  //     userId: "nguyen123",
  //     userAlias: "Anh Nguyên",
  //     userRole: UserRole.ADMIN,
  //     createDate: "2024-09-01T10:15:00Z",
  //     lastLoginDate: "2024-09-24T08:00:00Z",
  //     situation: "활성화됨", // Active
  //   },
  //   {
  //     id: 2,
  //     userId: user?.id,
  //     userAlias: user?.name,
  //     userRole: user?.role,
  //     createDate: "2024-08-20T09:00:00Z",
  //     lastLoginDate: "2024-09-23T16:30:00Z",
  //     situation: "비활성화됨", // Inactive
  //   },
  //   {
  //     id: 3,
  //     userId: "test01",
  //     userAlias: "",
  //     userRole: UserRole.MEMBER,
  //     createDate: "2024-07-10T12:00:00Z",
  //     lastLoginDate: "2024-08-01T14:45:00Z",
  //     situation: "잠김", // Locked
  //   },
  // ];

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

  // const columns: GridColDef[] = useMemo(
  //   () => [
  //     {
  //       field: "inspectionTime",
  //       headerName: "점검 시간",
  //       flex: 1,
  //     },
  //     {
  //       field: "itemScope",
  //       headerName: "항목 범위",
  //       flex: 1,
  //     },
  //     {
  //       field: "inspectionStartType",
  //       headerName: "점검 시작",
  //       flex: 1,
  //     },
  //     {
  //       field: "reviewStatus",
  //       headerName: "검토 필요 항목",
  //       flex: 1,
  //       // renderCell: ({ row }) => (
  //       //   <Box bgcolor={statusColorMapper[row.inspectionStatus]}>
  //       //     {statusTextMapper[row.inspectionStatus]}
  //       //   </Box>
  //       // ),
  //     },
  //     {
  //       field: "inspectionStatus",
  //       headerName: "상태",
  //       flex: 1,
  //       // renderCell: ({ row }) => (
  //       //   <Box bgcolor={statusColorMapper[row.status]}>
  //       //     {statusTextMapper[row.status] ?? ''}
  //       //   </Box>
  //       // ),
  //     },
  //     {
  //       field: "lastInspector",
  //       headerName: "최종 점검자",
  //       flex: 1,
  //     },
  //   ],
  //   []
  // );
  type ActionType =
    | "addUser"
    | "editUser"
    | "deleteMfaSettings"
    | "lock_unlockAccount"
    | "resetPassword"
    | "transferAdminPermission"
    | "deleteUser";

  const [openModal, setOpenModal] = useState<{ [key in ActionType]: boolean }>({
    addUser: false,
    editUser: false,
    deleteMfaSettings: false,
    lock_unlockAccount: false,
    resetPassword: false,
    transferAdminPermission: false,
    deleteUser: false,
  });
  // const [seletedRow, setSelectedRowUser] = useState<UserData>();
  const toggleOpenModal = useCallback((action: ActionType) => {
    setOpenModal((prev) => ({
      ...prev,
      [action]: !prev[action],
    }));
  }, []);

  const handleSelectAction = useCallback(
    (row: UserData, action: ActionType) => {
      setSelectedRow(row);
      toggleOpenModal(action);
    },
    [toggleOpenModal]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "email",
        flex: 1,
        headerName: "아이디",
        // renderCell: ({ row }) => (
        //   <span>
        //     {row.userAlias ? `${row.userId}(${row.userAlias})` : row.userId}
        //   </span>
        // ),
      },
      {
        field: "role",
        flex: 1,
        headerName: "권한",
        renderCell: ({ row }) => (
          <span>{row.role === UserRole.ADMIN ? "관리자" : "멤버"}</span>
        ),
      },
      {
        field: "rank",
        headerName: "생성시간",
        flex: 1,
        renderCell: ({ row }) => <span>{row.rank ? "Member" : "-"}</span>,
      },
      {
        field: "mfaEnabledYn",
        headerName: "로그인",
        flex: 1,
        // renderCell: ({ row }) => (
        //   <span>{getOffsetDateTimeFromNow(row.lastLoginDate, "-")}</span>
        // ),
      },
      {
        field: "createdAt",
        headerName: "상태",
        flex: 1,
      },
      {
        field: "name",
        headerName: "상태",
        flex: 1,
      },
      {
        field: "actions",
        headerName: "설정",
        flex: 1,
        sortable: false,
        renderCell: ({ row }) =>
          row.id !== user?.id && (
            <CSelect
              key={row.id}
              defaultValue="관리"
              value="관리"
              onChange={(value) => handleSelectAction(row, value as ActionType)}
              sx={{
                width: "20px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
              options={[
                { label: "정보 수정", value: "addUser" },
                { label: "MFA 설정 삭제", value: "editUser" },
                { label: "잠금/해금", value: "lock_unlockAccount" },
                { label: "비밀번호 초기화", value: "resetPassword" },
                { label: "관리자 권한 이전", value: "transferAdminPermission" },
                {
                  label: "삭제",
                  value: "deleteUser",
                  color: theme.palette.error.main,
                },
              ]}
            />
          ),
      },
    ],
    [user, handleSelectAction]
  );

  const handleSearch = useCallback(() => {}, []);

  const handleRowClick = useCallback((row: GridRowDef & UserData) => {
    setSelectedRow(row);
  }, []);

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
    openModal,
    toggleOpenModal,
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
