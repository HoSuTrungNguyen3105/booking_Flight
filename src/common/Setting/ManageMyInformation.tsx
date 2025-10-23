import { Box, Button, Stack } from "@mui/material";
import { useCallback, useState, useEffect, useMemo, memo } from "react";
import DialogConfirm from "../Modal/DialogConfirm";
import UserInfoSection from "../../components/User/UserInfoSection";
import TransferAuthoritySection from "./TransferAuthoritySection";
import { useAuth } from "../../context/AuthContext";
import { useUpdateUserInfo } from "../../context/Api/usePostApi";
import { UserRole, type UserData } from "../../utils/type";
import DataAccessPermissionSection from "./DataAccessPermissionSection";
import DeleteAccount from "../../components/Auth/DeleteAccount";
import ChangePasswordInProfile from "../../components/Profile/ChangePasswordInProfile";
import AccountSettings from "../../components/Auth/AccountSettings";

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
  const [mode, setMode] = useState<"info" | "action" | "update">("info");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const userId = user?.id ?? 0;
  const { refetchUpdateUserInfo } = useUpdateUserInfo(userId);

  const initialMyInfo = useMemo<UserDataToUpdate>(
    () => ({
      id: userId,
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      userAlias: user?.userAlias ?? "",
      authType: user?.authType ?? "",
      rank: user?.rank ?? "",
      role: user?.role ?? UserRole.USER,
      hireDate: user?.hireDate ?? 0,
      baseSalary: user?.baseSalary ?? 0,
    }),
    [user, userId]
  );

  const transferToMyInfo = useMemo<UserDataToTransferAdmin>(
    () => ({
      id: userId,
      name: user?.name ?? "",
      role: user?.role ?? UserRole.USER,
      employeeNo: user?.employeeNo ?? "",
      fromTransferAdminUserYn: user?.fromTransferAdminUserYn,
      toTransferAdminUserYn: user?.toTransferAdminUserYn,
    }),
    [user, userId]
  );

  const [myInfo, setMyInfo] = useState<UserDataToUpdate>(initialMyInfo);

  useEffect(() => {
    setHasChanges(JSON.stringify(myInfo) !== JSON.stringify(initialMyInfo));
  }, [myInfo, initialMyInfo]);

  const handleChange = (field: keyof UserDataToUpdate, value: string) => {
    setMyInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateMyInfo = useCallback(async () => {
    try {
      const res = await refetchUpdateUserInfo(myInfo);
      if (res?.resultCode === "00") {
        setOpenConfirmModal(false);
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  }, [myInfo, refetchUpdateUserInfo]);

  const handleRefresh = useCallback(() => {
    setMyInfo(initialMyInfo);
    setHasChanges(false);
  }, [initialMyInfo]);

  const renderButtonSection = useCallback(
    () => (
      <Stack direction="row" justifyContent="space-between" mt={0.5}>
        <Stack direction="row" spacing={1}>
          <Button
            variant={mode === "info" ? "contained" : "outlined"}
            onClick={() => setMode("info")}
          >
            Info Mode
          </Button>
          <Button
            variant={mode === "update" ? "contained" : "outlined"}
            onClick={() => setMode("update")}
          >
            Transfer Mode
          </Button>
          <Button
            variant={"contained"}
            color="error"
            onClick={() => setMode("action")}
          >
            Action Mode
          </Button>
        </Stack>
        <Stack direction="row" spacing={1}>
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
      </Stack>
    ),
    [mode, setMode, handleRefresh, hasChanges]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "85vh",
      }}
    >
      {mode === "info" && (
        <>
          <UserInfoSection myInfo={myInfo} onChange={handleChange} />
          <DataAccessPermissionSection />
        </>
      )}

      {mode === "action" && (
        <>
          <TransferAuthoritySection
            myInfo={transferToMyInfo}
            setOpenModal={() => setOpenConfirmModal(true)}
          />
          <ChangePasswordInProfile />
        </>
      )}

      {mode === "update" && (
        <>
          <DeleteAccount />
          <AccountSettings />
        </>
      )}

      {renderButtonSection()}

      <DialogConfirm
        cancelLabel="Cancel"
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={handleUpdateMyInfo}
        title="Confirm update"
        message="Are you sure you want to save changes to your personal information?"
        confirmLabel="Save"
      />
    </Box>
  );
};

export default memo(ManageMyInformation);
