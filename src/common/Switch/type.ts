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
