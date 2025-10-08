import { useEffect, useMemo, useState } from "react";
import {
  UserRole,
  type UserCreateProps,
  type UserData,
} from "../../../utils/type";
import {
  useGetUserList,
  useRandomPassword,
} from "../../../components/Api/useGetApi";
import { useDataSection, type UserFormConfig } from "./useDataSection";
import { useCreateUserByAdmin } from "../../../components/Api/usePostApi";
import { useToast } from "../../../context/ToastContext";

interface IUseUpdateUserProps {
  onClose: () => void;
  onSuccess: () => void;
}
export const useCreateUser = ({ onClose, onSuccess }: IUseUpdateUserProps) => {
  //   const api = useApi5();
  const [error, setError] = useState<string>("");
  const { fetchUserList, loadingUser, refetchUser } = useGetUserList();
  const { refetchUserPw } = useRandomPassword();
  const [updateInfo, setUpdateInfo] = useState<UserFormConfig>({
    email: "",
    password: "",
    name: "",
    role: UserRole.USER,
  });

  useEffect(() => {
    const generatePassword = async () => {
      const password = await refetchUserPw();
      if (password) {
        setUpdateInfo((prev) => ({ ...prev, password: password.data }));
      }
    };

    generatePassword();
  }, []);

  const toast = useToast();

  const formDetailConfig = useDataSection(updateInfo, "register");

  const handleChange = (key: string, value: any) => {
    setUpdateInfo((prev) => ({ ...prev, [key]: value }));
  };
  const { fetchCreateUser, refetchCreateUser } = useCreateUserByAdmin();
  const handleSubmit = async () => {
    const payload: UserCreateProps = {
      // name: updateInfo.name,
      // email: updateInfo.email,
      // password: updateInfo.password,
      // role: updateInfo.role,
      ...updateInfo,
    };

    const res = await refetchCreateUser(payload);

    if (res?.resultCode === "00") {
      toast(res.resultMessage, "success");
      onSuccess();
      onClose();
    } else {
      setError(res?.resultMessage || "Error not found");
    }
  };

  // const enableUpdateBtn = useMemo(
  //   () => updateInfo.name?.trim() !== "" || updateInfo?.email?.trim() !== "",
  //   [updateInfo]
  // );

  const handleChangeFormInput = (key: keyof typeof updateInfo, value: any) => {
    setUpdateInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    // isLoading,
    formDetailConfig,
    handleChangeFormInput,
    // enableUpdateBtn,
    updateInfo,
    fetchCreateUser,
    handleChange,
    handleSubmit,
    fetchUserList,
    loadingUser,
    refetchUser,
    error,
    // updateUser: () => updateUser(),
  } as const;
};
