import React, { memo, useCallback, useState } from "react";
import { Box } from "@mui/material";
import {
  useFindUserFromMessage,
  type SearchEmailFromSidebarMessageRes,
} from "../../context/Api/usePostApi";
import { useAuth } from "../../context/AuthContext";
import type { DropdownOptions } from "../../common/Dropdown/type";
import { SearchInputWithList } from "../../common/Dropdown/SearchInputWithList";

type SearchUserFromMessageProps = {
  value: { employeeId: number };
  onChange: (searchResult: SearchEmailFromSidebarMessageRes[]) => void;
};

type SearchEmployeeId = DropdownOptions & {
  data: SearchEmailFromSidebarMessageRes;
};

const SearchUserFromMessage: React.FC<SearchUserFromMessageProps> = ({
  onChange,
}) => {
  const [options, setOptions] = useState<SearchEmployeeId[]>([]);
  const { refetchUserFromMessage } = useFindUserFromMessage();
  const { user } = useAuth();
  const userId = user?.id;

  const handleInputChange = useCallback(
    async (searchText: string): Promise<SearchEmployeeId[]> => {
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
              value: e.userId,
              label: e.name || e.email,
              data: e,
            })
          );

          setOptions(mappedOptions);
          return mappedOptions;
        }

        setOptions([]);
        return [];
      } catch (error) {
        console.error("Search error:", error);
        setOptions([]);
        return [];
      }
    },
    [userId, refetchUserFromMessage]
  );

  // Khi user chọn 1 option
  const handleOptionSelect = useCallback(
    (selectedOption: SearchEmployeeId | null) => {
      if (selectedOption) {
        console.log(" Selected user:", selectedOption.data);
        onChange([selectedOption.data]); // Trả data ra cha
      } else {
        onChange([]);
      }
    },
    [onChange]
  );

  return (
    <Box sx={{ p: 3 }}>
      <SearchInputWithList
        value={null} // Không phải list option, chỉ giữ option được chọn
        options={options}
        label="Search Users"
        placeholder="Type to search..."
        apiCall={handleInputChange}
        onChange={handleOptionSelect} // không cần ép kiểu
        debounceDelay={500}
        status="confirmed"
      />
    </Box>
  );
};

export default memo(SearchUserFromMessage);
