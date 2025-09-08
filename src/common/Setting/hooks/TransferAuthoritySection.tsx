import { Box, Button, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import { UserRole, type UserData } from "../../../utils/type";
import theme from "../../../scss/theme";

interface ITransferAuthoritySectionProps {
  myInfo?: UserData;
  setOpenModal: (type: "approve" | "transfer") => void;
}

const TransferAuthoritySection = ({
  myInfo,
  setOpenModal,
}: ITransferAuthoritySectionProps) => {
  const isAdmin = myInfo?.userRole === UserRole.ADMIN;
  const canTransferAdmin =
    isAdmin &&
    myInfo.fromTransferAdminUserYn === "N" &&
    myInfo.toTransferAdminUserYn !== "Y";
  const isProgressTransferAdmin =
    isAdmin &&
    myInfo.fromTransferAdminUserYn === "Y" &&
    myInfo.toTransferAdminUserYn === "N";

  if (!canTransferAdmin && !isProgressTransferAdmin) return null;

  const handleButtonClick = useCallback(() => {
    isAdmin ? setOpenModal("transfer") : setOpenModal("approve");
  }, [isAdmin, setOpenModal]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: "8px 12px",
        border: `1px solid ${theme.palette.grey[200]}`,
        marginBottom: "8px",
      }}
    >
      <Box mb={1}>
        <Typography component="p" variant="subtitle1" fontWeight="bold">
          권한 이관
        </Typography>
        <Typography variant="body2" color="grey.500">
          관리자 권한은 한 명만 가능합니다. 관리자 권한 이관 과정은 받는 사람이
          확인될 때 까지 유지됩니다.
        </Typography>
        {isProgressTransferAdmin && (
          <Typography variant="body2" color="grey.500">
            권한 이관 요청이 진행중입니다.
          </Typography>
        )}
      </Box>

      <Button variant="contained" onClick={handleButtonClick}>
        {isAdmin ? "권한 이관 요청" : "권한 이관 승인"}
      </Button>
    </Box>
  );
};

export default memo(TransferAuthoritySection);
