import React, { useState } from "react";
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
} from "@mui/material";
import {
  WarningAmber as WarningIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";

const DeleteAccount: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleConfirm = () => {
    // if (!email) {
    //   alert("Vui lòng nhập email!");
    //   return;
    // }
    // Call API xóa account
    console.log("Delete account for:", email);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          border: "1px solid #cfd8dc",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom color="error">
          Delete Account
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Enter your registered email address and employee No.
        </Typography>

        <TextField
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          variant="outlined"
          sx={{ mb: 3 }}
        />

        <TextField
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          variant="outlined"
          sx={{ mb: 3 }}
        />

        <List dense sx={{ textAlign: "left", mb: 2 }}>
          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="The email address must be valid, reachable, and not changed for 30 days." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <WarningIcon color="warning" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="If you have ever been banned or are currently a MAL Supporter, you cannot delete your account here." />
          </ListItem>
        </List>

        <Typography
          variant="body2"
          color="error"
          fontWeight={600}
          sx={{ mb: 3 }}
        >
          Once you have deleted your account, you will not be able to register
          with the same email for 30 days.
        </Typography>

        <Button
          fullWidth
          variant="contained"
          color="error"
          size="large"
          sx={{ textTransform: "none", fontWeight: 600 }}
          onClick={handleConfirm}
        >
          Confirmation
        </Button>
      </Paper>
    </Container>
  );
};

export default DeleteAccount;
