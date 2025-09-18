import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import InputTextField from "../../common/Input/InputTextField";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() === "") return;
    onSendMessage(message);
    setMessage("");
  };

  return (
    <Box
      p={2}
      display="flex"
      alignItems="center"
      sx={{ backgroundColor: "#fafafa", borderRadius: 2 }}
    >
      <InputTextField
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e)}
        sx={{
          borderRadius: 4,
          backgroundColor: "white",
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSend}
        sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
      >
        Send
      </Button>
    </Box>
  );
};

export default MessageInput;
