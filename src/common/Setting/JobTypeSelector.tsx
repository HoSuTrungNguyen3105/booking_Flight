import {
  Autocomplete,
  Box,
  Checkbox,
  Typography,
  type SxProps,
} from "@mui/material";
import { useState } from "react";
import InputTextField from "../Input/InputTextField";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ArrowDown from "../../svgs/icon-search.svg";

interface ICheckBoxSelectorProps {
  sx?: SxProps;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  value: string[];
  onChange: (value: string[]) => void;
  valueInCheckBox: string[];
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const CheckBoxSelector = ({
  sx,
  placeholder,
  disabled,
  readOnly,
  error,
  value = [],
  onChange,
  valueInCheckBox,
}: ICheckBoxSelectorProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [open, setOpen] = useState(false);

  const handleSearchType = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleCheckboxClick = (selectedValue: string) => {
    const isSelected = value.includes(selectedValue);
    const newValue = isSelected
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
    onChange(newValue);
  };

  const filteredList = valueInCheckBox.filter((item) =>
    item.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <Box sx={sx}>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={filteredList}
        value={value}
        inputValue={searchKeyword}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onInputChange={(_, newInput) => handleSearchType(newInput)}
        onChange={(_, newValue) => onChange(newValue)}
        disabled={disabled}
        readOnly={readOnly}
        getOptionLabel={(option) => option}
        renderOption={(props, option, { selected }) => (
          <li {...props} key={option}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
              onClick={() => handleCheckboxClick(option)}
            />
            <Typography>{option}</Typography>
          </li>
        )}
        renderInput={(params) => (
          <InputTextField
            {...params}
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
            placeholder={placeholder || "검색 단어를 입력해주세요."}
            endIcon={
              <Box
                component="img"
                sx={{ width: "20px", cursor: "pointer" }}
                src={ArrowDown}
                onClick={() => setOpen((prev) => !prev)}
              />
            }
            error={error}
          />
        )}
      />
    </Box>
  );
};

export default CheckBoxSelector;
