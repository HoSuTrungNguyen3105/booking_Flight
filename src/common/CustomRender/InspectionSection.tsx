import { Box, Button, Stack, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import DataTable, { type GridRowDef } from "../DataGrid/index";
import SearchIcon from "../../svgs/phone.png";
import Pagination from "../DataGrid/Pagination";
import SearchBar from "./SearchBar";
import useClientPagination from "../../context/use[custom]/useClientPagination";

type ISecurityTabSectionProps = {
  columns: GridColDef[];
  rows: GridRowDef[];
  name?: string;
  loading?: boolean;
  onSearch?: (query: string) => void;
  onRowClick: (rowData: GridRowDef) => void;
  handleAction?: () => void;
};

const InspectionSection = ({
  columns,
  rows,
  loading,
  name = "Total",
  onSearch = () => {},
  onRowClick,
  handleAction = () => {},
}: ISecurityTabSectionProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setHeaderHeight(headerRef.current?.getBoundingClientRect().bottom || 0);
  }, []);

  const {
    totalElements,
    paginatedData,
    pageSize,
    onPageChange,
    sortModel,
    onPageSizeChange,
    currentPage,
    totalPages,
    onSortModelChange,
  } = useClientPagination({ data: rows });

  const renderContent = useCallback(() => {
    return (
      <Box marginRight={0} display="flex" flexDirection="column" height="100%">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "4px 10px",
            backgroundColor: "white",
            border: 1,
            borderColor: "grey.200",
            gap: "4px",
          }}
        >
          <Box
            component="img"
            src={SearchIcon}
            width={18}
            height={18}
            alt="Search Icon"
          />
          <Box justifyContent="space-between" display="flex" width="100%">
            <Typography variant="body2">
              {name}
              <Typography component="span" color="primary">
                {rows.length}
              </Typography>
            </Typography>
            <Button onClick={() => handleAction()}></Button>
          </Box>
        </Box>

        <Box display="flex" minHeight={rows.length === 0 ? "60vh" : "auto"}>
          <DataTable
            checkboxSelection={false}
            hideColumnHeaderCheckbox
            sortModel={sortModel}
            onSortModelChange={onSortModelChange}
            columns={columns}
            rows={paginatedData}
            loading={loading}
            onRowClick={onRowClick}
          />
        </Box>
        <Pagination
          currentPage={currentPage}
          totalResult={totalElements}
          totalPage={totalPages}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </Box>
    );
  }, [totalElements, rows, columns, loading, onSortModelChange, sortModel]);

  return (
    <Stack gap="10px" height="100%">
      <Box minHeight={headerHeight}>
        <SearchBar onSearch={onSearch as () => void} />
      </Box>
      <Box flexGrow={1}>{renderContent()}</Box>
    </Stack>
  );
};

export default memo(InspectionSection);
