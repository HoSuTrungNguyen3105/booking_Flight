import { useCallback, useEffect, useState } from "react";
import {
  EmployeeStatus,
  UserRole,
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
      console.log("payload", payload);
      toast(res?.resultMessage || "Success", "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      toast("Cập nhật thất bại", "error");
    }
  }, [formData, onSuccess, refetchUpdateUserFromAdmin, toast]);

  return {
    formDetailConfig,
    error,
    formData,
    handleChange,
    handleSubmit,
  } as const;
};
