// import { FormControlLabel, Checkbox as MuiCheckbox } from "@mui/material";
// import { CheckedIcon, IndeterminateIcon, UncheckedIcon } from "./CheckboxIcons";
// import type { CheckboxProps } from "./type";

// export const Checkbox = ({
//   color = "primary",
//   indeterminate,
//   checked,
//   value,
//   disabled,
//   onBlur,
//   onChange,
//   onClick,
//   label,
//   center = false,
//   sx,
//   checkedIcon,
//   indeterminateIcon,
// }: CheckboxProps) => {
//   return (
//     <FormControlLabel
//       sx={{ justifyContent: center ? "center" : "flex-start", ...sx }}
//       label={label}
//       control={
//         <MuiCheckbox
//           size="medium"
//           indeterminate={indeterminate}
//           disabled={disabled}
//           color={color}
//           value={value}
//           checked={checked}
//           onChange={onChange}
//           onBlur={onBlur}
//           onClick={onClick}
//           icon={<UncheckedIcon />}
//           checkedIcon={checkedIcon || <CheckedIcon color={color} />}
//           indeterminateIcon={
//             indeterminateIcon || <IndeterminateIcon color={color} />
//           }
//         />
//       }
//     />
//   );
// };

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

// BaseCheckbox.tsx
// import { Checkbox, type CheckboxProps } from "@mui/material";
// import { forwardRef } from "react";
// import { CheckedIcon, IndeterminateIcon, UncheckedIcon } from "./CheckboxIcons";

// const BaseCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
//   (props, ref) => {
//     const {
//       color = "primary",
//       checkedIcon,
//       indeterminateIcon,
//       ...rest
//     } = props;

//     return (
//       <Checkbox
//         {...rest}
//         inputRef={ref}
//         icon={<UncheckedIcon />}
//         checkedIcon={checkedIcon || <CheckedIcon color={color} />}
//         indeterminateIcon={
//           indeterminateIcon || <IndeterminateIcon color={color} />
//         }
//         sx={{
//           color: "#9c27b0",
//           "&.Mui-checked": {
//             color: "#f44336",
//           },
//           ...(props.sx || {}),
//         }}
//       />
//     );
//   }
// );

// export default BaseCheckbox;
