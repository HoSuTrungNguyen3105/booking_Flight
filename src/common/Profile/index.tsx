import { useCallback, useState } from "react";
import { Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext.tsx";
import { DateFormatEnum, formatDate } from "../../hooks/format.ts";
import UpdateUserModal from "../Setting/hooks/UpdateUserModal.tsx";
import { Button } from "../Button/Button.tsx";
import type { UserData } from "../../utils/type.ts";
import type { IDetailItem } from "../DetailSection/index.tsx";
import DetailSection from "../DetailSection/index.tsx";

const ProfileUser = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const renderDataGrid = useCallback(() => {
    const detailInfoProfile: IDetailItem[] = [
      { title: "id", description: user?.id },
      { title: "name", description: user?.name },
      { title: "mfaEnabledYn", description: user?.mfaEnabledYn },
      { title: "email", description: user?.email },
      { title: "role", description: user?.role },
      {
        title: "createdAt",
        description: formatDate(
          DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
          user?.createdAt
        ),
      },
      {
        title: "updatedAt",
        description: formatDate(
          DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
          user?.updatedAt
        ),
      },
    ];
    return (
      <Box sx={{ height: "auto", width: "100%" }}>
        <DetailSection data={detailInfoProfile} />
        <Button
          label="Cập nhật thông tin"
          sx={{ mt: 2 }}
          onClick={() => setOpen(true)}
        />
      </Box>
    );
  }, []);
  return (
    <div>
      {renderDataGrid()}
      <UpdateUserModal
        onSuccess={() => setOpen(false)}
        open={open}
        data={user as UserData}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default ProfileUser;
