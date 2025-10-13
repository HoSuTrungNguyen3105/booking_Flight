import { Box, Grid, Typography, Button, FormControl } from "@mui/material";
import { memo, useCallback, useState } from "react";
import BaseModal from "../../../common/Modal/BaseModal";
import type { GeneratePayroll } from "../PayrollManagement";
import InputTextField from "../../../common/Input/InputTextField";
import MoneyIcon from "../../../svgs/money-euro-banknote.svg";
import { Add as AddIcon } from "@mui/icons-material";
import { useGetUserIdAndNameToDropdownGeneratePayroll } from "../../Api/useGetApi";
import SelectDropdown from "../../../common/Dropdown/SelectDropdown";
import FormRow from "../../../common/CustomRender/FormRow";

interface IModalGeneratePayrollProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePayrollModal = ({
  open,
  onClose,
  onSuccess,
}: IModalGeneratePayrollProps) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [payrollData, setPayrollData] = useState<GeneratePayroll>({
    employeeId: 0,
    month: month,
    year: year,
    baseSalary: 0,
    allowances: 0,
    deductions: 0,
    tax: 0,
  });
  // const { refetchGeneratePayroll } = useGeneratePayroll();
  const { dataGetUserIdAndNameToDropdown } =
    useGetUserIdAndNameToDropdownGeneratePayroll();
  const handleGeneratePayroll = useCallback(async () => {
    // const res = await refetchGeneratePayroll({
    //   ...payrollData,
    // });
    // if (res?.resultCode === "00") {
    //   // onClose();
    //   onSuccess();
    // } else {
    //   console.log("payrollData", payrollData);
    // }
  }, [onSuccess]);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={handleGeneratePayroll}>
          Save
        </Button>
      </Box>
    );
  }, [handleGeneratePayroll]);

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
            <Grid size={5}>
              <FormRow label="Month">
                <Typography> {payrollData.month}</Typography>
              </FormRow>
            </Grid>
            <Grid size={5}>
              <FormRow label="Year">
                <Typography> {payrollData.year}</Typography>
              </FormRow>
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth>
                <SelectDropdown
                  options={dataGetUserIdAndNameToDropdown?.list || []}
                  placeholder="Chọn nhân viên chua tao trong nam nay"
                  onChange={(val) => {
                    setPayrollData((prev) => ({
                      ...prev,
                      employeeId: Number(val),
                    }));
                  }}
                  value={payrollData.employeeId}
                />
              </FormControl>
            </Grid>

            {/* Lương cơ bản */}
            <Grid size={12}>
              <InputTextField
                placeholder="Lương cơ bản"
                type="number"
                value={String(payrollData.baseSalary)}
                endIcon={
                  <Box
                    component={"img"}
                    sx={{ height: 22, width: 22 }}
                    src={MoneyIcon}
                  />
                }
                onChange={(e) =>
                  setPayrollData((prev) => ({
                    ...prev,
                    baseSalary: Number(e),
                  }))
                }
              />
            </Grid>

            {/* Phụ cấp */}
            <Grid size={12}>
              <InputTextField
                type="number"
                value={String(payrollData.allowances)}
                endIcon={
                  <Box
                    component={"img"}
                    sx={{ height: 22, width: 22 }}
                    src={MoneyIcon}
                  />
                }
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
              <InputTextField
                type="number"
                value={String(payrollData.deductions)}
                endIcon={
                  <Box
                    component={"img"}
                    sx={{ height: 22, width: 22 }}
                    src={MoneyIcon}
                  />
                }
                onChange={(e) =>
                  setPayrollData((prev) => ({
                    ...prev,
                    deductions: Number(e),
                  }))
                }
              />
            </Grid>

            {/* Thuế */}
            <Grid size={12}>
              <InputTextField
                type="number"
                value={String(payrollData.tax)}
                endIcon={
                  <Box
                    component={"img"}
                    sx={{ height: 22, width: 22 }}
                    src={MoneyIcon}
                  />
                }
                onChange={(e) =>
                  setPayrollData((prev) => ({
                    ...prev,
                    tax: Number(e),
                  }))
                }
              />
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }, [payrollData, setPayrollData, dataGetUserIdAndNameToDropdown?.list]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Generate bảng lương"
      Icon={AddIcon}
      // maxWidth="lg"
      // sx={{ maxHeight: "600px", width: "lg" }}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(CreatePayrollModal);
