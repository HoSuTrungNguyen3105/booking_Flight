import { useState } from "react";
import { Button } from "../../common/Button/Button";
import { useAuth } from "../../context/AuthContext";
import DialogConfirm from "../../common/Modal/DialogConfirm";

const SignOut = () => {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  const submitLogout = () => {
    logout();
  };
  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Button size="large" onClick={handleClick} label="Sign Out" />
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
