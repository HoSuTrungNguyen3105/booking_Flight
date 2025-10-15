import { useEffect, useState } from "react";
import { UserRole, type UserCreateProps } from "../../../utils/type";
import { useRandomPassword } from "../../../components/Api/useGetApi";
import { useDataSection, type UserFormConfig } from "./useDataSection";
import { useCreateUserByAdmin } from "../../../components/Api/usePostApi";
import { useToast } from "../../../context/ToastContext";

interface IUseUpdateUserProps {
  onClose: () => void;
  onSuccess: () => void;
}
export const useCreateUser = ({ onClose, onSuccess }: IUseUpdateUserProps) => {
  //   const api = useApi();
  const [error, setError] = useState<string>("");
  const { refetchUserPw } = useRandomPassword();
  const [updateInfo, setUpdateInfo] = useState<UserFormConfig>({
    email: "",
    password: "",
    name: "",
    role: UserRole.USER,
    employeeNo: "",
  });

  useEffect(() => {
    const generatePassword = async () => {
      const password = await refetchUserPw();
      if (password?.resultCode === "00") {
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
  const { refetchCreateUser } = useCreateUserByAdmin();
  const handleSubmit = async () => {
    if (updateInfo.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateInfo.email)) {
        setError("Invalid email format");
        return;
      }
    }
    const payload: UserCreateProps = {
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

  return {
    error,
    formDetailConfig,
    updateInfo,
    handleChange,
    handleSubmit,
  } as const;
};
