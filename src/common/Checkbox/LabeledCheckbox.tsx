import { forwardRef } from "react";
import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
  type CheckboxProps as MuiCheckboxProps,
} from "@mui/material";
import { CheckedIcon, IndeterminateIcon, UncheckedIcon } from "./CheckboxIcons";

type LabeledCheckboxProps = MuiCheckboxProps & {
  label?: string;
  center?: boolean;
};

const LabeledCheckbox = forwardRef<HTMLInputElement, LabeledCheckboxProps>(
  (
    {
      label,
      center = false,
      color = "primary",
      checkedIcon,
      indeterminateIcon,
      sx,
      ...rest
    },
    ref
  ) => {
    return (
      <FormControlLabel
        sx={{ justifyContent: center ? "center" : "flex-start", ...(sx || {}) }}
        label={label}
        control={
          <MuiCheckbox
            {...rest}
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

export default LabeledCheckbox;
