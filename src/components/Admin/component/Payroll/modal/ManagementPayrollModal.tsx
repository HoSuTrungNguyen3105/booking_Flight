import {
  Box,
  Grid,
  Typography,
  Button,
  FormControl,
  Chip,
} from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import BaseModal from "../../../../../common/Modal/BaseModal";
import { Add as AddIcon } from "@mui/icons-material";
import {
  useGetPayrollsById,
  useGetUserIdAndNameToDropdownGeneratePayroll,
} from "../../../../Api/useGetApi";
import { useGeneratePayroll } from "../../../../Api/usePostApi";
import SelectDropdown from "../../../../../common/Dropdown/SelectDropdown";
import FormRow from "../../../../../common/CustomRender/FormRow";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import InputNumber from "../../../../../common/Input/InputNumber";
import InputTextField from "../../../../../common/Input/InputTextField";
import { useToast } from "../../../../../context/ToastContext";
import type { GeneratePayroll } from "../PayrollManagement";

interface IModalGeneratePayrollProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  payrollId: number;
  mode: "info" | "create";
}

const ManagementPayrollModal = ({
  open,
  mode,
  onClose,
  onSuccess,
  payrollId,
}: IModalGeneratePayrollProps) => {
  const toast = useToast();
  const now = new Date();
  const [payrollData, setPayrollData] = useState<GeneratePayroll>({
    employeeId: 0,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    baseSalary: 0,
    allowances: 0,
    deductions: 0,
    tax: 0,
  });

  const { dataGetPayrollsById, refetchGetPayrollsById } =
    useGetPayrollsById(payrollId);
  const { refetchGeneratePayroll } = useGeneratePayroll();
  const { dataGetUserIdAndNameToDropdown } =
    useGetUserIdAndNameToDropdownGeneratePayroll();

  useEffect(() => {
    if (open && mode === "info") refetchGetPayrollsById();
  }, [open, mode, refetchGetPayrollsById]);

  const handleGeneratePayroll = useCallback(async () => {
    const res = await refetchGeneratePayroll(payrollData);

    if (res?.resultCode === "00") {
      toast(res.resultMessage);
      onSuccess();

      setPayrollData({
        employeeId: 0,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        baseSalary: 0,
        allowances: 0,
        deductions: 0,
        tax: 0,
      });
    } else {
      console.warn("Payroll submission failed:", payrollData);
    }
  }, [payrollData, refetchGeneratePayroll, onSuccess]);

  const renderActions = useCallback(
    () => (
      <Box display="flex" justifyContent="flex-end" gap={1}>
        {mode === "create" && (
          <Button variant="contained" onClick={handleGeneratePayroll}>
            Save
          </Button>
        )}
      </Box>
    ),
    [mode, handleGeneratePayroll]
  );

  const renderPayrollInfo = useCallback(() => {
    const payroll = dataGetPayrollsById?.data;
    if (!payroll) return null;

    const statusColors = {
      paid: "success",
      pending: "warning",
      processing: "info",
      cancelled: "error",
      draft: "default",
    } as const;

    const color =
      statusColors[
        (payroll.status?.toLowerCase() ?? "draft") as keyof typeof statusColors
      ];

    return (
      <Box sx={{ height: "25rem", overflow: "auto" }}>
        <Box sx={{ bgcolor: "primary.50", borderRadius: 2, p: 1, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Tổng lương thực nhận
          </Typography>
          <Chip label={payroll.status} color={color} size="small" />
        </Box>

        <Grid container spacing={2}>
          {[
            { label: "Month", value: payroll.month },
            { label: "Year", value: payroll.year },
            { label: "Lương cơ bản", value: payroll.baseSalary },
            { label: "Phụ cấp", value: payroll.allowances },
            { label: "Khấu trừ", value: payroll.deductions },
            { label: "Thuế", value: payroll.tax },
            { label: "Net Pay", value: payroll.netPay },
            { label: "Status", value: payroll.status },
          ].map((item, i) => (
            <Grid key={i} size={12}>
              <FormRow label={item.label}>
                <InputTextField value={String(item.value)} disabled />
              </FormRow>
            </Grid>
          ))}

          <Grid size={12}>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Thông tin nhân viên
            </Typography>
          </Grid>
          {[
            { label: "Tên nhân viên", value: payroll.employee?.name },
            { label: "Email", value: payroll.employee?.email },
            { label: "Phòng ban", value: payroll.employee?.department },
            { label: "Chức vụ", value: payroll.employee?.position },
          ].map((item, i) => (
            <Grid key={i} size={6}>
              <FormRow label={item.label}>
                <InputTextField value={item.value ?? ""} disabled />
              </FormRow>
            </Grid>
          ))}

          <Grid size={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Lịch sử bảng lương
            </Typography>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
                maxHeight: 200,
                overflow: "auto",
              }}
            >
              {payroll.employee?.payrolls?.map((p) => (
                <Typography key={p.id} variant="body2" sx={{ mb: 0.5 }}>
                  {p.month}/{p.year} — {p.status} — Net Pay: {p.netPay}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }, [dataGetPayrollsById?.data]);

  const renderCreateForm = useCallback(
    () => (
      <>
        <Typography variant="body2" gutterBottom>
          Thông tin bảng lương
        </Typography>

        <Grid container spacing={2}>
          <Grid size={6}>
            <FormRow label="Month">
              <Typography>{payrollData.month}</Typography>
            </FormRow>
          </Grid>
          <Grid size={6}>
            <FormRow label="Year">
              <Typography>{payrollData.year}</Typography>
            </FormRow>
          </Grid>

          <Grid size={12}>
            <FormRow label="Employee Id">
              <SelectDropdown
                options={dataGetUserIdAndNameToDropdown?.list || []}
                placeholder="Chọn nhân viên chưa tạo trong năm nay"
                value={payrollData.employeeId}
                onChange={(val) =>
                  setPayrollData((prev) => ({
                    ...prev,
                    employeeId: Number(val),
                  }))
                }
              />
            </FormRow>
          </Grid>

          {[
            { label: "Lương cơ bản", key: "baseSalary" },
            { label: "Phụ cấp", key: "allowances" },
            { label: "Khấu trừ", key: "deductions" },
            { label: "Thuế", key: "tax" },
          ].map(({ label, key }) => (
            <Grid key={key} size={12}>
              <FormRow label={label}>
                <FormControl fullWidth>
                  <InputNumber
                    size="large"
                    isSeparator
                    placeholder={label}
                    endIcon={<LocalAtmIcon />}
                    value={payrollData[key as keyof GeneratePayroll] as number}
                    onChange={(val) =>
                      setPayrollData((prev) => ({
                        ...prev,
                        [key]: Number(val),
                      }))
                    }
                  />
                </FormControl>
              </FormRow>
            </Grid>
          ))}
        </Grid>
      </>
    ),
    [payrollData, dataGetUserIdAndNameToDropdown]
  );

  /** ========== MAIN RENDER ========== */
  const renderContent = useCallback(() => {
    if (mode === "info") return renderPayrollInfo();
    return renderCreateForm();
  }, [mode, renderPayrollInfo, renderCreateForm]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Bảng lương"
      Icon={AddIcon}
      slots={{
        content: renderContent(),
        actions: renderActions(),
      }}
    />
  );
};

export default memo(ManagementPayrollModal);
