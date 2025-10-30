import { memo, useEffect, useState } from "react";
import { useSocket } from "../../context/use[custom]/useSocket";
import type { Conversation, ResConversationsResponse } from "../../utils/type";
import { socket } from "../../hooks/socket";
import {
  Box,
  Typography,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Avatar,
  Badge,
  List,
} from "@mui/material";
import theme from "../../scss/theme";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import useDebounce from "../../context/use[custom]/useDebounce";
import SearchUserFromMessage from "./SearchUserFromMessage";
import type { SearchEmailFromSidebarMessageRes } from "../../context/Api/usePostApi";

const Conversations = ({
  userId,
  handleUserSelect,
  selectedUser,
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

  useEffect(() => {
    if (isConnected) {
      socket.emit("getConversations", { userId });
    }
  }, [isConnected, userId]);

  const [searchResult, setSearchResult] = useState<
    SearchEmailFromSidebarMessageRes[]
  >([]);

  const [filteredUsers, setFilteredUsers] = useState<Conversation[]>([]);
  const debouncedQuery = useDebounce(filteredUsers, 500);

  useEffect(() => {
    if (data?.list) {
      setFilteredUsers(data.list);
    }
  }, [data]);

  useEffect(() => {
    if (searchResult.length > 0) {
      const mappedResult: Conversation[] = searchResult.map((user) => ({
        userId: user.userId,
        name: user.name,
        lastMessage: "",
        timestamp: 0,
        email: user.email,
      }));
      setFilteredUsers(mappedResult);
    } else if (searchResult.length === 0 && data?.list) {
      // nếu tìm không thấy -> quay lại danh sách gốc
      setFilteredUsers(data.list);
    }
  }, [searchResult, data]);

  useEffect(() => {
    if (!data?.list) return;

    if (debouncedQuery.map((e) => e.name.trim().length === 0)) {
    } else {
      const filtered = data.list.filter((conv) => conv.name?.toLowerCase());
      setFilteredUsers(filtered);
    }
  }, [debouncedQuery, data]);

  return (
    <Box height={"90vh"} minWidth={0}>
      <SearchUserFromMessage onChange={(result) => setSearchResult(result)} />
      {data?.resultCode === "00" && (
        <List sx={{ py: 0, height: "100%", overflow: "auto" }}>
          {filteredUsers?.map((conv, index) => (
            <ListItem
              key={conv.userId}
              disablePadding
              sx={{
                borderBottom: index < 1 ? 1 : 0,
                borderColor: "divider",
              }}
            >
              <ListItemButton
                onClick={() => {
                  handleUserSelect?.(conv.userId);
                }}
                selected={selectedUser === conv.userId}
                sx={{
                  py: 2,
                  px: 2.5,
                  gap: 2,
                  transition: "all 0.2s ease-in-out",
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    borderRight: 3,
                    borderColor: "primary.main",
                  },
                }}
              >
                {/* Avatar with Status */}
                <ListItemAvatar sx={{ minWidth: "auto" }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    color="success"
                    sx={{
                      "& .MuiBadge-dot": {
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        border: "2px solid white",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 52,
                        height: 52,
                        bgcolor: "primary.main",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        boxShadow: theme.shadows[1],
                      }}
                    >
                      {conv.name?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>

                {/* Conversation Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* Header with name and timestamp */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      noWrap
                      fontWeight="600"
                      sx={{
                        fontSize: "0.95rem",
                        color:
                          selectedUser === conv.userId
                            ? "white"
                            : "text.primary",
                      }}
                    >
                      {conv.name} -{conv.userId}
                    </Typography>
                    {conv.timestamp && (
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            selectedUser === conv.userId
                              ? "white"
                              : "text.secondary",
                          fontSize: "0.75rem",
                          minWidth: "fit-content",
                          ml: 1,
                        }}
                      >
                        {formatDate(DateFormatEnum.HH_MM_A, conv.timestamp)}
                      </Typography>
                    )}
                  </Box>

                  {/* Last message preview */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{
                        maxWidth: "75%",
                        fontSize: "0.875rem",
                        color:
                          selectedUser === conv.userId
                            ? "rgba(255,255,255,0.9)"
                            : "text.secondary",
                        lineHeight: 1.3,
                      }}
                    >
                      {conv.lastMessage || "Bắt đầu cuộc trò chuyện..."}
                    </Typography>
                  </Box>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* Empty State */}
      {!loading && data?.resultCode !== "00" && (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            fontWeight="500"
            gutterBottom
          >
            {data?.resultMessage || "Chưa có cuộc trò chuyện nào"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ opacity: 0.8 }}
          >
            Bắt đầu trò chuyện bằng cách tìm kiếm người dùng mới
          </Typography>
        </Box>
      )}

      {/* No Conversations State */}
      {!loading && data?.resultCode === "00" && data?.list?.length === 0 && (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            color="text.primary"
            fontWeight="600"
            gutterBottom
          >
            Chào mừng bạn!
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 280, lineHeight: 1.5 }}
          >
            Bắt đầu cuộc trò chuyện đầu tiên bằng cách tìm kiếm và chọn người
            dùng từ danh sách
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default memo(Conversations);
