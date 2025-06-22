import { TextField, type TextFieldProps } from "@mui/material";

const TextArea = (props: TextFieldProps) => {
  return (
    <TextField
      {...props}
      multiline
      minRows={4}
      maxRows={4}
      variant="outlined"
      fullWidth
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          padding: "8px",
          alignItems: "flex-start", // Align text at the top
        },
        "& fieldset": {
          borderColor: "grey.400", // Default border color
        },
        "&:hover fieldset": {
          borderColor: "primary.main", // Border on hover
        },
        "&.Mui-focused fieldset": {
          borderColor: "primary.dark", // Border on focus
        },
      }}
    />
  );
};

export default TextArea;
