import type { SxProps } from "@mui/material";
import type { HTMLInputTypeAttribute, ReactNode } from "react";

export type InputFieldStatus = "error" | "warning" | "confirmed" | "default";

export type TInputField = "text" | "number" | "number-multi" | "alpha-numeric";

export type TInputSize = "small" | "medium" | "large";

export interface IInputTextFieldProps {
  type?: HTMLInputTypeAttribute;
  placeholder2: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  clearable?: boolean;
  sx?: SxProps;
  error?: boolean;
  name?: string;
  disabled?: boolean;
  readonly?: boolean;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export type InputNumberProps = {
  placeholder?: string;
  value?: number;
  defaultValue?: number;
  min?: number;
  status?: InputFieldStatus;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onChange?: (value: number | null) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => void;
  isSeparator?: boolean;
  size?: TInputSize;
  textAlign?: "left" | "right";
  sx?: SxProps;
};

export const ICON_BY_STATUS: Record<InputFieldStatus, ReactNode> = {
  default: null,
  confirmed: null,
  error: null,
  warning: null,
};

export const INPUT_HEIGHT_BY_SIZE: Record<TInputSize, number> = {
  small: 28,
  medium: 32,
  large: 36,
};
