import React, { memo, useCallback, useEffect, useState } from "react";
import { Box, Button, Typography, Avatar, Stack } from "@mui/material";
import { Search } from "@mui/icons-material";
import {
  useFindUserFromMessage,
  type SearchEmailFromSidebarMessageRes,
} from "../Api/usePostApi";
import { useAuth } from "../../context/AuthContext";
import useDebounce from "../../context/use[custom]/useDebounce";
import type { DropdownOptions } from "../../common/Dropdown/type";
import { SearchInputWithList } from "../../common/Dropdown/SearchInputWithList";

const SearchUserFromMessage: React.FC = () => {
  const [query, setQuery] = useState("");
  const searchData = useDebounce(query, 300);
  const [options, setOptions] = useState<DropdownOptions[]>([]);

  const { dataUserFromMessage, refetchUserFromMessage } =
    useFindUserFromMessage();
  const { user } = useAuth();
  const userId = user?.id;

  const [optionWhenSearch, setOptionWhenSearch] =
    useState<SearchEmailFromSidebarMessageRes[]>();

  // Sửa lại hàm handleInputChange để trả về promise đúng format
  const handleInputChange = useCallback(
    async (searchText: string): Promise<DropdownOptions[]> => {
      setQuery(searchText);

      if (!searchText.trim() || !userId) {
        setOptions([]);
        return [];
      }

      try {
        const res = await refetchUserFromMessage({
          id: userId,
          email: searchText,
        });
        if (res?.resultCode === "00" && res.list) {
          const mappedOptions = res.list.map(
            (e: SearchEmailFromSidebarMessageRes) => ({
              value: e.id,
              label: e.name || e.email, // Dùng string cho label
              data: e, // Lưu toàn bộ data để dùng trong custom render
            })
          );
          setOptionWhenSearch(res.list);
          setOptions(mappedOptions);
          return mappedOptions;
        }
        return [];
      } catch (error) {
        console.error("Search error:", error);
        return [];
      }
    },
    [userId, refetchUserFromMessage]
  );

  // Effect để xử lý khi có data từ API
  useEffect(() => {
    if (optionWhenSearch && optionWhenSearch.length > 0) {
      const mapped = optionWhenSearch.map((e) => ({
        value: e.id,
        label: e.name || e.email, // Label phải là string
        data: e, // Lưu thêm data để render custom
      }));
      setOptions(mapped);
    }
  }, [optionWhenSearch]);

  const handleOptionSelect = useCallback(
    (selectedOption: DropdownOptions | null) => {
      if (selectedOption) {
        console.log("Selected user:", selectedOption);
        // Xử lý khi chọn user
      }
    },
    []
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <SearchInputWithList
          options={options}
          label="Search Users"
          placeholder="Type to search..."
          apiCall={handleInputChange}
          onChange={handleOptionSelect}
          debounceDelay={500}
          status="confirmed"
        />
      </Stack>
    </Box>
  );
};

export default memo(SearchUserFromMessage);
