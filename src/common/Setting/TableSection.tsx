import { Box } from "@mui/material";
import type { GridRowDef } from "../DataGrid";
import DataTable from "../DataGrid/index";
import useClientPagination from "../../context/use[custom]/useClientPagination";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { useCallback, useMemo } from "react";
import Pagination from "../DataGrid/Pagination";
type ITableSectionProps = {
  rows: GridRowDef[];
  columns: GridColDef[];
  isLoading: boolean;
  setRows: React.Dispatch<React.SetStateAction<GridRowDef[]>>;
  handleRowClick?: (row: GridRowDef) => void;
  nextRowClick?: boolean;
  largeThan?: boolean;
  hideColumnHeaderCheckbox?: boolean;
};
const TableSection = ({
  rows,
  columns,
  setRows,
  handleRowClick,
  nextRowClick,
  largeThan,
  hideColumnHeaderCheckbox,
  isLoading,
}: ITableSectionProps) => {
  const {
    totalElements,
    paginatedData,
    pageSize,
    onPageChange,
    onPageSizeChange,
    currentPage,
    totalPages,
    onSortModelChange,
  } = useClientPagination({ data: rows });
  const handleRowSelect = useCallback(
    (selectedRow: Set<GridRowId>) => {
      setRows((prev) =>
        prev.map((row) => ({
          ...row,
          checkYn: !!selectedRow.has(row.id),
        }))
      );
    },
    [setRows]
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
          hideColumnHeaderCheckbox={hideColumnHeaderCheckbox}
          checkboxSelection={false}
          selectedRows={selectedRow}
          onRowClick={handleRowClick}
          onRowSelect={handleRowSelect}
          onSortModelChange={onSortModelChange}
          loading={isLoading}
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

export default TableSection;
