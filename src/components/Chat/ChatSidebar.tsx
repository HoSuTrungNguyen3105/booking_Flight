import { memo, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaComments } from "react-icons/fa";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Avatar,
  List,
  ListItemButton,
  Tooltip,
  IconButton,
  Stack,
} from "@mui/material";
import type { BaseUserData } from "../../utils/type";
import SearchUser from "./SearchUser";
import SidebarSkeleton from "./SidebarSkeleton";

type UserWithMess = {
  isContactsLoading?: boolean;
  contacts?: BaseUserData[];
  onlineUsers?: number[];
  selectedUser?: BaseUserData;
  onUserSelect?: (user: BaseUserData) => void;
};

const ChatSidebar = ({
  isContactsLoading,
  contacts = [],
  onlineUsers = [],
  selectedUser,
  onUserSelect,
}: UserWithMess) => {
  const [changeWidth, setChangeWidth] = useState<"300px" | "60px">("300px");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const filteredContacts = showOnlineOnly
    ? contacts.filter((contact) => onlineUsers.includes(contact.id))
    : contacts;

  const isCollapsed = changeWidth === "60px";

  if (isContactsLoading) return <SidebarSkeleton />;

  return (
    <Box sx={{ display: "flex", height: "70vh", bgcolor: "grey.50" }}>
      <Stack
        sx={{
          width: changeWidth,
          height: "90vh",
          overflow: "hidden",
          transition: "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
          position: "relative",
        }}
      >
        <Tooltip title={isCollapsed ? "Mở rộng" : "Thu gọn"} placement="right">
          <IconButton
            onClick={() => setChangeWidth(isCollapsed ? "300px" : "60px")}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            {isCollapsed ? (
              <FaArrowRight size={16} />
            ) : (
              <FaArrowLeft size={16} />
            )}
          </IconButton>
        </Tooltip>

        {!isCollapsed && (
          <Box
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              width: "100%",
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5} p={1.5}>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <FaComments size={20} />
              </Box>
              <Typography fontWeight="600">Tin nhắn</Typography>
            </Box>

            <SearchUser onUserSelect={onUserSelect || (() => {})} />

            <Box
              mt={1}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={1.5}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={showOnlineOnly}
                    onChange={(e) => setShowOnlineOnly(e.target.checked)}
                    color="primary"
                  />
                }
                label="Chỉ hiển thị online"
                sx={{
                  "& .MuiFormControlLabel-label": { fontSize: "0.8rem" },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                ({onlineUsers.length} online)
              </Typography>
            </Box>
          </Box>
        )}

        {/* Danh sách liên hệ */}
        <Box flex={1} overflow="auto" py={1}>
          {filteredContacts.length > 0 ? (
            <List disablePadding>
              {filteredContacts.map((contact) => {
                const isOnline = onlineUsers.includes(contact.id);
                const isSelected = selectedUser?.id === contact.id;

                return (
                  <Tooltip
                    key={contact.id}
                    title={isCollapsed ? contact.name : ""}
                    placement="right"
                  >
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => onUserSelect?.(contact)}
                      sx={{
                        gap: 2,
                        minHeight: 72,
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        px: isCollapsed ? 0.5 : 2,
                        "&.Mui-selected": {
                          bgcolor: "action.hover",
                          borderLeft: "4px solid",
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <Avatar
                          src={contact.pictureUrl || "/avatar.jpg"}
                          alt={contact.name}
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
                              bgcolor: "success.main",
                              borderRadius: "50%",
                              border: "2px solid",
                              borderColor: "background.paper",
                            }}
                          />
                        )}
                      </Box>

                      {!isCollapsed && (
                        <Box sx={{ overflow: "hidden", flex: 1 }}>
                          <Typography noWrap fontWeight={500}>
                            {contact.name}
                          </Typography>
                          <Typography
                            noWrap
                            variant="body2"
                            color="text.secondary"
                          >
                            {isOnline ? "Online" : "Offline"}
                          </Typography>
                        </Box>
                      )}
                    </ListItemButton>
                  </Tooltip>
                );
              })}
            </List>
          ) : (
            !isCollapsed && (
              <Typography
                textAlign="center"
                color="text.secondary"
                sx={{ mt: 2, px: 2 }}
              >
                Không có liên hệ nào phù hợp.
              </Typography>
            )
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default memo(ChatSidebar);
