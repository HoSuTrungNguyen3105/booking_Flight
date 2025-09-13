import type {
  GridRowId,
  GridRowModel,
  GridColDef,
  GridSortModel,
} from "@mui/x-data-grid";
import { memo, useCallback, type ReactNode } from "react";
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
  selectedRows?: GridRowId[];
  sortModel?: GridSortModel;
  emptyContent?: ReactNode;
  emptyItemIcon?: string;
  onRowSelect?: (row: Set<GridRowId>) => void;
  onRowClick?: (row: GridRowDef) => void;
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
      height="100%"
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

  "& .MuiDataGrid-virtualScroller": {
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: 0,
      height: 0,
      background: "transparent",
    },
    scrollbarWidth: "none",
  },

  "& .MuiDataGrid-main": {
    "&::-webkit-scrollbar": {
      display: "none",
    },
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
  onRowClick = () => {},
  selectedRows,
  emptyContent,
  sortModel,
  onSortModelChange = () => {},
  onRowSelect = () => {},
}: IDataTableProps) => {
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
      sortModel={sortModel}
      onSortModelChange={(model) => onSortModelChange(model)}
      rowSelectionModel={{
        type: "include",
        ids: new Set(selectedRows),
      }}
      onRowSelectionModelChange={(row) => {
        onRowSelect(row.ids);
      }}
      slots={{
        noRowsOverlay: noRowOverlay,
        loadingOverlay: loadingMemo,
      }}
      onRowClick={(event) => {
        onRowClick(event.row);
      }}
    />
  );
};

EmptyRowsOverlay.displayName = "EmptyRowsOverlay";

export default memo(DataTable);
