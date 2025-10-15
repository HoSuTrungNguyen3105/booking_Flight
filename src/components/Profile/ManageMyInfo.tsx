import { useInspectionPerformanceHistory } from "../../common/Setting/hooks/useInspectionPerformanceHistory";
import { Box, Button, Typography } from "@mui/material";
import { type GridRowDef } from "../../common/DataGrid/index";
import AddUserModal from "../../common/Setting/Component/AddUserModal";
import { Loading } from "../../common/Loading/Loading";
import UpdateUserModal from "../../common/Setting/Component/UpdateUserModal";
import AccountLock from "../../common/Setting/Component/AccountLockModal";
import { memo, useCallback, useState } from "react";
import AdminUpdateUserModal from "../../common/Setting/Component/AdminUpdateUserModal";
import UpdateUserForm from "../../common/Setting/Component/UpdateUserForm";
import type { AdminUpdateUserForm } from "../../utils/type";
import SendEmailToUsers from "../Auth/SendEmailToUsers";
import TableSection from "../../common/CustomRender/TableSection";
import type { GridRowId } from "@mui/x-data-grid";
import BatchUpdateEmployeeNo from "../User/Security/BatchUpdateEmployeeNo";
import type { BatchEmployeeNoReq } from "../Api/usePostApi";
import ConfirmDeleteModal from "../Common/ConfirmDeleteModal";
import DeleteUserModal from "../../common/Setting/Component/DeleteUserModal";
import TransferAdminModal from "../../common/Setting/Component/TransferAdminModal";
import { useAuth } from "../../context/AuthContext";

const ManageMyInfo = () => {
  const { user } = useAuth();
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
  const [selectedUpdateItem, setSelectedUpdateItem] = useState<
    BatchEmployeeNoReq[]
  >([]);
  const [navigateUpdateEmployeeID, setNavigateUpdateEmployeeID] =
    useState<boolean>(false);

  const handleMealRowSelection = (selectedIds: GridRowId[]) => {
    setSelectedRowIds(selectedIds);

    const newSelectedRows = rows.filter((row) => selectedIds.includes(row.id));
    setSelectedRowChange(newSelectedRows);
  };

  const handleNavigateEmailSend = useCallback(() => {
    setNavigateEmailSend(true);
  }, [setNavigateEmailSend]);
  const [isValidate, setIsValidate] = useState(false);

  const handleNavigateSelectedUpdateItem = useCallback(() => {
    const updates: BatchEmployeeNoReq[] = selectedRowChange.map((row) => ({
      userId: Number(row.id as number),
      employeeNo: String(row.employeeNo),
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
    return (
      <BatchUpdateEmployeeNo
        onSuccess={() => {
          setNavigateUpdateEmployeeID(false);
          handleRefetchUserList();
        }}
        updateItem={selectedUpdateItem}
      />
    );
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
        <TransferAdminModal
          open={openModal.transferAdminPermission}
          userId={selectedRow}
          fromUserId={user?.id!}
          // onSuccess={() => {
          //   handleRefetchUserList();
          //   closeModal("transferAdminPermission");
          //   setIsValidate(true);
          // }}
          onClose={() => closeModal("transferAdminPermission")}
        />
      )}

      {/* {openModal.transferAdminPermission && selectedRow && (
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
      )} */}

      {openModal.deleteUser && selectedRow && (
        <DeleteUserModal
          open={openModal.deleteUser}
          // id={selectedRow.id}
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
