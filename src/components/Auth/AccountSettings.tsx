import { useState } from "react";
import { Box, Stack, Typography, Button, Divider, Alert } from "@mui/material";
import theme from "../../scss/theme";
import InputTextField from "../../common/Input/InputTextField";

const AccountSettings = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleChangeEmail = () => {
    console.log("Submit email:", email);
    // TODO: call API update email
  };

  const handleChangeUsername = () => {
    console.log("Submit username:", username);
    // TODO: call API update username
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác."
      )
    ) {
      console.log("Delete account");
      // TODO: call API delete account
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: "8px 12px",
        border: `1px solid ${theme.palette.grey[200]}`,
        marginBottom: "8px",
      }}
    >
      {/* Change Email */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Change Email
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <InputTextField isEmail value={email} onChange={(e) => setEmail(e)} />
        <Button
          variant="contained"
          onClick={handleChangeEmail}
          sx={{ minWidth: 120 }}
        >
          Submit
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Change Username */}
      {/* <Typography variant="h6" fontWeight="bold" gutterBottom>
        Change Username
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>
        * You may only change your username once every month. <br />* Changing
        username will break links to your old profile.
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <InputTextField value={username} onChange={(e) => setUsername(e)} />
        <Button
          variant="contained"
          onClick={handleChangeUsername}
          sx={{ minWidth: 120 }}
        >
          Submit
        </Button>
      </Stack> */}

      <Divider sx={{ my: 4 }} />

      {/* Delete Account */}
      {/* <Typography variant="h6" fontWeight="bold" color="error" gutterBottom>
        Delete Account
      </Typography>
      <Alert severity="error" sx={{ mb: 2 }}>
        All account deletion requests are permanent. You cannot reactivate or
        recover your account after deletion. Please save any important
        information before proceeding.
      </Alert>
      <Button variant="contained" color="error" onClick={handleDeleteAccount}>
        Delete Account
      </Button> */}
    </Box>
  );
};

export default AccountSettings;
