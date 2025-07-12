// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import * as apiClient from "../../context/AuthContext";
// import { useAppContext } from "../contexts/AppContext";
import { useState } from "react";
import { Button } from "../../common/Button/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Typography } from "@mui/material";
import Modal from "../../common/Modal/Modal";
// import { toast } from "react-toastify";

const SignOut = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (user === null) {
      toast("You are not logged in!", "error");
      return;
    }
    setOpen(true);
  };
  const submitLogout = () => {
    logout();
  };

  return (
    <>
      <Button size="large" onClick={handleClick} label="Sign Out" />
      <Modal
        handleSubmit={submitLogout}
        submitLabel="Oke"
        open={open}
        contentArea={
          <>
            <Typography> Are you want to log out ? </Typography>
          </>
        }
      ></Modal>
    </>
  );
};

export default SignOut;
