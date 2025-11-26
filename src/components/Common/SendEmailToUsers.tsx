import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";
import { Send, Close } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import InputTextField from "../../common/Input/InputTextField";
import InputTextArea from "../../common/Input/InputTextArea";
import { useToast } from "../../context/ToastContext";
import { EmailAttachmentUploader } from "../../common/FileUploader/FileUploadButton";
import { useSendMail } from "../../context/Api/UserApi";
import { ResponseCode } from "../../utils/response";
import ChipInput from "../../common/Input/ChipInput";

type SendEmailProps = {
  selectedUser: string[];
  // onSubmit?: (payload: {
  //   to: string[];
  //   cc?: string[];
  //   bcc?: string[];
  //   subject: string;
  //   text: string;
  //   files?: File[];
  // }) => Promise<void> | void;
};

const SendEmailToUsers = ({ selectedUser }: SendEmailProps) => {
  const { user } = useAuth();
  const [to, setTo] = useState<string[]>(selectedUser);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const { sendCcBcc } = useSendMail();

  const toast = useToast();

  const handleSendCcBcc = async () => {
    if (to.length === 0) {
      toast("Please add at least one recipient", "error");
      return;
    }
    if (!subject) {
      toast("Please add a subject", "error");
      return;
    }

    const res = await sendCcBcc({
      toList: to,
      ccList: cc,
      bccList: bcc,
      subject,
      text: body,
    });

    if (res?.resultCode === ResponseCode.SUCCESS) {
      toast(res.resultMessage, "success");
      // Reset form
      setTo([]);
      setCc([]);
      setBcc([]);
      setSubject("");
      setBody("");
    } else {
      toast(res?.resultMessage || "Error sending email", "error");
    }
  };

  return (
    <Stack gap={2} sx={{ maxWidth: 800, margin: "0 auto", padding: 2 }}>
      <Typography variant="h5" fontWeight="bold">
        Compose Email
      </Typography>
      <Divider />

      {/* From */}
      <Typography variant="body2" color="text.secondary">
        From: <strong>{user?.name || "Admin"}</strong>
      </Typography>

      {/* To */}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            To:
          </Typography>
          <Box>
            {!showCc && (
              <Button size="small" onClick={() => setShowCc(true)}>
                Cc
              </Button>
            )}
            {!showBcc && (
              <Button size="small" onClick={() => setShowBcc(true)}>
                Bcc
              </Button>
            )}
          </Box>
        </Box>
        <ChipInput
          label="Recipients"
          placeholder="Type email and press Enter"
          value={to}
          onChange={setTo}
        />
      </Box>

      {/* Cc */}
      <Collapse in={showCc}>
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Cc:
            </Typography>
            <IconButton size="small" onClick={() => setShowCc(false)}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <ChipInput
            label="Cc"
            placeholder="Type email and press Enter"
            value={cc}
            onChange={setCc}
          />
        </Box>
      </Collapse>

      {/* Bcc */}
      <Collapse in={showBcc}>
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Bcc:
            </Typography>
            <IconButton size="small" onClick={() => setShowBcc(false)}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <ChipInput
            label="Bcc"
            placeholder="Type email and press Enter"
            value={bcc}
            onChange={setBcc}
          />
        </Box>
      </Collapse>

      {/* Subject */}
      <Box>
        <Typography variant="body2" fontWeight="bold" gutterBottom>
          Subject:
        </Typography>
        <InputTextField
          value={subject}
          onChange={(e) => setSubject(e)}
          placeholder="Subject"
        />
      </Box>

      {/* Body */}
      <Box>
        <InputTextArea
          placeholder="Type your message here..."
          value={body}
          onChange={(e) => setBody(e)}
          minRows={6}
        />
      </Box>

      {/* Attachments & Buttons */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Box>
          <EmailAttachmentUploader
            title="Attach Files"
            uploadUrl="/api/email/send-cc-bcc" // Note: This URL might need to be adjusted based on actual backend endpoint for upload
            emailData={{
              toList: to,
              ccList: cc,
              bccList: bcc,
              subject: subject,
              text: body,
              html: `<p>${body}</p>`,
            }}
            maxSize="25 MB"
            maxFiles={5}
            multiple={true}
            autoUpload={false} // Changed to false so we don't upload immediately? Or maybe true if backend handles it separately.
            // Keeping previous logic but improved UI
            onUploadSuccess={(response, _) => {
              console.log("Files uploaded:", response);
            }}
            onUploadError={(error, _) => {
              console.error("Upload error:", error);
            }}
            headers={{
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // Assuming token storage
            }}
          />
        </Box>

        <Box display="flex" gap={2}>
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
            disabled={to.length === 0 || !subject}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default SendEmailToUsers;
