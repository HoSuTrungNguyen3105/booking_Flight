import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import type { GridColDef, GridSortModel } from "@mui/x-data-grid";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataTable from "../DataGrid/index";
import { Button } from "../Button/Button";
import SearchIcon from "../../svgs/phone.png";
import Pagination from "../DataGrid/Pagination";
type ISecurityTabSectionProps = {
  totalResult?: number;
  currentPage?: number;
  totalPage?: number;
  pageSize?: number;
  onChangePage?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSortModelChange?: (model: GridSortModel) => void;
  sortModel?: GridSortModel;
  handleAction?: () => void;
  columns: GridColDef[];
  tabs?: {
    label: string;
    description: string;
    content: React.ReactNode;
  }[];
  rows: any[];
  loading?: boolean;
  onSearch?: (query: string) => void;
};
const InspectionSection = ({
  totalResult = 0,
  currentPage = 1,
  totalPage = 5,
  pageSize = 10,
  onChangePage = () => {},
  onPageSizeChange = () => {},
  onSortModelChange = () => {},
  sortModel = [],
  handleAction = () => {},
  columns,
  tabs,
  rows,
  loading,
  onSearch,
}: ISecurityTabSectionProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const changedTabRef = useRef<number>(0);

  useEffect(() => {
    setHeaderHeight(headerRef.current?.getBoundingClientRect().bottom || 0);
  }, []);

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);

  const handleChangeTab = useCallback(
    (tabIndex: number) => {
      if (unsavedChanges) {
        changedTabRef.current = tabIndex;
        setShowUnsavedChangesDialog(true);
        return;
      }

      setActiveTab(tabIndex);
    },
    [unsavedChanges]
  );

  const renderTabData = useMemo(() => {
    if (!tabs || tabs.length === 0) return null;

    return (
      <Box>
        <Box ref={headerRef} sx={{ border: "1px solid grey" }}>
          <Box sx={{ backgroundColor: "white" }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => handleChangeTab(v)}
              sx={{ borderColor: "grey.200", minHeight: "auto" }}
            >
              {tabs?.map((tab, idx) => (
                <Tab
                  key={idx}
                  label={<Typography variant="button">{tab.label}</Typography>}
                  sx={{ minHeight: "40px" }}
                />
              ))}
            </Tabs>
          </Box>
        </Box>

        <Box sx={{ height: `calc(100vh - ${headerHeight}px)` }}>
          <Box
            sx={{
              border: "1px solid grey",
              display: "flex",
              padding: "12px 16px",
              bgcolor: "white",
            }}
          >
            <Typography variant="body1" sx={{ gap: "10px" }} color="grey.500">
              {tabs?.[activeTab].description}
            </Typography>
          </Box>
          <Box flexGrow={1}>{tabs?.[activeTab].content}</Box>
        </Box>
      </Box>
    );
  }, [activeTab, headerHeight, tabs, handleChangeTab]);

  const renderContent = useCallback(() => {
    if (tabs && tabs.length > 0) {
      return null;
    }

    return (
      <Box display="flex" flexDirection="column" height="100%">
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
              결과{" "}
              <Typography component="span" color="primary">
                {rows.length}
              </Typography>
            </Typography>
            <Button
              onClick={() => handleAction()}
              label={<Typography variant="button">지금 검색</Typography>}
            ></Button>
          </Box>
        </Box>

        <Box display="flex" minHeight={rows.length === 0 ? "60vh" : "auto"}>
          <DataTable
            checkboxSelection={false}
            hideColumnHeaderCheckbox
            sortModel={sortModel}
            onSortModelChange={onSortModelChange}
            columns={columns}
            rows={rows}
            loading={loading}
            // emptyContent={<EmptyRowsOverlay />}
          />
        </Box>

        <Pagination
          currentPage={currentPage}
          totalResult={totalResult}
          totalPage={totalPage}
          pageSize={pageSize}
          onPageChange={onChangePage}
          onPageSizeChange={onPageSizeChange}
        />
      </Box>
    );
  }, [tabs, totalResult, rows, columns, loading, onSortModelChange, sortModel]);

  return (
    <Stack gap="10px" height="100%">
      {/* <SearchBar onSearch={onSearch} /> */}
      {renderTabData}
      <Box flexGrow={1}>{renderContent()}</Box>
    </Stack>
  );
};

export default memo(InspectionSection);
