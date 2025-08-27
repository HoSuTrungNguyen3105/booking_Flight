import { styled, TextareaAutosize } from "@mui/material";
import type { ComponentProps } from "react";

interface IInputTextAreaProps
  extends Omit<ComponentProps<typeof TextareaAutosize>, "onChange"> {
  onChange?: (value: string) => void;
}

const TextAreaStyled = styled(TextareaAutosize)(({ theme }) => ({
  width: "100%",
  padding: "10px 12px",
  border: `1px solid ${theme.palette.grey[200]}`,
  outline: "none",
  resize: "none",
  fontSize: "14px",
  lineHeight: "1.4",
  borderRadius: "8px",

  "&:focus": {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
  },
}));

const InputTextArea = ({
  minRows = 6,
  style,
  onChange = () => {},
  ...props
}: IInputTextAreaProps) => {
  return (
    <TextAreaStyled
      {...props}
      style={{ ...style }}
      minRows={minRows}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default InputTextArea;
