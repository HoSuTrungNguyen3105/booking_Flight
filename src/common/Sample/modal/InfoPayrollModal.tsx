import { Box, Grid, Typography } from "@mui/material";
import { memo, useCallback, useEffect } from "react";
import BaseModal from "../../Modal/BaseModal";
import InputTextField from "../../Input/InputTextField";
import MoneyIcon from "../../../svgs/money-euro-banknote.svg";
import { Add as AddIcon } from "@mui/icons-material";
import { useGetPayrollsById } from "../../../components/Api/useGetApi";
import FormRow from "../../CustomRender/FormRow";

interface IModalGeneratePayrollProps {
  open: boolean;
  onClose: () => void;
  payrollId: number;
}

const InfoPayrollModal = ({
  open,
  onClose,
  payrollId,
}: IModalGeneratePayrollProps) => {
  const { dataGetPayrollsById, refetchGetPayrollsById } =
    useGetPayrollsById(payrollId);

  useEffect(() => {
    if (open) {
      refetchGetPayrollsById();
    }
  }, [open]);

  const renderContent = useCallback(() => {
    const payroll = dataGetPayrollsById?.data;
    if (!payroll) return null;

    return (
      <>
        <Typography component="p" variant="body2" sx={{ mb: 1 }}>
          Thông tin bảng lương (Read Only)
        </Typography>
        <Box
          sx={{ overflow: "auto", maxHeight: "400px", scrollbarWidth: "none" }}
        >
          <Grid container spacing={3}>
            {/* Thông tin payroll */}
            <Grid size={5}>
              <FormRow label="Month">
                <InputTextField value={String(payroll.month)} disabled />
              </FormRow>
            </Grid>
            <Grid size={5}>
              <FormRow label="Year">
                <InputTextField value={String(payroll.year)} disabled />
              </FormRow>
            </Grid>
            <Grid size={12}>
              <FormRow label="Lương cơ bản">
                <InputTextField
                  value={String(payroll.baseSalary)}
                  endIcon={
                    <Box
                      component="img"
                      sx={{ height: 22, width: 22 }}
                      src={MoneyIcon}
                    />
                  }
                  disabled
                />
              </FormRow>
            </Grid>
            <Grid size={12}>
              <FormRow label="Phụ cấp">
                <InputTextField
                  value={String(payroll.allowances)}
                  endIcon={
                    <Box
                      component="img"
                      sx={{ height: 22, width: 22 }}
                      src={MoneyIcon}
                    />
                  }
                  disabled
                />
              </FormRow>
            </Grid>
            <Grid size={12}>
              <FormRow label="Khấu trừ">
                <InputTextField
                  value={String(payroll.deductions)}
                  endIcon={
                    <Box
                      component="img"
                      sx={{ height: 22, width: 22 }}
                      src={MoneyIcon}
                    />
                  }
                  disabled
                />
              </FormRow>
            </Grid>
            <Grid size={12}>
              <FormRow label="Thuế">
                <InputTextField
                  value={String(payroll.tax)}
                  endIcon={
                    <Box
                      component="img"
                      sx={{ height: 22, width: 22 }}
                      src={MoneyIcon}
                    />
                  }
                  disabled
                />
              </FormRow>
            </Grid>
            <Grid size={12}>
              <FormRow label="Net Pay">
                <InputTextField value={String(payroll.netPay)} disabled />
              </FormRow>
            </Grid>
            <Grid size={12}>
              <FormRow label="Status">
                <InputTextField value={String(payroll.status)} disabled />
              </FormRow>
            </Grid>

            {/* Thông tin employee */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Thông tin nhân viên
              </Typography>
            </Grid>
            <Grid size={6}>
              <FormRow label="Tên nhân viên">
                <InputTextField value={payroll.employee?.name || ""} disabled />
              </FormRow>
            </Grid>
            <Grid size={6}>
              <FormRow label="Email">
                <InputTextField
                  value={payroll.employee?.email || ""}
                  disabled
                />
              </FormRow>
            </Grid>
            <Grid size={6}>
              <FormRow label="Phòng ban">
                <InputTextField
                  value={payroll.employee?.department || ""}
                  disabled
                />
              </FormRow>
            </Grid>
            <Grid size={6}>
              <FormRow label="Chức vụ">
                <InputTextField
                  value={payroll.employee?.position || ""}
                  disabled
                />
              </FormRow>
            </Grid>

            {/* Lịch sử payrolls */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Lịch sử bảng lương nhân viên
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
                {payroll.employee?.payrolls?.map((p: any) => (
                  <Box
                    key={p.id}
                    sx={{ mb: 1, p: 1, borderBottom: "1px solid #eee" }}
                  >
                    <Typography variant="body2">
                      {p.month}/{p.year} — {p.status} — Net Pay: {p.netPay}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }, [dataGetPayrollsById?.data]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Thông tin bảng lương"
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: null }}
    />
  );
};

export default memo(InfoPayrollModal);
