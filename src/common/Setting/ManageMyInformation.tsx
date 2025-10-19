import { Box, Button, Stack } from "@mui/material";
import { useCallback, useState, useEffect } from "react";
import DataAccessPermissionSection from "./DataAccessPermissionSection";
import DialogConfirm from "../Modal/DialogConfirm";
import UserInfoSection from "../../components/User/UserInfoSection";
import { UserRole, type UserData } from "../../utils/type";
import TransferAuthoritySection from "./Component/TransferAuthoritySection";
import { useAuth } from "../../context/AuthContext";
import { useUpdateUserInfo } from "../../components/Api/usePostApi";
import type { TFileUploader } from "../FileUploader/type";

export type UserDataToUpdate = Pick<
  UserData,
  | "id"
  | "name"
  | "phone"
  | "email"
  | "userAlias"
  | "authType"
  | "rank"
  | "role"
  | "hireDate"
  | "baseSalary"
>;

export type UserDataToTransferAdmin = Pick<
  UserData,
  | "id"
  | "name"
  | "role"
  | "employeeNo"
  | "fromTransferAdminUserYn"
  | "toTransferAdminUserYn"
>;

const ManageMyInformation = () => {
  const { user } = useAuth();

  const initialMyInfo: UserDataToUpdate = {
    id: user?.id ?? 0,
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    userAlias: user?.userAlias ?? "",
    authType: user?.authType ?? "",
    rank: user?.rank ?? "",
    role: user?.role ?? UserRole.USER,
    hireDate: user?.hireDate ?? 0,
    baseSalary: user?.baseSalary ?? 0,
  };

  const transferToMyInfo: UserDataToTransferAdmin = {
    id: user?.id ?? 0,
    name: user?.name ?? "",
    role: user?.role ?? UserRole.USER,
    employeeNo: user?.employeeNo ?? "",
    fromTransferAdminUserYn: user?.fromTransferAdminUserYn,
    toTransferAdminUserYn: user?.toTransferAdminUserYn,
  };

  const [myInfo, setMyInfo] = useState<UserDataToUpdate>(initialMyInfo);
  const [hasChanges, setHasChanges] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const { refetchUpdateUserInfo } = useUpdateUserInfo(user?.id as number);

  useEffect(() => {
    setHasChanges(JSON.stringify(myInfo) !== JSON.stringify(user));
  }, [myInfo, user]);

  const handleChange = (field: keyof UserDataToUpdate, value: string) => {
    setMyInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (files: TFileUploader[]) => {
    const file = files[0]?.raw;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setMyInfo((prev) => ({
        ...prev,
        pictureUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateMyInfo = useCallback(async () => {
    try {
      const res = await refetchUpdateUserInfo(myInfo);
      console.log("res", myInfo);
      if (res?.resultCode === "00") {
        setOpenConfirmModal(false);
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  }, [myInfo, refetchUpdateUserInfo]);

  const handleRefresh = useCallback(() => {
    setMyInfo(user as UserDataToUpdate);
    setHasChanges(false);
  }, [user]);

  const renderButtonSection = () => (
    <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2}>
      <Button
        variant="contained"
        disabled={!hasChanges}
        onClick={() => setOpenConfirmModal(true)}
      >
        Save Changes
      </Button>
      <Button variant="outlined" onClick={handleRefresh}>
        Refresh
      </Button>
    </Stack>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: 1,
        borderColor: "divider",
        overflowY: "auto",
        overflowX: "hidden",
        p: 2,
      }}
    >
      <UserInfoSection myInfo={myInfo} onChange={handleChange} />

      {/* <DataAccessPermissionSection /> */}

      <TransferAuthoritySection
        myInfo={transferToMyInfo}
        setOpenModal={() => setOpenConfirmModal(true)}
      />

      {renderButtonSection()}

      <DialogConfirm
        cancelLabel="Cancel"
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={handleUpdateMyInfo}
        title="Xác nhận cập nhật"
        message="Bạn có chắc chắn muốn lưu thay đổi thông tin cá nhân không?"
        confirmLabel="Lưu"
      />
    </Box>
  );
};

export default ManageMyInformation;
