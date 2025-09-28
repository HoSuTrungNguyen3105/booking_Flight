import { Box, Pagination, Stack, styled, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import SelectDropdown from "../Dropdown/SelectDropdown";

interface ICustomPaginationProps {
  totalText?: string;
  currentPage: number;
  totalResult: number;
  totalPage: number;
  pageSize: number;
  subResult?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

// Move styled component outside to prevent re-creation on each render
const StyledPagination = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    ...theme.typography.body2,
    color: theme.palette.grey[500],
  },
  "& .Mui-selected": {
    color: theme.palette.text.primary,
  },
}));

const DataTablePagination = ({
  currentPage,
  totalText,
  subResult,
  totalResult,
  totalPage,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}: ICustomPaginationProps) => {
  // Memoize the change handler to prevent recreation on each render
  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      onPageChange(page);
    },
    [onPageChange]
  );

  const pageSizeOptions = [
    { label: "10개씩 보기", value: 10 },
    { label: "15개씩 보기", value: 15 },
    { label: "20개씩 보기", value: 20 },
  ];

  const renderPageSizeChange = useCallback((dataLength: number) => {
    switch (true) {
      case dataLength < 10:
        return []; // nhỏ hơn 10 thì không hiển thị gì

      case dataLength <= 15:
        return pageSizeOptions.filter((opt) => opt.value <= 15);

      case dataLength <= 20:
        return pageSizeOptions.filter((opt) => opt.value <= 20);

      default:
        return pageSizeOptions;
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "3px 14px",
        backgroundColor: "white",
        border: 1,
        borderColor: "grey.200",
        borderTop: 0,
      }}
    >
      <Box>
        <Typography variant="body2" color="grey.400">
          {totalText} Total
        </Typography>
        <Typography variant="body1" color="grey.900" ml="4px">
          {totalResult} {subResult}
        </Typography>
      </Box>

      {currentPage !== 0 && (
        <Box display="flex" justifyContent="center" flexGrow={1}>
          <StyledPagination
            count={totalPage}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
            hidePrevButton={!currentPage || currentPage !== 0}
            hideNextButton={!currentPage || currentPage !== totalPage}
          />
        </Box>
      )}

      {onPageSizeChange && renderPageSizeChange(totalResult).length > 0 && (
        <Stack>
          <SelectDropdown
            sx={{ maxHeight: "30px" }}
            options={renderPageSizeChange(totalResult)}
            value={pageSize}
            onChange={(val) => onPageSizeChange(val as number)}
          />
        </Stack>
      )}
    </Box>
  );
};

export default memo(DataTablePagination);
