import { Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
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
import {
  Search as SearchIcon,
  RestartAlt as ResetIcon,
} from "@mui/icons-material";
import ChipInput from "../ChipInput";

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
  const [searchText, setSearchText] = useState("");
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleAddSearchTerm = useCallback(() => {
    const trimmed = searchText.trim();
    if (!trimmed) return;
    setSearchTerms((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );
    setSearchText("");
  }, [searchText]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleAddSearchTerm();
    },
    [handleAddSearchTerm]
  );

  const handleDeleteTerm = useCallback((index: number) => {
    setSearchTerms((terms) => terms.filter((_, i) => i !== index));
  }, []);

  const handleReset = useCallback(() => {
    setSearchText("");
    setSearchTerms([]);
    setStartDate("");
    setEndDate("");
    onSearch({ text: [], startDate: "", endDate: "" });
  }, [onSearch]);

  const handleSearch = useCallback(() => {
    onSearch({ text: searchTerms, startDate, endDate });
  }, [onSearch, searchTerms, startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) handleSearch();
  }, [startDate, endDate, handleSearch]);

  const searchTermChips = useMemo(
    () =>
      searchTerms.map((term, index) => (
        // <Chip
        //   key={`${term}-${index}`}
        //   variant="outlined"
        //   sx={{
        //     borderRadius: "3px",
        //     borderColor: "grey.200",
        //   }}
        //   label={<Typography variant="body2">{term}</Typography>}
        //   onDelete={() => handleDeleteTerm(index)}
        // />
        <ChipInput
          name={term}
          onChange={() => handleDeleteTerm(index)}
          label={term}
          key={`${term}-${index}`}
        />
      )),
    [searchTerms, handleDeleteTerm]
  );

  // // Trigger onSearch on query change
  // useEffect(() => {
  //   if (searchTerms.length > 0 || startDate || endDate) {
  //     onSearch(currentQuery);
  //   }
  // }, [searchTerms, startDate, endDate, onSearch, currentQuery]);

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
            onChange={setSearchText}
            onKeyDown={handleKeyDown}
            placeholder={"Enter keyword..."}
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
      <Stack direction="row" spacing={1}>
        <Tooltip title={"Search"}>
          <Button
            onClick={handleSearch}
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            disabled={disabled}
          >
            Search
          </Button>
        </Tooltip>

        <Tooltip title={"Reset"}>
          <IconButton onClick={handleReset} color="default">
            <ResetIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default memo(SearchBar);
