import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import InputTextField from "../../common/Input/InputTextField";

interface MessageInputProps {
  content: string;
  onSendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  content,
  onSendMessage,
}) => {
  const [message, setMessage] = useState(content);

  return (
    <Box
      p={2}
      display="flex"
      alignItems="center"
      sx={{ backgroundColor: "#fafafa", borderRadius: 2 }}
    >
      <TextField
        placeholder="Type a message..."
        value={message}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
        sx={{
          borderRadius: 4,
          backgroundColor: "white",
          flex: 1, // để input chiếm hết chỗ trống
          mr: 2,
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={onSendMessage}
        sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
      >
        Send
      </Button>
    </Box>
  );
};

export default MessageInput;
