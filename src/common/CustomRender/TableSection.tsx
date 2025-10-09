import { Box } from "@mui/material";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { memo, useCallback, useState } from "react";
import DataTable from "../DataGrid";
import Pagination from "../DataGrid/Pagination";
import useClientPagination from "../../context/use[custom]/useClientPagination";
import type { GridRowDef } from "../DataGrid";

type ITableSectionProps = {
  rows: GridRowDef[];
  columns: GridColDef[];
  isLoading: boolean;
  setRows: React.Dispatch<React.SetStateAction<GridRowDef[]>>;
  handleRowClick?: (row: GridRowDef) => void;
  nextRowClick?: boolean;
  largeThan?: boolean;
  onSelectedRowIdsChange?: (selectedIds: GridRowId[]) => void;
};

const TableSection = ({
  rows,
  columns,
  setRows,
  handleRowClick,
  nextRowClick = false,
  largeThan = false,
  isLoading,
  onSelectedRowIdsChange,
}: ITableSectionProps) => {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowId[]>([]);

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

  /**
   * ✅ Khi người dùng chọn dòng, cập nhật state + emit ra ngoài
   */
  const handleRowSelect = useCallback(
    (selectedIds: Set<GridRowId>) => {
      const selectedIdsArray = Array.from(selectedIds);

      setSelectedRowIds(selectedIdsArray);
      onSelectedRowIdsChange?.(selectedIdsArray);

      // ✅ chỉ cập nhật nếu có sự thay đổi
      setRows((prev) =>
        prev.map((row) =>
          row.checkYn === selectedIds.has(row.id)
            ? row
            : { ...row, checkYn: selectedIds.has(row.id) }
        )
      );
    },
    [setRows, onSelectedRowIdsChange]
  );

  /**
   * ✅ Click vào dòng sẽ gọi callback nếu có
   */
  const handleRowClickDebug = useCallback(
    (row: GridRowDef) => {
      console.log("👉 Row clicked:", row.id);
      handleRowClick?.(row);
    },
    [handleRowClick]
  );

  return (
    <Box sx={{ width: "100%", p: 1, maxHeight: "100vh" }}>
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
          checkboxSelection
          selectedRows={selectedRowIds}
          onRowClick={handleRowClickDebug}
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
