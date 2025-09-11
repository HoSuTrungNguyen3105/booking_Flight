import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { EmployeeStatus, type AdminUpdateUserForm } from "../../../utils/type";
import { useUpdateUserFromAdmin } from "../../Api/usePostApi";
import { useToast } from "../../../context/ToastContext";
import DateTimePickerComponent from "../../../common/DayPicker/date-range-picker";
import { useGetUserById } from "../../Api/useGetApi";
import SelectDropdown from "../../../common/Dropdown/SelectDropdown";
import InputTextField from "../../../common/Input/InputTextField";

// Danh sách option phòng ban
const departmentOptions = [
  { label: "IT", value: "IT" },
  { label: "HR", value: "HR" },
  { label: "Finance", value: "FINANCE" },
  { label: "Marketing", value: "MARKETING" },
];

// Danh sách option chức vụ
const positionOptions = [
  { label: "Manager", value: "MANAGER" },
  { label: "Staff", value: "STAFF" },
  { label: "Leader", value: "LEADER" },
  { label: "Intern", value: "INTERN" },
];

// Danh sách option trạng thái
const statusOptions = [
  { label: "Đang làm việc", value: EmployeeStatus.ACTIVE },
  { label: "Nghỉ việc", value: EmployeeStatus.INACTIVE },
  { label: "Tạm nghỉ", value: EmployeeStatus.SUSPENDED },
  { label: "Đã chấm dứt", value: EmployeeStatus.TERMINATED },
];

type AdminUpdateUserFormProps = {
  data: AdminUpdateUserForm;
  onSuccess: () => void;
};

export default function UpdateUserForm({
  data,
  onSuccess,
}: AdminUpdateUserFormProps) {
  console.log("Form received data:", data); // Kiểm tra data đầu vào

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      id: data.id,
      department: data.department ?? "",
      position: data.position ?? "",
      status: data.status ?? EmployeeStatus.ACTIVE,
      baseSalary: data.baseSalary ?? 0,
      hireDate: data.hireDate ?? Math.floor(Date.now() / 1000),
    },
  });

  const toast = useToast();
  const {} = useGetUserById(data.id as number);
  const { refetchUpdateUserFromAdmin } = useUpdateUserFromAdmin();

  const onSubmit = async (formData: AdminUpdateUserForm) => {
    try {
      await refetchUpdateUserFromAdmin(formData);
      toast(`Cập nhật nhân viên #${formData.id} thành công`, "success");
      onSuccess();
    } catch (error) {
      console.error("Error updating user:", error);
      toast("Cập nhật thất bại", "error");
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: "background.paper",
        maxWidth: 500,
        mx: "auto",
      }}
    >
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}
      >
        <Stack spacing={2}>
          {/* Department */}
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                {...field}
                options={departmentOptions}
                value={field.value}
                onChange={(val) => setValue("department", String(val))}
              />
            )}
          />

          {/* Position */}
          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                {...field}
                options={positionOptions}
                value={field.value}
                onChange={(val) => setValue("position", String(val))}
              />
            )}
          />

          {/* Hire Date */}
          <Controller
            name="hireDate"
            control={control}
            render={({ field }) => (
              <DateTimePickerComponent
                value={field.value}
                language="vn"
                onChange={(val) => setValue("hireDate", val)}
              />
            )}
          />

          {/* Base Salary - Sử dụng TextField tạm để test */}
          <Controller
            name="baseSalary"
            control={control}
            render={({ field }) => (
              <InputTextField
                {...field}
                type="number"
                value={String(field.value)}
                onChange={(e) => field.onChange(parseFloat(e) || 0)}
              />
            )}
          />

          {/* Status */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SelectDropdown
                {...field}
                options={statusOptions}
                value={field.value}
                onChange={(val) => setValue("status", val as EmployeeStatus)}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              textTransform: "none",
              py: 1,
              fontWeight: "bold",
            }}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
