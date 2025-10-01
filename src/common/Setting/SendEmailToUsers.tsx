import React, { useState } from "react";
import { Box, Button, Divider, Stack, Switch, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
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
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [broadcast, setBroadcast] = useState(true);

  const { sendCcBcc } = useSendMail();
  const toast = useToast();

  const handleSendCcBcc = async () => {
    const res = await sendCcBcc({
      toList: to,
      ccList: cc,
      bccList: bcc,
      subject,
      text: body,
    });

    if (res?.resultCode === "00") {
      toast(res.resultMessage, "success");
    } else {
      toast(res?.resultMessage || "Error sending email", "error");
    }
  };

  return (
    <Stack gap={2}>
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
        <Typography variant="body2">To:</Typography>
        <ChipInput name="Chip" label="Chip" value={to} onChange={setTo} />
      </Box>

      {/* Cc */}
      <Box>
        <Typography variant="body2">Cc:</Typography>
        <ChipInput value={cc} onChange={setCc} name="Chip" label="Chip" />
      </Box>

      {/* Bcc */}
      <Box>
        <Typography variant="body2">Bcc:</Typography>
        <ChipInput value={bcc} onChange={setBcc} name="Chip" label="Chip" />
      </Box>

      {/* Subject */}
      <InputTextField value={subject} onChange={(e) => setSubject(e)} />

      {/* Body */}
      <InputTextArea
        placeholder="Type your message..."
        value={body}
        onChange={(e) => setBody(e)}
      />

      {/* Broadcast & Buttons */}
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
              setCc([]);
              setBcc([]);
              setSubject("");
              setBody("");
            }}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<Send />}
            onClick={handleSendCcBcc}
            disabled={to.length === 0 || !subject || !body}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default SendEmailToUsers;
