import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Stack,
  FormControl,
} from "@mui/material";
import {
  AttachMoney,
  Add,
  Visibility,
  Download,
  CheckCircle,
  VisibilityOff,
} from "@mui/icons-material";
import {
  GridActionsCellItem,
  type GridColDef,
  type GridRowId,
} from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { type GridRowDef } from "../../common/DataGrid/index";
import TableSection from "../../common/CustomRender/TableSection";
import CreatePayrollModal from "../Profile/CreatePayrollModal";
import { useExportPayrollExcel, useGetPayrollData } from "../Api/useGetApi";
import SelectDropdown, {
  type ActionType,
} from "../../common/Dropdown/SelectDropdown";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import InfoPayrollModal from "./modal/InfoPayrollModal";
import FormRow from "../../common/CustomRender/FormRow";

export type EmployeeType = {
  id: number;
  email: string;
  name: string;
  position: string;
  department: string;
  payrolls: Payroll[];
  hireDate: string | null;
};

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
  employee: EmployeeType;
}

export interface GeneratePayroll {
  employeeId: number;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
}

const PayrollManagement = () => {
  const [month, setMonth] = useState<number | undefined>(
    new Date().getMonth() + 1 || undefined
  );
  const [year, setYear] = useState<number | undefined>(
    new Date().getFullYear() || undefined
  );
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [openInfoPayrollDialog, setOpenInfoPayrollDialog] = useState(false);
  const [payrollByEmployeeId, setPayrollByEmployeeId] = useState<number>(0);

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

  const { dataPayroll, refetchPayroll } = useGetPayrollData();

  const rowData = useMemo(
    () =>
      dataPayroll?.list?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [dataPayroll]
  );
  const { exportExcel, loading } = useExportPayrollExcel();

  const [visibleIds, setVisibleIds] = useState<number[]>([]);

  const maskValue = (value: string | number, isVisible: boolean) => {
    if (!value) return "";
    if (isVisible) return value.toString();

    const str = value.toString();
    if (str.length <= 3) return str;
    const visible = str.slice(-3);
    const masked = "*".repeat(str.length - 3);
    return masked + visible;
  };

  const columns: GridColDef[] = [
    {
      field: "employee",
      headerName: "Nhân viên",
      flex: 1,
      renderCell: (params) => {
        const isVisible = visibleIds.includes(params.row.id);
        return maskValue(params.row.employee.name, isVisible);
      },
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
      renderCell: (params) => {
        const isVisible = visibleIds.includes(params.row.id);
        return maskValue(params.value, isVisible);
      },
    },
    {
      field: "allowances",
      headerName: "Phụ cấp",
      flex: 1,
      renderCell: (params) => {
        const isVisible = visibleIds.includes(params.row.id);
        return maskValue(params.value, isVisible);
      },
    },
    {
      field: "deductions",
      headerName: "Khấu trừ",
      flex: 1,
      renderCell: (params) => {
        const isVisible = visibleIds.includes(params.row.id);
        return maskValue(params.value, isVisible);
      },
    },
    {
      field: "tax",
      headerName: "Thuế",
      flex: 1,
      renderCell: (params) => {
        const isVisible = visibleIds.includes(params.row.id);
        return maskValue(params.value, isVisible);
      },
    },
    {
      field: "netPay",
      headerName: "Thực lĩnh",
      flex: 1,
      renderCell: (params) => {
        const isVisible = visibleIds.includes(params.row.id);
        return (
          <Typography variant="subtitle1" color="primary" fontWeight="bold">
            {maskValue(params.value, isVisible)}
          </Typography>
        );
      },
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
        formatDate(DateFormatEnum.DD_MM_YYYY_HH_MM_SS, params.value),
    },
    {
      field: "showAction",
      type: "actions",
      headerName: "Thao tác",
      flex: 1,
      renderCell: (params) => {
        const isVisible = visibleIds.includes(params.row.id);

        const toggleVisibility = () => {
          setVisibleIds((prev) =>
            isVisible
              ? prev.filter((id) => id !== params.row.id)
              : [...prev, params.row.id]
          );
        };

        return [
          <GridActionsCellItem
            key="toggle-visibility"
            icon={isVisible ? <VisibilityOff /> : <Visibility />}
            label={isVisible ? "Ẩn dữ liệu" : "Hiện dữ liệu"}
            onClick={toggleVisibility}
          />,
        ];
      },
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Thao tác",
      flex: 1,
      renderCell: (params) =>
        [
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

  const filteredData = useMemo(() => {
    if (!rowData) return [];
    return rowData.filter((item) => {
      const matchMonth = month ? item.month === month : true;
      const matchYear = year ? item.year === year : true;
      return matchMonth && matchYear;
    });
  }, [rowData, month, year]);

  const handleDownload = (payroll: Payroll) => {
    console.log("Download:", payroll);
  };

  const handleFinalize = (id: number) => {
    console.log("Finalize:", id);
  };

  const [mealRows, setMealRows] = useState<GridRowDef[]>([]);

  const [selectedPayrollRows, setSelectedPayrollRows] = useState<GridRowDef[]>(
    []
  );

  const handleMealRowSelection = (selectedIds: GridRowId[]) => {
    setSelectedPayrollRows((prev) => {
      const newSelectedRows = mealRows.filter((row) =>
        selectedIds.includes(row.id)
      );
      return newSelectedRows;
    });
  };

  return (
    <Box sx={{ height: "70vh" }}>
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
            <FormControl sx={{ minWidth: 150 }}>
              <FormRow direction="column" label="Tháng">
                <SelectDropdown
                  value={month}
                  onChange={(e) => setMonth(Number(e))}
                  placeholder="Tháng"
                  options={monthsOptions}
                />
              </FormRow>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <FormRow direction="column" label="Năm">
                <SelectDropdown
                  value={year}
                  onChange={(e) => setYear(Number(e))}
                  placeholder="Năm"
                  options={options}
                />
              </FormRow>
            </FormControl>
          </Stack>
        </Grid>

        <Grid size={6}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenGenerateDialog(true)}
            size="large"
          >
            Tạo Bảng Lương Mới
          </Button>
        </Grid>

        <Grid size={12}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={exportExcel}
              disabled={loading}
              startIcon={<Download />}
            >
              Export Excel
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Data Grid */}
      <TableSection
        rows={filteredData}
        isLoading={false}
        setRows={setMealRows}
        // handleRowClick={handleOpenModalInfo}
        handleRowClick={(row) => {
          console.log("Row clicked ngoài:", row.id as number);
          setPayrollByEmployeeId(row.id as number);
          setOpenInfoPayrollDialog(true);
        }}
        onSelectedRowIdsChange={handleMealRowSelection}
        nextRowClick
        largeThan
        columns={columns}
      />

      <CreatePayrollModal
        open={openGenerateDialog}
        onClose={() => setOpenGenerateDialog(false)}
        onSuccess={() => setOpenGenerateDialog(false)}
      />

      <InfoPayrollModal
        open={openInfoPayrollDialog}
        payrollId={payrollByEmployeeId}
        onClose={() => {
          setOpenGenerateDialog(false);
          refetchPayroll();
        }}
      />
    </Box>
  );
};

export default PayrollManagement;
