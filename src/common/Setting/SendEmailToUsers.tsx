import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { AttachFile, Delete, Send } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { FileUploadButtonWithValidation } from "../../components/Admin/modal/FileUploadButtonWithValidation";
// import { FileUpload } from "../FileUploader";
// import FileUploadButton from "../../components/Admin/modal/FileUploadButtonWithValidation";
// import { FileUploadButton } from "../FileUploader/FileUploadButton";
// import { FileUploadButton } from "../FileUploader/FileUploadButton";
type SendEmailProps = {
  selectedUser: string[];
};
const SendEmailToUsers = ({ selectedUser }: SendEmailProps) => {
  const [to, setTo] = useState<string[]>(["madison@example.com"]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [broadcast, setBroadcast] = useState(true);
  const { user } = useAuth();
  const handleAddRecipient = (email: string) => {
    if (email && !to.includes(email)) {
      setTo([...to, email]);
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setTo(to.filter((item) => item !== email));
  };

  // const handleAttachFile = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setAttachments([...attachments, ...Array.from(event.target.files)]);
  //   }
  // };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "white",
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {/* Header */}
      <Typography variant="h6" fontWeight="bold">
        Send mail {selectedUser}
      </Typography>

      {/* From */}
      <Typography variant="body2" color="text.secondary">
        From: {user?.name}
      </Typography>

      {/* To */}
      <Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          To:
          {selectedUser.map((e) => (
            <Typography>e</Typography>
          ))}
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {to.map((email) => (
            <Chip
              key={email}
              label={email}
              onDelete={() => handleRemoveRecipient(email)}
              color="primary"
              variant="outlined"
            />
          ))}
          <TextField
            size="small"
            placeholder="Add recipient"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddRecipient((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
          />
        </Box>
      </Box>

      {/* Subject */}
      <TextField
        label="Subject"
        fullWidth
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      {/* Body */}
      <TextField
        placeholder="Type your message..."
        fullWidth
        multiline
        rows={6}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <FileUploadButtonWithValidation
        title="test"
        name="test"
        setValues={() => {}}
      />
      {/* <FileUpload name="upload" /> */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <Switch
            checked={broadcast}
            onChange={(e) => setBroadcast(e.target.checked)}
          />
          <Typography variant="body2">Broadcast</Typography>
        </Box>

        <Box display="flex" gap={1}>
          <Button variant="outlined" color="inherit">
            Discard
          </Button>
          <Button variant="contained" color="error" endIcon={<Send />}>
            Send email
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SendEmailToUsers;
