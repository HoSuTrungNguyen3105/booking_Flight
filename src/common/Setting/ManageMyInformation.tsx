import { Box, Button, Stack } from "@mui/material";
import { useCallback, useState } from "react";
import DataAccessPermissionSection from "./DataAccessPermissionSection";
import DialogConfirm from "../Modal/DialogConfirm";
import UserInfoSection from "./UserInfoSection";
import { type UserData, type UserUpdateProps } from "../../utils/type";
import TransferAuthoritySection from "./Component/TransferAuthoritySection";
import { useAuth } from "../../context/AuthContext";
import { useUpdateUserInfo } from "../../components/Api/usePostApi";
import type { TFileUploader } from "../FileUploader/type";

const ManageMyInformation = () => {
  const { user } = useAuth();
  const [hasChanges, setHasChanges] = useState(false);
  const [toggleOpenModal, setToggleOpenModal] = useState(false);
  const { refetchUpdateUserInfo } = useUpdateUserInfo(user?.id as number);
  const [myInfo, setMyInfo] = useState<UserUpdateProps>(user as UserData);

  const handleChange = (field: keyof UserData, value: string) => {
    setMyInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (files: TFileUploader[]) => {
    const file = files[0]?.raw;
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result as string;

      setMyInfo((prev) => ({
        ...prev,
        pictureUrl: base64Image,
      }));
    };
  };

  const handleUpdateMyInfo = useCallback(async () => {
    console.log("myInfo", myInfo);
    const res = await refetchUpdateUserInfo(myInfo);
    console.log("res", res);
  }, [myInfo, refetchUpdateUserInfo]);

  const handleRefresh = useCallback(() => {}, []);

  const renderButtonSection = useCallback(() => {
    return (
      <Stack
        direction="row"
        spacing={1}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <Stack direction="row" spacing={1} justifyContent={"flex-end"}>
          <Button variant="contained" onClick={handleUpdateMyInfo}>
            Save Changes
          </Button>
          <Button variant="outlined" onClick={handleRefresh}>
            Refresh
          </Button>
        </Stack>
      </Stack>
    );
  }, [hasChanges]);

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
      }}
    >
      <UserInfoSection myInfo={myInfo as UserData} onChange={handleChange} />
      {/* <ManagePathAdminSection /> */}
      <DataAccessPermissionSection />

      <TransferAuthoritySection
        myInfo={myInfo as UserData}
        setOpenModal={() => setToggleOpenModal(!toggleOpenModal)}
      />

      {/* <TimeInfoSection /> */}

      {renderButtonSection()}

      <DialogConfirm
        icon="warning"
        cancelLabel="Exit"
        open={toggleOpenModal}
        onClose={() => setToggleOpenModal(false)}
        onConfirm={() => {}}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn thực hiện hành động này không?"
        confirmLabel="Xác nhận"
      />
    </Box>
  );
};

export default ManageMyInformation;
