import type { SxProps } from "@mui/material";

export type AppearanceButtonType =
  | "contained"
  | "outlined"
  | "unfilled"
  | "unfilledInverse";
export type PriorityType = "primary" | "normal" | "custom";
export type IconPositionType = "leading" | "trailing";
export type SizeType = "small" | "medium" | "large";
export type ButtonType = "button" | "reset" | "submit";

export type ButtonProps = {
  appearance?: AppearanceButtonType;
  disabled?: boolean;
  iconPosition?: IconPositionType;
  iconSize?: number;
  customLabelColor?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  priority?: PriorityType;
  size?: SizeType;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  customColor?: string;
  translate?: boolean;
  className?: string;
  sx?: SxProps;
  type?: ButtonType;
  isHovered?: boolean;
  isActivated?: boolean;
};


export type ButtonNewProp = {
  appearance?: AppearanceButtonType;
  disabled?: boolean;
  customLabelColor?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  size?: SizeType;
  label?: React.ReactNode;
  customColor?: string;
  translate?: boolean;
  className?: string;
  sx?: SxProps;
  type?: ButtonType;
  isHovered?: boolean;
  isActivated?: boolean;
};