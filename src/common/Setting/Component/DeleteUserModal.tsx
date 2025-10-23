import { Box, Button, Divider, Typography, TextField } from "@mui/material";
import { memo, useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import type { UserData } from "../../../utils/type";
import BaseModal from "../../Modal/BaseModal";
import { useDeleteUserById } from "../../../context/Api/usePostApi";
import theme from "../../../scss/theme";

interface IDeleteAccountModalProps {
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
}: IDeleteAccountModalProps) => {
  const { refetchDeleteUser } = useDeleteUserById();
  const [inputId, setInputId] = useState<string>("");

  const onDeleteOnChange = useCallback(async () => {
    if (String(user?.id) === inputId) {
      const res = await refetchDeleteUser({ id: Number(inputId) });
      console.log("res", res);
      if (res?.resultCode === "00") {
        onSuccess();
        onClose();
      }
    }
  }, [user?.id, inputId, onSuccess, onClose, refetchDeleteUser]);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        {String(user?.id) === inputId && (
          <Button
            variant="contained"
            sx={{ backgroundColor: theme.palette.error.main }}
            onClick={onDeleteOnChange}
          >
            Delete
          </Button>
        )}
      </Box>
    );
  }, [user?.id, inputId]);

  const renderContent = useCallback(() => {
    return (
      <>
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
      </>
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
