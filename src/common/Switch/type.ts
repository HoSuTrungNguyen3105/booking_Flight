import type { SwitchProps } from "@mui/material";
import type React from "react";

export interface Android12SwitchProps {
  color?: string;
  label?: string;
  switchProps?: SwitchProps;
  hasLabel?: boolean;
  labelOn?: string;
  labelOff?: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  "data-testid"?: string;
}

// export interface Android12SwitchProps {
//   color?: string;
//   label?: string;
//   switchProps?: SwitchProps;
//   hasLabel?: boolean;
//   onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
//   labelOn?: string;
//   labelOff?: string;
//   checked?: boolean;
//   disabled?: boolean;
//   size?: "small" | "medium" | "large";
//   tooltip?: string;
//   labelPosition?: "start" | "end";
//   required?: boolean;
// }

export interface CustomSwitchProps {
  customColor?: string;
  hasLabel?: boolean;
  labelOn?: string;
  labelOff?: string;
  checked?: boolean;
}
