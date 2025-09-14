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
import { useEffect, useState } from "react";
import DataTable, { type GridRowDef } from "../../common/DataGrid/index";
import TableSection from "../Setting/TableSection";
import CreatePayrollModal from "./modal/CreatePayrollModal";

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

export type PayrollProps = {
  baseSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
};

const PayrollManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<number>(0);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [payrollData, setPayrollData] = useState<PayrollProps>({
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
      flex: 1,
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
      flex: 1,
      renderCell: (params) => (
        <Typography>
          {params.row.month}/{params.row.year}
        </Typography>
      ),
    },
    {
      field: "baseSalary",
      headerName: "Lương cơ bản",
      flex: 1,
      renderCell: (params) => (
        <Typography fontWeight="medium">
          {params.value.toLocaleString()}đ
        </Typography>
      ),
    },
    {
      field: "allowances",
      headerName: "Phụ cấp",
      flex: 1,
      renderCell: (params) => `${params.value.toLocaleString()}đ`,
    },
    {
      field: "deductions",
      headerName: "Khấu trừ",
      flex: 1,
      renderCell: (params) => `${params.value.toLocaleString()}đ`,
    },
    {
      field: "tax",
      headerName: "Thuế",
      flex: 1,
      renderCell: (params) => `${params.value.toLocaleString()}đ`,
    },
    {
      field: "netPay",
      headerName: "Thực lĩnh",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="subtitle1" color="primary" fontWeight="bold">
          {params.value.toLocaleString()}đ
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
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
      flex: 1,
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("vi-VN"),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Thao tác",
      flex: 1,
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

  const [mealRows, setMealRows] = useState<GridRowDef[]>([]);

  const [selectedMealRows, setSelectedMealRows] = useState<GridRowDef[]>([]);

  const handleMealRowSelection = (selectedIds: any[]) => {
    setSelectedMealRows((prev) => {
      const newSelectedRows = mealRows.filter((row) =>
        selectedIds.includes(row.id)
      );
      return newSelectedRows;
    });
  };

  // useEffect(() => {
  //   setMealRows(payrolls);
  // }, [payrolls]);

  useEffect(() => {
    setSelectedMealRows((prev) =>
      prev.filter((selectedRow) =>
        mealRows.some((row) => row.id === selectedRow.id)
      )
    );
  }, [mealRows]);

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
      <TableSection
        rows={payrolls}
        isLoading={false}
        setRows={setMealRows}
        onSelectedRowIdsChange={handleMealRowSelection}
        nextRowClick
        largeThan
        columns={columns}
      />

      <CreatePayrollModal
        open={openGenerateDialog}
        onClose={() => setOpenGenerateDialog(false)}
        payrollData={payrollData}
        onSuccess={() => setOpenGenerateDialog(false)}
      />
    </Box>
  );
};

export default PayrollManagement;
