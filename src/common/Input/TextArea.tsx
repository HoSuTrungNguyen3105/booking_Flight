import React from "react";
import { TextField, type TextFieldProps } from "@mui/material";

const TextArea: React.FC<TextFieldProps> = ({
  sx,
  multiline = true,
  minRows = 1,
  maxRows = 1,
  fullWidth = true,
  variant = "outlined",
  ...rest
}) => {
  return (
    <TextField
      {...rest}
      multiline={multiline}
      minRows={minRows}
      maxRows={maxRows}
      fullWidth={fullWidth}
      variant={variant}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          padding: "8px",
          alignItems: "flex-start",
        },
        "& fieldset": {
          borderColor: "grey.400",
        },
        "&:hover fieldset": {
          borderColor: "primary.main",
        },
        "&.Mui-focused fieldset": {
          borderColor: "primary.dark",
        },
        ...sx, // Merge ngoài cùng để có thể ghi đè
      }}
    />
  );
};

TextArea.displayName = "TextArea";

export default TextArea;
