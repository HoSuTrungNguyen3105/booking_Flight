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
import {
  CheckedIcon,
  IndeterminateIcon,
  UncheckedIcon,
} from "../Checkbox/CheckboxIcons";
import Icon from "../../svgs/loading.gif";
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
  onRowSelect?: (rowId: Set<GridRowId>) => void;
  onSortModelChange?: (model: GridSortModel) => void;
}
const loadingMemo = memo(() => {
  return (
    <Box p={2}>
      <Loading />
    </Box>
  );
}); // <== thêm dependency array ở đây
type EmptyRowsOverlayProps = {
  emptyContent?: ReactNode;
  emptyItemIcon?: string;
};
const EmptyRowsOverlay = memo(
  ({ emptyContent, emptyItemIcon }: EmptyRowsOverlayProps) => {
    return (
      <Stack
        justifyContent={"center"}
        alignItems={"center"}
        gap={1}
        height={"100%"}
      >
        <Box component={"img"} src={emptyItemIcon ?? Icon} />
        <Typography color="grey.500">{emptyContent ?? "No item"}</Typography>
      </Stack>
    );
  }
);
EmptyRowsOverlay.displayName = "EmptyRowsOverlay";

// Styled DataGrid component
const StyledDataGrid = styled(DataGrid)<{ hideColumnHeaderCheckbox: boolean }>(
  ({ theme, hideColumnHeaderCheckbox }) => ({
    borderRadius: 0,
    "& .MuiDataGrid-columnSeparator": {
      display: "none",
    },
    "& .MuiDataGrid-checkboxInput": {
      "& .MuiSvgIcon-root": {
        width: "24px",
        height: "24px",
      },
    },
    "& .MuiDataGrid-columnHeader": {
      ...theme.typography.body2,
    },
    "& .MuiDataGrid-cell": {
      ...theme.typography.body2,
      lineHeight: "none",
      "&:focus-within": {
        outline: "none",
      },
    },
    ...(hideColumnHeaderCheckbox && {
      "& .MuiDataGrid-columnHeaderCheckbox": {
        display: "none",
      },
    }),
  })
);

const DataTable = ({
  hideColumnHeaderCheckbox = false,
  checkboxSelection = true,
  loading,
  rows,
  columns,
  columnHeaderHeight,
  // selectedRows,
  emptyContent,
  sortModel,
  onSortModelChange,
}: IDataTableProps) => {
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const noRowOverlay = useCallback(() => {
    return (
      <EmptyRowsOverlay emptyContent={emptyContent} emptyItemIcon={Icon} />
    );
  }, [emptyContent]);

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
      onRowSelectionModelChange={(newSelection) => {
        setSelectedRows(Array.from(newSelection.ids));
      }}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      slots={{
        noRowsOverlay: noRowOverlay,
        loadingOverlay: loadingMemo,
      }}
      slotProps={{
        baseCheckbox: {
          sx: {
            color: "red",
            "&.Mui-checked": {
              color: "green",
            },
          },
          icon: <UncheckedIcon />,
          checkedIcon: <CheckedIcon color="primary" />,
          indeterminateIcon: <IndeterminateIcon color="primary" />,
        },
      }}
    />
  );
};
export default memo(DataTable);
