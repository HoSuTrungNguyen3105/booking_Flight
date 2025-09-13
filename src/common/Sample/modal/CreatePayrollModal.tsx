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
import { memo, useCallback, useMemo } from "react";
import type { GridRowDef } from "../../DataGrid";
import BaseModal from "../../Modal/BaseModal";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import type { PayrollProps } from "../PayrollManagement";
interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  payrollData: PayrollProps;
  //   selectedRows: GridRowDef;
}

const CreatePayrollModal = ({
  open,
  onClose,
  onSuccess,
  //   selectedRows,
  payrollData,
}: IModalStatisticalDataLearningProps) => {
  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={() => {}} />
      </Box>
    );
  }, []);

  const renderContent = useCallback(() => {
    const columnsSubFileList = useMemo(
      () => [
        { field: "category", headerName: "유형", flex: 1 },
        { field: "fileName", headerName: "파일 이름", flex: 1 },
      ],
      []
    );

    const renderRows = (data: PayrollProps) => {
      if (!data) return null;
      return (
        <Box
          sx={{
            overflow: "auto", // Cho phép cuộn
            maxHeight: "400px", // Hoặc bất kỳ chiều cao nào bạn muốn
            scrollbarWidth: "none",
          }}
        >
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Nhân viên</InputLabel>
                {/* <Select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(Number(e.target.value))}
                  label="Nhân viên"
                >
                  <MenuItem value={1}>Nguyễn Văn A (NV001)</MenuItem>
                  <MenuItem value={2}>Trần Thị B (NV002)</MenuItem>
                </Select> */}
              </FormControl>
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Tháng</InputLabel>
                {/* <Select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  label="Tháng"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </MenuItem>
                  ))}
                </Select> */}
              </FormControl>
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Năm</InputLabel>
                {/* <Select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  label="Năm"
                >
                  {[2023, 2024, 2025].map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select> */}
              </FormControl>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Lương cơ bản"
                type="number"
                value={payrollData.baseSalary}
                onChange={
                  (e) => {}
                  //   setPayrollData({
                  //     ...payrollData,
                  //     baseSalary: Number(e.target.value),
                  //   })
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
                onChange={
                  (e) => {}
                  //   setPayrollData({
                  //     ...payrollData,
                  //     allowances: Number(e.target.value),
                  //   })
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
                onChange={
                  (e) => {}
                  //   setPayrollData({
                  //     ...payrollData,
                  //     deductions: Number(e.target.value),
                  //   })
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
                onChange={
                  (e) => {}
                  //   setPayrollData({
                  //     ...payrollData,
                  //     tax: Number(e.target.value),
                  //   })
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
        </Box>
      );
    };

    return (
      <>
        <Typography component="p" variant="body2">
          기본 정보
        </Typography>
        {renderRows(payrollData)}
      </>
    );
  }, [payrollData]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`원본 데이터, 통계 데이터 학습 Seq 상세 정보`}
      Icon={PrivacyTipIcon}
      maxWidth="lg"
      sx={{ maxHeight: "600px", maxWidth: "lg", width: "lg" }}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(CreatePayrollModal);
