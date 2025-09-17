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
} from "@mui/material";
import type { BaseUserData } from "../../utils/type";

interface SearchUserProps {
  onUserSelect: (user: BaseUserData) => void;
}

const SearchUser: React.FC<SearchUserProps> = ({ onUserSelect }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<BaseUserData[]>([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/users?search=${search}`
      );
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box p={2} height={160} overflow="auto">
      {/* Thanh tìm kiếm */}
      <Box display="flex" gap={2} alignItems="center">
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            sx: {
              borderRadius: 3,
              bgcolor: "black",
              color: "white",
              input: { color: "white" },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ borderRadius: 2, textTransform: "none" }}
        >
          Search
        </Button>
      </Box>

      {/* Danh sách user */}
      <List sx={{ mt: 2, maxHeight: 100, overflow: "auto" }}>
        {users.map((user) => (
          <ListItemButton
            key={user.email}
            onClick={() => onUserSelect(user)}
            sx={{
              bgcolor: "error.light",
              borderRadius: "50px",
              mb: 1,
              "&:hover": { bgcolor: "error.main" },
            }}
          >
            <ListItemText
              primary={
                <Typography variant="body2" color="white" fontStyle="italic">
                  {user.name}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default SearchUser;
