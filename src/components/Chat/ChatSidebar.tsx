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
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { BaseUserData } from "../../utils/type";
import SidebarSkeleton from "./SidebarSkeleton";
import { Message } from "@mui/icons-material";
import InputTextField from "../../common/Input/InputTextField";
import SearchUser from "./SearchUser";
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

  const handleUserSelect = async (user: BaseUserData) => {
    // setSelectedUser(user);
    // socket.emit("join", { userId: user.id });
    // try {
    //   const response = await axios.get(
    //     `http://localhost:4000/messages/${user.id}`
    //   );
    //   setMessages(response.data);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  if (isContactsLoading) return <SidebarSkeleton />;

  return (
    <Stack
      overflow="hidden"
      direction="column"
      sx={{
        height: "100%",
        transition: "width 200ms",
        // overflow: "hidden",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          width: 6,
        },
        borderRight: "1px solid",
        borderColor: "divider",
        // display: "flex",
        // flexDirection: "column",
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
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Message />
          </Box>
          <Typography
            fontWeight="600"
            sx={{ display: { xs: "none", lg: "block" } }}
          >
            Tin nhắn
          </Typography>
        </Box>

        {/* <InputTextField
          placeholder="Nhập tên người dùng để tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e)}
          sx={{
            pr: 2,
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
          }}
        /> */}
        <SearchUser onUserSelect={handleUserSelect} />

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
    </Stack>
  );
};

export default ChatSidebar;
