import { useEffect } from "react";
import { useSocket } from "../../context/use[custom]/useSocket";
import type { ResConversationsResponse } from "../../utils/type";
import { socket } from "../../context/use[custom]/socket";
import {
  Box,
  Typography,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  Badge,
} from "@mui/material";
import theme from "../../scss/theme";
const Conversations = ({
  userId,
  handleUserSelect,
}: {
  userId: number;
  handleUserSelect?: (id: number) => void;
}) => {
  const { data, loading, isConnected } = useSocket<ResConversationsResponse>({
    event: "getConversationsResponse",
    autoListen: true,
    userId,
    onSuccess: (res) => {
      if (res?.resultCode === "00") {
        console.log(" Conversations:", res.list);
      } else {
        console.warn("Server error:", res?.resultMessage);
      }
    },
  });

  // Khi socket sẵn sàng thì emit request
  useEffect(() => {
    if (isConnected) {
      socket.emit("getConversations", { userId });
    }
  }, [isConnected, userId]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {data?.resultCode === "00" ? (
        <>
          {data?.list?.map((conv) => (
            <ListItem key={conv.userId}>
              <ListItemButton
                onClick={() => handleUserSelect?.(conv.userId)}
                sx={{
                  py: 1.5,
                  px: 2,
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                    },
                  },
                }}
              >
                {/* Avatar + trạng thái */}
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    variant="dot"
                    color="success"
                    //invisible={!conv.online}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        // bgcolor: conv.online
                        //   ? "primary.main"
                        //   : "grey.400",
                      }}
                    >
                      {/* {conv.name.charAt(0)} */}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>

                {/* Nội dung */}
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        noWrap
                        fontWeight="medium"
                      >
                        {conv.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {/* {conv.timestamp ?? ""} */}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          maxWidth: "70%",
                          // fontWeight:
                          //   conv.unread > 0 ? "600" : "normal",
                          // color:
                          //   conv.unread > 0
                          //     ? "text.primary"
                          //     : "text.secondary",
                        }}
                      >
                        {conv.lastMessage}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", p: 2 }}
        >
          {data?.resultMessage}
        </Typography>
      )}
    </div>
  );
};
export default Conversations;
