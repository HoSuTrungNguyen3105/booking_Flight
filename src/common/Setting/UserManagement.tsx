import { Box, Button, Typography } from "@mui/material";
import DataTablePagination from "components/atoms/DataTablePagination";
import memo from "react";
import ReadTransferAdmin from "model";
import { useUserManagement } from "hooks";
import RegisterUserModal from "modals/RegisterUserModal";
import UpdateUserModal from "modals/UpdateUserModal";
import ResetterPasswordModal from "modals/ResetUserPasswordModal";
import DeleteUserModal from "modals/DeleteUserModal";
import LockAccountModal from "modals/LockAccountModal";
import { useInspectionPerformanceHistory } from "./hooks/useInspectionPerformanceHistory";

const UserManagement = () => {
  const {
    users,
    loading,
    totalPages,
    handlePageChange,
    selectedRow,
    setSelectedRow,
    refreshUserList,
  } = useInspectionPerformanceHistory(); //useUserManagement();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "15px",
        borderColor: "grey.200",
      }}
    >
      <Box sx={{ flexGrow: 1 }} overflow="auto">
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ marginBottom: "10px" }}
        >
          User Management
        </Typography>
        <Button onClick={() => toggleOpenModal("addUser")} variant="contained">
          Add User
        </Button>
        <DataTablePagination
          columns={columns}
          userPage={userPage}
          totalItems={totalItems}
          currentPage={currentPage} // Adjust for 0-based index
          onPageChange={handlePageChange}
        />
        {openModal.addUser && <RegisterUserModal onSuccess={refreshUserList} />}
        {openModal.editUser && selectedRow && (
          <UpdateUserModal
            user={selectedRow}
            onClose={() => toggleOpenModal("editUser")}
            onSuccess={refreshUserList}
          />
        )}
        {openModal.deleteUser && selectedRow && (
          <DeleteUserModal
            user={selectedRow}
            onClose={() => toggleOpenModal("deleteUser")}
            onSuccess={refreshUserList}
          />
        )}
        {openModal.lockAccount && selectedRow && (
          <LockAccountModal
            user={selectedRow}
            onClose={() => toggleOpenModal("lockAccount")}
            onSuccess={refreshUserList}
          />
        )}
      </Box>
    </Box>
  );
};

export default memo(UserManagement);
