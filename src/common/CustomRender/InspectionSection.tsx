import { Box, Stack } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { type GridRowDef } from "../DataGrid/index";
import SearchBar from "./SearchBar";
import TableSection from "./TableSection";

type ISecurityTabSectionProps = {
  columns: GridColDef[];
  rows: GridRowDef[];
  name?: string;
  loading?: boolean;
  onSearch?: (query: string) => void;
  onRowClick: (rowData: GridRowDef) => void;
};

const InspectionSection = ({
  columns,
  rows,
  loading,
  onSearch = () => {},
  onRowClick,
}: ISecurityTabSectionProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setHeaderHeight(headerRef.current?.getBoundingClientRect().bottom || 0);
  }, []);

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
