import { useCallback, useEffect, useMemo, useState } from "react";
import { type UserData } from "../../../utils/type";
import { useGetUserList } from "../../../components/Api/useGetApi";
import { useDataSection, type UpdateUserForm } from "./useDataSection";
import { useCreateUserByAdmin } from "../../../components/Api/usePostApi";

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
  const { loadingUser, refetchUser } = useGetUserList();
  const { fetchCreateUser, refetchCreateUser } = useCreateUserByAdmin();

  const [formData, setFormData] = useState<UpdateUserForm>(() => ({
    role: data?.role,
    rank: data?.rank,
    name: data?.name,
    userAlias: data?.createdAt,
    // pictureUrl: (data as any)?.pictureUrl,
  }));

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  useEffect(() => {
    if (!data) return;
    setFormData({
      rank: data.rank ?? "",
      name: data.name ?? "",
      userAlias: data.userAlias ?? "",
      // pictureUrl: (data as any)?.pictureUrl ?? "",
    });
    // reset error khi load data mới
    setError("");
  }, [data]);

  // useDataSection lấy config trực tiếp từ formData để luôn cập nhật
  const formDetailConfig = useDataSection(formData, "update");

  const handleChangeFormInput = (key: keyof UpdateUserForm, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload: UpdateUserForm = {
        name: formData.name,
        userAlias: formData.userAlias,
        rank: formData.rank,
        role: formData.role,
      };

      const res = await refetchCreateUser(payload);
      console.log("payload", payload);
      if (res?.resultCode === "00") {
        onSuccess?.();
        onClose?.();
      } else {
        setError(res?.resultMessage ?? "Cập nhật thất bại");
        console.error("Update user failed:", res);
      }
    } catch (err: any) {
      setError(err?.message ?? "Lỗi khi gọi API");
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
    handleChangeFormInput,
    enableUpdateBtn,
    error,
    formData,
    fetchCreateUser,
    handleChange,
    handleSubmit,
    // fetchUserList,
    loadingUser,
    refetchUser,
  } as const;
};
