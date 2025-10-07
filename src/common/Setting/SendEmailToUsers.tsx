import { useState } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import ChipInput from "../ChipInput";
import InputTextField from "../Input/InputTextField";
import InputTextArea from "../Input/InputTextArea";
import { useSendMail } from "../../components/Api/usePostApi";
import { useToast } from "../../context/ToastContext";
import { EmailAttachmentUploader } from "../FileUploader/FileUploadButton";

type SendEmailProps = {
  selectedUser: string[];
  onSubmit?: (payload: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    text: string;
    files?: File[];
  }) => Promise<void> | void;
};

const SendEmailToUsers = ({ selectedUser, onSubmit }: SendEmailProps) => {
  const { user } = useAuth();
  const [to, setTo] = useState<string[]>(selectedUser);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [broadcast, setBroadcast] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

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
          {/* <FileUploadButton accept=".img,.svg" name="Upload" title="Files" /> */}
          <EmailAttachmentUploader
            title="Add Email Attachments"
            uploadUrl="/api/email/send-cc-bcc"
            emailData={{
              toList: ["recipient@example.com"],
              ccList: ["cc@example.com"],
              bccList: ["bcc@example.com"],
              subject: "Test Email with Attachments",
              text: "This email contains the attached files",
              html: "<p>This email contains the attached files</p>",
            }}
            maxSize="25 MB"
            maxFiles={5}
            multiple={true}
            autoUpload={true}
            onUploadSuccess={(response, files) => {
              console.log(
                "Email with attachments sent successfully:",
                response
              );
            }}
            onUploadError={(error, files) => {
              console.error("Failed to send email with attachments:", error);
            }}
            headers={{
              Authorization: "Bearer your-token",
              "X-Requested-With": "XMLHttpRequest",
            }}
          />
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
