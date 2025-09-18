import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Stack,
} from "@mui/material";
import type { BaseUserData } from "../../utils/type";
import InputTextField from "../../common/Input/InputTextField";

interface SearchUserProps {
  onUserSelect: (user: BaseUserData) => void;
}
const mockUsers: BaseUserData[] = [
  { name: "Nguyễn Văn A", email: "a@example.com", password: "" },
  { name: "Nguyễn Văn A", email: "a@example.com", password: "" },
  { name: "Nguyễn Văn A", email: "a@example.com", password: "" },
  { name: "Nguyễn Văn A", email: "a@example.com", password: "" },
  { name: "Nguyễn Văn A", email: "a@example.com", password: "" },
];

const SearchUser: React.FC<SearchUserProps> = ({ onUserSelect }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<BaseUserData[]>(mockUsers);

  const handleSearch = () => {
    const filtered = users.filter((user) =>
      user?.name?.toLowerCase().includes(search.toLowerCase())
    );
    setUsers(filtered);
  };

  // const handleSearch = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:4000/users?search=${search}`
  //     );
  //     setUsers(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <Box p={2} width={"100%"} height={50}>
      {/* Thanh tìm kiếm */}
      <Box display="flex" gap={2} alignItems="center">
        <InputTextField
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Search
        </Button>

        {/* Danh sách user */}
        <List sx={{ mt: 2 }}>
          {users.map((user) => (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {user.name}
            </Stack>
            // <ListItemButton
            //   key={user.email}
            //   onClick={() => onUserSelect(user)}
            //   sx={{
            //     bgcolor: "error.light",
            //     borderRadius: "50px",
            //     mb: 1,
            //     "&:hover": { bgcolor: "error.main" },
            //   }}
            // >
            //   <ListItemText
            //     primary={
            //       <Typography variant="body2" color="white" fontStyle="italic">
            //         {user.name}
            //       </Typography>
            //     }
            //   />
            // </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default SearchUser;
