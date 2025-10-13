import { Box, Button, Stack } from "@mui/material";
import { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { EmployeeStatus, type AdminUpdateUserForm } from "../../utils/type";
import { useUpdateUserFromAdmin } from "../Api/usePostApi";
import { useToast } from "../../context/ToastContext";
import SelectDropdown from "../../common/Dropdown/SelectDropdown";
import InputTextField from "../../common/Input/InputTextField";
import {
  mapStringToDropdown,
  useFindAllDepartments,
  useFindAllEmployeeStatuses,
  useFindAllPositions,
} from "../Api/useGetApi";

type AdminUpdateUserFormProps = {
  data: AdminUpdateUserForm;
  onSuccess: () => void;
};

export default function UpdateUserForm({
  data,
  onSuccess,
}: AdminUpdateUserFormProps) {
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      id: data.id,
      department: data.department ?? "",
      position: data.position ?? "",
      status: data.status ?? EmployeeStatus.ACTIVE,
      baseSalary: data.baseSalary ?? 0,
    },
  });

  const { dataEmployeeStatuses } = useFindAllEmployeeStatuses();
  const { dataDepartments } = useFindAllDepartments();
  const { dataPositions } = useFindAllPositions();

  const departmentOptions = mapStringToDropdown(dataDepartments?.data || []);

  const positionOptions = mapStringToDropdown(dataPositions?.data || []);

  const statusOptions = mapStringToDropdown(dataEmployeeStatuses?.data || []);

  const toast = useToast();
  const { refetchUpdateUserFromAdmin } = useUpdateUserFromAdmin();

  const onSubmit = useCallback(
    async (formData: AdminUpdateUserForm) => {
      try {
        await refetchUpdateUserFromAdmin(formData);
        toast(`Cập nhật nhân viên #${formData.id} thành công`, "success");
        onSuccess();
      } catch (error) {
        console.error("Error updating user:", error);
        toast("Cập nhật thất bại", "error");
      }
    },
    [onSuccess, refetchUpdateUserFromAdmin]
  );

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
