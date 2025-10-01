import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Switch,
  TextField,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import { Send, Close } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import ChipInput from "../ChipInput";
import InputTextField from "../Input/InputTextField";
import InputTextArea from "../Input/InputTextArea";
import { useSendMail } from "../../components/Api/usePostApi";
import { useToast } from "../../context/ToastContext";

type SendEmailProps = {
  selectedUser: string[];
};

const SendEmailToUsers = ({ selectedUser }: SendEmailProps) => {
  const { user } = useAuth();
  const [to, setTo] = useState<string[]>(selectedUser);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [broadcast, setBroadcast] = useState(true);
  const [inputEmail, setInputEmail] = useState("");
  const { sendCcBcc, sendMany } = useSendMail();

  // const handleSendOne = () => {
  //   sendOne({
  //     to: "abc@gmail.com",
  //     subject: "Hello",
  //     text: "Test gửi 1 người",
  //   });
  // };
  const toast = useToast();

  const handleSendMany = async () => {
    const res = await sendMany({
      toList: selectedUser,
      subject: subject,
      text: body,
    });
    if (res?.resultCode === "00") {
      toast(res.resultMessage, "success");
    } else {
      toast(res?.resultMessage || "Error in send email", "info");
    }
  };

  const handleAddRecipient = (email: string) => {
    const trimmedEmail = email.trim();
    if (trimmedEmail && !to.includes(trimmedEmail)) {
      setTo([...to, trimmedEmail]);
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setTo(to.filter((item) => item !== email));
  };

  const handleSendEmail = () => {
    // TODO: call API gửi email
    console.log({ to, subject, body, broadcast });
    alert(`Email sent to: ${to.join(", ")}`);
  };

  return (
    <>
      <Stack
        sx={{
          // width: "100%",
          // bgcolor: "background.paper",
          // p: 3,
          // display: "flex",
          // flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Send Email
        </Typography>
        <Divider />

        {/* From */}
        <Typography variant="body2" color="text.secondary">
          From: <strong>{user?.name || "Admin"}</strong>
        </Typography>

        {/* To */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            To:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
            {/* {to.map((email) => (
            <Chip
              key={email}
              label={email}
              onDelete={() => handleRemoveRecipient(email)}
              color="primary"
              variant="outlined"
              size="small"
              deleteIcon={<Close />}
            />
          ))} */}
            <ChipInput name="Chip" label="Chip" value={to} />
            {/* <InputTextField
              placeholder="Add recipient and press Enter"
              value={inputEmail}
              onChange={(e) => setInputEmail(e)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddRecipient(inputEmail);
                  setInputEmail("");
                  e.preventDefault();
                }
              }}
              sx={{ minWidth: 200 }}
            /> */}
          </Box>
        </Box>

        {/* Subject */}
        <InputTextField value={subject} onChange={(e) => setSubject(e)} />

        {/* Body */}
        <InputTextArea
          placeholder="Type your message..."
          value={body}
          onChange={(e) => setBody(e)}
        />

        {/* Broadcast & Action Buttons */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Switch
              checked={broadcast}
              onChange={(e) => setBroadcast(e.target.checked)}
            />
            <Typography variant="body2">Broadcast</Typography>
          </Box>

          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => {
                setTo([]);
                setSubject("");
                setBody("");
                setInputEmail("");
              }}
            >
              Discard
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<Send />}
              onClick={handleSendMany}
              disabled={to.length === 0 || !subject || !body}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export default SendEmailToUsers;
