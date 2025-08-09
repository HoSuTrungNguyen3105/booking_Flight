import React from "react";
import { useInspectionPerformanceHistory } from "./hooks/useInspectionPerformanceHistory";
import { Box } from "@mui/material";
import TableSection from "./TableSection";
import DataTable from "../DataGrid/index";
import Pagination from "../DataGrid/Pagination";
import AddUserModal from "./hooks/AddUserModal";
import { Loading } from "../Loading/Loading";
import UpdateUserModal from "./hooks/UpdateUserModal";
import AccountLock from "./AccountLock";
import DeleteUserModal from "./DeleteUserModal";

const ManageMyInfo = () => {
  const {
    loading,
    totalPages,
    selectedRow,
    toggleOpenModal,
    rows,
    columns,
    onSortModelChange,
    onPageChange,
    onPageSizeChange,
    openModal,
    onRowClick,
  } = useInspectionPerformanceHistory();
  if (loading) {
    return <Loading />;
  }
  return (
    <Box>
      <DataTable
        rows={rows}
        columns={columns}
        checkboxSelection={false}
        onRowClick={onRowClick}
        onSortModelChange={onSortModelChange}
        loading={loading}
      />
      <Box sx={{ flexShrink: 0 }}>
        <Pagination
          totalPage={totalPages}
          totalResult={2}
          onPageChange={onPageChange}
          currentPage={totalPages}
          pageSize={2}
          onPageSizeChange={onPageSizeChange}
        />
      </Box>
      {openModal.addUser && (
        <AddUserModal
          open={openModal.addUser}
          onSuccess={() => toggleOpenModal("addUser")}
          onClose={() => {}}
        />
      )}
      {openModal.editUser && (
        <UpdateUserModal
          open={openModal.editUser}
          data={selectedRow?.id}
          onSuccess={() => toggleOpenModal("editUser")}
          onClose={() => {}}
        />
      )}
      {openModal.deleteUser && selectedRow && (
        <DeleteUserModal
          open={openModal.deleteUser}
          user={selectedRow}
          onSuccess={() => toggleOpenModal("deleteUser")}
          onClose={() => {}}
        />
      )}
      {openModal.lock_unlockAccount && selectedRow && (
        <AccountLock
          open={openModal.lock_unlockAccount}
          user={selectedRow}
          onSuccess={() => toggleOpenModal("lock_unlockAccount")}
          onClose={() => {}}
        />
      )}
    </Box>
  );
};

export default ManageMyInfo;
