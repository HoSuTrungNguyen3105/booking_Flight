import { Box, Pagination, styled, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import { Dropdown } from "../Dropdown/Dropdown";
import CSelect from "../Dropdown/CSelect";

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

      <Box display="flex" justifyContent="center" flexGrow={1}>
        <StyledPagination
          count={totalPage}
          page={currentPage}
          onChange={handlePageChange}
          shape="rounded"
          hidePrevButton={!currentPage || currentPage === 1}
          hideNextButton={!currentPage || currentPage === totalPage}
        />
      </Box>

      {onPageSizeChange && (
        <Box>
          <CSelect
            sx={{ maxHeight: "30px" }}
            options={[
              { label: "10개씩 보기", value: 10 },
              { label: "15개씩 보기", value: 15 },
              { label: "20개씩 보기", value: 20 },
            ]}
            value={pageSize}
            onChange={(val) => onPageSizeChange(val as number)}
          />
        </Box>
      )}
    </Box>
  );
};

export default memo(DataTablePagination);
