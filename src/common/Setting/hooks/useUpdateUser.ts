import { useCallback, useEffect, useMemo, useState } from "react";
import {
  EmployeeStatus,
  UserRole,
  type AdminUpdateUserForm,
  type UserData,
  type UserRoleType,
} from "../../../utils/type";
import { useDataSection, type UserFormConfig } from "./useDataSection";
import { useUpdateUserFromAdmin } from "../../../components/Api/usePostApi";
import { useToast } from "../../../context/ToastContext";

interface IUseUpdateUserProps {
  onClose: () => void;
  onSuccess: () => void;
  data?: UserData;
}

export const useUpdateUser = ({
  onClose,
  onSuccess,
  data,
}: IUseUpdateUserProps) => {
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<UserFormConfig>({
    id: data?.id,
    role: data?.role as UserRoleType,
    email: data?.email || "",
    password: data?.password,
    name: data?.name,
    department: data?.department ?? "",
    position: data?.position ?? "",
    status: data?.status ?? EmployeeStatus.ACTIVE,
    baseSalary: data?.baseSalary ?? 0,
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!data) return;
    setFormData({
      // rank: data.rank ?? "",
      id: data?.id,
      name: data.name ?? "",
      role: (data.role || UserRole.USER) as UserRoleType,
      email: data.email,
      department: data?.department ?? "",
      position: data?.position ?? "",
      status: data?.status ?? EmployeeStatus.ACTIVE,
      baseSalary: data?.baseSalary ?? 0,
      // userAlias: data.userAlias ?? "",
      // pictureUrl: (data as any)?.pictureUrl ?? "",
    });
    // reset error khi load data mới
    setError("");
  }, [data]);

  const formDetailConfig = useDataSection(formData, "update");

  const { refetchUpdateUserFromAdmin } = useUpdateUserFromAdmin();

  const toast = useToast();

  const handleSubmit = useCallback(async () => {
    //formData: AdminUpdateUserForm
    try {
      const payload: Partial<UserFormConfig> = {
        id: formData.id,
        baseSalary: formData.baseSalary,
        department: formData.department,
        position: formData.position,
        status: formData.status,
        role: formData.role,
      };
      const res = await refetchUpdateUserFromAdmin(payload);
      toast(res?.resultMessage || "Success", "success");
      onSuccess();
    } catch (error) {
      console.error("Error updating user:", error);
      toast("Cập nhật thất bại", "error");
    }
  }, [onSuccess, refetchUpdateUserFromAdmin]);

  // const handleSubmit = async () => {
  //   try {
  //     const payload: UserFormConfig = {
  //       name: formData.name,
  //       email: formData.email,
  //       // userAlias: formData.userAlias,
  //       // rank: formData.rank,
  //       role: formData.role,
  //     };

  // const res = await refetchCreateUser(payload);

  // if (res?.resultCode === "00") {
  //   onSuccess?.();
  //   onClose?.();
  // } else {
  //   setError(res?.resultMessage ?? "Cập nhật thất bại");
  //   console.error("Update user failed:", res);
  // }
  //   } catch (err) {
  //     setError((err as string) ?? "Lỗi khi gọi API");
  //     console.error("Update exception:", err);
  //   }
  // };

  const enableUpdateBtn = useMemo(
    () =>
      (formData.role?.trim() ?? "") !== "" ||
      (formData.name?.trim() ?? "") !== "",
    [formData]
  );

  return {
    formDetailConfig,
    error,
    formData,
    handleChange,
    handleSubmit,
  } as const;
};
