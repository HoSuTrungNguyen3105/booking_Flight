import { useEffect, useMemo, useState } from "react";
import {
  UserRole,
  type UserData,
  type UserRoleType,
} from "../../../utils/type";
import { useDataSection, type UserFormConfig } from "./useDataSection";

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
    role: data?.role as UserRoleType,
    email: data?.email || "",
    password: data?.password,
    name: data?.name,
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  useEffect(() => {
    if (!data) return;
    setFormData({
      // rank: data.rank ?? "",
      name: data.name ?? "",
      role: (data.role || UserRole.USER) as UserRoleType,
      email: data.email,
      // userAlias: data.userAlias ?? "",
      // pictureUrl: (data as any)?.pictureUrl ?? "",
    });
    // reset error khi load data mới
    setError("");
  }, [data]);

  const formDetailConfig = useDataSection(formData, "update");

  const handleSubmit = async () => {
    try {
      const payload: UserFormConfig = {
        name: formData.name,
        email: formData.email,
        // userAlias: formData.userAlias,
        // rank: formData.rank,
        role: formData.role,
      };

      // const res = await refetchCreateUser(payload);

      // if (res?.resultCode === "00") {
      //   onSuccess?.();
      //   onClose?.();
      // } else {
      //   setError(res?.resultMessage ?? "Cập nhật thất bại");
      //   console.error("Update user failed:", res);
      // }
    } catch (err) {
      setError((err as string) ?? "Lỗi khi gọi API");
      console.error("Update exception:", err);
    }
  };

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
