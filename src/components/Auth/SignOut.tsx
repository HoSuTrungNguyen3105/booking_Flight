import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DialogConfirm from "../../common/Modal/DialogConfirm";
import { Button } from "@mui/material";

const SignOut = () => {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const submitLogout = () => logout();
  const closeModal = () => setOpen(false);

  return (
    <>
      <Button onClick={handleClick}>Sign Out</Button>
      <DialogConfirm
        onConfirm={submitLogout}
        onClose={closeModal}
        confirmLabel="Confirm"
        cancelLabel="Exit"
        open={open}
        title="Logout confirm"
        message="You will be logged out from your account."
      />
    </>
  );
};

export default SignOut;
