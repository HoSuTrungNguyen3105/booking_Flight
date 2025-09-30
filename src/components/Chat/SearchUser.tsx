import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Stack,
  Paper,
  Collapse,
  Tooltip,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { BaseUserData } from "../../utils/type";
import InputTextField from "../../common/Input/InputTextField";

interface SearchUserProps {
  onUserSelect: (user: BaseUserData) => void;
  selectedUser?: BaseUserData | null;
  isCollapsed?: boolean;
}

const SearchUser: React.FC<SearchUserProps> = ({
  onUserSelect,
  selectedUser,
  isCollapsed,
}) => {
  const [search, setSearch] = useState("");
  // const [users, setUsers] = useState<BaseUserData[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<BaseUserData[]>([]);

  useEffect(() => {
    const filtered = filteredUsers.filter(
      (user) =>
        user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        user?.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, filteredUsers]);

  const handleSearch = () => {
    if (search.trim() === "") {
      setFilteredUsers(filteredUsers);
      return;
    }

    const filtered = filteredUsers.filter(
      (user) =>
        user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        user?.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleClearSearch = () => {
    setSearch("");
    setFilteredUsers(filteredUsers);
  };

  const handleUserSelect = (user: BaseUserData) => {
    onUserSelect(user);
  };

  //   return (
  //     <Paper
  //       sx={{
  //         width: 350,
  //         height: "100vh",
  //         bgcolor: "grey.50",
  //         borderRight: 1,
  //         borderColor: "divider",
  //         overflow: "auto",
  //       }}
  //     >
  //             <Collapse in={!isCollapsed}>
  //       <Box p={2}>
  //         {/* Header */}
  //         <Typography
  //           variant="h6"
  //           gutterBottom
  //           color="primary.main"
  //           fontWeight="bold"
  //         >
  //           Users Dashboard
  //         </Typography>

  //         {/* Thanh tìm kiếm */}
  //         <Box display="flex" gap={1} alignItems="center" mb={2}>
  //           <InputTextField
  //             placeholder="Search users..."
  //             value={search}
  //             onChange={(e) => setSearch(e)}
  //             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
  //             clearable
  //           />
  //           <Button
  //             variant="contained"
  //             color="primary"
  //             onClick={handleSearch}
  //             sx={{
  //               minWidth: "auto",
  //               px: 2,
  //               borderRadius: 1,
  //             }}
  //           >
  //             <SearchIcon />
  //           </Button>
  //         </Box>

  //         {/* Thống kê */}
  //         <Box mb={2} p={1.5} bgcolor="primary.light" borderRadius={1}>
  //           <Typography variant="body2" color="white" fontWeight="medium">
  //             Total Users: {users.length}
  //           </Typography>
  //           <Typography variant="body2" color="white">
  //             Filtered: {filteredUsers.length}
  //           </Typography>
  //         </Box>

  //         {/* Danh sách user */}
  //         <Typography variant="subtitle2" color="text.secondary" gutterBottom>
  //           User List
  //         </Typography>

  //         <List sx={{ mt: 1 }}>
  //           {filteredUsers.map((user) => (
  //             <ListItemButton
  //               key={user.id || user.email}
  //               onClick={() => handleUserSelect(user)}
  //               selected={selectedUser?.email === user.email}
  //               sx={{
  //                 mb: 1,
  //                 borderRadius: 2,
  //                 bgcolor:
  //                   selectedUser?.email === user.email
  //                     ? "primary.main"
  //                     : "background.paper",
  //                 "&:hover": {
  //                   bgcolor:
  //                     selectedUser?.email === user.email
  //                       ? "primary.dark"
  //                       : "grey.100",
  //                 },
  //                 boxShadow: 1,
  //                 transition: "all 0.2s ease-in-out",
  //               }}
  //             >
  //               <Stack
  //                 direction="row"
  //                 alignItems="center"
  //                 spacing={1.5}
  //                 width="100%"
  //               >
  //                 <Box
  //                   sx={{
  //                     width: 40,
  //                     height: 40,
  //                     borderRadius: "50%",
  //                     bgcolor:
  //                       selectedUser?.email === user.email
  //                         ? "white"
  //                         : "primary.main",
  //                     display: "flex",
  //                     alignItems: "center",
  //                     justifyContent: "center",
  //                     color:
  //                       selectedUser?.email === user.email
  //                         ? "primary.main"
  //                         : "white",
  //                     fontWeight: "bold",
  //                     fontSize: 14,
  //                   }}
  //                 >
  //                   {user.name?.charAt(0).toUpperCase() || "U"}
  //                 </Box>
  //                 <Box flex={1}>
  //                   <ListItemText
  //                     primary={
  //                       <Typography
  //                         variant="body2"
  //                         fontWeight="medium"
  //                         color={
  //                           selectedUser?.email === user.email
  //                             ? "white"
  //                             : "text.primary"
  //                         }
  //                       >
  //                         {user.name}
  //                       </Typography>
  //                     }
  //                     secondary={
  //                       <Typography
  //                         variant="caption"
  //                         color={
  //                           selectedUser?.email === user.email
  //                             ? "white"
  //                             : "text.secondary"
  //                         }
  //                       >
  //                         {user.email}
  //                       </Typography>
  //                     }
  //                   />
  //                 </Box>
  //               </Stack>
  //             </ListItemButton>
  //           ))}
  //         </List>

  //         {filteredUsers.length === 0 && (
  //           <Box textAlign="center" py={3}>
  //             <Typography variant="body2" color="text.secondary">
  //               No users found
  //             </Typography>
  //           </Box>
  //         )}
  //       </Box>
  //             </Collapse>
  //     </Paper>
  //   );
  // };

  return (
    <Paper
      sx={{
        width: isCollapsed ? 80 : 350,
        height: "100vh",
        bgcolor: "grey.50",
        borderRight: 1,
        borderColor: "divider",
        overflow: "auto",
        transition: "width 0.3s ease",
        position: "relative",
      }}
    >
      {isCollapsed && (
        <Box p={1}>
          <Typography
            variant="h6"
            noWrap
            textAlign="center"
            mb={2}
            fontSize={16}
          >
            Users
          </Typography>

          <Stack spacing={1} alignItems="center">
            {filteredUsers.slice(0, 5).map((user) => (
              <Tooltip key={user.id} title={user.name} placement="right">
                <Avatar
                  onClick={() => handleUserSelect(user)}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "primary.main",
                    cursor: "pointer",
                    border: selectedUser?.id === user.id ? "2px solid" : "none",
                    borderColor:
                      selectedUser?.id === user.id
                        ? "primary.main"
                        : "transparent",
                  }}
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              </Tooltip>
            ))}

            {filteredUsers.length > 5 && (
              <Avatar sx={{ width: 48, height: 48, bgcolor: "grey.300" }}>
                <Typography variant="caption">
                  +{filteredUsers.length - 5}
                </Typography>
              </Avatar>
            )}
          </Stack>
        </Box>
      )}

      {/* Chế độ mở rộng - hiển thị đầy đủ */}
      <Collapse in={!isCollapsed} orientation="horizontal">
        <Box p={2}>
          {/* Header */}
          <Typography
            variant="h6"
            gutterBottom
            color="primary.main"
            fontWeight="bold"
          >
            Users Dashboard
          </Typography>

          {/* Thanh tìm kiếm */}
          <Box display="flex" gap={1} alignItems="center" mb={2}>
            <InputTextField
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              clearable
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{
                minWidth: "auto",
                px: 2,
                borderRadius: 1,
              }}
            >
              <SearchIcon />
            </Button>
          </Box>

          {/* Thống kê */}
          <Box mb={2} p={1.5} bgcolor="primary.light" borderRadius={1}>
            <Typography variant="body2" color="white" fontWeight="medium">
              Total Users: {filteredUsers.length}
            </Typography>
            <Typography variant="body2" color="white">
              Filtered: {filteredUsers.length}
            </Typography>
          </Box>

          {/* Danh sách user */}
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            User List
          </Typography>

          <List sx={{ mt: 1 }}>
            {filteredUsers.map((user) => (
              <ListItemButton
                key={user.id || user.email}
                onClick={() => handleUserSelect(user)}
                selected={selectedUser?.email === user.email}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  bgcolor:
                    selectedUser?.email === user.email
                      ? "primary.main"
                      : "background.paper",
                  "&:hover": {
                    bgcolor:
                      selectedUser?.email === user.email
                        ? "primary.dark"
                        : "grey.100",
                  },
                  boxShadow: 1,
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  width="100%"
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor:
                        selectedUser?.email === user.email
                          ? "white"
                          : "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color:
                        selectedUser?.email === user.email
                          ? "primary.main"
                          : "white",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </Box>
                  <Box flex={1}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color={
                            selectedUser?.email === user.email
                              ? "white"
                              : "text.primary"
                          }
                        >
                          {user.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          color={
                            selectedUser?.email === user.email
                              ? "white"
                              : "text.secondary"
                          }
                        >
                          {user.email}
                        </Typography>
                      }
                    />
                  </Box>
                </Stack>
              </ListItemButton>
            ))}
          </List>

          {filteredUsers.length === 0 && (
            <Box textAlign="center" py={3}>
              <Typography variant="body2" color="text.secondary">
                No users found
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default SearchUser;
