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
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowDef[]>([]); // State để lưu selected IDs
  const [selectedRowChange, setSelectedRowCHange] = useState<GridRowDef[]>([]); // State để lưu selected IDs

  const handleMealRowSelection = (selectedIds: any[]) => {
    setSelectedRowCHange(() => {
      const newSelectedRows = selectedRowIds.filter((row) =>
        selectedIds.includes(row.id)
      );
      return newSelectedRows;
    });
  };

  const [isValidate, setIsValidate] = useState(false);

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

  if (selectedRowIds.length > 0) {
    const selectedEmails = selectedRowIds
      .map((row) => row.email)
      .filter(Boolean); // lọc email hợp lệ
    return <SendEmailToUsers selectedUser={selectedEmails} />;
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

      {selectedRow?.length}

      <TableSection
        setRows={setSelectedRowIds}
        isLoading={loading}
        nextRowClick
        onSelectedRowIdsChange={handleMealRowSelection}
        rows={rows}
        columns={columns}
      />
      {selectedRowIds.length > 0 && (
        <Button variant="contained">Send Message</Button>
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
