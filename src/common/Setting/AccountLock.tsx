import { Box, Button, Divider, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useLockAccount } from "./hooks/useLockAccount";
import type { UserData } from "../../utils/type";
import BaseModal from "../Modal/BaseModal";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserData;
}

const AccountLockModal = ({
  open,
  onClose,
  onSuccess,
  user,
}: IModalStatisticalDataLearningProps) => {
  const { handleLockAccount, title, buttonTitle, subtitle } = useLockAccount({
    onClose,
    onSuccess,
    user,
  });
  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="outlined" onClick={handleLockAccount}>
          {buttonTitle}
        </Button>
      </Box>
    );
  }, [buttonTitle, handleLockAccount]);

  const renderContent = useCallback(() => {
    return (
      <>
        <Divider sx={{ mb: 2, marginTop: 0, marginBottom: "22px" }} />
        <Typography variant="body1">데이터 목록</Typography>
      </>
    );
  }, []);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(AccountLockModal);
