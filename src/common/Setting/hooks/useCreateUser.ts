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
  const { fetchUser, loadingUser, refetchUser } = useGetUserList();
  const { fetchUserPw } = useRandomPassword();
  const [updateInfo, setUpdateInfo] = useState<UserCreateProps>({
    email: user?.email,
    password: fetchUserPw?.data,
    name: user?.name,
    role: user?.role,
  });
  const toast = useToast();
  const [formData, setFormData] = useState<UserCreateProps>(updateInfo);
  //   const formDetailConfig = useDataSection(formData, false);
  const formDetailConfig = useDataSection(formData, "register", false);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const { fetchCreateUser, refetchCreateUser } = useCreateUserByAdmin();
  const handleSubmit = async () => {
    const payload: UserCreateProps = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    const res = await refetchCreateUser(payload);
    console.log("res", res);
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
