import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Typography, Avatar, Stack } from "@mui/material";
import { Search } from "@mui/icons-material";
import {
  useFindUserFromMessage,
  type SearchEmailFromSidebarMessageRes,
} from "../Api/usePostApi";
import { useAuth } from "../../context/AuthContext";
import useDebounce from "../../context/use[custom]/useDebounce";
import { Dropdown } from "../../common/Dropdown/Dropdown";
import type { DropdownOptions } from "../../common/Dropdown/type";

const SearchUserFromMessage: React.FC = () => {
  const [query, setQuery] = useState("");
  const searchData = useDebounce(query, 300);
  const [options, setOptions] = useState<DropdownOptions[]>([]);
  const [selected, setSelected] = useState<DropdownOptions | null>(null);

  const { dataUserFromMessage, refetchUserFromMessage } =
    useFindUserFromMessage();
  const { user } = useAuth();
  const userId = user?.id;

  const [optionWhenSearch, setOptionWhenSearch] =
    useState<SearchEmailFromSidebarMessageRes[]>();

  const handleInputChange = async (val: string) => {
    if (!val.trim() || !userId) return;
    const res = await refetchUserFromMessage({ id: userId, email: val });
    if (res?.resultCode === "00") {
      setOptionWhenSearch(res.list as SearchEmailFromSidebarMessageRes[]);
    }
  };

  const handleSearch = useCallback(async () => {
    if (searchData || !userId) return;
    const res = await refetchUserFromMessage({ id: userId, email: searchData });
    if (res?.resultCode === "00") {
      setOptionWhenSearch(res.list as SearchEmailFromSidebarMessageRes[]);
    }
    const mapped = optionWhenSearch?.map((e) => ({
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
    }));
    setOptions(mapped as DropdownOptions[]);
  }, []);

  useEffect(() => {
    if (dataUserFromMessage?.list) {
      handleSearch();
    }
  }, [dataUserFromMessage, handleSearch]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Dropdown
          debounceDelay={300}
          options={options}
          value={selected}
          onChange={(e, newValue) => {
            setSelected(newValue as DropdownOptions);
          }}
          onInputChange={(val) => {
            if (val.trim()) {
              handleInputChange(val);
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          startIcon={<Search />}
        >
          Tìm kiếm
        </Button>
      </Stack>
    </Box>
  );
};

export default SearchUserFromMessage;
