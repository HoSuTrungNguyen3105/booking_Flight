import { forwardRef } from "react";
import { Checkbox as MuiCheckbox, FormControlLabel } from "@mui/material";
import { CheckedIcon, IndeterminateIcon, UncheckedIcon } from "./CheckboxIcons";
import type { CheckboxProps } from "./type";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
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
    },
    ref
  ) => {
    return (
      <FormControlLabel
        sx={{ justifyContent: center ? "center" : "flex-start", ...(sx || {}) }}
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
            inputRef={ref}
            icon={<UncheckedIcon />}
            checkedIcon={checkedIcon || <CheckedIcon color={color} />}
            indeterminateIcon={
              indeterminateIcon || <IndeterminateIcon color={color} />
            }
          />
        }
      />
    );
  }
);
