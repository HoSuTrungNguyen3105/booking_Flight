import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Avatar, Stack } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useFindUserFromMessage } from "../Api/usePostApi";
import { useAuth } from "../../context/AuthContext";
import useDebounce from "../../context/use[custom]/useDebounce";
import { Dropdown } from "../../common/Dropdown/Dropdown";
import type { DropdownOptions } from "../../common/Dropdown/type";

const SearchUserFromMessage: React.FC = () => {
  const [query, setQuery] = useState("");
  const searchData = useDebounce(query, 300);
  const [selected, setSelected] = useState<DropdownOptions | null>(null);

  const { dataUserFromMessage, refetchUserFromMessage } =
    useFindUserFromMessage();
  const { user } = useAuth();
  const userId = user?.id;

  const options: DropdownOptions[] =
    dataUserFromMessage?.list?.map((e) => ({
      value: e.id,
      label: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 24, height: 24 }}>
            {e.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontWeight={600}>{e.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {e.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mã NV: {e.employeeNo} • Role: {e.role}
            </Typography>
          </Box>
        </Box>
      ),
    })) || [];

  useEffect(() => {
    const fetchData = async () => {
      if (!searchData.trim() || !userId) return;
      await refetchUserFromMessage({
        id: userId,
        email: searchData,
      });
    };
    fetchData();
  }, [searchData, userId, refetchUserFromMessage]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Dropdown
          options={options}
          value={selected}
          onChange={(_, val) => setSelected(val as DropdownOptions | null)}
        />
        <Button variant="contained" color="primary" startIcon={<Search />}>
          Tìm kiếm
        </Button>
      </Stack>
    </Box>
  );
};

export default SearchUserFromMessage;
