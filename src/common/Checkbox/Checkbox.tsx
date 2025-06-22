import { FormControlLabel, Checkbox as MuiCheckbox } from "@mui/material";
import { CheckedIcon, IndeterminateIcon, UncheckedIcon } from "./Checkbox-icon";
import type { CheckboxProps } from "./type";

export const Checkbox = ({
  color = "primary",
  indeterminate,
  checked,
  value,
  disabled,
  onBlur,
  onChange,
  onClick,
  label,
  center = false,
  sx,
  checkedIcon,
  indeterminateIcon,
}: CheckboxProps) => {
  return (
    <FormControlLabel
      sx={{ justifyContent: center ? "center" : "flex-start", ...sx }}
      label={label}
      control={
        <MuiCheckbox
          size="medium"
          indeterminate={indeterminate}
          disabled={disabled}
          color={color}
          value={value}
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          onClick={onClick}
          icon={<UncheckedIcon />}
          checkedIcon={checkedIcon || <CheckedIcon color={color} />}
          indeterminateIcon={
            indeterminateIcon || <IndeterminateIcon color={color} />
          }
        />
      }
    />
  );
};
