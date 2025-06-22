import type { SxProps } from "@mui/material";

export type AppearanceButtonType =
  | "contained"
  | "outlined"
  | "unfilled"
  | "unfilledInverse";
export type PriorityType = "primary" | "normal";
export type IconPositionType = "leading" | "trailing";
export type SizeType = "small" | "medium" | "large";
export type ButtonType = "button" | "reset" | "submit";

export type ButtonProps = {
  appearance?: AppearanceButtonType;
  disabled?: boolean;
  iconPosition?: IconPositionType;
  iconSize?: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  priority?: PriorityType;
  size?: SizeType;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  translate?: boolean;
  className?: string;
  sx?: SxProps;
  type?: ButtonType;
  isHovered?: boolean;
  isActivated?: boolean;
};
