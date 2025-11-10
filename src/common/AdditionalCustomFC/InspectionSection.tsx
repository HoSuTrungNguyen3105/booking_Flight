import { Box, Stack } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { type GridRowDef } from "../DataGrid/index";
import SearchBar, { type ISearchQuery } from "./SearchBar";
import TableSection from "./TableSection";

type ISecurityTabSectionProps = {
  columns: GridColDef[];
  rows: GridRowDef[];
  name?: string;
  loading?: boolean;
  onSearch?: (query: ISearchQuery) => void;
  onRowClick: (rowData: GridRowDef) => void;
};

const InspectionSection = ({
  columns,
  rows,
  loading,
  onRowClick,
}: ISecurityTabSectionProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [filteredRows, setFilteredRows] = useState<GridRowDef[]>(rows);

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  useEffect(() => {
    setHeaderHeight(headerRef.current?.getBoundingClientRect().bottom || 0);
  }, []);

  const handleSearch = useCallback(
    (query: ISearchQuery) => {
      const { text, startDate, endDate } = query;

      const filtered = rows.filter((row) => {
        const matchesText =
          text.length === 0 ||
          text.some((term) =>
            Object.values(row).some((val) =>
              String(val).toLowerCase().includes(term.toLowerCase())
            )
          );

        const matchesDate =
          (!startDate && !endDate) ||
          (row.createdAt &&
            (!startDate || new Date(row.createdAt) >= new Date(startDate)) &&
            (!endDate || new Date(row.createdAt) <= new Date(endDate)));

        return matchesText && matchesDate;
      });

      setFilteredRows(filtered);
    },
    [rows]
  );

  const renderContent = useCallback(() => {
    return (
      <Box display="flex" flexDirection="column">
        <TableSection
          columns={columns}
          rows={filteredRows}
          isLoading={loading as boolean}
          nextRowClick={true}
          setRows={() => {}}
          handleRowClick={onRowClick}
        />
      </Box>
    );
  }, [filteredRows, columns, loading, onRowClick]);

  return (
    <Stack height="100%">
      <Box minHeight={headerHeight}>
        <SearchBar onSearch={handleSearch} />
      </Box>
      <Box flexGrow={1}>{renderContent()}</Box>
    </Stack>
  );
};

export default memo(InspectionSection);
