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
  List,
} from "@mui/material";
import theme from "../../scss/theme";
import { Loading } from "../../common/Loading/Loading";
import { DateFormatEnum, formatDate } from "../../hooks/format";
const Conversations = ({
  userId,
  selectedUser,
  handleUserSelect,
}: {
  userId: number;
  selectedUser: number;
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
    <Box sx={{ flex: 1, overflow: "auto" }}>
      {loading ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Loading />
        </Box>
      ) : data?.resultCode === "00" ? (
        <List sx={{ py: 0 }}>
          {data?.list?.map((conv) => (
            <ListItem key={conv.userId} disablePadding>
              <ListItemButton
                onClick={() => handleUserSelect?.(conv.userId)}
                selected={selectedUser === conv.userId}
                sx={{
                  py: 2,
                  px: 2,
                  borderBottom: 1,
                  borderColor: "divider",
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    "&:hover": {
                      backgroundColor: "primary.light",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    color="success"
                  >
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        backgroundColor: "primary.main",
                        fontWeight: 600,
                      }}
                    >
                      {conv.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="600"
                        noWrap
                        sx={{ maxWidth: "60%" }}
                      >
                        {conv.name}
                      </Typography>
                      {conv.timestamp && (
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(
                            DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                            conv.timestamp
                          )}
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={0.5}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{
                          maxWidth: "70%",
                          fontSize: "0.8125rem",
                        }}
                      >
                        {conv.lastMessage || "No messages yet"}
                      </Typography>
                      {/* Unread badge can be added here */}
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {data?.resultMessage || "No conversations found"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
export default Conversations;
