import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  AttachMoney,
  Add,
  Visibility,
  Download,
  CheckCircle,
  IosShareRounded,
} from "@mui/icons-material";
import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { type GridRowDef } from "../../common/DataGrid/index";
import TableSection from "../Setting/TableSection";
import CreatePayrollModal from "./modal/CreatePayrollModal";
import { useGetPayrollData } from "../../components/Api/useGetApi";
import SelectDropdown, { type ActionType } from "../Dropdown/SelectDropdown";

export interface Payroll {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
  netPay: number;
  status: string; //"DRAFT" | "FINALIZED"
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
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [payrollData, setPayrollData] = useState<PayrollProps>({
    baseSalary: 0,
    allowances: 0,
    deductions: 0,
    tax: 0,
  });

  const options: ActionType[] = [
    { value: 2023, label: "2023" },
    { value: 2024, label: "2024" },
    { value: 2025, label: "2025" },
    { value: 2022, label: "2022" },
    { value: 2021, label: "2021" },
    { value: 2020, label: "2020" },
    { value: 2019, label: "2019" },
    { value: 2018, label: "2018" },
    { value: 2017, label: "2017" },
  ];

  const monthsOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`,
  }));

  const { dataPayrollStatuses } = useGetPayrollData();

  const rowData = useMemo(
    () =>
      dataPayrollStatuses?.list?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [dataPayrollStatuses]
  );

  const maskValue = (value: string | number) => {
    if (!value) return "";
    const str = value.toString();
    if (str.length <= 3) return str;
    const visible = str.slice(-3);
    const masked = "*".repeat(str.length - 3);
    return masked + visible;
  };

  const handleSearch = (month: number, year: number) => {};

  const [showData, setShowData] = useState(false);

  // Data Grid Columns
  const columns: GridColDef[] = [
    {
      field: "employee",
      headerName: "Nhân viên",
      flex: 1,
      renderCell: (params) =>
        showData
          ? params.row.employee.name
          : maskValue(params.row.employee.name),
    },
    {
      field: "period",
      headerName: "Kỳ lương",
      flex: 1,
      renderCell: (params) => (
        <Typography>
          {String(params.row.month).padStart(2, "0")}/{params.row.year}
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
            key="toggle-visibility"
            icon={<Visibility />}
            label={showData ? "Ẩn dữ liệu" : "Hiện dữ liệu"}
            onClick={() => setShowData((prev) => !prev)}
          />,
          <GridActionsCellItem
            key="download"
            icon={<Download />}
            label="Tải về"
            onClick={() => handleDownload(params.row)}
          />,
          params.row.status === "DRAFT" && (
            <GridActionsCellItem
              key="finalize"
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

  useEffect(() => {
    setSelectedMealRows((prev) =>
      prev.filter((selectedRow) =>
        mealRows.some((row) => row.id === selectedRow.id)
      )
    );
  }, [mealRows]);

  return (
    <Box sx={{ height: "70vh" }}>
      {/* Header */}
      <Grid container spacing={3}>
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
              <SelectDropdown
                value={month}
                onChange={(e) => setMonth(Number(e))}
                placeholder="Tháng"
                options={monthsOptions}
              >
                {/* {Array.from({ length: 12 }, (_, i) => ({
                  value: i + 1,
                  label: `Tháng ${i + 1}`,
                })).map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))} */}
              </SelectDropdown>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <Typography variant="body1">Năm</Typography>
              <SelectDropdown
                value={year}
                onChange={(e) => setYear(Number(e))}
                placeholder="Năm"
                options={options}
              />
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
        rows={rowData}
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
        setPayrollData={setPayrollData}
        onSuccess={() => setOpenGenerateDialog(false)}
      />
    </Box>
  );
};

export default PayrollManagement;
