import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  Alert,
} from "@mui/material";
import { memo, useCallback } from "react";
import BaseModal from "../../Modal/BaseModal";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import type { PayrollProps } from "../PayrollManagement";
import { Dropdown } from "../../Dropdown/Dropdown";
import InputTextField from "../../Input/InputTextField";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  payrollData: PayrollProps;
  setPayrollData: React.Dispatch<React.SetStateAction<PayrollProps>>;
}

const CreatePayrollModal = ({
  open,
  onClose,
  onSuccess,
  payrollData,
  setPayrollData,
}: IModalStatisticalDataLearningProps) => {
  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={onSuccess}>
          Lưu
        </Button>
      </Box>
    );
  }, [onSuccess]);

  const valueEmployee = [{ value: "ss", label: "ss" }];

  const renderContent = useCallback(() => {
    if (!payrollData) return null;

    return (
      <>
        <Typography component="p" variant="body2" sx={{ mb: 1 }}>
          Thông tin bảng lương
        </Typography>
        <Box
          sx={{
            overflow: "auto",
            maxHeight: "400px",
            scrollbarWidth: "none",
          }}
        >
          <Grid container spacing={3}>
            {/* Nhân viên */}
            <Grid size={12}>
              <FormControl fullWidth>
                <Dropdown
                  options={valueEmployee}
                  placeholder="Chọn nhân viên"
                  onChange={() => {}}
                  value={[]}
                />
              </FormControl>
            </Grid>

            {/* Lương cơ bản */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Lương cơ bản"
                type="number"
                value={payrollData.baseSalary}
                onChange={(e) =>
                  setPayrollData((prev) => ({
                    ...prev,
                    baseSalary: Number(e.target.value),
                  }))
                }
                InputProps={{ endAdornment: <span>đ</span> }}
              />
            </Grid>

            {/* Phụ cấp */}
            <Grid size={12}>
              <InputTextField
                type="number"
                value={String(payrollData.allowances)}
                onChange={(e) =>
                  setPayrollData((prev) => ({
                    ...prev,
                    allowances: Number(e),
                  }))
                }
              />
            </Grid>

            {/* Khấu trừ */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Khấu trừ"
                type="number"
                value={payrollData.deductions}
                onChange={(e) =>
                  setPayrollData((prev) => ({
                    ...prev,
                    deductions: Number(e.target.value),
                  }))
                }
                InputProps={{ endAdornment: <span>đ</span> }}
              />
            </Grid>

            {/* Thuế */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Thuế"
                type="number"
                value={payrollData.tax}
                onChange={(e) =>
                  setPayrollData((prev) => ({
                    ...prev,
                    tax: Number(e.target.value),
                  }))
                }
                InputProps={{ endAdornment: <span>đ</span> }}
              />
            </Grid>

            {/* Thực lĩnh */}
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
      </>
    );
  }, [payrollData, setPayrollData]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Chi tiết bảng lương"
      Icon={PrivacyTipIcon}
      maxWidth="lg"
      sx={{ maxHeight: "600px", width: "lg" }}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(CreatePayrollModal);
