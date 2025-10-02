import { useInspectionPerformanceHistory } from "./hooks/useInspectionPerformanceHistory";
import { Box, Button, Typography } from "@mui/material";
import { type GridRowDef } from "../DataGrid/index";
import AddUserModal from "./hooks/AddUserModal";
import { Loading } from "../Loading/Loading";
import UpdateUserModal from "./hooks/UpdateUserModal";
import AccountLock from "./AccountLock";
import DeleteUserModal from "./DeleteUserModal";
import { memo, useCallback, useState } from "react";
import AdminUpdateUserModal from "./hooks/AdminUpdateUserModal";
import UpdateUserForm from "../../components/Admin/component/UpdateUserForm";
import type { AdminUpdateUserForm } from "../../utils/type";
import SendEmailToUsers from "./SendEmailToUsers";
import TableSection from "./TableSection";
import type { GridRowId } from "@mui/x-data-grid";
import BatchUpdateEmployeeNo, {
  type UpdateItem,
} from "../Sample/BatchUpdateEmployeeNo";

const ManageMyInfo = () => {
  const {
    loading,
    handleRefetchUserList,
    selectedRow,
    toggleOpenModal,
    rows,
    closeModal,
    columns,
    openModal,
  } = useInspectionPerformanceHistory();
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowId[]>([]);
  const [selectedRowChange, setSelectedRowChange] = useState<GridRowDef[]>([]);
  const [navigateEmailSend, setNavigateEmailSend] = useState<boolean>(false);
  const [selectedUpdateItem, setSelectedUpdateItem] = useState<UpdateItem[]>(
    []
  );
  const [navigateUpdateEmployeeID, setNavigateUpdateEmployeeID] =
    useState<boolean>(false);

  const handleMealRowSelection = (selectedIds: GridRowId[]) => {
    setSelectedRowIds(selectedIds);

    // Nếu anh có toàn bộ dữ liệu rows (ví dụ: data từ API)
    const newSelectedRows = rows.filter((row) => selectedIds.includes(row.id));
    setSelectedRowChange(newSelectedRows);

    console.log("selectedRowIds:", selectedIds);
    console.log("selectedRowChange:", newSelectedRows);
  };

  // const selectedEmails: string[] = selectedRowChange.map((row) => row);

  const handleNavigateEmailSend = useCallback(() => {
    setNavigateEmailSend(true);
  }, [setNavigateEmailSend]);
  const [isValidate, setIsValidate] = useState(false);

  const handleNavigateSelectedUpdateItem = useCallback(() => {
    const updates: UpdateItem[] = selectedRowChange.map((row) => ({
      userId: Number(row.id as number), // ép chắc chắn về number
      employeeNo: String(row.employeeNo ?? ""),
    }));
    setSelectedUpdateItem(updates);
    setNavigateUpdateEmployeeID(true);
  }, [selectedRowChange]);

  if (loading) {
    return <Loading />;
  }

  if (isValidate) {
    return (
      <UpdateUserForm
        data={selectedRow as AdminUpdateUserForm}
        onSuccess={() => {
          setIsValidate(false);
          handleRefetchUserList();
        }}
      />
    );
  }

  if (navigateEmailSend) {
    const selectedEmails: string[] = selectedRowChange.map((row) => row.email);
    return <SendEmailToUsers selectedUser={selectedEmails} />;
  }

  if (navigateUpdateEmployeeID) {
    return <BatchUpdateEmployeeNo updateItem={selectedUpdateItem} />;
  }

  return (
    <Box sx={{ paddingBottom: "8px" }}>
      <Box
        sx={{
          backgroundColor: "white",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: 1,
          borderColor: "grey.200",
        }}
      >
        <Typography component="p" variant="overline">
          User Management
        </Typography>
        <Button variant="contained" onClick={() => toggleOpenModal("addUser")}>
          Create User
        </Button>
      </Box>

      <TableSection
        setRows={setSelectedRowChange}
        isLoading={loading}
        nextRowClick
        largeThan
        onSelectedRowIdsChange={handleMealRowSelection}
        rows={rows}
        columns={columns}
      />

      {selectedRowIds.length > 0 && (
        <Button onClick={handleNavigateEmailSend} variant="contained">
          Send Message
        </Button>
      )}

      {selectedRowIds.length > 0 && (
        <Button onClick={handleNavigateSelectedUpdateItem} variant="contained">
          Update Employee ID
        </Button>
      )}

      {openModal.addUser && (
        <AddUserModal
          open={openModal.addUser}
          onSuccess={() => {
            handleRefetchUserList();
            closeModal("addUser");
          }}
          onClose={() => closeModal("addUser")}
        />
      )}

      {openModal.editUser && selectedRow && (
        <UpdateUserModal
          open={openModal.editUser}
          data={selectedRow}
          onSuccess={() => {
            handleRefetchUserList();
            closeModal("editUser");
          }}
          onClose={() => closeModal("editUser")}
        />
      )}

      {openModal.transferAdminPermission && selectedRow && (
        <AdminUpdateUserModal
          open={openModal.transferAdminPermission}
          data={selectedRow}
          onSuccess={() => {
            handleRefetchUserList();
            closeModal("transferAdminPermission");
            setIsValidate(true);
          }}
          onClose={() => closeModal("transferAdminPermission")}
        />
      )}

      {openModal.deleteUser && selectedRow && (
        <DeleteUserModal
          open={openModal.deleteUser}
          user={selectedRow}
          onSuccess={() => {
            handleRefetchUserList();
            closeModal("deleteUser");
          }}
          onClose={() => closeModal("deleteUser")}
        />
      )}

      {openModal.lock_unlockAccount && selectedRow && (
        <AccountLock
          open={openModal.lock_unlockAccount}
          user={selectedRow}
          onSuccess={() => {
            handleRefetchUserList();
            closeModal("lock_unlockAccount");
          }}
          onClose={() => closeModal("lock_unlockAccount")}
        />
      )}
    </Box>
  );
};

export default memo(ManageMyInfo);
