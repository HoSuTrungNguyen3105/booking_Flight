import React, { memo, useCallback, useState } from "react";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Box,
} from "@mui/material";
import {
  WarningAmber as WarningIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import InputTextField from "../../common/Input/InputTextField";
import theme from "../../scss/theme";
import {
  getUserIdByEmail,
  useDeleteMyAccount,
} from "../../context/Api/usePostApi";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const DeleteAccount: React.FC = () => {
  const [email, setEmail] = useState("");
  const { logout } = useAuth();
  const { refetchUserEmailData } = getUserIdByEmail();
  const { refetchDeleteMyAccount } = useDeleteMyAccount();
  const toast = useToast();
  const handleConfirm = useCallback(async () => {
    try {
      const res = await refetchUserEmailData({ email });
      const id = res?.data?.userId;

      if (res?.resultCode === "00" && id) {
        const resDelete = await refetchDeleteMyAccount({ id });

        if (resDelete?.resultCode === "00") {
          toast(resDelete?.resultMessage || "Success");
          logout();
        } else {
          toast(resDelete?.resultMessage || "Error not found", "error");
        }
      } else {
        toast(res?.resultMessage || "Error not found", "error");
      }
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
    }
  }, [email, refetchUserEmailData, refetchDeleteMyAccount]);

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
          Delete Account
        </Typography>
        <Typography variant="body2" color="grey.500">
          Enter your registered email address and employee No.
        </Typography>
      </Box>

      <InputTextField
        isEmail
        value={email}
        onChange={(e) => setEmail(e)}
        placeholder="email@example.com"
        sx={{ mb: 1 }}
      />

      <List dense sx={{ textAlign: "left", mb: 1 }}>
        <ListItem>
          <ListItemIcon>
            <WarningIcon color="warning" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary=" Once you have deleted your account, you will not be able to register with the same email for 30 days." />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckIcon color="success" fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="The email address must be valid, reachable, and not changed for 30 days." />
        </ListItem>
      </List>

      <Button
        variant="contained"
        color="error"
        size="large"
        onClick={handleConfirm}
      >
        Confirmation
      </Button>
    </Box>
    // </Container>
  );
};

export default memo(DeleteAccount);
