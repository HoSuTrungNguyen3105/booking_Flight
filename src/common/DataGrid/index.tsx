import type {
  GridRowId,
  GridRowModel,
  GridColDef,
  GridSortModel,
} from "@mui/x-data-grid";
import { forwardRef, memo, useCallback, useState, type ReactNode } from "react";
import { Loading } from "../Loading/Loading";
import {
  Box,
  Checkbox,
  Stack,
  styled,
  Typography,
  type CheckboxProps,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  CheckedIcon,
  IndeterminateIcon,
  UncheckedIcon,
} from "../Checkbox/CheckboxIcons";
export type GridRowDef = GridRowModel & {
  id: GridRowId;
};
const CustomCheckbox = forwardRef<HTMLButtonElement, any>((props, ref) => {
  return (
    <span ref={ref}>
      <Checkbox
        {...props}
        size="small"
        color="primary"
        sx={{
          color: "#aaa",
          "&.Mui-checked": {
            color: "#1976d2",
          },
        }}
      />
    </span>
  );
});

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

const EmptyRowsOverlay = memo(() => {
  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      gap={1}
      height={"100%"}
    >
      <Box />
      <Typography>No item</Typography>
    </Stack>
  );
});
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
    emptyContent ? <>{emptyContent}</> : <EmptyRowsOverlay />;
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
        // baseCheckbox: {
        //   sx: {
        //     color: "red",
        //     "&.Mui-checked": {
        //       color: "green",
        //     },
        //   },
        // }, // <-- dùng custom Checkbox
        noRowsOverlay: emptyContent
          ? () => <>{emptyContent}</>
          : EmptyRowsOverlay,
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
