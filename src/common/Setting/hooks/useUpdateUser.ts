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
  const { fetchUser, loadingUser, refetchUser } = useGetUserList();
  const { fetchCreateUser, refetchCreateUser } = useCreateUserByAdmin();

  // formData là nguồn truth, khởi tạo từ data nếu có, hoặc defaults
  const [formData, setFormData] = useState<UpdateUserForm>(() => ({
    role: data?.role,
    rank: data?.rank ?? "",
    name: data?.name ?? "",
    userAlias: data?.userAlias ?? "",
    pictureUrl: (data as any)?.pictureUrl ?? "",
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
      pictureUrl: (data as any)?.pictureUrl ?? "",
    });
    // reset error khi load data mới
    setError("");
  }, [data]);

  // useDataSection lấy config trực tiếp từ formData để luôn cập nhật
  const formDetailConfig = useDataSection(formData, "update", true);

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
        role: formData.role as any,
        pictureUrl: formData.pictureUrl,
      };

      // Nếu anh có API update riêng thì gọi API update ở đây (không dùng create)
      const res = await refetchCreateUser(payload); // giữ như anh đang dùng; đổi thành update API nếu cần

      if (res?.resultCode === "00") {
        // success: gọi callback cha để refresh và đóng modal
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
      (formData.userAlias?.trim() ?? "") !== "" ||
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
    fetchUser,
    loadingUser,
    refetchUser,
  } as const;
};
