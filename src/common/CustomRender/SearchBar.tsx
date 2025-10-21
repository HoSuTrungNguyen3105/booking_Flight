import {
  Chip,
  Stack,
  Tooltip,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import {
  memo,
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
} from "react";
import {
  Search as SearchIcon,
  RestartAlt as ResetIcon,
} from "@mui/icons-material";
import InputTextField from "../Input/InputTextField";
import DateTimePickerComponent from "../DayPicker";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    // Optional: auto-search when both date filters are set
    if (startDate && endDate) handleSearch();
  }, [startDate, endDate, handleSearch]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      p={2}
      bgcolor="white"
      border={1}
      borderColor="grey.200"
      borderRadius={2}
    >
      {/* Input + Chips */}
      <Stack flexGrow={1} spacing={1}>
        <InputTextField
          value={searchText}
          disabled={disabled}
          onChange={setSearchText}
          onKeyDown={handleKeyDown}
          placeholder={t("search.placeholder") || "Enter keyword..."}
        />
        {searchTerms.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {searchTerms.map((term, i) => (
              <Chip
                key={`${term}-${i}`}
                label={<Typography variant="body2">{term}</Typography>}
                onDelete={() => handleDeleteTerm(i)}
                size="small"
                color="default"
                sx={{ borderRadius: "4px" }}
              />
            ))}
          </Stack>
        )}
      </Stack>

      {/* Date Range */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <DateTimePickerComponent
          language="vn"
          // value={startDate}
          // onChange={setStartDate}
        />
        <Typography variant="body2">-</Typography>
        <DateTimePickerComponent
          language="vn"
          // value={endDate}
          // onChange={setEndDate}
        />
      </Stack>

      {/* Actions */}
      <Stack direction="row" spacing={1}>
        <Tooltip title={t("search.searchBtn") || "Search"}>
          <span>
            <Button
              onClick={handleSearch}
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              disabled={disabled}
            >
              Search
            </Button>
          </span>
        </Tooltip>

        <Tooltip title={t("search.resetBtn") || "Reset"}>
          <IconButton onClick={handleReset} color="default">
            <ResetIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default memo(SearchBar);
