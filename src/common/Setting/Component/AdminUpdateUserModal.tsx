import { Box, Button, Stack, Typography } from "@mui/material";
import { memo, useCallback, useState } from "react";
import BaseModal from "../../Modal/BaseModal";
import AddIcon from "@mui/icons-material/Add";
import type { UserData } from "../../../utils/type";
import InputTextField from "../../Input/InputTextField";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  data?: UserData;
}

const AdminUpdateUserModal = ({
  data,
  open,
  onClose,
  onSuccess,
}: IModalStatisticalDataLearningProps) => {
  const [inputId, setInputId] = useState<string>("");

  const handleSubmit = useCallback(async () => {
    if (String(data?.id) === inputId) {
      onSuccess();
    }
  }, [data?.id, inputId, onSuccess, onClose]);

  const renderActions = useCallback(() => {
    if (inputId !== String(data?.id)) {
      return null;
    }
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="contained" sx={{ p: 0.5 }} onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    );
  }, [handleSubmit]);

  const renderContent = useCallback(() => {
    return (
      <Stack spacing={2}>
        <Typography variant="body1">
          Nhập ID xác nhận tài khoản. Ex : {String(data?.id)}
        </Typography>
        <InputTextField
          value={inputId}
          onChange={setInputId}
          placeholder="Nhập ID tại đây"
          sx={{ mt: 2 }}
        />
      </Stack>
    );
  }, [inputId, data]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={`Update user from ADMIN`}
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(AdminUpdateUserModal);
