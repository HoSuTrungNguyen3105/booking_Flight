import { useEffect, useMemo, useState } from "react";
import { type UserCreateProps, type UserData } from "../../../utils/type";
import {
  useGetUserList,
  useRandomPassword,
} from "../../../components/Api/useGetApi";
import { useDataSection } from "./useDataSection";
import { useCreateUserByAdmin } from "../../../components/Api/usePostApi";
import { useToast } from "../../../context/ToastContext";

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
  const { fetchUserList, loadingUser, refetchUser } = useGetUserList();
  const { refetchUserPw } = useRandomPassword();
  const [updateInfo, setUpdateInfo] = useState<UserCreateProps>({
    email: user?.email,
    password: "",
    name: user?.name,
    role: user?.role,
  });
  // Fetch password khi component mount (nếu cần)
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
  // const [formData, setFormData] = useState<UserCreateProps>(updateInfo);
  //   const formDetailConfig = useDataSection(formData, false);
  const formDetailConfig = useDataSection(updateInfo, "register");

  const handleChange = (key: string, value: any) => {
    setUpdateInfo((prev) => ({ ...prev, [key]: value }));
  };
  const { fetchCreateUser, refetchCreateUser } = useCreateUserByAdmin();
  const handleSubmit = async () => {
    const payload: UserCreateProps = {
      name: updateInfo.name,
      email: updateInfo.email,
      password: updateInfo.password,
      role: updateInfo.role,
    };

    const res = await refetchCreateUser(payload);
    if (res?.resultCode === "00") {
      toast(res.resultMessage, "success");
      onSuccess();
    } else {
      toast(res?.resultMessage as string, "info");
    }
  };

  const enableUpdateBtn = useMemo(
    () => updateInfo.name?.trim() !== "" || updateInfo?.email?.trim() !== "",
    [updateInfo]
  );

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
    enableUpdateBtn,
    error,
    updateInfo,
    fetchCreateUser,
    handleChange,
    handleSubmit,
    fetchUserList,
    loadingUser,
    refetchUser,
    // updateUser: () => updateUser(),
  } as const;
};
