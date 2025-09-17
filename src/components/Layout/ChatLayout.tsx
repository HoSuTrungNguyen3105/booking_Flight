import { Box, Paper, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "../Chat/ChatSidebar";

const ChatLayout = () => {
  // const { selectedUser } = useChatStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        p: isMobile ? 0 : 3,
      }}
    >
      <Paper
        elevation={isMobile ? 0 : 3}
        sx={{
          bgcolor: "background.paper",
          borderRadius: isMobile ? 0 : 2,
          width: "100%",
          height: isMobile ? "100%" : "90vh",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            overflow: "hidden",
            // flexDirection: isMobile && selectedUser ? "column" : "row",
          }}
        >
          {/* Sidebar - ẩn trên mobile khi có chat được chọn */}
          {/* {(!isMobile || !selectedUser) && (
            <Sidebar
              includeReturnButton
              onReturn={handleReturn}
              isMobile={isMobile}
            />
          )} */}

          {/* Chat Container or No Chat Selected */}
          {/* {!selectedUser ? (
            <NoChatSelected />
          ) : (
            <ChatContainer isMobile={isMobile} />
          )} */}
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatLayout;
