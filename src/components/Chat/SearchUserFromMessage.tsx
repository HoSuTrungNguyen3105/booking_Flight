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
import type { DetailResponseMessage, ResponseMessage } from "../../utils/type";

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

  // Sửa lại hàm handleInputChange để chỉ cập nhật query
  const handleInputChange = useCallback((searchText: string) => {
    setQuery(searchText);
  }, []);

  // Effect để gọi API khi searchData thay đổi
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchData.trim() || !userId) {
        setOptions([]);
        setOptionWhenSearch([]);
        return;
      }

      try {
        const res = await refetchUserFromMessage({
          id: userId,
          email: searchData,
        });
        if (res?.resultCode === "00" && res.list) {
          setOptionWhenSearch(res.list);
        } else {
          setOptionWhenSearch([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setOptions([]);
        setOptionWhenSearch([]);
      }
    };

    fetchUsers();
  }, [searchData, userId, refetchUserFromMessage]);

  // Effect để map data thành options
  useEffect(() => {
    if (optionWhenSearch && optionWhenSearch.length > 0) {
      const mapped = optionWhenSearch.map((e) => ({
        value: e.id,
        label: e.name || e.email || "", // Đảm bảo label là string
        data: e, // Lưu thêm data để render custom
      }));
      setOptions(mapped);
    } else {
      setOptions([]);
    }
  }, [optionWhenSearch]);

  const handleOptionSelect = useCallback(
    (event: any, selectedOption: DropdownOptions | null) => {
      if (selectedOption) {
        console.log("Selected user:", selectedOption);
        // Xử lý khi chọn user
      }
    },
    []
  );

  // Custom output render function
  const renderCustomOutput = (
    option: DetailResponseMessage<SearchEmailFromSidebarMessageRes>
  ) => {
    const userData = option.data as SearchEmailFromSidebarMessageRes;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 1,
          width: "100%",
        }}
      >
        <Avatar sx={{ width: 24, height: 24, fontSize: "0.8rem" }}>
          {userData?.name?.charAt(0)?.toUpperCase() ||
            userData?.email?.charAt(0)?.toUpperCase() ||
            "U"}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={600} variant="body2">
            {userData?.name || "No name"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userData?.email || "No email"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mã NV: {userData?.employeeNo || "N/A"} • Role:{" "}
            {userData?.role || "N/A"}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <SearchInputWithList
          options={options}
          placeholder="Type to search..."
          onInputChange={handleInputChange}
          onChange={handleOptionSelect}
          customOutPut={renderCustomOutput}
          debounceDelay={500}
          disabled={false}
        />
        <Button variant="contained" color="primary" startIcon={<Search />}>
          Tìm kiếm
        </Button>
      </Stack>
    </Box>
  );
};

export default memo(SearchUserFromMessage);
