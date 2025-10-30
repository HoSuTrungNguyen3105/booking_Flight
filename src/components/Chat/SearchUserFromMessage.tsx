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

  // Gọi API khi user nhập text
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
            (e: SearchEmailFromSidebarMessageRes): SearchEmployeeId => ({
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

  const handleOptionSelect = useCallback(
    (selectedOption: SearchEmployeeId | null) => {
      if (selectedOption) {
        onChange([selectedOption.data]);
      } else {
        onChange([]);
      }
    },
    [onChange]
  );

  return (
    <Box sx={{ p: 1, bgcolor: "background.paper" }}>
      <SearchInputWithList
        value={null}
        options={options}
        label="Search users"
        placeholder="Type name or email..."
        apiCall={handleInputChange}
        onChange={(option) =>
          handleOptionSelect(option as SearchEmployeeId | null)
        }
        debounceDelay={400}
      />
    </Box>
  );
};

export default memo(SearchUserFromMessage);
