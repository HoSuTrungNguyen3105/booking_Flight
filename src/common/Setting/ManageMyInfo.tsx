import { useInspectionPerformanceHistory } from "./hooks/useInspectionPerformanceHistory";
import { Box, Button, Typography } from "@mui/material";
import DataTable, { type GridRowDef } from "../DataGrid/index";
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
import SendEmailToUsers from "./SendEmailToUsers";
import TableSection from "./TableSection";

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
        onSuccess={() => setIsValidate(false)}
      />
    );
  }

  // Nếu có row được chọn để gửi email
  if (selectedRowChange.length > 0) {
    return <SendEmailToUsers selectedUser={selectedRowIds} />;
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
      {selectedRow?.length}

      <TableSection
        setRows={setSelectedRowIds}
        isLoading={loading}
        nextRowClick
        onSelectedRowIdsChange={handleMealRowSelection}
        // checkboxSelection={false}
        // onSortModelChange={onSortModelChange}
        // sortModel={sortModel}
        //loading={loading}
        rows={rows}
        columns={columns}
      />

      {/* <Box sx={{ flexShrink: 0 }}>
        <Pagination
          totalPage={totalPages}
          totalResult={totalCount}
          onPageChange={onPageChange}
          currentPage={pageInfo.page}
          pageSize={pageInfo.size}
          onPageSizeChange={onPageSizeChange}
        />
      </Box> */}

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
