import type { SxProps } from "@mui/material";
import React from "react";

export type CheckboxProps = {
  className?: string;
  color?: "primary" | "secondary";
  indeterminate?: boolean;
  checked?: boolean;
  value?: string | number;
  disabled?: boolean;
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  center?: boolean;
  sx?: SxProps;
  checkedIcon?: React.ReactNode;
  indeterminateIcon?: React.ReactNode;
};
