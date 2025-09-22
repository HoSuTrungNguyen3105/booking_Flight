import { useState, type KeyboardEvent } from "react";
import {
  TextField,
  Chip,
  InputAdornment,
  FormHelperText,
  Box,
} from "@mui/material";
import InputTextField from "../Input/InputTextField";

interface Props {
  name: string;
  label: string;
  value?: string[];
  onChange?: (values: string[]) => void;
  maxChips?: number; // mặc định 10
}

const ChipInput = ({
  name,
  label,
  value = [],
  onChange,
  maxChips = 10,
}: Props) => {
  const [chipData, setChipData] = useState<string[]>(value);
  const [inputValue, setInputValue] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault();

      if (chipData.length >= maxChips) {
        setDisabled(true);
        return;
      }

      const newValues = [...chipData, inputValue.trim()];
      setChipData(newValues);
      onChange?.(newValues);
      setInputValue("");
    }
  };

  const handleDelete = (index: number) => {
    const newValues = chipData.filter((_, i) => i !== index);
    setChipData(newValues);
    onChange?.(newValues);
  };

  return (
    <>
      <InputTextField
        name={name}
        value={inputValue}
        onChange={(e) => setInputValue(e)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        startIcon={chipData.map((data, index) => (
          <Box key={index}>
            <Chip label={data} onDelete={() => handleDelete(index)} />
          </Box>
        ))}
      />
    </>
  );
};

export default ChipInput;
