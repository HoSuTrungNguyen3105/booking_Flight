import { useInspectionPerformanceHistory } from "./hooks/useInspectionPerformanceHistory";
import { Box, Button, Typography } from "@mui/material";
import DataTable from "../DataGrid/index";
import Pagination from "../DataGrid/Pagination";
import AddUserModal from "./hooks/AddUserModal";
import { Loading } from "../Loading/Loading";
import UpdateUserModal from "./hooks/UpdateUserModal";
import AccountLock from "./AccountLock";
import DeleteUserModal from "./DeleteUserModal";
import { memo, useState } from "react";
import AdminUpdateUserModal from "./hooks/AdminUpdateUserModal";
import UpdateUserForm from "../../components/Admin/component/UpdateUserForm";
import type { AdminUpdateUserForm } from "../../utils/type";

const ManageMyInfo = () => {
  const {
    loading,
    totalPages,
    handleRefetchUserList,
    selectedRow,
    toggleOpenModal,
    rows,
    closeModal,
    columns,
    onSortModelChange,
    onPageChange,
    onPageSizeChange,
    openModal,
    totalCount,
    pageInfo,
    sortModel,
  } = useInspectionPerformanceHistory();
  const [isValidate, setIsValidate] = useState(false);

  if (loading) {
    return <Loading />;
  }

  if (isValidate) {
    return (
      <UpdateUserForm
        data={selectedRow as AdminUpdateUserForm}
        onSuccess={() => setIsValidate(false)}
      />
    );
  }

  return (
    <Box sx={{ paddingBottom: "8px" }}>
      <Box
        sx={{
          backgroundColor: "white",
          padding: "8px",
          justifyContent: "space-around",
          border: 1,
          borderColor: "grey.200",
        }}
      >
        <Typography component="p" variant="overline">
          내 정보 관리
        </Typography>
        <Typography variant="body2" color="grey.500">
          <Button onClick={() => toggleOpenModal("addUser")} />
        </Typography>
      </Box>
      <DataTable
        checkboxSelection={false}
        onSortModelChange={onSortModelChange}
        sortModel={sortModel}
        loading={loading}
        rows={rows}
        columns={columns}
      />

      <Box sx={{ flexShrink: 0 }}>
        <Pagination
          totalPage={totalPages}
          totalResult={totalCount}
          onPageChange={onPageChange}
          currentPage={pageInfo.page}
          pageSize={pageInfo.size}
          onPageSizeChange={onPageSizeChange}
        />
      </Box>

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
