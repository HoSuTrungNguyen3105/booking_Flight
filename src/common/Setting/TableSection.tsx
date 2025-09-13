import { Box } from "@mui/material";
import type { GridRowDef } from "../DataGrid";
import DataTable from "../DataGrid/index";
import useClientPagination from "../../context/use[custom]/useClientPagination";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { memo, useCallback, useMemo, useState } from "react";
import Pagination from "../DataGrid/Pagination";

type ITableSectionProps = {
  rows: GridRowDef[];
  columns: GridColDef[];
  isLoading: boolean;
  setRows: React.Dispatch<React.SetStateAction<GridRowDef[]>>;
  handleRowClick?: (row: GridRowDef) => void;
  nextRowClick?: boolean;
  largeThan?: boolean;
  onSelectedRowIdsChange?: (selectedIds: GridRowId[]) => void; // Thêm prop callback mới
};

const TableSection = ({
  rows,
  columns,
  setRows,
  handleRowClick,
  nextRowClick,
  largeThan,
  isLoading,
  onSelectedRowIdsChange, // Nhận prop callback
}: ITableSectionProps) => {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowId[]>([]); // State để lưu selected IDs

  const {
    totalElements,
    paginatedData,
    pageSize,
    onPageChange,
    onPageSizeChange,
    currentPage,
    totalPages,
    onSortModelChange,
    sortModel,
  } = useClientPagination({ data: rows });

  const handleRowSelect = useCallback(
    (selectedIds: Set<GridRowId>) => {
      // Chuyển Set thành Array
      const selectedIdsArray = Array.from(selectedIds);

      // Cập nhật state selectedRowIds
      setSelectedRowIds(selectedIdsArray);

      // Gọi callback nếu có
      if (onSelectedRowIdsChange) {
        onSelectedRowIdsChange(selectedIdsArray);
      }

      // Cập nhật rows với trạng thái checkYn
      setRows((prev) =>
        prev.map((row) => ({
          ...row,
          checkYn: selectedIds.has(row.id),
        }))
      );
    },
    [setRows, onSelectedRowIdsChange]
  );

  const selectedRow = useMemo(
    () => rows?.filter(({ checkYn }) => checkYn).map(({ id }) => id),
    [rows]
  );

  return (
    <Box sx={{ width: "100%", padding: "8px", maxHeight: "100vh" }}>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          height: largeThan ? "20rem" : "10rem",
        }}
      >
        <DataTable
          rows={paginatedData}
          columns={columns}
          checkboxSelection={true}
          selectedRows={selectedRow}
          onRowClick={handleRowClick}
          onRowSelect={handleRowSelect}
          onSortModelChange={onSortModelChange}
          loading={isLoading}
          sortModel={sortModel}
        />
      </Box>
      {nextRowClick && (
        <Box sx={{ flexShrink: 0 }}>
          <Pagination
            totalPage={totalPages}
            totalResult={totalElements}
            onPageChange={onPageChange}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default memo(TableSection);
