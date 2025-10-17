import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import type { GridRowDef } from "../../DataGrid";
import { UserRole, type UserData } from "../../../utils/type";
import { useAuth } from "../../../context/AuthContext";
import theme from "../../../scss/theme";
import { useGetUserList } from "../../../components/Api/useGetApi";
import { DateFormatEnum, formatDate } from "../../../hooks/format";
import SelectDropdown from "../../Dropdown/SelectDropdown";
import { Box, Typography } from "@mui/material";

type IInspectionPerformanceHistoryItem = GridRowDef;

export const useInspectionPerformanceHistory = () => {
  const dataTableViewRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const { fetchUserList, refetchUser } = useGetUserList();
  const [openCheckNow, setOpenCheckNow] = useState(false);
  const [selectedRow, setSelectedRow] = useState<UserData | null>(null);
  const [selectedItemDetailRow, setSelectedItemDetailRow] =
    useState<IInspectionPerformanceHistoryItem | null>(null);

  const { user, isAuthenticated } = useAuth();
  const rows = fetchUserList?.list ?? [];

  type ActionType =
    | "addUser"
    | "editUser"
    | "deleteMfaSettings"
    | "lock_unlockAccount"
    | "resetPassword"
    | "relationData"
    | "permissionChangeRole"
    | "transferAdminPermission"
    | "deleteUser";

  const [openModal, setOpenModal] = useState<{ [key in ActionType]: boolean }>({
    addUser: false,
    editUser: false,
    deleteMfaSettings: false,
    lock_unlockAccount: false,
    resetPassword: false,
    relationData: false,
    transferAdminPermission: false,
    permissionChangeRole: false,
    deleteUser: false,
  });

  const toggleOpenModal = useCallback((action: ActionType) => {
    setOpenModal((prev) => ({
      ...prev,
      [action]: !prev[action],
    }));
  }, []);

  const closeModal = useCallback((action: ActionType) => {
    setOpenModal((prev) => ({
      ...prev,
      [action]: false,
    }));
  }, []);

  const handleSelectAction = useCallback(
    (row: UserData, action: ActionType) => {
      setSelectedRow(row);
      toggleOpenModal(action);
    },
    [toggleOpenModal]
  );

  const DropdownCell = memo(
    ({
      row,
      currentUserId,
    }: {
      row: UserData;
      currentUserId?: number;
      isAuthenticated: boolean;
    }) => {
      if (!isAuthenticated) return null;
      if (!currentUserId) return null;
      if (row.id === currentUserId) return null;
      return (
        <SelectDropdown
          defaultValue="Options"
          value="Options"
          onChange={(value) => handleSelectAction(row, value as ActionType)}
          options={[
            { label: "Edit", value: "editUser" },
            { label: "Delete MFA Settings", value: "deleteMfaSettings" },
            { label: "Lock/Unlock", value: "lock_unlockAccount" },
            { label: "Reset Password", value: "resetPassword" },
            {
              label: "Transfer Admin Permission",
              value: "transferAdminPermission",
            },
            {
              label: "Permission Change Role",
              value: "permissionChangeRole",
              color: theme.palette.warning.dark,
            },
            {
              label: "Relation Data",
              value: "relationData",
              color: theme.palette.info.dark,
            },
            {
              label: "Delete User",
              value: "deleteUser",
              color: theme.palette.error.main,
            },
          ]}
        />
      );
    }
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "email",
        flex: 1,
        headerName: "email",
      },
      {
        field: "role",
        flex: 1,
        headerName: "role",
        renderCell: (params: GridRenderCellParams) => {
          let bgColor = "";
          let textColor = "#000";

          switch (params.value) {
            case UserRole.ADMIN:
              bgColor = "#FFF36C"; // Yellow
              break;
            case UserRole.MONITOR:
              bgColor = "#E1BEE7"; // Light purple/pink
              break;
            case UserRole.USER:
              bgColor = "#D6ECE7"; // Light blue
              break;
            default:
              bgColor = "#E0E0E0"; // Grey
          }

          return (
            <Box display="flex" padding={1}>
              <Typography
                sx={{
                  display: "flex",
                  backgroundColor: bgColor,
                  padding: "4px 8px",
                  borderRadius: "3px",
                  color: textColor,
                  width: "90px",
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
      {
        field: "accountLockYn",
        headerName: "accountLockYn",
        flex: 1,
        renderCell: ({ row }) => (
          <span>{row.accountLockYn === "Y" ? "Locked" : "Unlocked"}</span>
        ),
      },
      {
        field: "employeeNo",
        headerName: "employeeNo",
        flex: 1,
      },
      {
        field: "createdAt",
        headerName: "createdAt",
        flex: 1,
        renderCell: ({ row }) =>
          formatDate(DateFormatEnum.MM_DD_YYYY, row.createdAt),
      },
      {
        field: "name",
        headerName: "name",
        flex: 1,
      },
      {
        field: "actions",
        headerName: "actions",
        flex: 1,
        renderCell: ({ row }) => (
          <DropdownCell
            row={row}
            currentUserId={user?.id}
            isAuthenticated={isAuthenticated}
          />
        ),
      },
    ],
    [handleSelectAction, user]
  );

  const handleSearch = useCallback(() => {}, []);

  const handleRowClick = useCallback((row: UserData) => {
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

  const handleRefetchUserList = useCallback(() => {
    refetchUser();
  }, [refetchUser]);

  return {
    dataTableViewRef,
    headerHeight,
    loading: false,
    selectedRow,
    setSelectedRow,
    selectedItemDetailRow,
    setSelectedItemDetailRow,
    rows,
    openModal,
    toggleOpenModal,
    handleSelectAction,
    handleRefetchUserList,
    columns,
    closeModal,
    onRowClick: handleRowClick,
    onSearch: handleSearch,
    openCheckNow,
    toggleOpenCheckNow: () => setOpenCheckNow((prev) => !prev),
  } as const;
};
