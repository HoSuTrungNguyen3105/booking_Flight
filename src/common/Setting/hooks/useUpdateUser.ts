import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { UseRCreate, UserData, UserRole } from "../../../utils/type";
import { useGetUserList } from "../../../components/Api/useGetApi";
import { useDataSection, type UpdateUserForm } from "./useDataSection";
import { useCreateUserByAdmin } from "../../../components/Api/usePostApi";

interface IUseUpdateUserProps {
  onClose: () => void;
  onSuccess: () => void;
  user?: UserData;
}

// interface UpdateUserForm {
//   roleType?: string;
//   userId?: string;
//   dataQueryPermission: string;
//   userName?: string;
//   userAlias?: string;
// }

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
    password: user?.password,
    mfaEnabledYn: user?.mfaEnabledYn,
    name: user?.name,
    userAlias: user?.userAlias,
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
  const [formData, setFormData] = useState<UseRCreate>({
    // userId: 0,
    // id: 0,
    name: "",
    password: generateRandomPassword(12),
    role: "MEMBER" as UserRole,
    email: "",
    // permissionRole: "",
  });
  // const {  fetchCreateUser,
  // refetchCreateUser, }=useCreateUserByAdmin();
  //   console.log(formData);

  // Hàm cập nhật value
  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const { fetchCreateUser, refetchCreateUser } = useCreateUserByAdmin();
  const handleSubmit = async () => {
    const res = await refetchCreateUser(formData); // truyền dữ liệu vào
    if (res?.resultCode === "00") {
      console.log("Tạo user thành công", res.data);
    } else {
      console.error("Tạo user thất bại", res?.resultMessage);
    }
  };

  const formDetailConfig = useDataSection(formData);

  const enableUpdateBtn = useMemo(
    () =>
      updateInfo.userAlias?.trim() !== "" ||
      updateInfo?.mfaEnabledYn?.trim() !== "",
    [updateInfo]
  );

  const handleChangeFormInput = useCallback(
    (key: keyof UseRCreate, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  //   const { mutateAsync: updateUser, isLoading } = useMutation({
  //     mutationFn: () => api.UserInfo.updateUser(updateInfo),
  //     onSuccess: () => {
  //       onClose();
  //       onSuccess();
  //     },
  //     onError: (error) => {
  //       setError('Failed to update user');
  //       console.error(error);
  //     }
  //   });

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
