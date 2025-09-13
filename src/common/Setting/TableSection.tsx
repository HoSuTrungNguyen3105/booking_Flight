import { Box } from "@mui/material";
import type { GridRowDef } from "../DataGrid";
import DataTable from "../DataGrid/index";
import useClientPagination from "../../context/use[custom]/useClientPagination";
import type {
  GridColDef,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { memo, useCallback, useMemo } from "react";
import Pagination from "../DataGrid/Pagination";

type ITableSectionProps = {
  rows: GridRowDef[];
  columns: GridColDef[];
  isLoading: boolean;
  setRows: React.Dispatch<React.SetStateAction<GridRowDef[]>>;
  handleRowClick?: (row: GridRowDef) => void;
  nextRowClick?: boolean;
  largeThan?: boolean;
};

const TableSection = ({
  rows,
  columns,
  setRows,
  handleRowClick,
  nextRowClick,
  largeThan,
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
    (newSelection: GridRowSelectionModel) => {
      // newSelection là array id (GridRowId[]) hoặc single id
      const ids: GridRowId[] = Array.from(newSelection as GridRowId[]);

      setRows((prev) =>
        prev.map((row) => ({
          ...row,
          checkYn: ids.includes(row.id), // đánh dấu checked
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
          checkboxSelection
          rowSelectionModel={selectedRow} // đồng bộ checked
          onRowSelectionModelChange={handleRowSelect} // gọi khi check
          onRowClick={handleRowClick}
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

export default memo(TableSection);
