import { TextField, type TextFieldProps } from "@mui/material";

const TextArea = ({ sx, ...rest }: TextFieldProps) => {
  return (
    <TextField
      {...rest}
      multiline
      minRows={1}
      maxRows={1}
      variant="outlined"
      fullWidth
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2, // tương đương 16px
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
        ...sx, // Merge sx từ bên ngoài
      }}
    />
  );
};

export default TextArea;
