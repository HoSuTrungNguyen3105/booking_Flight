import { Box, Chip, Stack, Typography } from "@mui/material";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";
import InputTextField from "../Input/InputTextField";
import DateTimePickerComponent from "../DayPicker";

export interface ISearchQuery {
  text: string[];
  startDate: string;
  endDate: string;
}

interface ISearchBarProps {
  disabled?: boolean;
  onSearch: (query: ISearchQuery) => void;
}

const SearchBar = ({ disabled = false, onSearch }: ISearchBarProps) => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Create full query when state changes
  const currentQuery = useMemo(
    () => ({
      text: searchTerms,
      startDate,
      endDate,
    }),
    [searchTerms, startDate, endDate]
  );

  // Add search term from input
  const handleAddSearchTerm = useCallback(() => {
    const trimmedText = searchText.trim();
    if (trimmedText) {
      setSearchTerms((prev) => [...prev, trimmedText]);
      setSearchText("");
    }
  }, [searchText]);

  // Handle key press
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleAddSearchTerm();
      }
    },
    [handleAddSearchTerm]
  );

  // Delete chip
  const handleDeleteSearchTerm = useCallback((indexToDelete: number) => {
    setSearchTerms((terms) =>
      terms.filter((_, index) => index !== indexToDelete)
    );
  }, []);

  // Input handlers
  const handleSearchTextChange = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const handleStartDateChange = useCallback((value: string) => {
    setStartDate(value);
  }, []);

  const handleEndDateChange = useCallback((value: string) => {
    setEndDate(value);
  }, []);

  // Memoized chip rendering
  const searchTermChips = useMemo(
    () =>
      searchTerms.map((term, index) => (
        <Chip
          key={`${term}-${index}`}
          variant="outlined"
          sx={{
            borderRadius: "3px",
            borderColor: "grey.200",
          }}
          label={<Typography variant="body2">{term}</Typography>}
          onDelete={() => handleDeleteSearchTerm(index)}
        />
      )),
    [searchTerms, handleDeleteSearchTerm]
  );

  // Trigger onSearch on query change
  useEffect(() => {
    if (searchTerms.length > 0 || startDate || endDate) {
      onSearch(currentQuery);
    }
  }, [searchTerms, startDate, endDate, onSearch, currentQuery]);

  return (
    <Stack
      gap={2}
      direction="row"
      alignItems="flex-start"
      p={2}
      bgcolor="white"
      border={1}
      borderColor="grey.100"
    >
      <Stack gap={1} flexGrow={1}>
        <Box sx={{ maxHeight: "20rem" }}>
          <InputTextField
            value={searchText}
            disabled={disabled}
            onChange={handleSearchTextChange}
            onKeyDown={handleKeyDown}
            placeholder="검색 단어를 입력해주세요."
          />
        </Box>

        {searchTerms.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {searchTermChips}
          </Stack>
        )}
      </Stack>

      <Stack maxHeight={"20rem"} gap={1} direction="row" alignItems="center">
        <DateTimePickerComponent language="jp" />
        -
        <DateTimePickerComponent language="jp" />
      </Stack>
    </Stack>
  );
};

export default memo(SearchBar);
