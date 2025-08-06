import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
  UserRole,
  type UseRCreate,
  type UserData,
  type UserRoleType,
} from "../../../utils/type";
import { useGetUserList } from "../../../components/Api/useGetApi";
import { useDataSection, type UpdateUserForm } from "./useDataSection";
import { useCreateUserByAdmin } from "../../../components/Api/usePostApi";

interface IUseUpdateUserProps {
  onClose: () => void;
  onSuccess: () => void;
  user?: UserData;
}
export const useUpdateUser = ({
  onClose,
  onSuccess,
  user,
}: IUseUpdateUserProps) => {
  //   const api = useApi5();
  const [error, setError] = useState<string>("");
  const { fetchUser, loadingUser, refetchUser } = useGetUserList();
  const [updateInfo, setUpdateInfo] = useState<UpdateUserForm>({
    role: user?.role,
    // password: user?.password,
    rank: user?.rank,
    mfaEnabledYn: user?.mfaEnabledYn,
    name: user?.name,
    userAlias: user?.userAlias,
    email: user?.email,
  });
  function generateRandomPassword(length: number = 8): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
      password += randomChar;
    }
    return password;
  }
  const defaultFormData = {
    name: "",
    password: generateRandomPassword(12),
    email: "",
    role: UserRole.USER, // dùng enum
  };

  const [formData, setFormData] = useState<UseRCreate>(defaultFormData);
  //   const formDetailConfig = useDataSection(formData, false);
  const formDetailConfig = useDataSection(formData, true, {
    password: { disabled: true }, // ẩn hoặc khóa password khi update
    email: { disabled: true }, // không cho sửa email
  });

  // Hàm cập nhật value
  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const { fetchCreateUser, refetchCreateUser, setParamsUser } =
    useCreateUserByAdmin();
  const handleSubmit = async () => {
    // JSON.stringify(formData);
    const payload: UseRCreate = {
      name: formData.name,
      password: formData.password,
      email: formData.email,
      role: formData.role, // đảm bảo đúng kiểu
    };
    setParamsUser(payload);

    const res = await refetchCreateUser(payload); // ✅ Truyền trực tiếp

    console.log(setParamsUser(payload));
    if (res?.resultCode === "00") {
      console.log("Tạo user thành công", res.data);
    } else {
      console.error("Tạo user thất bại", res);
    }
  };

  const enableUpdateBtn = useMemo(
    () =>
      updateInfo.userAlias?.trim() !== "" ||
      updateInfo?.mfaEnabledYn?.trim() !== "",
    [updateInfo]
  );

  const handleChangeFormInput = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    // isLoading,
    formDetailConfig,
    handleChangeFormInput,
    enableUpdateBtn,
    error,
    formData,
    fetchCreateUser,
    handleChange,
    handleSubmit,
    fetchUser,
    loadingUser,
    refetchUser,
    // updateUser: () => updateUser(),
  } as const;
};
