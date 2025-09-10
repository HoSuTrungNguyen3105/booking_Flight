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
  { label: "Finance", value: "Finance" },
  { label: "Marketing", value: "Marketing" },
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
};

export default function UpdateUserForm({ data }: AdminUpdateUserFormProps) {
  const [userState, setUserState] = useState<AdminUpdateUserForm>(data);

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      id: data.id,
      department: data.department ?? "", // nếu có thì bind, ko thì rỗng
      position: data.position ?? "",
      status: data.status ?? EmployeeStatus.ACTIVE,
      baseSalary: data.baseSalary ?? undefined,
      hireDate: data.hireDate ?? Math.floor(Date.now() / 1000), // default now
    },
  });

  const toast = useToast();
  const {} = useGetUserById(data.id as number);
  const { refetchUpdateUserFromAdmin } = useUpdateUserFromAdmin();

  const onSubmit = async (formData: AdminUpdateUserForm) => {
    const payload = {
      ...formData,
      // convert hireDate từ string yyyy-MM-dd -> timestamp (giây)
      // hireDate: formData.hireDate
      //   ? Math.floor(new Date(formData.hireDate).getTime() / 1000)
      //   : 0,
    };
    await refetchUpdateUserFromAdmin(payload);
    console.log("spe", payload);
    toast(`Cập nhật nhân viên #${data.id} thành công`, "success");
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
      <Box pr={2} mb={2}>
        {JSON.stringify(data)}
      </Box>

      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {/* onSubmit={handleSubmit(onSubmit)} */}
        <Stack spacing={2}>
          {/* Department */}

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
                {...field}
                language="vn"
                onChange={(val) => setValue("hireDate", val)} // parent update value
              />
            )}
          />

          {/* Base Salary */}
          <Controller
            name="baseSalary"
            control={control}
            render={({ field }) => (
              <InputTextField
                {...field}
                value={String(field.value)}
                clearable
                type="password"
                showEyeIcon
              />
            )}
          />

          {/* Status */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              // <TextField {...field} select label="Trạng thái" fullWidth>
              //   {statusOptions.map((opt) => (
              //     <MenuItem key={opt.value} value={opt.value}>
              //       {opt.label}
              //     </MenuItem>
              //   ))}
              // </TextField>
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
              borderRadius: 2,
              textTransform: "none",
              py: 1,
              fontWeight: "bold",
            }}
          >
            Lưu thay đổi
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
