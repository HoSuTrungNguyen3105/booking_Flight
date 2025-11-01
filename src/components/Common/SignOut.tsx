import { memo, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import DialogConfirm from "../../common/Modal/DialogConfirm";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const SignOut = () => {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleConfirm = useCallback(() => {
    logout();
    handleClose();
  }, [logout, handleClose]);

  return (
    <>
      <Button onClick={handleOpen} startIcon={<LogoutIcon />}>
        Sign Out
      </Button>
      <DialogConfirm
        open={open}
        onConfirm={handleConfirm}
        onClose={handleClose}
        confirmLabel="Confirm"
        cancelLabel="Exit"
        title="Logout confirm"
        message="You will be logged out from your account."
      />
    </>
  );
};

export default memo(SignOut);
