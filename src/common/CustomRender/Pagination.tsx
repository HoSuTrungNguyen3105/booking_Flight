import { styled } from "@mui/material/styles";
import { Pagination } from "@mui/material";

export const StyledPagination = styled(Pagination)(({ theme }) => ({
  marginTop: theme.spacing(2),
  "& .MuiPaginationItem-root": {
    color: "#1976d2", // màu chữ
    fontWeight: 600,
    borderRadius: 8,
    "&.Mui-selected": {
      backgroundColor: "#1976d2",
      color: "white",
    },
  },
}));
