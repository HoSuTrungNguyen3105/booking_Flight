import { useEffect, useMemo, useState } from "react";
import { type UseRCreate, type UserData } from "../../../utils/type";
import {
  useGetUserList,
  useRandomPassword,
} from "../../../components/Api/useGetApi";
import { useDataSection, type UpdateUserForm } from "./useDataSection";
import { useCreateUserByAdmin } from "../../../components/Api/usePostApi";

interface IUseUpdateUserProps {
  onClose: () => void;
  onSuccess: () => void;
  user?: UserData;
}
export const useCreateUser = ({
  onClose,
  onSuccess,
  user,
}: IUseUpdateUserProps) => {
  //   const api = useApi5();
  const [error, setError] = useState<string>("");
  const { fetchUser, loadingUser, refetchUser } = useGetUserList();
  const { refetchUserPw, fetchUserPw } = useRandomPassword();
  const [updateInfo, setUpdateInfo] = useState<UseRCreate>({
    role: user?.role,
    password: fetchUserPw?.data,
    email: user?.email,
    name: user?.name,
  });

  const [formData, setFormData] = useState<UseRCreate>(updateInfo);
  //   const formDetailConfig = useDataSection(formData, false);
  const formDetailConfig = useDataSection(formData, "register", false);

  // Hàm cập nhật value
  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const { fetchCreateUser, refetchCreateUser } = useCreateUserByAdmin();
  const handleSubmit = async () => {
    // JSON.stringify(formData);
    const payload: UseRCreate = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role, // đảm bảo đúng kiểu
    };

    const res = await refetchCreateUser(payload); // ✅ Truyền trực tiếp

    if (res?.resultCode === "00") {
      console.log("Tạo user thành công", res.data);
    } else {
      console.error("Tạo user thất bại", res);
    }
  };
  useEffect(() => {
    if (fetchUserPw?.data) {
      setFormData((prev) => ({
        ...prev,
        password: fetchUserPw.data,
      }));
    }
  }, [fetchUserPw]);

  useEffect(() => {
    refetchUserPw();
  }, [refetchUserPw, user]);

  const enableUpdateBtn = useMemo(
    () => updateInfo.name?.trim() !== "" || updateInfo?.email?.trim() !== "",
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
