import type {
  GridRowId,
  GridRowModel,
  GridColDef,
  GridSortModel,
} from "@mui/x-data-grid";
import { memo, useCallback, useState, type ReactNode } from "react";
import { Loading } from "../Loading/Loading";
import { Box, Stack, styled, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Icon from "../../svgs/No_item.png";

export type GridRowDef = GridRowModel & {
  id: GridRowId;
};

interface IDataTableProps {
  loading?: boolean;
  rows: GridRowDef[];
  columns: GridColDef[];
  columnHeaderHeight?: number;
  hideColumnHeaderCheckbox?: boolean;
  checkboxSelection?: boolean;
  selectedRows?: GridRowId[]; // optional external control
  sortModel?: GridSortModel;
  emptyContent?: ReactNode;
  emptyItemIcon?: string;
  onRowSelect?: (row: GridRowDef) => void;
  onRowSelectionModelChange?: (model: {
    type: "include" | "exclude";
    ids: Set<GridRowId>;
  }) => void;
  onSortModelChange?: (model: GridSortModel) => void;
}

// Overlay khi loading
const loadingMemo = memo(() => (
  <Box p={2}>
    <Loading />
  </Box>
));

// Overlay khi không có dữ liệu
type EmptyRowsOverlayProps = {
  emptyContent?: ReactNode;
  emptyItemIcon?: string;
};
const EmptyRowsOverlay = memo(
  ({ emptyContent, emptyItemIcon }: EmptyRowsOverlayProps) => (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={2}
      height="60vh"
      sx={{ width: "100%", textAlign: "center" }}
    >
      <Box
        component="img"
        src={emptyItemIcon ?? Icon}
        alt="empty-icon"
        sx={{
          width: 64,
          height: 64,
          objectFit: "contain",
          opacity: 0.7,
        }}
      />
      <Typography variant="body2">
        {emptyContent ?? "Không có dữ liệu"}
      </Typography>
    </Stack>
  )
);
EmptyRowsOverlay.displayName = "EmptyRowsOverlay";

// Styled DataGrid
const StyledDataGrid = styled(DataGrid)<{
  hideColumnHeaderCheckbox: boolean;
}>(({ theme, hideColumnHeaderCheckbox }) => ({
  borderRadius: 0,
  "& .MuiDataGrid-columnSeparator": { display: "none" },
  "& .MuiDataGrid-checkboxInput .MuiSvgIcon-root": {
    width: "24px",
    height: "24px",
  },
  "& .MuiDataGrid-columnHeader": theme.typography.body2,
  "& .MuiDataGrid-cell": {
    ...theme.typography.body2,
    lineHeight: "none",
    "&:focus-within": { outline: "none" },
  },
  ...(hideColumnHeaderCheckbox && {
    "& .MuiDataGrid-columnHeaderCheckbox": { display: "none" },
  }),
}));

const DataTable = ({
  hideColumnHeaderCheckbox = false,
  checkboxSelection = true,
  loading,
  rows,
  columns,
  columnHeaderHeight,
  selectedRows,
  emptyContent,
  sortModel,
  onSortModelChange = () => {},
  onRowSelect = () => {},
  onRowSelectionModelChange = () => {},
}: IDataTableProps) => {
  const [internalSelectedRows, setInternalSelectedRows] = useState<GridRowId[]>(
    []
  );

  const noRowOverlay = useCallback(
    () => <EmptyRowsOverlay emptyContent={emptyContent} emptyItemIcon={Icon} />,
    [emptyContent]
  );

  return (
    <StyledDataGrid
      rows={rows}
      columns={columns}
      checkboxSelection={checkboxSelection}
      hideFooter
      loading={loading}
      columnHeaderHeight={columnHeaderHeight}
      disableColumnMenu
      hideColumnHeaderCheckbox={hideColumnHeaderCheckbox}
      rowSelectionModel={{
        type: "include",
        ids: new Set(selectedRows),
      }}
      // onRowSelectionModelChange={(newSelection) => {
      //   setInternalSelectedRows(
      //     Array.isArray(newSelection)
      //       ? newSelection
      //       : Array.from(newSelection as Set<GridRowId>)
      //   );
      //   onRowSelectionModelChange?.({
      //     type: "include",
      //     ids: new Set(
      //       Array.isArray(newSelection)
      //         ? newSelection
      //         : Array.from(newSelection as Set<GridRowId>)
      //     ),
      //   });
      // }}
      // rowSelectionModel={selectedRows}
      onRowSelectionModelChange={(newSelection) => {
        const updatedSelection = Array.isArray(newSelection)
          ? newSelection
          : Array.from(newSelection as Set<GridRowId>);

        setInternalSelectedRows(updatedSelection);
        onRowSelectionModelChange?.(updatedSelection);
      }}
      sortModel={sortModel}
      onSortModelChange={(model) => onSortModelChange(model)}
      slots={{
        noRowsOverlay: noRowOverlay,
        loadingOverlay: loadingMemo,
      }}
      componentsProps={{
        baseCheckbox: {
          indeterminate: false,
        },
      }}
      components={{
        BaseCheckbox: CustomCheckboxComponent, // nếu muốn tự tạo component riêng
      }}
      onRowClick={(event) => {
        onRowSelect(event.row as GridRowDef);
      }}
    />
  );
};

export default memo(DataTable);
