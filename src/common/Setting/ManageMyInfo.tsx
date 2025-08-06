import React from "react";
import { useInspectionPerformanceHistory } from "./hooks/useInspectionPerformanceHistory";
import { Box } from "@mui/material";
import TableSection from "./TableSection";
import DataTable from "../DataGrid/index";
import Pagination from "../DataGrid/Pagination";
import AddUserModal from "./hooks/AddUserModal";
import { Loading } from "../Loading/Loading";

const ManageMyInfo = () => {
  const {
    dataTableViewRef,
    headerHeight,
    loading,
    totalCount,
    totalPages,
    selectedRow,
    setSelectedRow,
    selectedItemDetailRow,
    setSelectedItemDetailRow,
    rows,
    columns,
    pageInfo,
    sortModel,
    onSortModelChange,
    onPageChange,
    onPageSizeChange,
    openModal,
    onRowClick,
    onSearch,
    openCheckNow,
    toggleOpenCheckNow,
  } = useInspectionPerformanceHistory();
  if (loading) {
    return <Loading />;
  }
  return (
    <Box>
      {/* <TableSection
    rows={rows}
  columns={columns}
  handleRowClick={onRowClick}
  nextRowClick
  largeThan
  isLoading={loading}

    />  */}
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
          onSuccess={() => {}}
          onClose={() => {}}
        />
      )}
    </Box>
  );
};

export default ManageMyInfo;
