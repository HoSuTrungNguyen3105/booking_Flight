import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { BaseUserData } from "../../utils/type";
import SidebarSkeleton from "./SidebarSkeleton";
import { Message } from "@mui/icons-material";
type UserWithMess = {
  user?: BaseUserData;
  isContactsLoading?: number[];
};
const ChatSidebar = ({ user, isContactsLoading }: UserWithMess) => {
  //   const {
  //     getContacts,
  //     contacts,
  //     isLoading: isContactsLoading,
  //     selectedUser,
  //     setSelectedUser,
  //   } = useChatStore();
  //   const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     getContacts();
  //   }, [getContacts]);

  //   // Lọc danh sách users
  //   const filteredContacts = contacts.filter((contact) => {
  //     const matchesSearch = contact.username
  //       .toLowerCase()
  //       .includes(searchQuery.toLowerCase());
  //     const isOnline = onlineUsers.includes(contact._id);

  //     return matchesSearch && (showOnlineOnly ? isOnline : true);
  //   });

  if (isContactsLoading) return <SidebarSkeleton />;

  return (
    <Box
      component="aside"
      sx={{
        height: "100%",
        // width: { xs: 100, lg: 280 },
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        // transition: "all 0.2s ease-in-out",
      }}
    >
      <Button
        variant="outlined"
        onClick={() => navigate("/")}
        startIcon={<FaArrowLeft size={20} />}
        sx={{ alignSelf: "flex-start", m: 1 }}
      >
        Trở về
      </Button>
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          width: "100%",
          p: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Box
            sx={{
              p: 1,
              bgcolor: "white",
              borderRadius: "50%",
              boxShadow: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Message />
          </Box>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{ display: { xs: "none", lg: "block" } }}
          >
            Tin nhắn
          </Typography>
        </Box>

        {/* Input tìm kiếm */}
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Nhập tên người dùng để tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
          }}
        />

        {/* Checkbox lọc online */}
        <Box
          mt={2}
          display={{ xs: "none", lg: "flex" }}
          alignItems="center"
          gap={1}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                color="primary"
              />
            }
            label="Chỉ hiển thị online"
            sx={{ fontSize: 14 }}
          />
          <Typography variant="caption" color="text.secondary">
            {/* ({onlineUsers.length - 1} online) */}
          </Typography>
        </Box>
      </Box>

      {/* Danh sách contacts */}
      <Box flex={1} overflow="auto" py={1}>
        {/* {filteredContacts.length > 0 ? (
          <List disablePadding>
            {filteredContacts.map((contact) => {
              const isSelected = selectedUser?._id === contact._id;
              const isOnline = onlineUsers.includes(contact._id);

              return (
                <ListItemButton
                  key={contact._id}
                  selected={isSelected}
                  onClick={() => setSelectedUser(contact)}
                  sx={{
                    gap: 2,
                    "&.Mui-selected": {
                      bgcolor: "action.hover",
                      borderLeft: "4px solid",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Box sx={{ position: "relative" }}>
                      <Avatar
                        src={contact.profilePic || "/avatar.jpg"}
                        alt={contact.username}
                        sx={{ width: 48, height: 48 }}
                      />
                      {isOnline && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: 12,
                            height: 12,
                            bgcolor: "green",
                            borderRadius: "50%",
                            border: "2px solid white",
                          }}
                        />
                      )}
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography noWrap fontWeight={500}>
                        {contact.username}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        noWrap
                        variant="body2"
                        color="text.secondary"
                      >
                        {contact.latestMessage
                          ? contact.latestMessage
                          : isOnline
                          ? "Online"
                          : "Offline"}
                      </Typography>
                    }
                    sx={{ display: { xs: "none", lg: "block" } }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        ) : (
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            Không có liên hệ nào phù hợp.
          </Typography>
        )} */}
      </Box>
    </Box>
  );
};

export default ChatSidebar;
