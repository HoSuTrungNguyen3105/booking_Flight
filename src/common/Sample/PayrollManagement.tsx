import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  Paper,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  AttachMoney,
  Add,
  Visibility,
  Download,
  Edit,
  CheckCircle,
  Person,
  CalendarMonth,
} from "@mui/icons-material";
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
} from "@mui/x-data-grid";
import { useState } from "react";

interface Payroll {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
  netPay: number;
  status: "DRAFT" | "FINALIZED";
  generatedAt: string;
  employee: {
    id: number;
    name: string;
    employeeNo: string;
    email?: string;
    role?: string;
  };
}

const PayrollManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<number>(0);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [payrollData, setPayrollData] = useState({
    baseSalary: 0,
    allowances: 0,
    deductions: 0,
    tax: 0,
  });

  // Mock data
  const payrolls: Payroll[] = [
    {
      id: 1,
      employeeId: 1,
      month: 12,
      year: 2024,
      baseSalary: 50000000,
      allowances: 5000000,
      deductions: 2500000,
      tax: 7500000,
      netPay: 45000000,
      status: "FINALIZED",
      generatedAt: "2024-12-15T00:00:00Z",
      employee: { id: 1, name: "Nguyễn Văn A", employeeNo: "NV001" },
    },
    {
      id: 2,
      employeeId: 2,
      month: 12,
      year: 2024,
      baseSalary: 60000000,
      allowances: 6000000,
      deductions: 3000000,
      tax: 9000000,
      netPay: 54000000,
      status: "DRAFT",
      generatedAt: "2024-12-16T00:00:00Z",
      employee: { id: 2, name: "Trần Thị B", employeeNo: "NV002" },
    },
  ];

  // Data Grid Columns
  const columns: GridColDef[] = [
    {
      field: "employee",
      headerName: "Nhân viên",
      width: 200,
      renderCell: (params) => (
        <Stack spacing={0.5}>
          <Typography variant="subtitle2">
            {params.row.employee.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.employee.employeeNo}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "period",
      headerName: "Kỳ lương",
      width: 120,
      renderCell: (params) => (
        <Typography>
          {params.row.month}/{params.row.year}
        </Typography>
      ),
    },
    {
      field: "baseSalary",
      headerName: "Lương cơ bản",
      width: 150,
      type: "number",
      renderCell: (params) => (
        <Typography fontWeight="medium">
          {params.value.toLocaleString()}đ
        </Typography>
      ),
    },
    {
      field: "allowances",
      headerName: "Phụ cấp",
      width: 130,
      type: "number",
      renderCell: (params) => `${params.value.toLocaleString()}đ`,
    },
    {
      field: "deductions",
      headerName: "Khấu trừ",
      width: 130,
      type: "number",
      renderCell: (params) => `${params.value.toLocaleString()}đ`,
    },
    {
      field: "tax",
      headerName: "Thuế",
      width: 130,
      type: "number",
      renderCell: (params) => `${params.value.toLocaleString()}đ`,
    },
    {
      field: "netPay",
      headerName: "Thực lĩnh",
      width: 150,
      type: "number",
      renderCell: (params) => (
        <Typography variant="subtitle1" color="primary" fontWeight="bold">
          {params.value.toLocaleString()}đ
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value === "FINALIZED" ? "Đã thanh toán" : "Bản nháp"}
          color={params.value === "FINALIZED" ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "generatedAt",
      headerName: "Ngày tạo",
      width: 150,
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("vi-VN"),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Thao tác",
      width: 150,
      renderCell: (params) =>
        [
          <GridActionsCellItem
            icon={<Visibility />}
            label="Xem chi tiết"
            onClick={() => handleViewDetails(params.row)}
          />,
          <GridActionsCellItem
            icon={<Download />}
            label="Tải về"
            onClick={() => handleDownload(params.row)}
          />,
          params.row.status === "DRAFT" && (
            <GridActionsCellItem
              icon={<CheckCircle />}
              label="Duyệt"
              onClick={() => handleFinalize(params.row.id)}
            />
          ),
        ].filter(Boolean),
    },
  ];

  const handleViewDetails = (payroll: Payroll) => {
    console.log("View details:", payroll);
  };

  const handleDownload = (payroll: Payroll) => {
    console.log("Download:", payroll);
  };

  const handleFinalize = (id: number) => {
    console.log("Finalize:", id);
  };

  return (
    <Box sx={{ p: 3, height: "100vh" }}>
      {/* Header */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AttachMoney color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Quản lý Bảng Lương
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Quản lý và theo dõi bảng lương nhân viên
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Action Bar */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={12}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenGenerateDialog(true)}
              size="large"
            >
              Tạo Bảng Lương Mới
            </Button>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Tháng</InputLabel>
              <Select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                label="Tháng"
              >
                {Array.from({ length: 12 }, (_, i) => ({
                  value: i + 1,
                  label: `Tháng ${i + 1}`,
                })).map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Năm</InputLabel>
              <Select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                label="Năm"
              >
                {[2023, 2024, 2025].map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Grid>

        <Grid size={12}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="outlined" startIcon={<Download />}>
              Export Excel
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Data Grid */}
      <Card sx={{ height: "calc(100vh - 250px)" }}>
        <DataGrid
          rows={payrolls}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          sx={{
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              borderBottom: "2px solid #e0e0e0",
            },
          }}
        />
      </Card>

      {/* Generate Payroll Dialog */}
      <Dialog
        open={openGenerateDialog}
        onClose={() => setOpenGenerateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Tạo Bảng Lương Mới
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Nhân viên</InputLabel>
                <Select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(Number(e.target.value))}
                  label="Nhân viên"
                >
                  <MenuItem value={1}>Nguyễn Văn A (NV001)</MenuItem>
                  <MenuItem value={2}>Trần Thị B (NV002)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Tháng</InputLabel>
                <Select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  label="Tháng"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Năm</InputLabel>
                <Select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  label="Năm"
                >
                  {[2023, 2024, 2025].map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Lương cơ bản"
                type="number"
                value={payrollData.baseSalary}
                onChange={(e) =>
                  setPayrollData({
                    ...payrollData,
                    baseSalary: Number(e.target.value),
                  })
                }
                InputProps={{
                  endAdornment: "đ",
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Phụ cấp"
                type="number"
                value={payrollData.allowances}
                onChange={(e) =>
                  setPayrollData({
                    ...payrollData,
                    allowances: Number(e.target.value),
                  })
                }
                InputProps={{
                  endAdornment: "đ",
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Khấu trừ"
                type="number"
                value={payrollData.deductions}
                onChange={(e) =>
                  setPayrollData({
                    ...payrollData,
                    deductions: Number(e.target.value),
                  })
                }
                InputProps={{
                  endAdornment: "đ",
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Thuế"
                type="number"
                value={payrollData.tax}
                onChange={(e) =>
                  setPayrollData({
                    ...payrollData,
                    tax: Number(e.target.value),
                  })
                }
                InputProps={{
                  endAdornment: "đ",
                }}
              />
            </Grid>

            <Grid size={12}>
              <Alert severity="info">
                Thực lĩnh:{" "}
                {(
                  payrollData.baseSalary +
                  payrollData.allowances -
                  payrollData.deductions -
                  payrollData.tax
                ).toLocaleString()}
                đ
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGenerateDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={() => console.log("Generate payroll")}
          >
            Tạo Bảng Lương
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PayrollManagement;
