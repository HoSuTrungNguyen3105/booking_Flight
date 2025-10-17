import { Box, Button, Stack, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import DataTable, { type GridRowDef } from "../DataGrid/index";
import SearchIcon from "../../svgs/icon-search.svg";
import Pagination from "../DataGrid/Pagination";
import SearchBar from "./SearchBar";
import useClientPagination from "../../context/use[custom]/useClientPagination";
import TableSection from "./TableSection";

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

  // const {
  //   totalElements,
  //   paginatedData,
  //   pageSize,
  //   onPageChange,
  //   sortModel,
  //   onPageSizeChange,
  //   currentPage,
  //   totalPages,
  //   onSortModelChange,
  // } = useClientPagination({ data: rows });

  const renderContent = useCallback(() => {
    return (
      <Box display="flex" flexDirection="column">
        <TableSection
          columns={columns}
          rows={rows}
          isLoading={loading as boolean}
          nextRowClick={true}
          setRows={() => {}}
          handleRowClick={onRowClick}
          // largeThan
        />
      </Box>
    );
  }, [rows, columns, loading]);

  return (
    <Stack height="100%">
      <Box minHeight={headerHeight}>
        <SearchBar onSearch={onSearch as () => void} />
      </Box>
      <Box flexGrow={1}>{renderContent()}</Box>
    </Stack>
  );
};

export default memo(InspectionSection);
