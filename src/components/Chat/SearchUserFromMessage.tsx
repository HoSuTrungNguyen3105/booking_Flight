import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import {
  useFindUserFromMessage,
  type SearchEmailFromSidebarMessageRes,
} from "../Api/usePostApi";
import { useAuth } from "../../context/AuthContext";
import useDebounce from "../../context/use[custom]/useDebounce";
import { Dropdown } from "../../common/Dropdown/Dropdown";
import type { DropdownOptions } from "../../common/Dropdown/type";
import { data } from "react-router-dom";

const SearchUserFromMessage: React.FC = () => {
  const [query, setQuery] = useState("");
  const searchData = useDebounce(query, 300);
  const [selected, setSelected] = useState<DropdownOptions | null>(null);

  const { dataUserFromMessage, refetchUserFromMessage } =
    useFindUserFromMessage();
  const { user } = useAuth();
  const userId = user?.id;

  const options: DropdownOptions[] = dataUserFromMessage?.list?.map((e)=>{
    label : e.email,
    value: e.
  })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // gọi API mỗi khi searchData thay đổi
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       if (!searchData.trim() || !userId) return;
  //       const res = await refetchUserFromMessage({
  //         id: userId,
  //         email: searchData,
  //       });
  //       console.log("res", res);
  //     };
  //     fetchData();
  //   }, [searchData, userId, refetchUserFromMessage]);

  const handleSearch = async () => {
    if (!query.trim() || !userId) return;
    await refetchUserFromMessage({
      id: userId,
      email: query,
    });
    if (event) {
      setAnchorEl(event.currentTarget as HTMLElement);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Search box */}
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Tìm kiếm theo email"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Search />}
          onClick={() => handleSearch()} // truyền event
        >
          Tìm kiếm
        </Button>
      </Stack>

      {/* Result */}
      <Box sx={{ mt: 3 }}>
         <Dropdown
                  label="Chọn vai trò"
                  options={options}
                  value={selected}
                  onChange={(e, newValue) =>
                    setSelected(newValue as DropdownOptions | null)
                  }
                  placeholder="Chọn 1 option"
                  status="confirmed" // icon xanh
                />
        {/* {dataUserFromMessage?.resultCode === "00" &&
        Array.isArray(dataUserFromMessage.list) &&
        dataUserFromMessage.list.length > 0 ? (
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && dataUserFromMessage?.list?.length > 0}
            onClose={handleClose}
            PaperProps={{
              sx: { width: anchorEl?.clientWidth || 300, mt: 1 },
            }}
          >
            {dataUserFromMessage.list.map(
              (user: SearchEmailFromSidebarMessageRes) => (
                <MenuItem
                  key={user.id}
                  onClick={() => {
                    //   onSelect(user);
                    handleClose();
                  }}
                >
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Mã NV: {user.employeeNo} • Role: {user.role}
                    </Typography>
                  </Box>
                </MenuItem>
              )
            )}
          </Menu>
        ) : (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Không tìm thấy nhân viên
          </Typography>
        )} */}
      </Box>
    </Box>
  );
};

export default SearchUserFromMessage;
