import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import type { UserData } from "../../utils/type";
import BaseModal from "../Modal/BaseModal";
import { useDeleteUserById } from "../../components/Api/useDeleteApi";

interface IModalStatisticalDataLearningProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserData;
}

const DeleteAccountModal = ({
  open,
  onClose,
  onSuccess,
  user,
}: IModalStatisticalDataLearningProps) => {
  const { refetchDeleteUser } = useDeleteUserById(user?.id);
  const [inputId, setInputId] = useState("");

  const onDeleteOnChange = () => {
    refetchDeleteUser();
    onSuccess?.();
    onClose();
  };

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        {String(user?.id) === inputId && (
          <Button variant="outlined" color="error" onClick={onDeleteOnChange}>
            Delete
          </Button>
        )}
      </Box>
    );
  }, [user?.id, inputId]);

  const renderContent = useCallback(() => {
    return (
      <Box>
        <Divider sx={{ mb: 2, marginTop: 0, marginBottom: "22px" }} />
        <Typography variant="body1">
          Nhập ID <strong>{user?.id}</strong> để xác nhận xóa tài khoản.
        </Typography>
        <TextField
          fullWidth
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          placeholder="Nhập ID tại đây"
          sx={{ mt: 2 }}
        />
      </Box>
    );
  }, [user?.id, inputId]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Delete"
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(DeleteAccountModal);
