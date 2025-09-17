import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

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
      display="flex"
      alignItems="center"
      p={2}
      px={4}
      gap={2}
      sx={{ backgroundColor: "#fafafa", borderRadius: 2 }}
    >
      <TextField
        fullWidth
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        variant="outlined"
        size="small"
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
