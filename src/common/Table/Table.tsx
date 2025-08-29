import {
  TableBody,
  TableCell,
  TableContainer,
  Box,
  FormControl,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Table,
  type SelectChangeEvent,
  Select,
  styled,
} from "@mui/material";
import { useState } from "react";
import { Button } from "../Button/Button";
import { FileUpload } from "../FileUploader";
// import Select from "react-select";
const columns = [
  {
    id: "id",
    name: "gildong.hong",
    label: "ID",
    type: "membr_sys",
    minWidth: 100,
  },
  {
    id: "name",
    name: "gildong.hong",
    label: "Tên",
    type: "sys_user",
    minWidth: 150,
  },
  {
    id: "status",
    name: "gildong.hong",
    label: "Trạng thái",
    type: "sys_admin",
    minWidth: 120,
  },
];
type Props = {
  className?: string;
};
const ArrowDownIcon: React.FC<Props> = ({ className }) => {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        width: "10px",
        height: "10px",
        borderRight: "2px solid #333",
        borderBottom: "2px solid #333",
        transform: "rotate(45deg)",
        transition: "transform 0.2s ease",
        marginRight: "8px",
        marginTop: "4px",
      }}
    />
  );
};
const TableCustom = () => {
  const rows = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    name: `Dữ liệu ${index + 1}`,
    status: index % 2 === 0 ? "Hoạt động" : "Tạm ngưng",
    type: [
      { value: "membr_sys", label: "Membr Sys" },
      { value: "sys_user", label: "Sys User" },
      { value: "sys_admin", label: "Sys Admin" },
    ],
  }));
  const [open, setOpen] = useState(false);

  const RotatingArrow = styled(ArrowDownIcon)<{ open: boolean }>(
    ({ open }) => ({
      transform: open ? "rotate(-135deg)" : "rotate(45deg)", // mở thì quay lên
    })
  );
  const [page, setPage] = useState(0);
  const [value, setValue] = useState("");
  const rowsPerPage = 5;

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };
  const slicedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    // <div>
    <form>
      <FormControl>
        <Box>
          <Button
            appearance="contained"
            priority="custom"
            customLabelColor="#000000"
            label="단추단추"
            customColor="#fdd835" // 🌟 vàng sáng nổi bật
            size="large"
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          />
        </Box>
        <TableContainer className="flight-container">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          ></Box>
          <Box sx={{ borderRadius: 1, border: "solid 3px #f2f3f8" }}>
            <Box className="search-status"></Box>
          </Box>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 360 }}>
              <Table stickyHeader aria-label="custom table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slicedRows.map((row, idx) => (
                    <TableRow hover key={idx}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>
                        {/* <Select options={row.type} /> */}
                        <Select
                          onChange={handleChange}
                          open={open}
                          onOpen={() => setOpen(true)}
                          onClose={() => setOpen(false)}
                          IconComponent={(props) => (
                            <RotatingArrow {...props} open={open} />
                          )}
                          value={value}
                          displayEmpty
                          className="select"
                          // inputProps={{ "aria-label": "Without label" }}
                        >
                          {row.type.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[]}
            />
          </Paper>
        </TableContainer>
      </FormControl>
    </form>
    //  </div>
  );
};

export default TableCustom;
