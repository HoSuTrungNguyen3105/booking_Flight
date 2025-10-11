import {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import type { DropdownOptions, DropdownType } from "./type";
import useDebounce from "../../context/use[custom]/useDebounce";
import InputTextField from "../Input/InputTextField";

interface ApiCallFunction {
  (searchText: string): Promise<DropdownOptions[]>;
}

interface DropdownProps extends DropdownType {
  size?: "small" | "medium";
  apiCall?: ApiCallFunction;
  debounceDelay?: number;
  customOutPut?: (option: DropdownOptions) => ReactNode; // Changed to function that returns ReactNode
}

export const SearchInputWithList = ({
  options = [],
  sx,
  onChange,
  placeholder = "",
  status,
  onInputChange,
  disabled,
  customOutPut,
  apiCall,
  debounceDelay = 300,
}: DropdownProps) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiOptions, setApiOptions] = useState<DropdownOptions[]>([]);
  const [showList, setShowList] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearchText = useDebounce(inputText, debounceDelay);

  const fetchOptions = useCallback(
    async (searchText: string) => {
      if (!apiCall) return;

      try {
        setIsLoading(true);
        const data = await apiCall(searchText);
        setApiOptions(data);
        setShowList(true);
      } catch (error) {
        console.error("Error fetching options:", error);
        setApiOptions([]);
        setShowList(false);
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall]
  );

  useEffect(() => {
    if (debouncedSearchText.trim() !== "" && apiCall) {
      fetchOptions(debouncedSearchText);
    } else if (debouncedSearchText.trim() === "" && apiCall) {
      setApiOptions([]);
      setShowList(false);
    }
  }, [debouncedSearchText, fetchOptions, apiCall]);

  const combinedOptions = useMemo(() => {
    if (apiCall) {
      return apiOptions;
    }
    return options;
  }, [options, apiOptions, apiCall]);

  const borderColor = useMemo(() => {
    const colorMap: Record<string, string> = {
      error: "red",
      warning: "orange",
      confirmed: "green",
    };
    return status && colorMap[status] ? colorMap[status] : undefined;
  }, [status]);

  const handleInputChange = (value: string) => {
    setInputText(value);
    onInputChange?.(value);

    if (apiCall && value.trim() !== "") {
      setShowList(true);
    } else if (!apiCall && value.trim() !== "" && combinedOptions.length > 0) {
      setShowList(true);
    } else {
      setShowList(false);
    }
  };

  const handleOptionSelect = (option: DropdownOptions) => {
    setInputText(typeof option.label === "string" ? option.label : "");
    setShowList(false);
    onChange?.(null as any, option);
  };

  const handleClickAway = () => {
    setShowList(false);
  };

  // Render the content for each list item
  const renderListItemContent = (option: DropdownOptions) => {
    if (customOutPut) {
      // If customOutPut is provided as a function, call it with the option
      return customOutPut(option);
    } else {
      // Default rendering - show the label
      return (
        <ListItemText
          primary={typeof option.label === "string" ? option.label : "Option"}
        />
      );
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        ref={containerRef}
        sx={{ position: "relative", minWidth: 600, ...sx }}
      >
        <InputTextField
          placeholder={placeholder}
          value={inputText}
          onChange={handleInputChange}
          disabled={disabled}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor },
              "&:hover fieldset": { borderColor },
              "&.Mui-focused fieldset": { borderColor },
            },
          }}
        />

        {/* Results List */}
        {showList && combinedOptions.length > 0 && (
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1300,
              mt: 0.5,
              maxHeight: 200,
              overflow: "auto",
              boxShadow: 3,
            }}
          >
            <List dense sx={{ py: 0 }}>
              {combinedOptions.map((option, index) => (
                <ListItem
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  {renderListItemContent(option)}
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* No results message */}
        {showList &&
          !isLoading &&
          combinedOptions.length === 0 &&
          inputText.trim() !== "" && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 1300,
                mt: 0.5,
                p: 2,
                boxShadow: 3,
              }}
            >
              <Typography variant="body2" color="text.secondary" align="center">
                No results found
              </Typography>
            </Paper>
          )}
      </Box>
    </ClickAwayListener>
  );
};
